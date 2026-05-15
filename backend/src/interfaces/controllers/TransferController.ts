import { Request, Response, NextFunction } from 'express'
import { TransferService } from '../../application/transfer/TransferService'
import { z } from 'zod'

const transferService = new TransferService()

const SendCoinsDto = z.object({
  alunoId: z.string().uuid(),
  valor: z.number().int().positive(),
  motivo: z.string().min(5),
})

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

  async byProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transferService.listByProfessor(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },

  async byAluno(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transferService.listByAluno(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },
}
