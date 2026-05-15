import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type CreateVantagemInput = {
  empresaId: string
  nome: string
  descricao: string
  urlFoto: string
  custoMoedas: number
}

export class VantagemService {
  async listAll() {
    return prisma.vantagem.findMany({
      where: { ativa: true },
      include: { empresa: true },
      orderBy: { custoMoedas: 'asc' },
    })
  }

  async listByEmpresa(empresaId: string) {
    return prisma.vantagem.findMany({
      where: { empresaId },
      orderBy: { nome: 'asc' },
    })
  }

  async getVantagem(id: string) {
    const v = await prisma.vantagem.findUnique({ where: { id }, include: { empresa: true } })
    if (!v) throw new Error('Vantagem não encontrada')
    return v
  }

  async create(input: CreateVantagemInput) {
    if (input.custoMoedas <= 0) throw new Error('Custo deve ser positivo')
    return prisma.vantagem.create({ data: input })
  }

  async update(id: string, data: Partial<CreateVantagemInput>) {
    await this.getVantagem(id)
    return prisma.vantagem.update({ where: { id }, data })
  }

  async deactivate(id: string) {
    await this.getVantagem(id)
    return prisma.vantagem.update({ where: { id }, data: { ativa: false } })
  }

  async delete(id: string) {
    await this.getVantagem(id)
    await prisma.vantagem.delete({ where: { id } })
  }
}
