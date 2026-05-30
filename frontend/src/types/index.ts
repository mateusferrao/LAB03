export type Papel = 'ALUNO' | 'PROFESSOR' | 'EMPRESA_PARCEIRA'

export interface UsuarioAuth {
  id: string
  email: string
  papel: Papel
  nome?: string
  saldoMoedas?: number
  instituicao?: Instituicao
  departamento?: string
  descricao?: string
}

export interface Instituicao {
  id: string
  nome: string
  descricao: string
}

export interface Aluno {
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
  instituicao?: Instituicao
  criadoEm?: string
}

export interface Professor {
  id: string
  email: string
  nome: string
  cpf: string
  departamento: string
  saldoMoedas: number
  instituicaoId: string
  instituicao?: Instituicao
}

export interface EmpresaParceira {
  id: string
  email: string
  nome: string
  descricao: string
  criadoEm?: string
  vantagens?: Vantagem[]
}

export interface Vantagem {
  id: string
  empresaId: string
  empresa?: EmpresaParceira
  nome: string
  descricao: string
  urlFoto: string
  custoMoedas: number
  ativa: boolean
}

export interface Transferencia {
  id: string
  professorId: string
  professor?: Professor
  alunoId: string
  aluno?: Aluno
  valor: number
  motivo: string
  realizadaEm: string
}

export interface TransferStatement {
  saldoMoedas: number
  professor?: Pick<Professor, 'id' | 'nome' | 'saldoMoedas'>
  aluno?: Pick<Aluno, 'id' | 'nome' | 'saldoMoedas'>
  transferencias: Transferencia[]
}

export interface Resgate {
  id: string
  alunoId: string
  aluno?: Aluno
  vantagemId: string
  vantagem?: Vantagem
  codigoCupom: string
  valor: number
  resgatadoEm: string
}

export interface LeaderboardEntry {
  posicao: number
  nome: string
  saldoMoedas: number
  curso: string
  instituicao: string
}

export interface Stats {
  totalAlunos: number
  totalProfessores: number
  totalEmpresas: number
  totalTransferencias: number
  totalResgates: number
  moedasCirculando: number
}

// Legacy aliases for backward compat
export type Student = Aluno
export type PartnerCompany = EmpresaParceira
export type Institution = Instituicao
