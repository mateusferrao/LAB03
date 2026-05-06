import { Request, Response, NextFunction } from 'express'
import { StudentService } from '../../application/student/StudentService'
import { CreateStudentDto, UpdateStudentDto } from '../dtos/student.dto'

const studentService = new StudentService()

export const StudentController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await studentService.listStudents()
      res.json(students)
    } catch (err) {
      next(err)
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.getStudent(req.params.id)
      res.json(student)
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateStudentDto.parse(req.body)
      const student = await studentService.createStudent(dto)
      res.status(201).json(student)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateStudentDto.parse(req.body)
      const student = await studentService.updateStudent(req.params.id, dto)
      res.json(student)
    } catch (err) {
      next(err)
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await studentService.deleteStudent(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
