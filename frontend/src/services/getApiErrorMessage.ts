import { isAxiosError } from 'axios'

type ApiErrorBody = {
  error?: string
  details?: Array<{ campo?: string; mensagem?: string }>
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback

  const details = error.response?.data?.details
  if (Array.isArray(details) && details.length > 0) {
    const first = details[0]
    if (first.campo && first.mensagem) return `${first.campo}: ${first.mensagem}`
    if (first.mensagem) return first.mensagem
  }

  return error.response?.data?.error ?? fallback
}
