import { useEffect, useState } from 'react'
import api from '../../services/api'
import { getApiErrorMessage } from '../../services/getApiErrorMessage'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import type { Aluno } from '../../types'

export function TransferPage() {
  const { user, refreshMe } = useAuth()
  const [students, setStudents] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [alunoId, setAlunoId] = useState('')
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [lastSuccess, setLastSuccess] = useState<{ nome: string; valor: number } | null>(null)

  const saldoAtual = user?.saldoMoedas ?? 0

  useEffect(() => {
    refreshMe()
    api.get<Aluno[]>('/students')
      .then(({ data }) => setStudents(data))
      .catch(() => toast.error('Erro ao carregar alunos'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!alunoId) return toast.error('Selecione um aluno')
    const v = Number(valor)
    if (!v || v <= 0) return toast.error('Informe um valor válido')
    if (v > saldoAtual) return toast.error('Saldo insuficiente')
    if (motivo.trim().length < 5) return toast.error('Motivo deve ter ao menos 5 caracteres')

    setSubmitting(true)
    try {
      await api.post('/transfers', { alunoId, valor: v, motivo: motivo.trim() })
      const aluno = students.find((s) => s.id === alunoId)
      setLastSuccess({ nome: aluno?.nome ?? 'Aluno', valor: v })
      setAlunoId('')
      setValor('')
      setMotivo('')
      await refreshMe()
      toast.success(`⬡ ${v} moedas enviadas com sucesso!`)
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Erro ao enviar moedas'))
    } finally {
      setSubmitting(false)
    }
  }

  const valorNum = Number(valor)
  const saldoRestante = saldoAtual - (valorNum > 0 ? valorNum : 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Área do Professor</div>
          <h1 className="page-title">Enviar Moedas</h1>
          <div className="page-subtitle">Reconheça o mérito acadêmico dos seus alunos</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        {/* Saldo Card */}
        <div>
          <div className="stat-card" style={{ marginBottom: 'var(--space-5)', textAlign: 'center', padding: 'var(--space-6)' }}>
            <div className="stat-label">Seu Saldo Disponível</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--gold-400)', lineHeight: 1 }}>⬡</div>
              <div className="stat-value" style={{ fontSize: '3rem' }}>{saldoAtual}</div>
            </div>
            <div className="stat-sub">moedas para distribuir</div>

            {valorNum > 0 && valorNum <= saldoAtual && (
              <div style={{
                marginTop: 'var(--space-4)', padding: 'var(--space-3)',
                background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Após a transferência</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 4 }}>
                  <span style={{ color: 'var(--gold-400)', fontSize: '0.9rem' }}>⬡</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: saldoRestante >= 0 ? 'var(--text-primary)' : 'var(--crimson-400)' }}>
                    {saldoRestante}
                  </span>
                </div>
              </div>
            )}
          </div>

          {lastSuccess && (
            <div className="alert alert-success">
              <div style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Transferência realizada!</div>
              <div style={{ fontSize: '0.85rem' }}>
                ⬡ <strong>{lastSuccess.valor}</strong> moedas enviadas para <strong>{lastSuccess.nome}</strong>
              </div>
            </div>
          )}

          <div className="card" style={{ marginTop: 'var(--space-4)' }}>
            <div className="card-header"><span className="card-title">Como funciona</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: '①', text: 'Selecione um aluno que merece reconhecimento' },
                { icon: '②', text: 'Defina a quantidade de moedas a enviar' },
                { icon: '③', text: 'Descreva o motivo do reconhecimento' },
                { icon: '④', text: 'O aluno receberá as moedas para trocar por vantagens' },
              ].map((step) => (
                <div key={step.icon} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-heading)', fontSize: '1rem', flexShrink: 0 }}>{step.icon}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Nova Transferência</span>
          </div>

          {loading ? (
            <div className="flex items-center gap-4" style={{ padding: 'var(--space-8)', justifyContent: 'center' }}>
              <div className="spinner" style={{ width: 24, height: 24 }} />
              <span style={{ color: 'var(--text-muted)' }}>Carregando alunos...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Aluno *</label>
                <select
                  className="form-select"
                  value={alunoId}
                  onChange={(e) => setAlunoId(e.target.value)}
                  required
                >
                  <option value="">Selecione o aluno</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} — {s.curso}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Valor (moedas) *</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={saldoAtual}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder={`1 – ${saldoAtual}`}
                  required
                />
                {valorNum > saldoAtual && (
                  <div className="alert alert-error" style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)' }}>
                    Valor excede seu saldo disponível
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Motivo do reconhecimento *</label>
                <textarea
                  className="form-textarea"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: Excelente participação no projeto final, apresentação excepcional..."
                  rows={4}
                  minLength={5}
                  required
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {motivo.length}/500 caracteres — mínimo 5
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={submitting || saldoAtual === 0}
                style={{ marginTop: 'var(--space-4)' }}
              >
                {submitting ? 'Enviando...' : `⬡ Enviar ${valorNum > 0 ? valorNum : ''} Moedas`}
              </button>

              {saldoAtual === 0 && (
                <div className="alert alert-error" style={{ marginTop: 'var(--space-3)' }}>
                  Você não possui moedas disponíveis para distribuir
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
