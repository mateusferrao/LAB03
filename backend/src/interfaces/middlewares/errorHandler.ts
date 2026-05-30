import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Dados invalidos',
      details: err.errors.map((e) => ({ campo: e.path.join('.'), mensagem: e.message })),
    })
  }

  if (err instanceof Error) {
    if (
      err.message.includes('nao encontrado') ||
      err.message.includes('nao encontrada') ||
      err.message.includes('nÃ£o encontrado') ||
      err.message.includes('nÃ£o encontrada')
    ) {
      return res.status(404).json({ error: err.message })
    }
    if (
      err.message.includes('ja cadastrado') ||
      err.message.includes('jÃ¡ cadastrado') ||
      err.message.includes('Credenciais') ||
      err.message.includes('obrigatorio')
    ) {
      return res.status(400).json({ error: err.message })
    }
    if (
      err.message.includes('insuficiente') ||
      err.message.includes('nao esta disponivel') ||
      err.message.includes('nÃ£o estÃ¡ disponÃ­vel')
    ) {
      return res.status(422).json({ error: err.message })
    }
    return res.status(500).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Erro interno do servidor' })
}
