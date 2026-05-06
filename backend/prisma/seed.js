const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const instituicoes = [
  { nome: 'PUC Minas', descricao: 'Pontifícia Universidade Católica de Minas Gerais' },
  { nome: 'UFMG', descricao: 'Universidade Federal de Minas Gerais' },
  { nome: 'UFOP', descricao: 'Universidade Federal de Ouro Preto' },
  { nome: 'UFSJ', descricao: 'Universidade Federal de São João del-Rei' },
  { nome: 'CEFET-MG', descricao: 'Centro Federal de Educação Tecnológica de Minas Gerais' },
]

async function main() {
  const count = await prisma.instituicao.count()
  if (count === 0) {
    await prisma.instituicao.createMany({ data: instituicoes })
    console.log(`Seed: ${instituicoes.length} instituições criadas`)
  } else {
    console.log(`Seed: instituições já existem (${count} registros), pulando`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
