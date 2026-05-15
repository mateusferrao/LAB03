import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import type { Vantagem, Resgate } from '../../types'

interface CouponModal {
  vantagem: Vantagem
  resgate: Resgate
}

function PerkCardSkeleton() {
  return (
    <div className="perk-card" style={{ opacity: 0.4 }}>
      <div style={{ height: 160, background: 'var(--bg-elevated)' }} />
      <div className="perk-card-body">
        <div style={{ height: 16, background: 'var(--bg-elevated)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, background: 'var(--bg-elevated)', borderRadius: 4, width: '70%' }} />
      </div>
    </div>
  )
}

function AlunoPerks() {
  const { user, refreshMe } = useAuth()
  const [vantagens, setVantagens] = useState<Vantagem[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [couponModal, setCouponModal] = useState<CouponModal | null>(null)

  useEffect(() => {
    refreshMe()
    api.get<Vantagem[]>('/vantagens')
      .then(({ data }) => setVantagens(data))
      .catch(() => toast.error('Erro ao carregar vantagens'))
      .finally(() => setLoading(false))
  }, [])

  const saldo = user?.saldoMoedas ?? 0

  async function handleRedeem(v: Vantagem) {
    if (v.custoMoedas > saldo) return toast.error('Saldo insuficiente para resgatar esta vantagem')
    if (!window.confirm(`Resgatar "${v.nome}" por ⬡ ${v.custoMoedas} moedas?`)) return

    setRedeeming(v.id)
    try {
      const { data: resgate } = await api.post<Resgate>('/resgates', { vantagemId: v.id })
      setCouponModal({ vantagem: v, resgate })
      await refreshMe()
      toast.success('Vantagem resgatada! Guarde seu cupom.')
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Erro ao resgatar vantagem')
    } finally {
      setRedeeming(null)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-super">Área do Aluno</div>
          <h1 className="page-title">Catálogo de Vantagens</h1>
          <div className="page-subtitle">Troque suas moedas por benefícios exclusivos</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-6)', minWidth: 180 }}>
          <div className="stat-label">Seu Saldo</div>
          <div className="coin-display" style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}>
            <div className="coin-icon">⬡</div>
            <span className="coin-amount" style={{ fontSize: '1.8rem' }}>{saldo}</span>
          </div>
          <div className="stat-sub">moedas disponíveis</div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-3">
          {[1,2,3,4,5,6].map((i) => <PerkCardSkeleton key={i} />)}
        </div>
      ) : vantagens.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⬡</div>
          <div className="empty-state-title">Nenhuma vantagem disponível</div>
          <div className="empty-state-desc">As empresas parceiras ainda não cadastraram vantagens</div>
        </div>
      ) : (
        <div className="grid grid-3">
          {vantagens.map((v) => {
            const canAfford = saldo >= v.custoMoedas
            return (
              <div key={v.id} className="perk-card" style={{ opacity: canAfford ? 1 : 0.6, position: 'relative' }}>
                {!canAfford && (
                  <div style={{
                    position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
                    background: 'var(--crimson-800)', color: '#fff',
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    padding: '2px 8px', borderRadius: 999,
                  }}>
                    Saldo insuficiente
                  </div>
                )}
                <div className="perk-card-img">
                  {v.urlFoto ? (
                    <img
                      src={v.urlFoto}
                      alt={v.nome}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        const el = e.target as HTMLImageElement
                        el.parentElement!.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;color:var(--gold-700)">⬡</div>'
                      }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--gold-700)' }}>⬡</div>
                  )}
                </div>
                <div className="perk-card-body">
                  <div className="perk-card-title">{v.nome}</div>
                  {v.empresa && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-2)' }}>
                      {v.empresa.nome}
                    </div>
                  )}
                  <div className="perk-card-desc">{v.descricao}</div>
                </div>
                <div className="perk-card-footer">
                  <div className="coin-display">
                    <div className="coin-icon" style={{ fontSize: '0.75rem' }}>⬡</div>
                    <span className="coin-amount" style={{ fontSize: '0.95rem' }}>{v.custoMoedas}</span>
                  </div>
                  <button
                    className={`btn btn-sm ${canAfford ? 'btn-crimson' : 'btn-ghost'}`}
                    disabled={!canAfford || redeeming === v.id}
                    onClick={() => handleRedeem(v)}
                  >
                    {redeeming === v.id ? '...' : 'Resgatar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {couponModal && (
        <div className="modal-overlay" onClick={() => setCouponModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: 420 }}>
            <button className="modal-close" onClick={() => setCouponModal(null)}>✕</button>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🎉</div>
            <div className="modal-title">Vantagem Resgatada!</div>
            <div style={{ color: 'var(--text-secondary)', margin: 'var(--space-3) 0', fontSize: '0.9rem' }}>
              {couponModal.vantagem.nome}
            </div>
            <div className="ornamental-divider" style={{ margin: 'var(--space-4) 0' }}>Cupom</div>
            <div className="coupon-card">
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>CÓDIGO DO CUPOM</div>
              <div className="coupon-code">{couponModal.resgate.codigoCupom}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>
                Apresente este código na empresa parceira
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <span>⬡ {couponModal.vantagem.custoMoedas} moedas debitadas</span>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-4)' }} onClick={() => setCouponModal(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function EmpresaPerks() {
  const { user } = useAuth()
  const [vantagens, setVantagens] = useState<Vantagem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ nome: '', descricao: '', urlFoto: '', custoMoedas: '' })

  useEffect(() => {
    if (!user?.id) return
    api.get<Vantagem[]>(`/vantagens/empresa/${user.id}`)
      .then(({ data }) => setVantagens(data))
      .catch(() => toast.error('Erro ao carregar vantagens'))
      .finally(() => setLoading(false))
  }, [user?.id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return toast.error('Nome é obrigatório')
    const custo = Number(form.custoMoedas)
    if (!custo || custo <= 0) return toast.error('Custo inválido')

    setAdding(true)
    try {
      const { data } = await api.post<Vantagem>(`/vantagens/empresa/${user?.id}`, {
        nome: form.nome, descricao: form.descricao, urlFoto: form.urlFoto, custoMoedas: custo,
      })
      setVantagens((prev) => [...prev, data])
      setForm({ nome: '', descricao: '', urlFoto: '', custoMoedas: '' })
      setShowForm(false)
      toast.success('Vantagem adicionada')
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Erro ao adicionar vantagem')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(v: Vantagem) {
    if (!window.confirm(`Excluir "${v.nome}"?`)) return
    try {
      await api.delete(`/vantagens/${v.id}`)
      setVantagens((prev) => prev.filter((x) => x.id !== v.id))
      toast.success('Vantagem removida')
    } catch {
      toast.error('Erro ao remover vantagem')
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-super">Área da Empresa</div>
          <h1 className="page-title">Minhas Vantagens</h1>
          <div className="page-subtitle">Gerencie os benefícios oferecidos aos alunos</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancelar' : '+ Nova Vantagem'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header"><span className="card-title">Adicionar Nova Vantagem</span></div>
          <form onSubmit={handleAdd}>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Café Grátis" required />
              </div>
              <div className="form-group">
                <label className="form-label">Custo em moedas *</label>
                <input className="form-input" name="custoMoedas" type="number" min="1" value={form.custoMoedas} onChange={handleChange} placeholder="Ex: 50" required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">URL da imagem</label>
                <input className="form-input" name="urlFoto" value={form.urlFoto} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Descrição</label>
                <textarea className="form-textarea" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva a vantagem..." rows={3} />
              </div>
            </div>
            <div className="flex gap-4" style={{ justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-crimson" disabled={adding}>
                {adding ? 'Adicionando...' : '+ Adicionar Vantagem'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-screen" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : vantagens.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⬡</div>
          <div className="empty-state-title">Nenhuma vantagem cadastrada</div>
          <div className="empty-state-desc">Adicione vantagens para atrair alunos</div>
        </div>
      ) : (
        <div className="grid grid-3">
          {vantagens.map((v) => (
            <div key={v.id} className="perk-card">
              <div className="perk-card-img">
                {v.urlFoto ? (
                  <img src={v.urlFoto} alt={v.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--gold-700)' }}>⬡</div>
                )}
              </div>
              <div className="perk-card-body">
                <div className="perk-card-title">{v.nome}</div>
                <div className="perk-card-desc">{v.descricao}</div>
              </div>
              <div className="perk-card-footer">
                <div className="coin-display">
                  <div className="coin-icon" style={{ fontSize: '0.75rem' }}>⬡</div>
                  <span className="coin-amount" style={{ fontSize: '0.95rem' }}>{v.custoMoedas}</span>
                </div>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(v)} title="Remover">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function ReadonlyPerks() {
  const [vantagens, setVantagens] = useState<Vantagem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Vantagem[]>('/vantagens')
      .then(({ data }) => setVantagens(data))
      .catch(() => toast.error('Erro ao carregar vantagens'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-super">Casa da Moeda</div>
          <h1 className="page-title">Catálogo de Vantagens</h1>
          <div className="page-subtitle">Vantagens disponíveis no ecossistema</div>
        </div>
      </div>
      {loading ? (
        <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" /></div>
      ) : vantagens.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⬡</div>
          <div className="empty-state-title">Nenhuma vantagem disponível</div>
        </div>
      ) : (
        <div className="grid grid-3">
          {vantagens.map((v) => (
            <div key={v.id} className="perk-card">
              <div className="perk-card-img">
                {v.urlFoto ? (
                  <img src={v.urlFoto} alt={v.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--gold-700)' }}>⬡</div>
                )}
              </div>
              <div className="perk-card-body">
                <div className="perk-card-title">{v.nome}</div>
                {v.empresa && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{v.empresa.nome}</div>}
                <div className="perk-card-desc">{v.descricao}</div>
              </div>
              <div className="perk-card-footer">
                <div className="coin-display">
                  <div className="coin-icon" style={{ fontSize: '0.75rem' }}>⬡</div>
                  <span className="coin-amount" style={{ fontSize: '0.95rem' }}>{v.custoMoedas}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function PerksPage() {
  const { user } = useAuth()

  if (user?.papel === 'ALUNO') return <AlunoPerks />
  if (user?.papel === 'EMPRESA_PARCEIRA') return <EmpresaPerks />
  return <ReadonlyPerks />
}
