import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req, res, next) => {
  try {
    const alunos = await prisma.aluno.findMany({
      orderBy: { saldoMoedas: 'desc' },
      take: 10,
      include: { instituicao: true },
    })
    res.json(alunos.map((a, i) => ({ posicao: i + 1, nome: a.nome, saldoMoedas: a.saldoMoedas, curso: a.curso, instituicao: a.instituicao.nome })))
  } catch (err) {
    next(err)
  }
})

router.get('/stats', async (req, res, next) => {
  try {
    const [totalAlunos, totalProfessores, totalEmpresas, totalTransferencias, totalResgates] = await Promise.all([
      prisma.aluno.count(),
      prisma.professor.count(),
      prisma.empresaParceira.count(),
      prisma.transferenciaMoedas.count(),
      prisma.resgate.count(),
    ])
    const moedasCirculando = await prisma.aluno.aggregate({ _sum: { saldoMoedas: true } })
    res.json({ totalAlunos, totalProfessores, totalEmpresas, totalTransferencias, totalResgates, moedasCirculando: moedasCirculando._sum.saldoMoedas ?? 0 })
  } catch (err) {
    next(err)
  }
})

export default router
