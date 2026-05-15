import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import type { Instituicao } from '../../types'

type Tab = 'aluno' | 'empresa'

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('aluno')
  const [loading, setLoading] = useState(false)
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])

  // Aluno fields
  const [alunoData, setAlunoData] = useState({
    nome: '', email: '', senha: '', cpf: '', rg: '',
    logradouro: '', cidade: '', estado: '', cep: '',
    curso: '', instituicaoId: '',
  })

  // Empresa fields
  const [empresaData, setEmpresaData] = useState({
    nome: '', email: '', senha: '', descricao: '',
  })

  useEffect(() => {
    api.get('/institutions').then((r) => setInstituicoes(r.data)).catch(() => {})
  }, [])

  function setAluno(field: string, value: string) {
    setAlunoData((p) => ({ ...p, [field]: value }))
  }

  function setEmpresa(field: string, value: string) {
    setEmpresaData((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'aluno') {
        await api.post('/auth/register/aluno', alunoData)
        await login(alunoData.email, alunoData.senha)
        toast.success('Cadastro realizado com sucesso!')
      } else {
        await api.post('/auth/register/empresa', empresaData)
        await login(empresaData.email, empresaData.senha)
        toast.success('Empresa cadastrada com sucesso!')
      }
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao cadastrar'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-hero-emblem">🏛️</div>
        <div className="login-hero-title">Casa da Moeda</div>
        <div className="login-hero-subtitle">Novo Cadastro</div>
        <div className="login-hero-strip">◆ &nbsp; Bem-vindo ao sistema &nbsp; ◆</div>

        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.7, maxWidth: 300 }}>
            Alunos acumulam moedas e trocam por vantagens exclusivas. Empresas parceiras ampliam seu alcance no ambiente acadêmico.
          </p>
        </div>

        <div style={{ marginTop: 'var(--space-5)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textAlign: 'center' }}>
          Professores são pré-cadastrados pelas instituições parceiras.
        </div>
      </div>

      <div className="login-right" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <div className="login-form-title">Criar Conta</div>

        <div className="register-tabs" style={{ width: '100%', marginBottom: 'var(--space-5)' }}>
          <button className={`register-tab ${tab === 'aluno' ? 'active' : ''}`} onClick={() => setTab('aluno')}>
            🎓 Aluno
          </button>
          <button className={`register-tab ${tab === 'empresa' ? 'active' : ''}`} onClick={() => setTab('empresa')}>
            🏪 Empresa
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} style={{ width: '100%' }}>
          {tab === 'aluno' ? (
            <>
              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input className="form-input" placeholder="Ana Clara Souza" value={alunoData.nome} onChange={(e) => setAluno('nome', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="ana@aluno.com" value={alunoData.email} onChange={(e) => setAluno('email', e.target.value)} required />
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">CPF (somente números)</label>
                  <input className="form-input" placeholder="12345678901" maxLength={11} value={alunoData.cpf} onChange={(e) => setAluno('cpf', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">RG</label>
                  <input className="form-input" placeholder="MG1234567" value={alunoData.rg} onChange={(e) => setAluno('rg', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Endereço (Logradouro)</label>
                <input className="form-input" placeholder="Rua das Flores, 100" value={alunoData.logradouro} onChange={(e) => setAluno('logradouro', e.target.value)} required />
              </div>

              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input className="form-input" placeholder="Belo Horizonte" value={alunoData.cidade} onChange={(e) => setAluno('cidade', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <input className="form-input" placeholder="MG" maxLength={2} value={alunoData.estado} onChange={(e) => setAluno('estado', e.target.value.toUpperCase())} required />
                </div>
                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input className="form-input" placeholder="30110000" maxLength={9} value={alunoData.cep} onChange={(e) => setAluno('cep', e.target.value)} required />
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Curso</label>
                  <input className="form-input" placeholder="Engenharia de Software" value={alunoData.curso} onChange={(e) => setAluno('curso', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Instituição</label>
                  <select className="form-select" value={alunoData.instituicaoId} onChange={(e) => setAluno('instituicaoId', e.target.value)} required>
                    <option value="">Selecione...</option>
                    {instituicoes.map((i) => (
                      <option key={i.id} value={i.id}>{i.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input className="form-input" type="password" placeholder="Mínimo 4 caracteres" value={alunoData.senha} onChange={(e) => setAluno('senha', e.target.value)} required minLength={4} />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Nome da Empresa</label>
                <input className="form-input" placeholder="Cantina Campus" value={empresaData.nome} onChange={(e) => setEmpresa('nome', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email Corporativo</label>
                <input className="form-input" type="email" placeholder="contato@empresa.com" value={empresaData.email} onChange={(e) => setEmpresa('email', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição da Empresa</label>
                <textarea className="form-textarea" placeholder="Descreva os produtos/serviços oferecidos e como beneficiam os estudantes..." value={empresaData.descricao} onChange={(e) => setEmpresa('descricao', e.target.value)} required minLength={10} />
              </div>

              <div className="form-group">
                <label className="form-label">Senha de Acesso</label>
                <input className="form-input" type="password" placeholder="Mínimo 4 caracteres" value={empresaData.senha} onChange={(e) => setEmpresa('senha', e.target.value)} required minLength={4} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? '⟳ Registrando...' : '⬡ Criar Conta'}
          </button>
        </form>

        <div className="login-link mt-6">
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--gold-400)' }}>Fazer login</Link>
        </div>
      </div>
    </div>
  )
}
