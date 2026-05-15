import { Request, Response, NextFunction } from 'express'
import { ResgateService } from '../../application/resgate/ResgateService'
import { z } from 'zod'

const resgateService = new ResgateService()

const ResgateDto = z.object({ vantagemId: z.string().uuid() })

export const ResgateController = {
  async resgatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { vantagemId } = ResgateDto.parse(req.body)
      const resgate = await resgateService.resgatar(req.user!.id, vantagemId)
      res.status(201).json(resgate)
    } catch (err) {
      next(err)
    }
  },

  async byAluno(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await resgateService.listByAluno(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },

  async byEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await resgateService.listByEmpresa(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },
}
