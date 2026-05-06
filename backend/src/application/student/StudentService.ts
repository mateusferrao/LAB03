import { Student } from '../../domain/entities/Student'
import {
  PrismaStudentRepository,
  CreateStudentInput,
  UpdateStudentInput,
} from '../../infrastructure/repositories/PrismaStudentRepository'

export class StudentService {
  private repo: PrismaStudentRepository

  constructor() {
    this.repo = new PrismaStudentRepository()
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    return this.repo.save(input)
  }

  async getStudent(id: string): Promise<Student> {
    const student = await this.repo.findById(id)
    if (!student) throw new Error('Aluno não encontrado')
    return student
  }

  async listStudents(): Promise<Student[]> {
    return this.repo.findAll()
  }

  async updateStudent(id: string, data: UpdateStudentInput): Promise<Student> {
    await this.getStudent(id)
    return this.repo.update(id, data)
  }

  async deleteStudent(id: string): Promise<void> {
    await this.getStudent(id)
    return this.repo.delete(id)
  }
}
