import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import type { EmpresaParceira } from '../../types'

export function CompanyListPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<EmpresaParceira[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const { data } = await api.get<EmpresaParceira[]>('/companies')
      setCompanies(data)
    } catch {
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(company: EmpresaParceira) {
    if (!window.confirm(`Deseja excluir "${company.nome}"? Todas as vantagens serão removidas.`)) return
    try {
      await api.delete(`/companies/${company.id}`)
      setCompanies((prev) => prev.filter((c) => c.id !== company.id))
      toast.success('Empresa excluída com sucesso')
    } catch {
      toast.error('Erro ao excluir empresa')
    }
  }

  const filtered = companies.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.descricao.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: 320 }}>
        <div className="spinner" />
        <span>Carregando empresas...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Gestão do Sistema</div>
          <h1 className="page-title">Empresas Parceiras</h1>
          <div className="page-subtitle">Gerencie as empresas que oferecem vantagens aos alunos</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/companies/new')}>
          + Nova Empresa
        </button>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
          <input
            className="form-input"
            style={{ maxWidth: 380 }}
            placeholder="Buscar por nome, email ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge badge-green">{filtered.length} empresas</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">Nenhuma empresa encontrada</div>
            <div className="empty-state-desc">
              {search ? 'Tente uma busca diferente' : 'Cadastre a primeira empresa parceira'}
            </div>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigate('/companies/new')}>
                + Cadastrar Empresa
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
                  <th>Descrição</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-heading)', color: 'var(--gold-400)', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                        }}>
                          {c.nome.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {c.nome}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.email}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>
                        {c.descricao.length > 60 ? c.descricao.slice(0, 60) + '…' : c.descricao}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-4" style={{ justifyContent: 'center' }}>
                        <Link to={`/companies/${c.id}/edit`} className="btn btn-ghost btn-sm btn-icon" title="Editar">
                          ✎
                        </Link>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Excluir"
                          onClick={() => handleDelete(c)}
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
