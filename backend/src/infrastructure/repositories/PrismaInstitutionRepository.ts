import { Institution } from '../../domain/entities/Institution'
import prisma from '../database/prisma'

export class PrismaInstitutionRepository {
  async findAll(): Promise<Institution[]> {
    return prisma.instituicao.findMany({ orderBy: { nome: 'asc' } })
  }

  async findById(id: string): Promise<Institution | null> {
    return prisma.instituicao.findUnique({ where: { id } })
  }
}
