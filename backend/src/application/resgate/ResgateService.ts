import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function generateCouponCode(): string {
  return `CDM-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
}

export class ResgateService {
  async resgatar(alunoId: string, vantagemId: string) {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: { usuario: true },
    })
    if (!aluno) throw new Error('Aluno não encontrado')

    const vantagem = await prisma.vantagem.findUnique({
      where: { id: vantagemId },
      include: { empresa: { include: { usuario: true } } },
    })
    if (!vantagem) throw new Error('Vantagem não encontrada')
    if (!vantagem.ativa) throw new Error('Vantagem não está disponível')
    if (aluno.saldoMoedas < vantagem.custoMoedas) throw new Error('Saldo insuficiente')

    const codigoCupom = generateCouponCode()

    const resgate = await prisma.$transaction(async (tx) => {
      await tx.aluno.update({
        where: { id: alunoId },
        data: { saldoMoedas: { decrement: vantagem.custoMoedas } },
      })
      return tx.resgate.create({
        data: { alunoId, vantagemId, codigoCupom, valor: vantagem.custoMoedas },
        include: { vantagem: { include: { empresa: true } }, aluno: true },
      })
    })

    // Emails (logged to console for prototype)
    console.log(`📧 EMAIL para ${aluno.usuario.email}: Seu cupom para "${vantagem.nome}" é ${codigoCupom}`)
    console.log(`📧 EMAIL para ${vantagem.empresa.usuario.email}: Resgate confirmado - Cupom ${codigoCupom} por ${aluno.nome}`)

    return resgate
  }

  async listByAluno(alunoId: string) {
    return prisma.resgate.findMany({
      where: { alunoId },
      include: { vantagem: { include: { empresa: true } } },
      orderBy: { resgatadoEm: 'desc' },
    })
  }

  async listByEmpresa(empresaId: string) {
    return prisma.resgate.findMany({
      where: { vantagem: { empresaId } },
      include: { aluno: true, vantagem: true },
      orderBy: { resgatadoEm: 'desc' },
    })
  }
}
