# LAB03 - Sistema de Moeda Estudantil

Guia prático para rodar o projeto sem sofrimento.

## Stack

- `frontend`: React + Vite + Nginx
- `backend`: Node.js + Express + TypeScript + Prisma
- `db`: PostgreSQL 16

## Como rodar

### Opção 1: Docker Compose

Esse é o jeito mais simples e o recomendado.

Pré-requisito:

- Docker
- Docker Compose

Na raiz do projeto:

```bash
docker compose up --build -d
```

Depois acesse:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Postgres: `localhost:5434`

Observações:

- Na primeira subida, o backend cria as tabelas com `prisma db push`.
- O seed roda automaticamente e cadastra instituições iniciais.
- A rota `/` do backend pode responder `404`, e isso é esperado.

Para acompanhar logs:

```bash
docker compose logs -f
```

Para ver o status dos containers:

```bash
docker compose ps
```

Para parar tudo:

```bash
docker compose down
```

Para parar e apagar o volume do banco:

```bash
docker compose down -v
```

## Como rodar localmente

Se você quiser rodar frontend e backend fora do Docker, o caminho mais simples é deixar só o banco no Compose.

### 1. Suba apenas o banco

```bash
docker compose up -d db
```

O banco ficará disponível em `localhost:5434`.

### 2. Backend

O arquivo [backend/.env](/home/af/dev/LAB03/backend/.env) já está configurado para usar o banco na porta `5434`.

Entre na pasta do backend:

```bash
cd backend
npm ci
npm run dev
```

Backend local:

- `http://localhost:3000`

### 3. Frontend

Crie um arquivo `frontend/.env.local` com:

```env
VITE_API_URL=http://localhost:3000
```

Depois rode:

```bash
cd frontend
npm ci
npm run dev
```

Frontend local:

- normalmente em `http://localhost:5173`

## Variáveis de ambiente

### Backend

Baseado em [backend/.env.example](/home/af/dev/LAB03/backend/.env.example):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/moeda_estudantil"
JWT_SECRET="troque_este_segredo_em_producao"
PORT=3000
```

### Frontend

No Docker, o frontend usa:

```env
VITE_API_URL=/api
```

O Nginx faz proxy de `/api` para o backend.

Fora do Docker, use:

```env
VITE_API_URL=http://localhost:3000
```

## Endpoints principais

Backend expõe estas rotas:

- `GET /students`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`
- `GET /companies`
- `GET /companies/:id`
- `POST /companies`
- `PUT /companies/:id`
- `DELETE /companies/:id`
- `GET /institutions`

Quando o frontend roda por Docker/Nginx, essas mesmas rotas ficam acessíveis com prefixo `/api`, por exemplo:

- `GET /api/students`
- `GET /api/companies`
- `GET /api/institutions`

## Comandos úteis

Rebuild completo:

```bash
docker compose up --build -d
```

Subir um serviço específico:

```bash
docker compose up -d frontend
docker compose up -d backend
docker compose up -d db
```

Ver logs de um serviço:

```bash
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

## Problemas comuns

### Porta `5173` em uso

Se o frontend não subir com erro de porta ocupada:

```bash
docker compose down
```

Feche o processo que está usando a `5173` e suba de novo:

```bash
docker compose up --build -d
```

### Porta `3000` em uso

Mesmo raciocínio:

- feche o processo que está usando a porta
- suba novamente o compose

### Quero resetar o banco

```bash
docker compose down -v
docker compose up --build -d
```

Isso apaga os dados do Postgres e recria tudo do zero.
