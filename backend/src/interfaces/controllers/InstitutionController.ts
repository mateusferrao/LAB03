import { Request, Response, NextFunction } from 'express'
import { InstitutionService } from '../../application/institution/InstitutionService'

const institutionService = new InstitutionService()

export const InstitutionController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const institutions = await institutionService.listInstitutions()
      res.json(institutions)
    } catch (err) {
      next(err)
    }
  },
}
