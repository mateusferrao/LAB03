-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "papel" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "instituicoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "saldo_moedas" INTEGER NOT NULL DEFAULT 0,
    "instituicao_id" TEXT NOT NULL,
    CONSTRAINT "alunos_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "alunos_instituicao_id_fkey" FOREIGN KEY ("instituicao_id") REFERENCES "instituicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "professores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "saldo_moedas" INTEGER NOT NULL DEFAULT 1000,
    "instituicao_id" TEXT NOT NULL,
    CONSTRAINT "professores_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "professores_instituicao_id_fkey" FOREIGN KEY ("instituicao_id") REFERENCES "instituicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "empresas_parceiras" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    CONSTRAINT "empresas_parceiras_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vantagens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "empresa_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL,
    "custo_moedas" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "vantagens_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas_parceiras" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transferencias_moedas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professor_id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "realizada_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transferencias_moedas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transferencias_moedas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resgates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aluno_id" TEXT NOT NULL,
    "vantagem_id" TEXT NOT NULL,
    "codigo_cupom" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "resgatado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resgates_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "resgates_vantagem_id_fkey" FOREIGN KEY ("vantagem_id") REFERENCES "vantagens" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_cpf_key" ON "alunos"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professores_cpf_key" ON "professores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "resgates_codigo_cupom_key" ON "resgates"("codigo_cupom");
