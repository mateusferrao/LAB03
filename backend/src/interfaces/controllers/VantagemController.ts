import { Request, Response, NextFunction } from 'express'
import { VantagemService } from '../../application/vantagem/VantagemService'
import { z } from 'zod'

const vantagemService = new VantagemService()

const CreateVantagemDto = z.object({
  nome: z.string().min(2),
  descricao: z.string().min(10),
  urlFoto: z.string().url().or(z.literal('')),
  custoMoedas: z.number().int().positive(),
})

export const VantagemController = {
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const vantagens = await vantagemService.listAll()
      res.json(vantagens)
    } catch (err) {
      next(err)
    }
  },

  async listByEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const vantagens = await vantagemService.listByEmpresa(req.params.empresaId)
      res.json(vantagens)
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateVantagemDto.parse(req.body)
      const vantagem = await vantagemService.create({
        ...dto,
        empresaId: req.params.empresaId,
      })
      res.status(201).json(vantagem)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateVantagemDto.partial().parse(req.body)
      const vantagem = await vantagemService.update(req.params.id, dto)
      res.json(vantagem)
    } catch (err) {
      next(err)
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await vantagemService.delete(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
