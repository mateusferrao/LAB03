# 🏛️ LAB03 - Sistema de Moeda Estudantil

> Sistema web full-stack para gerenciamento de uma moeda estudantil baseada em mérito acadêmico, permitindo que professores enviem moedas virtuais para alunos, alunos consultem extratos e resgatem vantagens, e empresas parceiras cadastrem benefícios no catálogo.

Este projeto foi desenvolvido como trabalho prático da disciplina de **Projeto de Software / Laboratório de Desenvolvimento de Software**, demonstrando modelagem de domínio, arquitetura em camadas, autenticação JWT, persistência com Prisma ORM, aplicação React com rotas protegidas e interface responsiva.

---

## 🚧 Status do Projeto

![License](https://img.shields.io/badge/license-academic-lightgrey)
![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-5.10.0-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?logo=sqlite)

---

## 📚 Índice

- [🔗 Links Úteis](#-links-úteis)
- [📝 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🏗 Arquitetura](#-arquitetura)
- [🔧 Instalação e Execução](#-instalação-e-execução)
- [🔐 Usuários de Demonstração](#-usuários-de-demonstração)
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)
- [🌐 Rotas da API](#-rotas-da-api)
- [🎥 Demonstração](#-demonstração)
- [🧩 Diagramas e Documentação](#-diagramas-e-documentação)
- [🔗 Documentações Utilizadas](#-documentações-utilizadas)
- [👥 Autores](#-autores)
- [🤝 Contribuição](#-contribuição)
- [🙏 Agradecimentos](#-agradecimentos)
- [📄 Licença](#-licença)

---

## 🔗 Links Úteis

💻 **Aplicação local:** `http://localhost:5173`  
> Endereço padrão do front-end em modo de desenvolvimento.

🧠 **API local:** `http://localhost:3000`  
> Endereço padrão do back-end Express.

🐙 **Repositório:** [github.com/mateusferrao/LAB03](https://github.com/mateusferrao/LAB03)

📄 **Arquitetura:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)  
> Visão geral dos atores, regras de negócio, camadas, padrões e contratos REST.

📌 **Histórias de usuário:** [docs/user-stories.md](docs/user-stories.md)

---

## 📝 Sobre o Projeto

### 🎯 Propósito

O **Sistema de Moeda Estudantil** tem como objetivo incentivar o mérito acadêmico por meio de uma moeda virtual. Professores recebem uma quantidade periódica de moedas e podem transferi-las para alunos como reconhecimento por desempenho, participação, entregas ou outras conquistas. Os alunos acumulam saldo e podem resgatar vantagens oferecidas por empresas parceiras.

### 🎓 Contexto Acadêmico

- **Disciplina:** Projeto de Software / Laboratório de Desenvolvimento de Software
- **Instituição:** PUC Minas - Engenharia de Software
- **Período:** 4º Período
- **Semestre:** 2026/1
- **Entrega:** LAB03 - Sistema de Moeda Estudantil

### 👥 Atores do Sistema

| Ator | Como participa | Principais ações |
|---|---|---|
| **Aluno** | Cadastra-se no sistema | Recebe moedas, consulta extrato, visualiza ranking e resgata vantagens |
| **Professor** | Usuário pré-cadastrado via seed | Envia moedas para alunos, informa motivo e acompanha extrato |
| **Empresa Parceira** | Cadastra-se no sistema | Gerencia vantagens e acompanha resgates |
| **Instituição** | Pré-cadastrada no banco | Relaciona alunos e professores |

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação com JWT:** Login, persistência de sessão e rota `/auth/me`
- 👤 **Cadastro de Alunos:** Registro com dados pessoais, endereço, curso e instituição
- 🏢 **Cadastro de Empresas Parceiras:** Registro de empresas para oferta de vantagens
- 👨‍🏫 **Gestão de Professores:** Listagem, consulta e crédito semestral de moedas
- 🪙 **Transferência de Moedas:** Professor envia moedas para aluno com motivo obrigatório
- 📜 **Extratos por Perfil:** Histórico de transferências enviadas, moedas recebidas e resgates
- 🎁 **Catálogo de Vantagens:** Empresas cadastram benefícios com foto, descrição e custo
- 🧾 **Resgate com Cupom:** Aluno resgata vantagem, saldo é debitado e cupom único é gerado
- 🏆 **Ranking:** Leaderboard com alunos e estatísticas gerais do sistema
- 🧭 **Rotas Protegidas:** Navegação controlada conforme usuário autenticado
- 🎨 **Design System Interno:** Página dedicada para visualização dos componentes e estilos
- 📊 **Dashboard:** Visão geral com saldo, indicadores e atalhos de navegação
- ⚡ **SPA Responsiva:** Interface React com Vite, React Router e feedback por toast
- 🧪 **Seed de Demonstração:** Dados iniciais para instituições, professores, alunos, empresas e vantagens

> Observação: as notificações por email estão representadas no protótipo por logs no console do back-end.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

| Tecnologia | Versão | Uso |
|---|---:|---|
| **React** | 19.2.5 | Biblioteca para construção da interface |
| **React DOM** | 19.2.5 | Renderização da aplicação no navegador |
| **React Router DOM** | 7.15.0 | Rotas, navegação e proteção de páginas |
| **Vite** | 8.0.10 | Dev server, build e HMR |
| **TypeScript** | 6.0.2 | Tipagem estática no front-end |
| **Axios** | 1.16.0 | Cliente HTTP para comunicação com a API |
| **Framer Motion** | 11.0.0 | Animações e transições de interface |
| **Lucide React** | 0.400.0 | Biblioteca de ícones |
| **React Hot Toast** | 2.4.1 | Feedback visual para ações do usuário |
| **Recharts** | 2.12.0 | Gráficos e visualizações de dados |

### 🧠 Back-end

| Tecnologia | Versão | Uso |
|---|---:|---|
| **Node.js** | LTS | Runtime JavaScript |
| **Express** | 4.18.2 | API REST |
| **TypeScript** | 5.3.3 | Tipagem estática no back-end |
| **Prisma ORM** | 5.10.0 | Modelagem, migrations e acesso ao banco |
| **SQLite** | Local | Banco de dados em arquivo para desenvolvimento |
| **JWT** | 9.0.2 | Autenticação baseada em token |
| **bcryptjs** | 2.4.3 | Hash de senhas |
| **Zod** | 3.22.4 | Validação de DTOs |
| **CORS** | 2.8.5 | Controle de acesso entre front-end e API |

### ⚙️ Ferramentas

| Ferramenta | Uso |
|---|---|
| **Git/GitHub** | Versionamento e hospedagem do código |
| **ESLint** | Padronização e análise estática do front-end |
| **Prisma Studio** | Inspeção visual do banco de dados |
| **PlantUML** | Diagramas de caso de uso, classes, componentes e entidade-relacionamento |

---

## 🏗 Arquitetura

### 📐 Visão Geral

O projeto é organizado como um **monorepo** com duas aplicações principais:

```
LAB03/
├── backend/    → API REST, regras de negócio, Prisma e SQLite
├── frontend/   → SPA React com autenticação, dashboard e telas por perfil
└── docs/       → arquitetura, histórias de usuário e diagramas PlantUML
```

Fluxo principal:

```
┌─────────────────────┐       HTTP/JSON        ┌──────────────────────┐
│   Frontend React    │ ─────────────────────▶ │   API Express        │
│   React Router      │ ◀───────────────────── │   Controllers        │
└─────────────────────┘                        └──────────┬───────────┘
                                                           │
                                                   ┌───────▼────────┐
                                                   │ Services       │
                                                   │ Regras de uso  │
                                                   └───────┬────────┘
                                                           │
                                                   ┌───────▼────────┐
                                                   │ Prisma ORM     │
                                                   │ SQLite dev.db  │
                                                   └────────────────┘
```

### 🧱 Back-end

O back-end segue uma divisão em camadas:

| Camada | Responsabilidade |
|---|---|
| **Domain** | Entidades, enums e contratos de repositório |
| **Application** | Serviços de caso de uso: autenticação, transferência, resgate, vantagens e professores |
| **Infrastructure** | Prisma Client e repositórios concretos |
| **Interfaces** | Controllers, rotas Express, middlewares e DTOs |

### 🖥 Front-end

O front-end segue uma estrutura orientada por funcionalidades:

| Módulo | Responsabilidade |
|---|---|
| **auth** | Login, cadastro e fluxo de autenticação |
| **dashboard** | Visão geral do usuário autenticado |
| **student** | Listagem e formulário de alunos |
| **professor** | Listagem de professores |
| **company** | Listagem e formulário de empresas parceiras |
| **transfer** | Envio de moedas pelo professor |
| **perks** | Catálogo e gestão de vantagens |
| **statement** | Extratos de alunos, professores e empresas |
| **leaderboard** | Ranking de alunos e estatísticas |
| **design-system** | Componentes visuais e padrões de UI |
| **slides** | Página de apoio para apresentação do projeto |

### 🔄 Padrões de Design Adotados

- **MVC no back-end:** Controllers finos, services com regras de negócio e Prisma como persistência
- **Service Layer:** Regras como envio de moedas e resgate ficam em serviços de aplicação
- **Repository Pattern:** Repositórios Prisma isolam acesso a dados em partes do domínio
- **DTO + Validation:** Zod valida entradas de autenticação e cadastro
- **Context API:** `AuthContext` centraliza usuário, token, login e logout
- **Route Guard:** `RequireAuth` protege as páginas internas
- **Feature-Based Frontend:** Telas organizadas por domínio funcional

---

## 🔧 Instalação e Execução

### 📋 Pré-requisitos

Antes de começar, instale:

- **Node.js LTS** v18 ou superior
- **npm** v8 ou superior
- **Git**

Verifique as versões:

```bash
node --version
npm --version
git --version
```

---

### 1. Clone o repositório

```bash
git clone https://github.com/mateusferrao/LAB03.git
cd LAB03
```

### 2. Configure o back-end

Entre na pasta do back-end:

```bash
cd backend
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque_este_segredo_em_producao"
PORT=3000
```

Gere o Prisma Client, aplique as migrations e execute o seed:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Inicie a API:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

---

### 3. Configure o front-end

Em outro terminal, entre na pasta do front-end:

```bash
cd frontend
npm install
```

Se necessário, crie `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Inicie a aplicação:

```bash
npm run dev
```

A interface estará disponível em:

```text
http://localhost:5173
```

---

### 🏗 Build para Produção

Back-end:

```bash
cd backend
npm run build
npm start
```

Front-end:

```bash
cd frontend
npm run build
npm run preview
```

---

### 🛠 Scripts Disponíveis

#### Back-end

| Script | Comando | Descrição |
|---|---|---|
| Desenvolvimento | `npm run dev` | Inicia a API com `ts-node-dev` |
| Build | `npm run build` | Compila TypeScript para `/dist` |
| Produção | `npm start` | Executa a API compilada |
| Prisma Client | `npm run db:generate` | Gera cliente Prisma |
| Migration | `npm run db:migrate` | Executa migrations em desenvolvimento |
| Seed | `npm run db:seed` | Popula o banco com dados iniciais |
| Studio | `npm run db:studio` | Abre o Prisma Studio |

#### Front-end

| Script | Comando | Descrição |
|---|---|---|
| Desenvolvimento | `npm run dev` | Inicia o Vite com HMR |
| Build | `npm run build` | Executa TypeScript e gera build em `/dist` |
| Preview | `npm run preview` | Serve o build localmente |
| Lint | `npm run lint` | Executa ESLint |

---

## 🔐 Usuários de Demonstração

Após executar o seed, todos os usuários abaixo usam a senha:

```text
123456
```

| Perfil | Email | Senha |
|---|---|---|
| **Professor** | `falbo@prof.com` | `123456` |
| **Aluno** | `ana@aluno.com` | `123456` |
| **Empresa Parceira** | `cantina@parceiro.com` | `123456` |

Outros dados criados pelo seed:

- Instituições: PUC Minas, UFMG, UFOP, UFSJ e CEFET-MG
- Professores de exemplo com saldo inicial de 1000 moedas
- Alunos de exemplo com saldos iniciais variados
- Empresas parceiras com vantagens cadastradas

---

## 📂 Estrutura de Pastas

```text
LAB03/
├── README.md
├── LABORATÓRIO 03 - Sistema de Moeda Estudantil (Release 1).pdf
├── docs/
│   ├── ARCHITECTURE.md
│   ├── user-stories.md
│   └── diagrams/
│       ├── class-diagram.puml
│       ├── component-diagram.puml
│       ├── er-diagram.puml
│       ├── er-diagram.pdf
│       ├── er-modelo.puml
│       ├── er-modelo.pdf
│       └── use-case-diagram.puml
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   ├── dev.db
│   │   └── migrations/
│   └── src/
│       ├── application/
│       │   ├── auth/
│       │   ├── company/
│       │   ├── institution/
│       │   ├── professor/
│       │   ├── resgate/
│       │   ├── student/
│       │   ├── transfer/
│       │   └── vantagem/
│       ├── domain/
│       │   ├── entities/
│       │   ├── enums/
│       │   └── interfaces/
│       ├── infrastructure/
│       │   ├── database/
│       │   └── repositories/
│       └── interfaces/
│           ├── controllers/
│           ├── dtos/
│           ├── middlewares/
│           ├── routes/
│           └── app.ts
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── App.css
        ├── context/
        │   └── AuthContext.tsx
        ├── services/
        │   └── api.ts
        ├── types/
        │   └── index.ts
        └── features/
            ├── auth/
            ├── company/
            ├── dashboard/
            ├── design-system/
            ├── leaderboard/
            ├── perks/
            ├── professor/
            ├── slides/
            ├── statement/
            ├── student/
            └── transfer/
```

---

## 🌐 Rotas da API

### Autenticação

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Pública | Autentica usuário e retorna JWT |
| `POST` | `/auth/register/aluno` | Pública | Cadastra aluno |
| `POST` | `/auth/register/empresa` | Pública | Cadastra empresa parceira |
| `GET` | `/auth/me` | JWT | Retorna usuário autenticado |

### Instituições, Alunos, Empresas e Professores

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/institutions` | Lista instituições |
| `GET` | `/students` | Lista alunos |
| `GET` | `/students/:id` | Busca aluno por ID |
| `POST` | `/students` | Cria aluno |
| `PUT` | `/students/:id` | Atualiza aluno |
| `DELETE` | `/students/:id` | Remove aluno |
| `GET` | `/companies` | Lista empresas |
| `GET` | `/companies/:id` | Busca empresa por ID |
| `POST` | `/companies` | Cria empresa |
| `PUT` | `/companies/:id` | Atualiza empresa |
| `DELETE` | `/companies/:id` | Remove empresa |
| `GET` | `/professors` | Lista professores |
| `GET` | `/professors/:id` | Busca professor por ID |
| `GET` | `/professors/:id/statement` | Consulta extrato do professor |
| `POST` | `/professors/credit-semester` | Credita 1000 moedas para professores |

### Moedas, Vantagens, Resgates e Ranking

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `POST` | `/transfers` | Professor | Envia moedas para aluno |
| `GET` | `/transfers/professor/:id` | JWT | Lista transferências por professor |
| `GET` | `/transfers/aluno/:id` | JWT | Lista transferências recebidas pelo aluno |
| `GET` | `/vantagens` | Pública | Lista vantagens disponíveis |
| `GET` | `/vantagens/empresa/:empresaId` | Pública | Lista vantagens de uma empresa |
| `POST` | `/vantagens/empresa/:empresaId` | Empresa | Cria vantagem |
| `PUT` | `/vantagens/:id` | Empresa | Atualiza vantagem |
| `DELETE` | `/vantagens/:id` | Empresa | Remove vantagem |
| `POST` | `/resgates` | Aluno | Resgata vantagem e gera cupom |
| `GET` | `/resgates/aluno/:id` | JWT | Lista resgates do aluno |
| `GET` | `/resgates/empresa/:id` | JWT | Lista resgates da empresa |
| `GET` | `/leaderboard` | Pública | Lista ranking de alunos |
| `GET` | `/leaderboard/stats` | Pública | Retorna estatísticas gerais |

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Tela | Descrição |
|---|---|
| **Login** | Entrada segura por email e senha |
| **Cadastro** | Registro de aluno ou empresa parceira |
| **Dashboard** | Visão inicial com indicadores e atalhos |
| **Alunos** | Listagem e manutenção de alunos |
| **Empresas** | Listagem e manutenção de empresas parceiras |
| **Professores** | Consulta de professores cadastrados |
| **Enviar Moedas** | Fluxo para professor reconhecer aluno com moedas e motivo |
| **Vantagens** | Catálogo de benefícios para alunos ou gestão pela empresa |
| **Extrato** | Histórico financeiro conforme perfil logado |
| **Ranking** | Classificação de alunos por saldo/moedas |
| **Design System** | Componentes, cores e padrões visuais usados na aplicação |
| **Apresentação** | Página de apoio para exposição do projeto |

### 🧪 Fluxo sugerido para testar

1. Faça login como professor: `falbo@prof.com` / `123456`
2. Acesse **Enviar Moedas**
3. Escolha um aluno, informe o valor e descreva o motivo
4. Saia e faça login como aluno: `ana@aluno.com` / `123456`
5. Consulte o **Extrato** e o **Catálogo de Vantagens**
6. Resgate uma vantagem caso haja saldo suficiente
7. Faça login como empresa: `cantina@parceiro.com` / `123456`
8. Consulte vantagens cadastradas e resgates recebidos

---

## 🧩 Diagramas e Documentação

O projeto possui documentação complementar em `docs/`:

| Arquivo | Conteúdo |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura, atores, entidades, padrões e contratos |
| [docs/user-stories.md](docs/user-stories.md) | Histórias de usuário e critérios de aceitação |
| [docs/diagrams/use-case-diagram.puml](docs/diagrams/use-case-diagram.puml) | Diagrama de casos de uso |
| [docs/diagrams/class-diagram.puml](docs/diagrams/class-diagram.puml) | Diagrama de classes |
| [docs/diagrams/component-diagram.puml](docs/diagrams/component-diagram.puml) | Diagrama de componentes |
| [docs/diagrams/er-diagram.puml](docs/diagrams/er-diagram.puml) | Diagrama entidade-relacionamento |
| [docs/diagrams/er-diagram.pdf](docs/diagrams/er-diagram.pdf) | Versão PDF do DER |

---

## 🔗 Documentações Utilizadas

- 📖 [React Documentation](https://react.dev/) - Documentação oficial do React
- 📖 [Vite Documentation](https://vite.dev/) - Guia oficial do Vite
- 📖 [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Referência TypeScript
- 📖 [React Router Documentation](https://reactrouter.com/) - Rotas e navegação
- 📖 [Express Documentation](https://expressjs.com/) - Framework HTTP para Node.js
- 📖 [Prisma Documentation](https://www.prisma.io/docs) - ORM, migrations e schema
- 📖 [SQLite Documentation](https://www.sqlite.org/docs.html) - Banco local usado no desenvolvimento
- 📖 [Zod Documentation](https://zod.dev/) - Validação de dados
- 📖 [JWT Introduction](https://jwt.io/introduction) - Autenticação baseada em tokens
- 📖 [Conventional Commits](https://www.conventionalcommits.org/) - Padrão de commits
- 📖 [PlantUML Documentation](https://plantuml.com/) - Diagramas do projeto

---

## 🤝 Contribuição

Contribuições são bem-vindas para evolução acadêmica do projeto:

1. Faça um **fork** do repositório
2. Crie uma branch para sua alteração:

```bash
git checkout -b feat/minha-feature
```

3. Realize os commits seguindo Conventional Commits:

```bash
git commit -m "feat: adiciona minha feature"
```

4. Envie a branch:

```bash
git push origin feat/minha-feature
```

5. Abra um **Pull Request** descrevendo as mudanças

### 📝 Padrão de Commits

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `style:` | Alterações de estilo e formatação |
| `refactor:` | Refatoração sem mudança de comportamento |
| `docs:` | Alterações na documentação |
| `test:` | Inclusão ou ajuste de testes |
| `chore:` | Tarefas de manutenção |

Exemplos:

```bash
git commit -m "feat: adiciona resgate de vantagens"
git commit -m "fix: corrige validação de saldo insuficiente"
git commit -m "docs: atualiza instruções de execução"
```

---

## 🙏 Agradecimentos

- **PUC Minas** - pelo ambiente acadêmico e estrutura de aprendizado
- **Professores da disciplina** - pela orientação no desenvolvimento do projeto
- Comunidade **React**, **Node.js**, **TypeScript** e **Prisma** - pela documentação e ecossistema open-source
- Colaboradores e colegas que contribuíram com requisitos, testes e revisão do sistema

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos. Até o momento, não há arquivo `LICENSE` formal no repositório.

Para reutilização, distribuição ou uso comercial, consulte os autores do projeto.

---

<div align="center">

**Sistema de Moeda Estudantil - LAB03**

Desenvolvido como projeto acadêmico de Engenharia de Software.

</div>
