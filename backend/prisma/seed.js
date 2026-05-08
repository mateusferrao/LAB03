const { PrismaClient, PapelUsuario } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const instituicoes = [
  { nome: 'PUC Minas', descricao: 'Pontifícia Universidade Católica de Minas Gerais' },
  { nome: 'UFMG', descricao: 'Universidade Federal de Minas Gerais' },
  { nome: 'UFOP', descricao: 'Universidade Federal de Ouro Preto' },
  { nome: 'UFSJ', descricao: 'Universidade Federal de São João del-Rei' },
  { nome: 'CEFET-MG', descricao: 'Centro Federal de Educação Tecnológica de Minas Gerais' },
]

const empresas = [
  {
    nome: 'Cantina Campus Sabor',
    email: 'contato@campussabor.com',
    descricao: 'Cantina parceira com descontos em lanches e refeições para estudantes.',
  },
  {
    nome: 'Livraria Academica Central',
    email: 'contato@livrariaacademica.com',
    descricao: 'Livraria com benefícios em materiais didáticos e papelaria.',
  },
  {
    nome: 'Tech Lab Impressao 3D',
    email: 'parceria@techlab3d.com',
    descricao: 'Parceira para descontos em impressão 3D e prototipagem acadêmica.',
  },
]

const alunos = [
  {
    nome: 'Ana Clara Souza',
    email: 'ana.souza@aluno.com',
    cpf: '12345678901',
    rg: 'MG1234567',
    logradouro: 'Rua das Acacias, 120',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30110000',
    curso: 'Engenharia de Software',
    instituicaoNome: 'PUC Minas',
  },
  {
    nome: 'Bruno Henrique Lima',
    email: 'bruno.lima@aluno.com',
    cpf: '12345678902',
    rg: 'MG1234568',
    logradouro: 'Avenida do Contorno, 4500',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30110010',
    curso: 'Ciencia da Computacao',
    instituicaoNome: 'UFMG',
  },
  {
    nome: 'Carla Mendes Rocha',
    email: 'carla.rocha@aluno.com',
    cpf: '12345678903',
    rg: 'MG1234569',
    logradouro: 'Rua Ouro Preto, 88',
    cidade: 'Ouro Preto',
    estado: 'MG',
    cep: '35400000',
    curso: 'Engenharia de Minas',
    instituicaoNome: 'UFOP',
  },
  {
    nome: 'Diego Martins Costa',
    email: 'diego.costa@aluno.com',
    cpf: '12345678904',
    rg: 'MG1234570',
    logradouro: 'Rua Sete de Setembro, 310',
    cidade: 'Sao Joao del-Rei',
    estado: 'MG',
    cep: '36300000',
    curso: 'Administracao',
    instituicaoNome: 'UFSJ',
  },
  {
    nome: 'Eduarda Fernandes Alves',
    email: 'eduarda.alves@aluno.com',
    cpf: '12345678905',
    rg: 'MG1234571',
    logradouro: 'Avenida Amazonas, 920',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30410000',
    curso: 'Engenharia Eletrica',
    instituicaoNome: 'CEFET-MG',
  },
]

async function ensureInstituicoes() {
  const count = await prisma.instituicao.count()

  if (count === 0) {
    await prisma.instituicao.createMany({ data: instituicoes })
    console.log(`Seed: ${instituicoes.length} instituições criadas`)
  } else {
    console.log(`Seed: instituições já existem (${count} registros), pulando`)
  }

  return prisma.instituicao.findMany()
}

async function ensureEmpresas() {
  const senhaHash = await bcrypt.hash('123456', 10)
  let created = 0
  let skipped = 0

  for (const empresa of empresas) {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: empresa.email },
      select: { id: true },
    })

    if (existingUser) {
      skipped += 1
      continue
    }

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: empresa.email,
          senhaHash,
          papel: PapelUsuario.EMPRESA_PARCEIRA,
        },
      })

      await tx.empresaParceira.create({
        data: {
          id: usuario.id,
          nome: empresa.nome,
          descricao: empresa.descricao,
        },
      })
    })

    created += 1
  }

  console.log(`Seed: empresas criadas=${created}, puladas=${skipped}`)
}

async function ensureAlunos(instituicoesExistentes) {
  const instituicoesPorNome = new Map(
    instituicoesExistentes.map((instituicao) => [instituicao.nome, instituicao.id]),
  )
  const senhaHash = await bcrypt.hash('123456', 10)
  let created = 0
  let skipped = 0

  for (const aluno of alunos) {
    const instituicaoId = instituicoesPorNome.get(aluno.instituicaoNome)

    if (!instituicaoId) {
      throw new Error(`Instituição não encontrada para seed do aluno: ${aluno.instituicaoNome}`)
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email: aluno.email },
      select: { id: true },
    })

    if (existingUser) {
      skipped += 1
      continue
    }

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: aluno.email,
          senhaHash,
          papel: PapelUsuario.ALUNO,
        },
      })

      await tx.aluno.create({
        data: {
          id: usuario.id,
          nome: aluno.nome,
          cpf: aluno.cpf,
          rg: aluno.rg,
          logradouro: aluno.logradouro,
          cidade: aluno.cidade,
          estado: aluno.estado,
          cep: aluno.cep,
          curso: aluno.curso,
          instituicaoId,
        },
      })
    })

    created += 1
  }

  console.log(`Seed: alunos criados=${created}, pulados=${skipped}`)
}

async function main() {
  const instituicoesExistentes = await ensureInstituicoes()
  await ensureEmpresas()
  await ensureAlunos(instituicoesExistentes)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
