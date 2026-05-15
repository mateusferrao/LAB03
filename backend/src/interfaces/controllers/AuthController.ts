import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../../application/auth/AuthService'
import { z } from 'zod'

const authService = new AuthService()

const LoginDto = z.object({
  email: z.string().email(),
  senha: z.string().min(4),
})

const RegisterAlunoDto = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(4),
  cpf: z.string().length(11),
  rg: z.string().min(5),
  logradouro: z.string().min(5),
  cidade: z.string().min(2),
  estado: z.string().min(2),
  cep: z.string().min(8),
  curso: z.string().min(2),
  instituicaoId: z.string().uuid(),
})

const RegisterEmpresaDto = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(4),
  descricao: z.string().min(10),
})

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = LoginDto.parse(req.body)
      const result = await authService.login(email, senha)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async registerAluno(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = RegisterAlunoDto.parse(req.body)
      const result = await authService.registerAluno(dto)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  },

  async registerEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = RegisterEmpresaDto.parse(req.body)
      const result = await authService.registerEmpresa(dto)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.id)
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
}
