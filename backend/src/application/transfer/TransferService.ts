import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type SendCoinsInput = {
  professorId: string
  alunoId: string
  valor: number
  motivo: string
}

export class TransferService {
  async sendCoins(input: SendCoinsInput) {
    const professor = await prisma.professor.findUnique({ where: { id: input.professorId } })
    if (!professor) throw new Error('Professor não encontrado')
    if (professor.saldoMoedas < input.valor) throw new Error('Saldo insuficiente')
    if (input.valor <= 0) throw new Error('Valor deve ser positivo')

    const aluno = await prisma.aluno.findUnique({
      where: { id: input.alunoId },
      include: { usuario: true },
    })
    if (!aluno) throw new Error('Aluno não encontrado')

    const transferencia = await prisma.$transaction(async (tx) => {
      await tx.professor.update({
        where: { id: input.professorId },
        data: { saldoMoedas: { decrement: input.valor } },
      })
      await tx.aluno.update({
        where: { id: input.alunoId },
        data: { saldoMoedas: { increment: input.valor } },
      })
      return tx.transferenciaMoedas.create({
        data: {
          professorId: input.professorId,
          alunoId: input.alunoId,
          valor: input.valor,
          motivo: input.motivo,
        },
        include: { professor: true, aluno: true },
      })
    })

    // Email notification (logged to console for the prototype)
    console.log(`📧 EMAIL para ${aluno.usuario.email}: Você recebeu ${input.valor} moeda(s) de ${professor.nome}! Motivo: "${input.motivo}"`)

    return transferencia
  }

  async listByProfessor(professorId: string) {
    return prisma.transferenciaMoedas.findMany({
      where: { professorId },
      include: { aluno: true },
      orderBy: { realizadaEm: 'desc' },
    })
  }

  async listByAluno(alunoId: string) {
    return prisma.transferenciaMoedas.findMany({
      where: { alunoId },
      include: { professor: true },
      orderBy: { realizadaEm: 'desc' },
    })
  }
}
