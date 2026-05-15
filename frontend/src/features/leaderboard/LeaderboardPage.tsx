import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import type { LeaderboardEntry } from '../../types'

function RankBadge({ pos }: { pos: number }) {
  const cls = pos === 1 ? 'rank-1' : pos === 2 ? 'rank-2' : pos === 3 ? 'rank-3' : 'rank-n'
  const label = pos === 1 ? '①' : pos === 2 ? '②' : pos === 3 ? '③' : `${pos}`
  return <div className={`rank-badge ${cls}`}>{label}</div>
}

const PODIUM_COLORS = [
  { bg: 'linear-gradient(135deg, #c9a84c22, #c9a84c44)', border: 'var(--gold-400)', text: 'var(--gold-300)', icon: '🥇' },
  { bg: 'linear-gradient(135deg, #aaaaaa18, #cccccc2a)', border: '#aaa', text: '#ccc', icon: '🥈' },
  { bg: 'linear-gradient(135deg, #cd7f3222, #cd7f3244)', border: '#cd7f32', text: '#e8a264', icon: '🥉' },
]

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<LeaderboardEntry[]>('/leaderboard')
      .then(({ data }) => setEntries(data.slice(0, 10)))
      .catch(() => toast.error('Erro ao carregar ranking'))
      .finally(() => setLoading(false))
  }, [])

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: 320 }}>
        <div className="spinner" />
        <span>Carregando ranking...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <div className="page-super">Casa da Moeda — {new Date().getFullYear()}</div>
        <h1 className="page-title">Ranking de Méritos</h1>
        <div className="page-subtitle">Os alunos com maior reconhecimento acadêmico</div>
      </div>

      <div className="ornamental-divider" style={{ marginBottom: 'var(--space-8)' }}>Pódio</div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⬡</div>
          <div className="empty-state-title">Nenhum aluno no ranking</div>
          <div className="empty-state-desc">O ranking será preenchido conforme os professores distribuírem moedas</div>
        </div>
      ) : (
        <>
          {/* Podium top 3 */}
          {top3.length > 0 && (
            <div style={{
              display: 'flex', gap: 'var(--space-4)', justifyContent: 'center',
              alignItems: 'flex-end', marginBottom: 'var(--space-10)',
              flexWrap: 'wrap',
            }}>
              {/* Render order: 2nd, 1st, 3rd for visual podium shape */}
              {[
                top3[1] ? { ...top3[1], visualOrder: 0 } : null,
                top3[0] ? { ...top3[0], visualOrder: 1 } : null,
                top3[2] ? { ...top3[2], visualOrder: 2 } : null,
              ].filter(Boolean).map((entry) => {
                if (!entry) return null
                const idx = entry.posicao - 1
                const color = PODIUM_COLORS[idx] ?? PODIUM_COLORS[2]
                return (
                  <div key={entry.posicao} style={{
                    flex: '0 0 220px', maxWidth: 240,
                    background: color.bg,
                    border: `2px solid ${color.border}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    textAlign: 'center',
                    minHeight: 270,
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    boxShadow: `0 0 32px ${color.border}22`,
                    order: entry.visualOrder,
                  }}>
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>{color.icon}</div>
                      <RankBadge pos={entry.posicao} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 110 }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: color.text, fontWeight: 700, lineHeight: 1.35 }}>
                        {entry.nome}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                        {entry.curso}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 'var(--space-2)' }}>
                        {entry.instituicao}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ color: color.text, fontSize: '1rem' }}>⬡</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: color.text }}>{entry.saldoMoedas}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Remaining places 4–10 */}
          {rest.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Classificação Geral</span>
                <span className="badge badge-gold">Top 10</span>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Pos.</th>
                      <th>Aluno</th>
                      <th>Curso</th>
                      <th>Instituição</th>
                      <th style={{ textAlign: 'right' }}>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry) => (
                      <tr key={entry.posicao}>
                        <td>
                          <RankBadge pos={entry.posicao} />
                        </td>
                        <td>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            {entry.nome}
                          </div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{entry.curso}</span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{entry.instituicao}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                            <div className="coin-icon" style={{ fontSize: '0.75rem' }}>⬡</div>
                            <span className="coin-amount" style={{ fontSize: '0.9rem' }}>{entry.saldoMoedas}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: 'var(--space-10)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
        Atualizado em tempo real — moedas representam reconhecimento acadêmico
      </div>
    </div>
  )
}
