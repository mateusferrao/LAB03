# User Stories — Sistema de Moeda Estudantil

## US01 — Cadastro de Aluno
**Como** aluno, **quero** me cadastrar no sistema informando meus dados pessoais e instituição, **para** poder participar do sistema de mérito estudantil.

**Critérios de aceitação:**
- Campos obrigatórios: nome, email, CPF, RG, endereço, curso
- Instituição selecionada de lista pré-cadastrada
- Email deve ser único no sistema
- Senha gerada ou definida no cadastro

---

## US02 — Autenticação
**Como** aluno/professor/empresa parceira, **quero** fazer login com email e senha, **para** acessar as funcionalidades do sistema com segurança.

**Critérios de aceitação:**
- Login retorna JWT com role do usuário
- Rotas protegidas retornam 401 sem token válido
- Roles distintas redirecionam para dashboards distintos

---

## US03 — Envio de Moedas
**Como** professor, **quero** enviar moedas a um aluno com um motivo descritivo, **para** reconhecer seu mérito acadêmico.

**Critérios de aceitação:**
- Professor deve ter saldo ≥ quantidade enviada
- Motivo é campo obrigatório (texto livre)
- Saldo do professor é decrementado imediatamente
- Aluno recebe email de notificação com nome do professor, valor e motivo

---

## US04 — Recebimento de Notificação por Email
**Como** aluno, **quero** ser notificado por email quando receber moedas, **para** saber quem me reconheceu e por qual motivo.

**Critérios de aceitação:**
- Email disparado automaticamente após transferência confirmada
- Email inclui: remetente, valor, motivo, saldo atual

---

## US05 — Consulta de Extrato — Professor
**Como** professor, **quero** visualizar meu extrato de envios, **para** acompanhar quantas moedas distribui e para quais alunos.

**Critérios de aceitação:**
- Lista de todas as transferências realizadas (data, aluno, valor, motivo)
- Exibe saldo atual disponível

---

## US06 — Consulta de Extrato — Aluno
**Como** aluno, **quero** visualizar meu extrato de transações, **para** saber quantas moedas recebi e quantas usei em resgates.

**Critérios de aceitação:**
- Lista de recebimentos (data, professor, valor, motivo)
- Lista de resgates (data, vantagem, custo, código do cupom)
- Exibe saldo atual disponível

---

## US07 — Cadastro de Empresa Parceira
**Como** empresa parceira, **quero** me cadastrar no sistema, **para** oferecer vantagens e benefícios aos alunos.

**Critérios de aceitação:**
- Campos obrigatórios: nome, email, senha, descrição
- Após cadastro, empresa pode gerenciar seu catálogo de vantagens

---

## US08 — Cadastro de Vantagem
**Como** empresa parceira, **quero** cadastrar vantagens com nome, descrição, foto e custo em moedas, **para** que alunos possam resgatá-las.

**Critérios de aceitação:**
- Campos obrigatórios: nome, descrição, foto (upload), custo em moedas
- Vantagem fica disponível no catálogo após cadastro
- Empresa pode editar e remover suas vantagens

---

## US09 — Visualização do Catálogo de Vantagens
**Como** aluno, **quero** visualizar todas as vantagens disponíveis, **para** escolher qual desejo resgatar.

**Critérios de aceitação:**
- Lista todas as vantagens ativas de todas as empresas parceiras
- Exibe nome, descrição, foto e custo em moedas
- Indica se o aluno possui saldo suficiente para cada item

---

## US10 — Resgate de Vantagem
**Como** aluno, **quero** resgatar uma vantagem usando minhas moedas, **para** obter o benefício oferecido pela empresa parceira.

**Critérios de aceitação:**
- Aluno deve ter saldo ≥ custo da vantagem
- Saldo decrementado imediatamente após confirmação
- Código de cupom único gerado pelo sistema
- Email enviado ao aluno com cupom e código
- Email enviado à empresa parceira com o mesmo código
- Resgate registrado no extrato do aluno

---

## US11 — Reposição Semestral de Moedas
**Como** sistema, **quero** adicionar 1000 moedas ao saldo de cada professor a cada semestre, **para** garantir que professores possam continuar reconhecendo alunos.

**Critérios de aceitação:**
- Executado automaticamente no início de cada semestre
- Valor é adicionado ao saldo corrente (acumulativo, não substitutivo)
- Professor é notificado sobre recebimento
