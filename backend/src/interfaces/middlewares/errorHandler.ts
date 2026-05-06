import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors.map((e) => ({ campo: e.path.join('.'), mensagem: e.message })),
    })
  }

  if (err instanceof Error) {
    const status = err.message.includes('não encontrado') ? 404 : 500
    return res.status(status).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Erro interno do servidor' })
}
