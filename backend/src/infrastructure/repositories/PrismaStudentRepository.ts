import { IRepository } from '../../domain/interfaces/IRepository'
import { Student } from '../../domain/entities/Student'
import prisma from '../database/prisma'
import { PapelUsuario } from '../../domain/enums/PapelUsuario'
import bcrypt from 'bcryptjs'

export type CreateStudentInput = Omit<Student, 'id' | 'saldoMoedas' | 'criadoEm'> & {
  senha: string
}

export type UpdateStudentInput = Partial<Omit<Student, 'id' | 'email' | 'criadoEm'>>

export class PrismaStudentRepository implements IRepository<Student, CreateStudentInput> {
  async findById(id: string): Promise<Student | null> {
    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: { usuario: true },
    })
    if (!aluno) return null
    return this.mapToStudent(aluno)
  }

  async findAll(): Promise<Student[]> {
    const alunos = await prisma.aluno.findMany({
      include: { usuario: true },
      orderBy: { nome: 'asc' },
    })
    return alunos.map(this.mapToStudent)
  }

  async save(input: CreateStudentInput): Promise<Student> {
    const senhaHash = await bcrypt.hash(input.senha, 10)

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: input.email,
          senhaHash,
          papel: PapelUsuario.ALUNO,
        },
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
        include: { usuario: true },
      })

      return aluno
    })

    return this.mapToStudent(result)
  }

  async update(id: string, data: UpdateStudentInput): Promise<Student> {
    const aluno = await prisma.aluno.update({
      where: { id },
      data: {
        nome: data.nome,
        cpf: data.cpf,
        rg: data.rg,
        logradouro: data.logradouro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        curso: data.curso,
        instituicaoId: data.instituicaoId,
      },
      include: { usuario: true },
    })
    return this.mapToStudent(aluno)
  }

  async delete(id: string): Promise<void> {
    // Cascade via onDelete: Cascade on Aluno.usuario
    await prisma.usuario.delete({ where: { id } })
  }

  private mapToStudent(aluno: any): Student {
    return {
      id: aluno.id,
      email: aluno.usuario.email,
      nome: aluno.nome,
      cpf: aluno.cpf,
      rg: aluno.rg,
      logradouro: aluno.logradouro,
      cidade: aluno.cidade,
      estado: aluno.estado,
      cep: aluno.cep,
      curso: aluno.curso,
      saldoMoedas: aluno.saldoMoedas,
      instituicaoId: aluno.instituicaoId,
      criadoEm: aluno.usuario.criadoEm,
    }
  }
}
