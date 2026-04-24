# Sistema de Moeda Estudantil — Architecture

## Overview

Student coin system. Professors distribute virtual coins to students as merit recognition. Students redeem coins for perks offered by partner companies.

**Tech stack:** React + Vite (frontend) · Node.js (backend) · TypeScript (both)
**Architecture style:** MVC with layered backend (Controller → Service → Repository)

---

## System Actors

| Actor | Registration | Core Actions |
|-------|-------------|--------------|
| Aluno (Student) | Self-registers | Receive coins, redeem perks, view statement |
| Professor | Pre-registered by institution | Send coins to students, view statement |
| Empresa Parceira (Company) | Self-registers | Manage perks catalog |
| Instituição | Pre-registered by admin | Referenced by students/professors |

---

## Domain Model

### Core Entities

```
User (abstract)
├── Student    — coinBalance, institution, course, CPF, RG, address
├── Professor  — coinBalance, institution, department, CPF
└── PartnerCompany — perk catalog

Institution — pre-seeded, referenced by Student and Professor
Perk        — owned by PartnerCompany, has coinCost, description, photo
Transaction (abstract)
├── CoinTransfer — Professor → Student, requires reason message
└── Redemption   — Student redeems Perk, generates couponCode
```

### Business Rules

1. Professor receives 1000 coins each semester (accumulative — unused coins carry over)
2. `sendCoins` requires: sufficient balance + target student + reason message (mandatory)
3. Student receives email on every coin receipt
4. Perk redemption: deduct balance → generate coupon code → email student + partner company
5. All actors authenticate via email + password (JWT)
6. Transaction history visible to professors (sent transfers) and students (received + redemptions)

---

## Backend Architecture

### Layer Structure

```
src/
├── domain/               # Pure business logic — no framework dependencies
│   ├── entities/         # User, Student, Professor, PartnerCompany, Institution, Perk, Transaction, CoinTransfer, Redemption
│   ├── value-objects/    # Address (immutable, no identity)
│   ├── enums/            # UserRole
│   └── interfaces/       # IRepository<T>, INotificationService
├── application/          # Use case orchestration
│   ├── auth/             # AuthService
│   ├── coins/            # CoinService (sendCoins, getSemesterBalance)
│   ├── perks/            # PerkService (redeemPerk, listPerks)
│   └── notifications/    # NotificationService (email dispatch)
├── infrastructure/       # Framework-specific implementations
│   ├── repositories/     # Prisma/TypeORM implementations of IRepository<T>
│   ├── email/            # NodeMailer adapter
│   └── database/         # DB connection, migrations
└── interfaces/           # HTTP layer
    ├── controllers/       # Thin — delegate to application services
    ├── routes/            # Express routers
    ├── middlewares/       # auth guard (JWT), error handler, validation
    └── dtos/              # Request/response shapes (zod schemas)
```

### Design Patterns

#### Repository Pattern
All data access goes through `IRepository<T>`. Controllers never touch DB directly.

```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}
```

Each entity has a concrete repository (e.g., `StudentRepository implements IRepository<Student>`). Swap DB without touching services.

#### Service Layer Pattern
Business logic lives exclusively in `application/` services. Controllers receive validated DTOs, call one service method, return response.

```typescript
// Controller — thin, delegates everything
async sendCoins(req: Request, res: Response) {
  const dto = SendCoinsDto.parse(req.body)
  const transfer = await coinService.sendCoins(req.user.id, dto)
  res.json(transfer)
}

// Service — all business logic here
async sendCoins(professorId: string, dto: SendCoinsDto): Promise<CoinTransfer> {
  const professor = await professorRepo.findById(professorId)
  if (professor.coinBalance < dto.amount) throw new InsufficientBalanceError()
  const student = await studentRepo.findById(dto.studentId)
  const transfer = professor.sendCoins(student, dto.amount, dto.reason)
  await coinTransferRepo.save(transfer)
  await notificationService.notifyStudentCoinReceived(student, transfer)
  return transfer
}
```

#### Observer / Event Pattern
`NotificationService` decouples email sending from business logic. Services emit domain events; notification service subscribes and sends emails.

```typescript
interface INotificationService {
  notifyStudentCoinReceived(student: Student, transfer: CoinTransfer): Promise<void>
  notifyRedemption(student: Student, company: PartnerCompany, redemption: Redemption): Promise<void>
}
```

#### DTO + Validation Pattern
Every request validated at boundary with `zod` before reaching service layer. Internal code never validates — trusts typed DTOs.

```typescript
const SendCoinsDto = z.object({
  studentId: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().min(1),
})
type SendCoinsDto = z.infer<typeof SendCoinsDto>
```

#### Factory Pattern — Coupon Code
`CouponFactory.generate()` produces unique alphanumeric codes. Isolated, testable, swappable.

---

## Frontend Architecture

### Structure

```
src/
├── features/            # Vertical slices per domain
│   ├── auth/            # Login, register pages + hooks
│   ├── student/         # Dashboard, registration form
│   ├── professor/       # Send coins form, statement
│   ├── company/         # Perk management
│   ├── perks/           # Perk catalog, redemption flow
│   └── transactions/    # Statement view (shared by student/professor)
├── shared/
│   ├── components/      # Button, Input, Modal, Table, etc.
│   ├── hooks/           # useAuth, usePagination, useToast
│   └── utils/           # formatCurrency, formatDate
├── services/            # API client (axios instances + typed request fns)
├── contexts/            # AuthContext (current user, token)
└── types/               # Shared TypeScript types matching backend DTOs
```

### Design Patterns

#### Feature Module Pattern
Each feature is self-contained: its own pages, hooks, and local types. Nothing leaks between features except via `shared/`. Enables parallel dev and easy deletion.

#### Container / Presenter Pattern
Data-fetching logic in `*Container` component (or custom hook). Rendering in pure `*View` component. View receives only props — no API calls, no side effects.

```typescript
// Container — fetches, owns state
function TransactionListContainer() {
  const { data, isLoading } = useTransactions()
  return <TransactionListView transactions={data} loading={isLoading} />
}

// Presenter — pure render
function TransactionListView({ transactions, loading }: Props) { ... }
```

#### Custom Hook Pattern
All async state (loading, error, data) encapsulated in hooks. Components stay declarative.

```typescript
function useSendCoins() {
  const [isPending, setIsPending] = useState(false)
  const send = async (dto: SendCoinsDto) => { ... }
  return { send, isPending }
}
```

#### Context Pattern — Auth
`AuthContext` holds decoded JWT user, role, and `logout()`. Role-based route guards read from context.

---

## API Contract (REST)

| Method | Path | Actor | Description |
|--------|------|-------|-------------|
| POST | `/auth/login` | All | Authenticate, receive JWT |
| POST | `/auth/register/student` | — | Student self-registration |
| POST | `/auth/register/company` | — | Company self-registration |
| GET | `/institutions` | — | List pre-registered institutions |
| GET | `/professors/me/statement` | Professor | View sent transfers |
| POST | `/coins/send` | Professor | Send coins to student |
| GET | `/students/me/statement` | Student | View received + redemptions |
| GET | `/perks` | Student | List available perks |
| POST | `/perks/:id/redeem` | Student | Redeem perk |
| GET | `/companies/me/perks` | Company | List own perks |
| POST | `/companies/me/perks` | Company | Create perk |
| PUT | `/companies/me/perks/:id` | Company | Update perk |
| DELETE | `/companies/me/perks/:id` | Company | Delete perk |

---

## Separation of Responsibilities

| Layer | Knows About | Does NOT Know About |
|-------|------------|---------------------|
| Domain entities | Business rules, own state | HTTP, DB, email |
| Application services | Domain entities, repository interfaces | Express, Prisma, NodeMailer |
| Infrastructure repos | Prisma/DB | Business rules |
| Controllers | DTOs, service contracts | DB schema, email |
| Frontend features | API response shapes | Backend internals |
| Shared components | Props interface | Feature data |

---

## Key Abstractions

- `IRepository<T>` — generic CRUD contract, all domain types implement
- `Transaction` (abstract) — unified statement model for both CoinTransfer and Redemption
- `User` (abstract) — shared auth fields; role-specific data in subclasses
- `INotificationService` — email sending contract, adapter-swappable
- `SendCoinsDto / RedeemPerkDto` — validated boundary objects, prevent raw request objects from leaking inward

---

## Diagrams

See `docs/` for PlantUML source:
- [`docs/use-case-diagram.puml`](docs/use-case-diagram.puml)
- [`docs/class-diagram.puml`](docs/class-diagram.puml)
- [`docs/component-diagram.puml`](docs/component-diagram.puml)
- [`docs/user-stories.md`](docs/user-stories.md)
