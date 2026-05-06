import api from './api'
import type { PartnerCompany, CreateCompanyInput, UpdateCompanyInput } from '../types'

export async function listCompanies(): Promise<PartnerCompany[]> {
  const { data } = await api.get<PartnerCompany[]>('/companies')
  return data
}

export async function getCompany(id: string): Promise<PartnerCompany> {
  const { data } = await api.get<PartnerCompany>(`/companies/${id}`)
  return data
}

export async function createCompany(input: CreateCompanyInput): Promise<PartnerCompany> {
  const { data } = await api.post<PartnerCompany>('/companies', input)
  return data
}

export async function updateCompany(id: string, input: UpdateCompanyInput): Promise<PartnerCompany> {
  const { data } = await api.put<PartnerCompany>(`/companies/${id}`, input)
  return data
}

export async function deleteCompany(id: string): Promise<void> {
  await api.delete(`/companies/${id}`)
}
