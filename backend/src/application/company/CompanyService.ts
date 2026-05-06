import { PartnerCompany } from '../../domain/entities/PartnerCompany'
import {
  PrismaCompanyRepository,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '../../infrastructure/repositories/PrismaCompanyRepository'

export class CompanyService {
  private repo: PrismaCompanyRepository

  constructor() {
    this.repo = new PrismaCompanyRepository()
  }

  async createCompany(input: CreateCompanyInput): Promise<PartnerCompany> {
    return this.repo.save(input)
  }

  async getCompany(id: string): Promise<PartnerCompany> {
    const company = await this.repo.findById(id)
    if (!company) throw new Error('Empresa parceira não encontrada')
    return company
  }

  async listCompanies(): Promise<PartnerCompany[]> {
    return this.repo.findAll()
  }

  async updateCompany(id: string, data: UpdateCompanyInput): Promise<PartnerCompany> {
    await this.getCompany(id)
    return this.repo.update(id, data)
  }

  async deleteCompany(id: string): Promise<void> {
    await this.getCompany(id)
    return this.repo.delete(id)
  }
}
