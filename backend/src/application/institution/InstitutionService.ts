import { Institution } from '../../domain/entities/Institution'
import { PrismaInstitutionRepository } from '../../infrastructure/repositories/PrismaInstitutionRepository'

export class InstitutionService {
  private repo: PrismaInstitutionRepository

  constructor() {
    this.repo = new PrismaInstitutionRepository()
  }

  async listInstitutions(): Promise<Institution[]> {
    return this.repo.findAll()
  }
}
