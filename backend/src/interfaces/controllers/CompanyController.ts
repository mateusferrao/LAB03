import { Request, Response, NextFunction } from 'express'
import { CompanyService } from '../../application/company/CompanyService'
import { CreateCompanyDto, UpdateCompanyDto } from '../dtos/company.dto'

const companyService = new CompanyService()

export const CompanyController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await companyService.listCompanies()
      res.json(companies)
    } catch (err) {
      next(err)
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await companyService.getCompany(req.params.id)
      res.json(company)
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateCompanyDto.parse(req.body)
      const company = await companyService.createCompany(dto)
      res.status(201).json(company)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateCompanyDto.parse(req.body)
      const company = await companyService.updateCompany(req.params.id, dto)
      res.json(company)
    } catch (err) {
      next(err)
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await companyService.deleteCompany(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
