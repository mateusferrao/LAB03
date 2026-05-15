import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { StudentListPage } from './features/student/StudentListPage'
import { StudentFormPage } from './features/student/StudentFormPage'
import { CompanyListPage } from './features/company/CompanyListPage'
import { CompanyFormPage } from './features/company/CompanyFormPage'
import { ProfessorListPage } from './features/professor/ProfessorListPage'
import { TransferPage } from './features/transfer/TransferPage'
import { PerksPage } from './features/perks/PerksPage'
import { StatementPage } from './features/statement/StatementPage'
import { DesignSystemPage } from './features/design-system/DesignSystemPage'
import { SlidesPage } from './features/slides/SlidesPage'
import { LeaderboardPage } from './features/leaderboard/LeaderboardPage'
import type { Papel } from './types'

// ── Nav config ───────────────────────────────────────────────────
const NAV_COMMON = [
  { to: '/',            icon: '◈', label: 'Painel Principal' },
  { to: '/leaderboard', icon: '⬡', label: 'Ranking' },
]

const NAV_ALUNO = [
  { to: '/perks',     icon: '⬡', label: 'Vantagens' },
  { to: '/statement', icon: '◉', label: 'Extrato' },
]

const NAV_PROFESSOR = [
  { to: '/students',  icon: '◈', label: 'Alunos' },
  { to: '/transfer',  icon: '⬡', label: 'Enviar Moedas' },
  { to: '/statement', icon: '◉', label: 'Meu Extrato' },
]

const NAV_EMPRESA = [
  { to: '/perks',     icon: '⬡', label: 'Minhas Vantagens' },
  { to: '/statement', icon: '◉', label: 'Resgates' },
]

const NAV_ADMIN = [
  { to: '/students',  icon: '◈', label: 'Alunos' },
  { to: '/companies', icon: '◈', label: 'Empresas' },
  { to: '/professors',icon: '◈', label: 'Professores' },
]

const CAN_VIEW_COMPANIES_AND_PROFESSORS: Papel[] = ['PROFESSOR', 'EMPRESA_PARCEIRA']

const NAV_SYSTEM = [
  { to: '/design-system', icon: '◇', label: 'Design System' },
  { to: '/slides',        icon: '◇', label: 'Apresentação' },
]

// ── Layout ────────────────────────────────────────────────────────
function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const roleNav =
    user?.papel === 'ALUNO' ? NAV_ALUNO :
    user?.papel === 'PROFESSOR' ? NAV_PROFESSOR :
    user?.papel === 'EMPRESA_PARCEIRA' ? NAV_EMPRESA : []

  const roleLabel =
    user?.papel === 'ALUNO' ? 'Aluno' :
    user?.papel === 'PROFESSOR' ? 'Professor' :
    user?.papel === 'EMPRESA_PARCEIRA' ? 'Empresa Parceira' : ''

  const adminNav = NAV_ADMIN.filter((item) =>
    user?.papel !== 'ALUNO' || (item.to !== '/companies' && item.to !== '/professors'),
  )

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-emblem">🏛️</div>
          <div className="sidebar-logo-title">Casa da Moeda</div>
          <div className="sidebar-logo-sub">Mérito Estudantil</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Sistema</div>
          {NAV_COMMON.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {roleNav.length > 0 && (
            <>
              <div className="nav-section-label" style={{ marginTop: 'var(--space-3)' }}>
                {user?.papel === 'ALUNO' ? 'Minha Conta' : user?.papel === 'PROFESSOR' ? 'Professor' : 'Empresa'}
              </div>
              {roleNav.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </>
          )}

          <div className="nav-section-label" style={{ marginTop: 'var(--space-3)' }}>Administração</div>
          {adminNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="nav-section-label" style={{ marginTop: 'var(--space-3)' }}>Documentação</div>
          {NAV_SYSTEM.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              {user?.nome ?? user?.email}
            </div>
            <span className={`user-role-badge role-${user?.papel}`}>{roleLabel}</span>
          </div>
          {user?.papel === 'ALUNO' && user.saldoMoedas !== undefined && (
            <div className="coin-display" style={{ marginBottom: 'var(--space-3)' }}>
              <div className="coin-icon">⬡</div>
              <span className="coin-amount" style={{ fontSize: '1rem' }}>{user.saldoMoedas} moedas</span>
            </div>
          )}
          <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
            ↩ Sair
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        <div className="top-bar">
          <div className="top-bar-breadcrumb">
            <span>CASA DA MOEDA</span>
            <span style={{ color: 'var(--border-gold)' }}>›</span>
            <span>Sistema de Mérito Estudantil</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {user?.papel === 'ALUNO' && (
              <div className="coin-display">
                <div className="coin-icon">⬡</div>
                <span className="coin-amount" style={{ fontSize: '0.95rem' }}>{user.saldoMoedas ?? 0}</span>
              </div>
            )}
            {user?.papel === 'PROFESSOR' && (
              <div className="coin-display">
                <div className="coin-icon">⬡</div>
                <span className="coin-amount" style={{ fontSize: '0.95rem' }}>{user.saldoMoedas ?? 0} disponíveis</span>
              </div>
            )}
          </div>
        </div>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/new" element={<StudentFormPage />} />
            <Route path="/students/:id/edit" element={<StudentFormPage />} />
            <Route path="/companies" element={<RequireRole roles={CAN_VIEW_COMPANIES_AND_PROFESSORS}><CompanyListPage /></RequireRole>} />
            <Route path="/companies/new" element={<RequireRole roles={CAN_VIEW_COMPANIES_AND_PROFESSORS}><CompanyFormPage /></RequireRole>} />
            <Route path="/companies/:id/edit" element={<RequireRole roles={CAN_VIEW_COMPANIES_AND_PROFESSORS}><CompanyFormPage /></RequireRole>} />
            <Route path="/professors" element={<RequireRole roles={CAN_VIEW_COMPANIES_AND_PROFESSORS}><ProfessorListPage /></RequireRole>} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/perks" element={<PerksPage />} />
            <Route path="/statement" element={<StatementPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/slides" element={<SlidesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

// ── Protected Route ───────────────────────────────────────────────
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
      <span>Verificando credenciais...</span>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireRole({ roles, children }: { roles: Papel[]; children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.papel)) return <Navigate to="/" replace />
  return <>{children}</>
}

// ── Root ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-gold)',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
