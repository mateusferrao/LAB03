import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import type { Professor } from '../../types'

export function ProfessorListPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get<Professor[]>('/professors')
      .then(({ data }) => setProfessors(data))
      .catch(() => toast.error('Erro ao carregar professores'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = professors.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    (p.departamento ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.instituicao?.nome ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: 320 }}>
        <div className="spinner" />
        <span>Carregando professores...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Gestão Acadêmica</div>
          <h1 className="page-title">Corpo Docente</h1>
          <div className="page-subtitle">Professores cadastrados no sistema — gerenciados pelas instituições</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total de Professores</div>
          <div className="stat-value">{professors.length}</div>
          <div className="stat-sub">cadastrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Instituições</div>
          <div className="stat-value">{new Set(professors.map((p) => p.instituicaoId)).size}</div>
          <div className="stat-sub">representadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Moedas em Posse</div>
          <div className="stat-value" style={{ color: 'var(--gold-400)' }}>
            ⬡ {professors.reduce((s, p) => s + p.saldoMoedas, 0)}
          </div>
          <div className="stat-sub">para distribuir</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
          <input
            className="form-input"
            style={{ maxWidth: 380 }}
            placeholder="Buscar por nome, departamento ou instituição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge badge-gold">{filtered.length} professores</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">Nenhum professor encontrado</div>
            <div className="empty-state-desc">
              {search ? 'Tente uma busca diferente' : 'Os professores são cadastrados pelas instituições'}
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Departamento</th>
                  <th>Instituição</th>
                  <th style={{ textAlign: 'right' }}>Saldo Disponível</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-heading)', color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                        }}>
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            Prof. {p.nome}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {p.departamento ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                        {p.instituicao?.nome ?? '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                        <div className="coin-icon" style={{ fontSize: '0.75rem' }}>⬡</div>
                        <span className="coin-amount" style={{ fontSize: '0.9rem' }}>{p.saldoMoedas}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
