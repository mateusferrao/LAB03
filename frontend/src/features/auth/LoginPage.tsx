import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, senha)
      toast.success('Acesso autorizado')
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Falha ao autenticar'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-hero-emblem">🏛️</div>

        <div className="login-hero-title">Casa da Moeda</div>
        <div className="login-hero-subtitle">
          Sistema de Mérito Estudantil — Release I
        </div>

        <div className="login-hero-strip">
          ◆ &nbsp; Conhecimento tem valor &nbsp; ◆
        </div>

        <div style={{ marginTop: 'var(--space-10)', maxWidth: 320, textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            Professores reconhecem, alunos prosperam. Uma moeda virtual que circula pelo mérito acadêmico e se converte em vantagens reais junto às empresas parceiras.
          </p>
        </div>

        <div style={{
          marginTop: 'var(--space-8)',
          display: 'flex',
          gap: 'var(--space-5)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}>
          <span>⬡ ALUNO</span>
          <span>⬡ PROFESSOR</span>
          <span>⬡ PARCEIRO</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-form-title">Acesso ao Sistema</div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Endereço de Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="senha">Senha de Acesso</label>
            <input
              id="senha"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 'var(--space-2)' }}
          >
            {loading ? '⟳ Verificando...' : '⬡ Entrar no Sistema'}
          </button>
        </form>

        <div className="ornamental-divider mt-6">ou</div>

        <div className="login-link">
          Novo usuário?{' '}
          <Link to="/register" style={{ color: 'var(--gold-400)' }}>
            Registre-se aqui
          </Link>
        </div>

        <div style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-4)',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          width: '100%',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            Credenciais de demonstração
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            <span>📚 falbo@prof.com / 123456</span>
            <span>🎓 ana@aluno.com / 123456</span>
            <span>🏪 cantina@parceiro.com / 123456</span>
          </div>
        </div>
      </div>
    </div>
  )
}
