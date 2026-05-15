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
    if (err.message.includes('não encontrado')) return res.status(404).json({ error: err.message })
    if (err.message.includes('já cadastrado') || err.message.includes('Credenciais')) return res.status(400).json({ error: err.message })
    if (err.message.includes('insuficiente') || err.message.includes('não está disponível')) return res.status(422).json({ error: err.message })
    return res.status(500).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Erro interno do servidor' })
}
