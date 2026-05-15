import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import type { Aluno } from '../../types'

export function StudentListPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const { data } = await api.get<Aluno[]>('/students')
      setStudents(data)
    } catch {
      toast.error('Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(student: Aluno) {
    if (!window.confirm(`Deseja excluir "${student.nome}"? Esta ação não pode ser desfeita.`)) return
    try {
      await api.delete(`/students/${student.id}`)
      setStudents((prev) => prev.filter((s) => s.id !== student.id))
      toast.success('Aluno excluído com sucesso')
    } catch {
      toast.error('Erro ao excluir aluno')
    }
  }

  const filtered = students.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.curso.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: 320 }}>
        <div className="spinner" />
        <span>Carregando alunos...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Gestão Acadêmica</div>
          <h1 className="page-title">Alunos Cadastrados</h1>
          <div className="page-subtitle">Gerencie os alunos registrados no sistema de mérito</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/students/new')}>
          + Novo Aluno
        </button>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
          <input
            className="form-input"
            style={{ maxWidth: 380 }}
            placeholder="Buscar por nome, email ou curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge badge-gold">{filtered.length} alunos</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">Nenhum aluno encontrado</div>
            <div className="empty-state-desc">
              {search ? 'Tente uma busca diferente' : 'Cadastre o primeiro aluno para começar'}
            </div>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigate('/students/new')}>
                + Cadastrar Aluno
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Curso</th>
                  <th>Instituição</th>
                  <th style={{ textAlign: 'right' }}>Saldo</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>{s.nome}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.email}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.curso}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{s.instituicao?.nome ?? '—'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="coin-display" style={{ justifyContent: 'flex-end' }}>
                        <div className="coin-icon" style={{ fontSize: '0.75rem' }}>⬡</div>
                        <span className="coin-amount" style={{ fontSize: '0.9rem' }}>{s.saldoMoedas}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-between gap-4" style={{ justifyContent: 'center' }}>
                        <Link to={`/students/${s.id}/edit`} className="btn btn-ghost btn-sm btn-icon" title="Editar">
                          ✎
                        </Link>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Excluir"
                          onClick={() => handleDelete(s)}
                        >
                          ✕
                        </button>
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
