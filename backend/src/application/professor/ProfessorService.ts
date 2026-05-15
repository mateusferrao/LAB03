import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ProfessorService {
  async listProfessors() {
    return prisma.professor.findMany({
      include: { usuario: true, instituicao: true },
      orderBy: { nome: 'asc' },
    })
  }

  async getProfessor(id: string) {
    const prof = await prisma.professor.findUnique({
      where: { id },
      include: { usuario: true, instituicao: true },
    })
    if (!prof) throw new Error('Professor não encontrado')
    return prof
  }

  async getStatement(professorId: string) {
    const professor = await this.getProfessor(professorId)
    const transferencias = await prisma.transferenciaMoedas.findMany({
      where: { professorId },
      include: { aluno: true },
      orderBy: { realizadaEm: 'desc' },
    })
    return {
      professor: { id: professor.id, nome: professor.nome, saldoMoedas: professor.saldoMoedas },
      transferencias,
    }
  }

  async creditSemester() {
    const professores = await prisma.professor.findMany()
    await Promise.all(
      professores.map((p) =>
        prisma.professor.update({
          where: { id: p.id },
          data: { saldoMoedas: p.saldoMoedas + 1000 },
        }),
      ),
    )
    return { mensagem: `Crédito de 1000 moedas adicionado a ${professores.length} professor(es)` }
  }
}
