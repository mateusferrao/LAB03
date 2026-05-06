import { z } from 'zod'

export const CreateStudentDto = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos').regex(/^\d+$/, 'CPF deve conter apenas números'),
  rg: z.string().min(1, 'RG obrigatório'),
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  cidade: z.string().min(1, 'Cidade obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 letras'),
  cep: z.string().length(8, 'CEP deve ter 8 dígitos').regex(/^\d+$/, 'CEP deve conter apenas números'),
  curso: z.string().min(1, 'Curso obrigatório'),
  instituicaoId: z.string().uuid('ID de instituição inválido'),
})

export const UpdateStudentDto = z.object({
  nome: z.string().min(1).optional(),
  cpf: z.string().length(11).regex(/^\d+$/).optional(),
  rg: z.string().min(1).optional(),
  logradouro: z.string().min(1).optional(),
  cidade: z.string().min(1).optional(),
  estado: z.string().length(2).optional(),
  cep: z.string().length(8).regex(/^\d+$/).optional(),
  curso: z.string().min(1).optional(),
  instituicaoId: z.string().uuid().optional(),
})

export type CreateStudentDto = z.infer<typeof CreateStudentDto>
export type UpdateStudentDto = z.infer<typeof UpdateStudentDto>
