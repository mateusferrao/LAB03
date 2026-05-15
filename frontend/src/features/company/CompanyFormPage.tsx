import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import type { EmpresaParceira, Vantagem } from '../../types'

export function CompanyFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', senha: '', descricao: '' })

  const [vantagens, setVantagens] = useState<Vantagem[]>([])
  const [vantagemForm, setVantagemForm] = useState({ nome: '', descricao: '', urlFoto: '', custoMoedas: '' })
  const [addingVantagem, setAddingVantagem] = useState(false)
  const [showVantagemForm, setShowVantagemForm] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    Promise.all([
      api.get<EmpresaParceira>(`/companies/${id}`),
      api.get<Vantagem[]>(`/vantagens/empresa/${id}`),
    ])
      .then(([{ data: c }, { data: v }]) => {
        setForm({ nome: c.nome, email: c.email, senha: '', descricao: c.descricao })
        setVantagens(v)
      })
      .catch(() => toast.error('Erro ao carregar empresa'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleVantagemChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setVantagemForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return toast.error('Nome é obrigatório')
    if (!form.descricao.trim()) return toast.error('Descrição é obrigatória')

    setSubmitting(true)
    try {
      if (isEdit) {
        await api.put(`/companies/${id}`, { nome: form.nome, descricao: form.descricao })
        toast.success('Empresa atualizada com sucesso')
      } else {
        if (!form.email.trim()) return toast.error('Email é obrigatório')
        if (form.senha.length < 4) return toast.error('Senha deve ter ao menos 4 caracteres')
        await api.post('/companies', form)
        toast.success('Empresa cadastrada com sucesso')
      }
      navigate('/companies')
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Erro ao salvar empresa')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddVantagem(e: React.FormEvent) {
    e.preventDefault()
    if (!vantagemForm.nome.trim()) return toast.error('Nome da vantagem é obrigatório')
    if (!vantagemForm.custoMoedas || Number(vantagemForm.custoMoedas) <= 0) return toast.error('Custo inválido')

    setAddingVantagem(true)
    try {
      const { data } = await api.post<Vantagem>(`/vantagens/empresa/${id}`, {
        nome: vantagemForm.nome,
        descricao: vantagemForm.descricao,
        urlFoto: vantagemForm.urlFoto,
        custoMoedas: Number(vantagemForm.custoMoedas),
      })
      setVantagens((prev) => [...prev, data])
      setVantagemForm({ nome: '', descricao: '', urlFoto: '', custoMoedas: '' })
      setShowVantagemForm(false)
      toast.success('Vantagem adicionada')
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Erro ao adicionar vantagem')
    } finally {
      setAddingVantagem(false)
    }
  }

  async function handleDeleteVantagem(v: Vantagem) {
    if (!window.confirm(`Excluir a vantagem "${v.nome}"?`)) return
    try {
      await api.delete(`/vantagens/${v.id}`)
      setVantagens((prev) => prev.filter((x) => x.id !== v.id))
      toast.success('Vantagem removida')
    } catch {
      toast.error('Erro ao remover vantagem')
    }
  }

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: 320 }}>
        <div className="spinner" />
        <span>Carregando...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Gestão do Sistema › Empresas</div>
          <h1 className="page-title">{isEdit ? 'Editar Empresa' : 'Cadastrar Empresa Parceira'}</h1>
          <div className="page-subtitle">
            {isEdit ? 'Atualize os dados da empresa parceira' : 'Registre uma nova empresa no ecossistema de mérito'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card-header">
            <span className="card-title">Dados da Empresa</span>
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Nome da empresa *</label>
              <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Café do Campus" required />
            </div>
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">E-mail de contato *</label>
                <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="contato@empresa.com" required />
              </div>
            )}
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">Senha * (mín. 4 caracteres)</label>
                <input className="form-input" name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="••••••" minLength={4} required />
              </div>
            )}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descrição *</label>
              <textarea
                className="form-textarea"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva os produtos/serviços e benefícios oferecidos aos alunos..."
                rows={4}
                maxLength={500}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4" style={{ justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/companies')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Empresa'}
          </button>
        </div>
      </form>

      {isEdit && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Vantagens Oferecidas</span>
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => setShowVantagemForm((v) => !v)}
            >
              {showVantagemForm ? '✕ Cancelar' : '+ Nova Vantagem'}
            </button>
          </div>

          {showVantagemForm && (
            <form onSubmit={handleAddVantagem} style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)', marginBottom: 'var(--space-5)',
              border: '1px solid var(--border-gold)',
            }}>
              <div className="form-grid form-grid-2" style={{ marginBottom: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Nome da vantagem *</label>
                  <input className="form-input" name="nome" value={vantagemForm.nome} onChange={handleVantagemChange} placeholder="Ex: Café Grátis" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Custo em moedas *</label>
                  <input className="form-input" name="custoMoedas" type="number" min="1" value={vantagemForm.custoMoedas} onChange={handleVantagemChange} placeholder="Ex: 50" required />
                </div>
                <div className="form-group">
                  <label className="form-label">URL da imagem</label>
                  <input className="form-input" name="urlFoto" value={vantagemForm.urlFoto} onChange={handleVantagemChange} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <input className="form-input" name="descricao" value={vantagemForm.descricao} onChange={handleVantagemChange} placeholder="Breve descrição da vantagem" />
                </div>
              </div>
              <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-crimson btn-sm" disabled={addingVantagem}>
                  {addingVantagem ? 'Adicionando...' : '+ Adicionar Vantagem'}
                </button>
              </div>
            </form>
          )}

          {vantagens.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-icon">⬡</div>
              <div className="empty-state-title">Nenhuma vantagem cadastrada</div>
              <div className="empty-state-desc">Adicione vantagens para que os alunos possam resgatar</div>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
              {vantagens.map((v) => (
                <div key={v.id} style={{
                  display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
                  padding: 'var(--space-3)', background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                }}>
                  {v.urlFoto && (
                    <img src={v.urlFoto} alt={v.nome} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{v.nome}</div>
                    {v.descricao && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{v.descricao}</div>}
                    <div className="coin-display" style={{ marginTop: 'var(--space-2)' }}>
                      <div className="coin-icon" style={{ fontSize: '0.7rem' }}>⬡</div>
                      <span className="coin-amount" style={{ fontSize: '0.82rem' }}>{v.custoMoedas} moedas</span>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDeleteVantagem(v)} title="Remover">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
