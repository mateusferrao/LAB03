import { IRepository } from '../../domain/interfaces/IRepository'
import { PartnerCompany } from '../../domain/entities/PartnerCompany'
import prisma from '../database/prisma'
import { PapelUsuario } from '@prisma/client'
import bcrypt from 'bcryptjs'

export type CreateCompanyInput = Omit<PartnerCompany, 'id' | 'criadoEm'> & {
  senha: string
}

export type UpdateCompanyInput = Partial<Pick<PartnerCompany, 'nome' | 'descricao'>>

export class PrismaCompanyRepository implements IRepository<PartnerCompany, CreateCompanyInput> {
  async findById(id: string): Promise<PartnerCompany | null> {
    const empresa = await prisma.empresaParceira.findUnique({
      where: { id },
      include: { usuario: true },
    })
    if (!empresa) return null
    return this.mapToCompany(empresa)
  }

  async findAll(): Promise<PartnerCompany[]> {
    const empresas = await prisma.empresaParceira.findMany({
      include: { usuario: true },
      orderBy: { nome: 'asc' },
    })
    return empresas.map(this.mapToCompany)
  }

  async save(input: CreateCompanyInput): Promise<PartnerCompany> {
    const senhaHash = await bcrypt.hash(input.senha, 10)

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: input.email,
          senhaHash,
          papel: PapelUsuario.EMPRESA_PARCEIRA,
        },
      })

      const empresa = await tx.empresaParceira.create({
        data: {
          id: usuario.id,
          nome: input.nome,
          descricao: input.descricao,
        },
        include: { usuario: true },
      })

      return empresa
    })

    return this.mapToCompany(result)
  }

  async update(id: string, data: UpdateCompanyInput): Promise<PartnerCompany> {
    const empresa = await prisma.empresaParceira.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
      },
      include: { usuario: true },
    })
    return this.mapToCompany(empresa)
  }

  async delete(id: string): Promise<void> {
    await prisma.usuario.delete({ where: { id } })
  }

  private mapToCompany(empresa: any): PartnerCompany {
    return {
      id: empresa.id,
      email: empresa.usuario.email,
      nome: empresa.nome,
      descricao: empresa.descricao,
      criadoEm: empresa.usuario.criadoEm,
    }
  }
}
