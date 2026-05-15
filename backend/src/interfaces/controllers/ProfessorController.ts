import { Request, Response, NextFunction } from 'express'
import { ProfessorService } from '../../application/professor/ProfessorService'

const professorService = new ProfessorService()

export const ProfessorController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const professores = await professorService.listProfessors()
      res.json(professores)
    } catch (err) {
      next(err)
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await professorService.getProfessor(req.params.id)
      res.json(prof)
    } catch (err) {
      next(err)
    }
  },

  async statement(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await professorService.getStatement(req.params.id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  },

  async creditSemester(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await professorService.creditSemester()
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
}
