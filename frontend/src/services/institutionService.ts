import api from './api'
import type { Institution } from '../types'

export async function listInstitutions(): Promise<Institution[]> {
  const { data } = await api.get<Institution[]>('/institutions')
  return data
}
