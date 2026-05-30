import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import type { Transferencia, Resgate, TransferStatement } from '../../types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ProfessorStatement() {
  const { user } = useAuth()
  const [transfers, setTransfers] = useState<Transferencia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    api.get<TransferStatement>('/transfers/me')
      .then(({ data }) => setTransfers(data.transferencias))
      .catch(() => toast.error('Erro ao carregar extrato'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const total = transfers.reduce((s, t) => s + t.valor, 0)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-super">Área do Professor</div>
          <h1 className="page-title">Meu Extrato</h1>
          <div className="page-subtitle">Histórico de moedas distribuídas aos alunos</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-6)', minWidth: 180 }}>
          <div className="stat-label">Total Distribuído</div>
          <div className="coin-display" style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}>
            <div className="coin-icon">⬡</div>
            <span className="coin-amount" style={{ fontSize: '1.8rem' }}>{total}</span>
          </div>
          <div className="stat-sub">{transfers.length} transferências</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Transferências Enviadas</span>
          <span className="badge badge-gold">{transfers.length} registros</span>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" /></div>
        ) : transfers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⬡</div>
            <div className="empty-state-title">Nenhuma transferência realizada</div>
            <div className="empty-state-desc">Comece distribuindo moedas aos seus alunos</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Aluno</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDate(t.realizadaEm)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {t.aluno?.nome ?? '—'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {t.aluno?.curso ?? ''}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                        <div className="coin-icon" style={{ fontSize: '0.7rem', color: 'var(--crimson-300)' }}>⬡</div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--crimson-300)', fontWeight: 600 }}>-{t.valor}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{t.motivo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

function AlunoStatement() {
  const { user } = useAuth()
  const [transfers, setTransfers] = useState<Transferencia[]>([])
  const [resgates, setResgates] = useState<Resgate[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'transfers' | 'resgates'>('transfers')

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      api.get<TransferStatement>('/transfers/me'),
      api.get<Resgate[]>('/resgates/aluno/me'),
    ])
      .then(([{ data: t }, { data: r }]) => {
        setTransfers(t.transferencias)
        setResgates(r)
      })
      .catch(() => toast.error('Erro ao carregar extrato'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const totalRecebido = transfers.reduce((s, t) => s + t.valor, 0)
  const totalGasto = resgates.reduce((s, r) => s + r.valor, 0)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-super">Área do Aluno</div>
          <h1 className="page-title">Meu Extrato</h1>
          <div className="page-subtitle">Histórico de moedas recebidas e vantagens resgatadas</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Saldo Atual</div>
          <div className="coin-display" style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}>
            <div className="coin-icon">⬡</div>
            <span className="coin-amount" style={{ fontSize: '1.6rem' }}>{user?.saldoMoedas ?? 0}</span>
          </div>
          <div className="stat-sub">disponível</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Recebido</div>
          <div className="stat-value" style={{ color: 'var(--gold-400)' }}>⬡ {totalRecebido}</div>
          <div className="stat-sub">{transfers.length} transações</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Gasto</div>
          <div className="stat-value" style={{ color: 'var(--crimson-300)' }}>⬡ {totalGasto}</div>
          <div className="stat-sub">{resgates.length} resgates</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-5)' }}>
          <button
            className={`btn btn-ghost ${tab === 'transfers' ? 'btn-primary' : ''}`}
            style={{
              borderRadius: 0, borderBottom: tab === 'transfers' ? '2px solid var(--gold-400)' : 'none',
              fontFamily: 'var(--font-heading)', fontSize: '0.82rem',
            }}
            onClick={() => setTab('transfers')}
          >
            Moedas Recebidas ({transfers.length})
          </button>
          <button
            className={`btn btn-ghost ${tab === 'resgates' ? 'btn-primary' : ''}`}
            style={{
              borderRadius: 0, borderBottom: tab === 'resgates' ? '2px solid var(--gold-400)' : 'none',
              fontFamily: 'var(--font-heading)', fontSize: '0.82rem',
            }}
            onClick={() => setTab('resgates')}
          >
            Vantagens Resgatadas ({resgates.length})
          </button>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" /></div>
        ) : tab === 'transfers' ? (
          transfers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⬡</div>
              <div className="empty-state-title">Nenhuma moeda recebida</div>
              <div className="empty-state-desc">Aguarde um professor reconhecer seu mérito</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Professor</th>
                    <th style={{ textAlign: 'right' }}>Valor</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {formatDate(t.realizadaEm)}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          Prof. {t.professor?.nome ?? '—'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                          <div className="coin-icon" style={{ fontSize: '0.7rem', color: '#90c890' }}>⬡</div>
                          <span style={{ fontFamily: 'var(--font-mono)', color: '#90c890', fontWeight: 600 }}>+{t.valor}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{t.motivo}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          resgates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⬡</div>
              <div className="empty-state-title">Nenhum resgate realizado</div>
              <div className="empty-state-desc">Explore o catálogo de vantagens e resgate seus benefícios</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Vantagem</th>
                    <th style={{ textAlign: 'right' }}>Valor</th>
                    <th>Código do Cupom</th>
                  </tr>
                </thead>
                <tbody>
                  {resgates.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {formatDate(r.resgatadoEm)}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {r.vantagem?.nome ?? '—'}
                        </div>
                        {r.vantagem?.empresa && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {r.vantagem.empresa.nome}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                          <div className="coin-icon" style={{ fontSize: '0.7rem', color: 'var(--crimson-300)' }}>⬡</div>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--crimson-300)', fontWeight: 600 }}>-{r.valor}</span>
                        </div>
                      </td>
                      <td>
                        <span className="coupon-code" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                          {r.codigoCupom}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  )
}

function EmpresaStatement() {
  const { user } = useAuth()
  const [resgates, setResgates] = useState<Resgate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    api.get<Resgate[]>('/resgates/empresa/me')
      .then(({ data }) => setResgates(data))
      .catch(() => toast.error('Erro ao carregar resgates'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const totalMoedas = resgates.reduce((s, r) => s + r.valor, 0)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-super">Área da Empresa</div>
          <h1 className="page-title">Histórico de Resgates</h1>
          <div className="page-subtitle">Cupons emitidos para os alunos</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-6)', minWidth: 180 }}>
          <div className="stat-label">Moedas Recebidas</div>
          <div className="coin-display" style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}>
            <div className="coin-icon">⬡</div>
            <span className="coin-amount" style={{ fontSize: '1.8rem' }}>{totalMoedas}</span>
          </div>
          <div className="stat-sub">{resgates.length} cupons emitidos</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Resgates Realizados</span>
          <span className="badge badge-crimson">{resgates.length} cupons</span>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" /></div>
        ) : resgates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⬡</div>
            <div className="empty-state-title">Nenhum resgate ainda</div>
            <div className="empty-state-desc">Quando alunos resgatarem suas vantagens, aparecerão aqui</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Aluno</th>
                  <th>Vantagem</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                  <th>Código do Cupom</th>
                </tr>
              </thead>
              <tbody>
                {resgates.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDate(r.resgatadoEm)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {r.aluno?.nome ?? '—'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {r.aluno?.curso ?? ''}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                        {r.vantagem?.nome ?? '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                        <div className="coin-icon" style={{ fontSize: '0.7rem', color: 'var(--gold-400)' }}>⬡</div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-400)', fontWeight: 600 }}>{r.valor}</span>
                      </div>
                    </td>
                    <td>
                      <span className="coupon-code" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                        {r.codigoCupom}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export function StatementPage() {
  const { user } = useAuth()

  if (user?.papel === 'PROFESSOR') return <ProfessorStatement />
  if (user?.papel === 'ALUNO') return <AlunoStatement />
  if (user?.papel === 'EMPRESA_PARCEIRA') return <EmpresaStatement />
  return (
    <div className="empty-state">
      <div className="empty-state-icon">◉</div>
      <div className="empty-state-title">Extrato não disponível</div>
    </div>
  )
}
