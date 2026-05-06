import { z } from 'zod'

export const CreateCompanyDto = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  descricao: z.string().min(1, 'Descrição obrigatória'),
})

export const UpdateCompanyDto = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
})

export type CreateCompanyDto = z.infer<typeof CreateCompanyDto>
export type UpdateCompanyDto = z.infer<typeof UpdateCompanyDto>
