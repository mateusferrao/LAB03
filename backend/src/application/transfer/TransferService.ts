import prisma from '../../infrastructure/database/prisma'
import { EmailService } from '../email/EmailService'

const emailService = new EmailService()

export type SendCoinsInput = {
  professorId: string
  alunoId: string
  valor: number
  motivo: string
}

export class TransferService {
  async sendCoins(input: SendCoinsInput) {
    if (input.valor <= 0) throw new Error('Valor deve ser positivo')

    const motivo = input.motivo.trim()
    if (!motivo) throw new Error('Motivo obrigatorio')

    const professor = await prisma.professor.findUnique({
      where: { id: input.professorId },
      include: { usuario: true },
    })
    if (!professor) throw new Error('Professor nao encontrado')

    const aluno = await prisma.aluno.findUnique({
      where: { id: input.alunoId },
      include: { usuario: true },
    })
    if (!aluno) throw new Error('Aluno nao encontrado')

    const transferencia = await prisma.$transaction(async (tx) => {
      const professorUpdate = await tx.professor.updateMany({
        where: { id: input.professorId, saldoMoedas: { gte: input.valor } },
        data: { saldoMoedas: { decrement: input.valor } },
      })
      if (professorUpdate.count === 0) throw new Error('Saldo insuficiente')

      await tx.aluno.update({
        where: { id: input.alunoId },
        data: { saldoMoedas: { increment: input.valor } },
      })

      return tx.transferenciaMoedas.create({
        data: {
          professorId: input.professorId,
          alunoId: input.alunoId,
          valor: input.valor,
          motivo,
        },
        include: { professor: true, aluno: true },
      })
    })

    await emailService.sendTransferEmails({
      alunoEmail: aluno.usuario.email,
      alunoNome: aluno.nome,
      professorEmail: professor.usuario.email,
      professorNome: professor.nome,
      valor: input.valor,
      motivo,
      realizadaEm: transferencia.realizadaEm,
    })

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

  async getProfessorStatement(professorId: string) {
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: { id: true, nome: true, saldoMoedas: true },
    })
    if (!professor) throw new Error('Professor nao encontrado')

    const transferencias = await this.listByProfessor(professorId)
    return { saldoMoedas: professor.saldoMoedas, professor, transferencias }
  }

  async getAlunoStatement(alunoId: string) {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { id: true, nome: true, saldoMoedas: true },
    })
    if (!aluno) throw new Error('Aluno nao encontrado')

    const transferencias = await this.listByAluno(alunoId)
    return { saldoMoedas: aluno.saldoMoedas, aluno, transferencias }
  }
}
