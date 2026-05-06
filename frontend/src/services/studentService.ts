import api from './api'
import type { Student, CreateStudentInput, UpdateStudentInput } from '../types'

export async function listStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students')
  return data
}

export async function getStudent(id: string): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${id}`)
  return data
}

export async function createStudent(input: CreateStudentInput): Promise<Student> {
  const { data } = await api.post<Student>('/students', input)
  return data
}

export async function updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
  const { data } = await api.put<Student>(`/students/${id}`, input)
  return data
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`)
}
