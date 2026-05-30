type EmailTemplateParams = Record<string, string | number | undefined>

type EmailSendInput = {
  templateId: string
  params: EmailTemplateParams
  fallbackSubject: string
  fallbackTo: string
}

const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send'

export class EmailService {
  private readonly serviceId = process.env.EMAILJS_SERVICE_ID
  private readonly publicKey = process.env.EMAILJS_PUBLIC_KEY
  private readonly privateKey = process.env.EMAILJS_PRIVATE_KEY

  isConfigured(): boolean {
    return Boolean(this.serviceId && this.publicKey)
  }

  async send(input: EmailSendInput): Promise<void> {
    if (!this.isConfigured()) {
      this.logFallback(input)
      return
    }

    try {
      const response = await fetch(EMAILJS_SEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: this.serviceId,
          template_id: input.templateId,
          user_id: this.publicKey,
          accessToken: this.privateKey,
          template_params: input.params,
        }),
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(`EmailJS respondeu ${response.status}: ${details}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'erro desconhecido'
      console.warn(`[EMAIL FALLBACK] Falha ao enviar via EmailJS: ${message}`)
      this.logFallback(input)
    }
  }

  async sendTransferEmails(input: {
    alunoEmail: string
    alunoNome: string
    professorEmail: string
    professorNome: string
    valor: number
    motivo: string
    realizadaEm: Date
  }): Promise<void> {
    const templateAlunoId = process.env.EMAILJS_TEMPLATE_ALUNO_ID
    const templateProfessorId = process.env.EMAILJS_TEMPLATE_PROFESSOR_ID

    const baseParams = {
      aluno_email: input.alunoEmail,
      aluno_nome: input.alunoNome,
      professor_email: input.professorEmail,
      professor_nome: input.professorNome,
      valor: input.valor,
      motivo: input.motivo,
      realizada_em: input.realizadaEm.toLocaleString('pt-BR'),
    }

    if (!templateAlunoId || !templateProfessorId) {
      this.logFallback({
        templateId: templateAlunoId ?? 'EMAILJS_TEMPLATE_ALUNO_ID',
        fallbackTo: input.alunoEmail,
        fallbackSubject: 'Moedas recebidas',
        params: baseParams,
      })
      this.logFallback({
        templateId: templateProfessorId ?? 'EMAILJS_TEMPLATE_PROFESSOR_ID',
        fallbackTo: input.professorEmail,
        fallbackSubject: 'Confirmacao de envio de moedas',
        params: baseParams,
      })
      return
    }

    await this.send({
      templateId: templateAlunoId,
      fallbackTo: input.alunoEmail,
      fallbackSubject: 'Voce recebeu moedas estudantis',
      params: {
        ...baseParams,
        to_email: input.alunoEmail,
        to_name: input.alunoNome,
        reply_to: input.professorEmail,
      },
    })

    await this.waitForEmailJsRateLimit()

    await this.send({
      templateId: templateProfessorId,
      fallbackTo: input.professorEmail,
      fallbackSubject: 'Moedas enviadas com sucesso',
      params: {
        ...baseParams,
        to_email: input.professorEmail,
        to_name: input.professorNome,
        reply_to: input.professorEmail,
      },
    })
  }

  private async waitForEmailJsRateLimit(): Promise<void> {
    if (!this.isConfigured()) return
    await new Promise((resolve) => setTimeout(resolve, 1100))
  }

  private logFallback(input: EmailSendInput): void {
    console.log('[EMAIL PROTOTIPO]', {
      to: input.fallbackTo,
      subject: input.fallbackSubject,
      templateId: input.templateId,
      params: input.params,
    })
  }
}
