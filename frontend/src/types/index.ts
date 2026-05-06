export interface Student {
  id: string
  email: string
  nome: string
  cpf: string
  rg: string
  logradouro: string
  cidade: string
  estado: string
  cep: string
  curso: string
  saldoMoedas: number
  instituicaoId: string
  criadoEm: string
}

export interface PartnerCompany {
  id: string
  email: string
  nome: string
  descricao: string
  criadoEm: string
}

export interface Institution {
  id: string
  nome: string
  descricao: string
}

export interface CreateStudentInput {
  nome: string
  email: string
  senha: string
  cpf: string
  rg: string
  logradouro: string
  cidade: string
  estado: string
  cep: string
  curso: string
  instituicaoId: string
}

export interface UpdateStudentInput {
  nome?: string
  cpf?: string
  rg?: string
  logradouro?: string
  cidade?: string
  estado?: string
  cep?: string
  curso?: string
  instituicaoId?: string
}

export interface CreateCompanyInput {
  nome: string
  email: string
  senha: string
  descricao: string
}

export interface UpdateCompanyInput {
  nome?: string
  descricao?: string
}
