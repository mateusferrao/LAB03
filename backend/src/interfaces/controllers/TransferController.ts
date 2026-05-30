import { Request, Response, NextFunction } from 'express'
import { TransferService } from '../../application/transfer/TransferService'
import { z } from 'zod'

const transferService = new TransferService()

const SendCoinsDto = z.object({
  alunoId: z.string().uuid(),
  valor: z.number().int().positive(),
  motivo: z.string().trim().min(5),
})

function canReadOwnResource(req: Request, role: string, id: string): boolean {
  return req.user?.papel === role && req.user.id === id
}

export const TransferController = {
  async send(req: Request, res: Response, next: NextFunction) {
    try {
      const { alunoId, valor, motivo } = SendCoinsDto.parse(req.body)
      const result = await transferService.sendCoins({
        professorId: req.user!.id,
        alunoId,
        valor,
        motivo,
      })
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  },

  async myStatement(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user!.papel === 'PROFESSOR') {
        const data = await transferService.getProfessorStatement(req.user!.id)
        res.json(data)
        return
      }

      if (req.user!.papel === 'ALUNO') {
        const data = await transferService.getAlunoStatement(req.user!.id)
        res.json(data)
        return
      }

      res.status(403).json({ error: 'Extrato de moedas disponivel apenas para professores e alunos' })
    } catch (err) {
      next(err)
    }
  },

  async byProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!canReadOwnResource(req, 'PROFESSOR', req.params.id)) {
        res.status(403).json({ error: 'Acesso negado' })
        return
      }

      const data = await transferService.listByProfessor(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },

  async byAluno(req: Request, res: Response, next: NextFunction) {
    try {
      if (!canReadOwnResource(req, 'ALUNO', req.params.id)) {
        res.status(403).json({ error: 'Acesso negado' })
        return
      }

      const data = await transferService.listByAluno(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },
}
