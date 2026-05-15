import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PapelUsuario } from '../../domain/enums/PapelUsuario'
import { signToken } from '../../interfaces/middlewares/authMiddleware'

const prisma = new PrismaClient()

export type RegisterAlunoInput = {
  nome: string
  email: string
  senha: string
  cpf: string
  rg: string
  logradouro: string
  cidade: string
  estado: string
  cep: string
  curso: string
  instituicaoId: string
}

export type RegisterEmpresaInput = {
  nome: string
  email: string
  senha: string
  descricao: string
}

export class AuthService {
  async login(email: string, senha: string) {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) throw new Error('Credenciais inválidas')

    const valid = await bcrypt.compare(senha, usuario.senhaHash)
    if (!valid) throw new Error('Credenciais inválidas')

    const token = signToken({ id: usuario.id, email: usuario.email, papel: usuario.papel })

    let perfil: Record<string, unknown> = {}
    if (usuario.papel === PapelUsuario.ALUNO) {
      perfil = (await prisma.aluno.findUnique({
        where: { id: usuario.id },
        include: { instituicao: true },
      })) ?? {}
    } else if (usuario.papel === PapelUsuario.PROFESSOR) {
      perfil = (await prisma.professor.findUnique({
        where: { id: usuario.id },
        include: { instituicao: true },
      })) ?? {}
    } else if (usuario.papel === PapelUsuario.EMPRESA_PARCEIRA) {
      perfil = (await prisma.empresaParceira.findUnique({ where: { id: usuario.id } })) ?? {}
    }

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        papel: usuario.papel,
        criadoEm: usuario.criadoEm,
        ...perfil,
      },
    }
  }

  async registerAluno(input: RegisterAlunoInput) {
    const exists = await prisma.usuario.findUnique({ where: { email: input.email } })
    if (exists) throw new Error('Email já cadastrado')

    const senhaHash = await bcrypt.hash(input.senha, 10)

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { email: input.email, senhaHash, papel: PapelUsuario.ALUNO },
      })
      const aluno = await tx.aluno.create({
        data: {
          id: usuario.id,
          nome: input.nome,
          cpf: input.cpf,
          rg: input.rg,
          logradouro: input.logradouro,
          cidade: input.cidade,
          estado: input.estado,
          cep: input.cep,
          curso: input.curso,
          instituicaoId: input.instituicaoId,
        },
        include: { usuario: true, instituicao: true },
      })
      return aluno
    })

    const token = signToken({ id: result.id, email: result.usuario.email, papel: PapelUsuario.ALUNO })
    return { token, usuario: { ...result, email: result.usuario.email, papel: PapelUsuario.ALUNO } }
  }

  async registerEmpresa(input: RegisterEmpresaInput) {
    const exists = await prisma.usuario.findUnique({ where: { email: input.email } })
    if (exists) throw new Error('Email já cadastrado')

    const senhaHash = await bcrypt.hash(input.senha, 10)

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { email: input.email, senhaHash, papel: PapelUsuario.EMPRESA_PARCEIRA },
      })
      const empresa = await tx.empresaParceira.create({
        data: { id: usuario.id, nome: input.nome, descricao: input.descricao },
        include: { usuario: true },
      })
      return empresa
    })

    const token = signToken({ id: result.id, email: result.usuario.email, papel: PapelUsuario.EMPRESA_PARCEIRA })
    return { token, usuario: { ...result, email: result.usuario.email, papel: PapelUsuario.EMPRESA_PARCEIRA } }
  }

  async me(userId: string) {
    const usuario = await prisma.usuario.findUnique({ where: { id: userId } })
    if (!usuario) throw new Error('Usuário não encontrado')

    if (usuario.papel === PapelUsuario.ALUNO) {
      const aluno = await prisma.aluno.findUnique({
        where: { id: userId },
        include: { instituicao: true },
      })
      return { ...aluno, email: usuario.email, papel: usuario.papel }
    }
    if (usuario.papel === PapelUsuario.PROFESSOR) {
      const prof = await prisma.professor.findUnique({
        where: { id: userId },
        include: { instituicao: true },
      })
      return { ...prof, email: usuario.email, papel: usuario.papel }
    }
    if (usuario.papel === PapelUsuario.EMPRESA_PARCEIRA) {
      const emp = await prisma.empresaParceira.findUnique({ where: { id: userId } })
      return { ...emp, email: usuario.email, papel: usuario.papel }
    }
    return { id: usuario.id, email: usuario.email, papel: usuario.papel }
  }
}
