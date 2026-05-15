import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import type { Aluno, Instituicao } from '../../types'

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

export function StudentFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [institutions, setInstitutions] = useState<Instituicao[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '', rg: '',
    logradouro: '', cidade: '', estado: '', cep: '', curso: '', instituicaoId: '',
  })

  useEffect(() => {
    const loadInstitutions = api.get<Instituicao[]>('/institutions').then((r) => setInstitutions(r.data))

    if (isEdit) {
      Promise.all([
        api.get<Aluno>(`/students/${id}`),
        loadInstitutions,
      ])
        .then(([{ data: s }]) => {
          setForm((f) => ({
            ...f,
            nome: s.nome, email: s.email, cpf: s.cpf, rg: s.rg,
            logradouro: s.logradouro, cidade: s.cidade, estado: s.estado,
            cep: s.cep, curso: s.curso, instituicaoId: s.instituicaoId,
          }))
        })
        .catch(() => toast.error('Erro ao carregar dados do aluno'))
        .finally(() => setLoading(false))
    } else {
      loadInstitutions.finally(() => setLoading(false))
    }
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return toast.error('Nome é obrigatório')
    if (!isEdit && !form.email.trim()) return toast.error('Email é obrigatório')
    if (!isEdit && form.senha.length < 4) return toast.error('Senha deve ter ao menos 4 caracteres')
    if (!form.curso.trim()) return toast.error('Curso é obrigatório')
    if (!form.instituicaoId) return toast.error('Selecione a instituição')

    setSubmitting(true)
    try {
      const payload = isEdit
        ? { nome: form.nome, rg: form.rg, logradouro: form.logradouro, cidade: form.cidade, estado: form.estado, cep: form.cep, curso: form.curso, instituicaoId: form.instituicaoId }
        : { ...form }

      if (isEdit) {
        await api.put(`/students/${id}`, payload)
        toast.success('Aluno atualizado com sucesso')
      } else {
        await api.post('/students', payload)
        toast.success('Aluno cadastrado com sucesso')
      }
      navigate('/students')
    } catch (err: any) {
      const msg = err.response?.data?.error ?? 'Erro ao salvar aluno'
      toast.error(msg)
    } finally {
      setSubmitting(false)
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
          <div className="page-super">Gestão Acadêmica › Alunos</div>
          <h1 className="page-title">{isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}</h1>
          <div className="page-subtitle">
            {isEdit ? 'Atualize os dados do aluno no sistema' : 'Registre um novo aluno no sistema de mérito'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card-header">
            <span className="card-title">Dados Pessoais</span>
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Nome completo *</label>
              <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: João da Silva" required />
            </div>
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">E-mail *</label>
                <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="joao@email.com" required />
              </div>
            )}
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">Senha * (mín. 4 caracteres)</label>
                <input className="form-input" name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="••••••" minLength={4} required />
              </div>
            )}
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">CPF *</label>
                <input className="form-input" name="cpf" value={form.cpf} onChange={handleChange} placeholder="00000000000" maxLength={11} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">RG</label>
              <input className="form-input" name="rg" value={form.rg} onChange={handleChange} placeholder="Ex: MG-12.345.678" />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card-header">
            <span className="card-title">Informações Acadêmicas</span>
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Curso *</label>
              <input className="form-input" name="curso" value={form.curso} onChange={handleChange} placeholder="Ex: Sistemas de Informação" required />
            </div>
            <div className="form-group">
              <label className="form-label">Instituição *</label>
              <select className="form-select" name="instituicaoId" value={form.instituicaoId} onChange={handleChange} required>
                <option value="">Selecione a instituição</option>
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>{i.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <span className="card-title">Endereço</span>
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Logradouro</label>
              <input className="form-input" name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Rua, Av., Alameda..." />
            </div>
            <div className="form-group">
              <label className="form-label">CEP</label>
              <input className="form-input" name="cep" value={form.cep} onChange={handleChange} placeholder="00000000" maxLength={8} />
            </div>
            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input className="form-input" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Ex: Belo Horizonte" />
            </div>
            <div className="form-group">
              <label className="form-label">Estado (UF)</label>
              <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
                <option value="">Selecione</option>
                {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/students')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Aluno'}
          </button>
        </div>
      </form>
    </div>
  )
}
