const { PrismaClient } = require('@prisma/client')
const PapelUsuario = { ALUNO: 'ALUNO', PROFESSOR: 'PROFESSOR', EMPRESA_PARCEIRA: 'EMPRESA_PARCEIRA' }
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const instituicoes = [
  { nome: 'PUC Minas', descricao: 'Pontifícia Universidade Católica de Minas Gerais' },
  { nome: 'UFMG', descricao: 'Universidade Federal de Minas Gerais' },
  { nome: 'UFOP', descricao: 'Universidade Federal de Ouro Preto' },
  { nome: 'UFSJ', descricao: 'Universidade Federal de São João del-Rei' },
  { nome: 'CEFET-MG', descricao: 'Centro Federal de Educação Tecnológica de Minas Gerais' },
]

const professores = [
  { nome: 'Prof. Ricardo Falbo', email: 'falbo@prof.com', cpf: '99988877701', departamento: 'Engenharia de Software', instituicaoNome: 'PUC Minas' },
  { nome: 'Prof. Ana Borges', email: 'borges@prof.com', cpf: '99988877702', departamento: 'Ciência da Computação', instituicaoNome: 'UFMG' },
  { nome: 'Prof. Carlos Silva', email: 'csilva@prof.com', cpf: '99988877703', departamento: 'Sistemas de Informação', instituicaoNome: 'UFOP' },
  { nome: 'Prof. Marta Oliveira', email: 'moliveira@prof.com', cpf: '99988877704', departamento: 'Matemática Aplicada', instituicaoNome: 'PUC Minas' },
]

const empresas = [
  {
    nome: 'Cantina Campus Sabor',
    email: 'cantina@parceiro.com',
    descricao: 'Cantina parceira com descontos em lanches e refeições para estudantes.',
    vantagens: [
      { nome: 'Almoço Completo', descricao: 'Prato comercial completo com sobremesa e suco na cantina universitária.', urlFoto: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', custoMoedas: 50 },
      { nome: 'Combo Lanche + Bebida', descricao: 'Sanduíche artesanal + refrigerante ou suco natural à sua escolha.', urlFoto: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400', custoMoedas: 30 },
      { nome: 'Café da Manhã', descricao: 'Café, leite, pão de queijo e frutas da estação.', urlFoto: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400', custoMoedas: 20 },
    ],
  },
  {
    nome: 'Livraria Acadêmica Central',
    email: 'livraria@parceiro.com',
    descricao: 'Livraria com benefícios em materiais didáticos e papelaria.',
    vantagens: [
      { nome: '20% Desconto Livro Técnico', descricao: 'Desconto de 20% em qualquer título de informática ou engenharia do catálogo.', urlFoto: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', custoMoedas: 80 },
      { nome: 'Kit Papelaria', descricao: 'Conjunto com caderno universitário, canetas, marca-texto e post-its.', urlFoto: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400', custoMoedas: 40 },
    ],
  },
  {
    nome: 'Tech Lab Impressão 3D',
    email: 'techlab@parceiro.com',
    descricao: 'Parceira para descontos em impressão 3D e prototipagem acadêmica.',
    vantagens: [
      { nome: 'Impressão 3D 100g', descricao: 'Impressão 3D de até 100g de filamento PLA em qualquer cor disponível.', urlFoto: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400', custoMoedas: 120 },
      { nome: 'Consultoria de Projeto', descricao: 'Sessão de 1h de consultoria técnica para projeto de prototipagem.', urlFoto: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400', custoMoedas: 200 },
    ],
  },
]

const alunos = [
  { nome: 'Ana Clara Souza', email: 'ana@aluno.com', cpf: '12345678901', rg: 'MG1234567', logradouro: 'Rua das Acacias, 120', cidade: 'Belo Horizonte', estado: 'MG', cep: '30110000', curso: 'Engenharia de Software', instituicaoNome: 'PUC Minas' },
  { nome: 'Bruno Henrique Lima', email: 'bruno@aluno.com', cpf: '12345678902', rg: 'MG1234568', logradouro: 'Avenida do Contorno, 4500', cidade: 'Belo Horizonte', estado: 'MG', cep: '30110010', curso: 'Ciência da Computação', instituicaoNome: 'UFMG' },
  { nome: 'Carla Mendes Rocha', email: 'carla@aluno.com', cpf: '12345678903', rg: 'MG1234569', logradouro: 'Rua Ouro Preto, 88', cidade: 'Ouro Preto', estado: 'MG', cep: '35400000', curso: 'Engenharia de Minas', instituicaoNome: 'UFOP' },
  { nome: 'Diego Martins Costa', email: 'diego@aluno.com', cpf: '12345678904', rg: 'MG1234570', logradouro: 'Rua Sete de Setembro, 310', cidade: 'São João del-Rei', estado: 'MG', cep: '36300000', curso: 'Administração', instituicaoNome: 'UFSJ' },
  { nome: 'Eduarda Fernandes Alves', email: 'edu@aluno.com', cpf: '12345678905', rg: 'MG1234571', logradouro: 'Avenida Amazonas, 920', cidade: 'Belo Horizonte', estado: 'MG', cep: '30410000', curso: 'Engenharia Elétrica', instituicaoNome: 'CEFET-MG' },
  { nome: 'Felipe Santos Rocha', email: 'felipe@aluno.com', cpf: '12345678906', rg: 'MG1234572', logradouro: 'Rua da Bahia, 1000', cidade: 'Belo Horizonte', estado: 'MG', cep: '30160000', curso: 'Engenharia de Software', instituicaoNome: 'PUC Minas' },
]

async function ensureInstituicoes() {
  const count = await prisma.instituicao.count()
  if (count === 0) {
    await prisma.instituicao.createMany({ data: instituicoes })
    console.log(`✅ ${instituicoes.length} instituições criadas`)
  } else {
    console.log(`⏭️  Instituições já existem (${count})`)
  }
  return prisma.instituicao.findMany()
}

async function ensureProfessores(instMap) {
  const senhaHash = await bcrypt.hash('123456', 10)
  let created = 0

  for (const p of professores) {
    const exists = await prisma.usuario.findUnique({ where: { email: p.email } })
    if (exists) continue

    const instituicaoId = instMap.get(p.instituicaoNome)
    if (!instituicaoId) throw new Error(`Instituição não encontrada: ${p.instituicaoNome}`)

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { email: p.email, senhaHash, papel: PapelUsuario.PROFESSOR },
      })
      await tx.professor.create({
        data: { id: usuario.id, nome: p.nome, cpf: p.cpf, departamento: p.departamento, instituicaoId },
      })
    })
    created++
  }
  console.log(`✅ ${created} professor(es) criado(s)`)
}

async function ensureEmpresas() {
  const senhaHash = await bcrypt.hash('123456', 10)
  let created = 0

  for (const empresa of empresas) {
    const exists = await prisma.usuario.findUnique({ where: { email: empresa.email } })
    let empresaId

    if (!exists) {
      await prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
          data: { email: empresa.email, senhaHash, papel: PapelUsuario.EMPRESA_PARCEIRA },
        })
        const emp = await tx.empresaParceira.create({
          data: { id: usuario.id, nome: empresa.nome, descricao: empresa.descricao },
        })
        empresaId = emp.id
      })
      created++
    } else {
      const emp = await prisma.empresaParceira.findUnique({ where: { id: exists.id } })
      empresaId = emp?.id
    }

    if (empresaId) {
      const vantagensCount = await prisma.vantagem.count({ where: { empresaId } })
      if (vantagensCount === 0) {
        await prisma.vantagem.createMany({
          data: empresa.vantagens.map((v) => ({ ...v, empresaId })),
        })
      }
    }
  }
  console.log(`✅ ${created} empresa(s) criada(s) com vantagens`)
}

async function ensureAlunos(instMap) {
  const senhaHash = await bcrypt.hash('123456', 10)
  let created = 0

  for (const aluno of alunos) {
    const exists = await prisma.usuario.findUnique({ where: { email: aluno.email } })
    if (exists) continue

    const instituicaoId = instMap.get(aluno.instituicaoNome)
    if (!instituicaoId) throw new Error(`Instituição não encontrada: ${aluno.instituicaoNome}`)

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { email: aluno.email, senhaHash, papel: PapelUsuario.ALUNO },
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
          saldoMoedas: Math.floor(Math.random() * 300) + 50,
        },
      })
    })
    created++
  }
  console.log(`✅ ${created} aluno(s) criado(s)`)
}

async function main() {
  console.log('🏛️  Iniciando seed — Sistema de Moeda Estudantil')
  const instituicoesExistentes = await ensureInstituicoes()
  const instMap = new Map(instituicoesExistentes.map((i) => [i.nome, i.id]))
  await ensureProfessores(instMap)
  await ensureEmpresas()
  await ensureAlunos(instMap)
  console.log('\n✅ Seed concluído!')
  console.log('📌 Senhas padrão: 123456')
  console.log('📌 Professor de exemplo: falbo@prof.com / 123456')
  console.log('📌 Aluno de exemplo: ana@aluno.com / 123456')
  console.log('📌 Empresa de exemplo: cantina@parceiro.com / 123456')
}

main().catch(console.error).finally(() => prisma.$disconnect())
