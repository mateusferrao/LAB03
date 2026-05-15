import { Link } from 'react-router-dom'

const COLORS = [
  { name: 'Gold 300', hex: '#e8c450', label: 'Texto ouro vivo' },
  { name: 'Gold 500', hex: '#c9a84c', label: 'Ouro principal' },
  { name: 'Gold 700', hex: '#8b6914', label: 'Ouro escuro' },
  { name: 'Crimson 400', hex: '#c8102e', label: 'Vermelho primário' },
  { name: 'Crimson 600', hex: '#8b0000', label: 'Carmesim escuro' },
  { name: 'BG Void', hex: '#08060a', label: 'Fundo principal' },
  { name: 'BG Card', hex: '#1c1810', label: 'Fundo de card' },
  { name: 'BG Elevated', hex: '#241e14', label: 'Fundo elevado' },
  { name: 'Text Primary', hex: '#e8d5a3', label: 'Texto primário' },
  { name: 'Text Secondary', hex: '#a89060', label: 'Texto secundário' },
  { name: 'Text Muted', hex: '#6b5c3a', label: 'Texto suave' },
  { name: 'Paper 100', hex: '#f5edd6', label: 'Papel envelhecido' },
]

const PATTERNS = [
  {
    name: 'Repository Pattern',
    tag: 'Arquitetura',
    desc: 'Abstrai o acesso ao banco de dados através de interfaces IRepository<T>. Cada entidade (Aluno, Professor, Empresa) possui seu repositório Prisma concreto, desacoplando a lógica de negócio da camada de persistência.',
    where: 'backend/src/infrastructure/repositories/',
  },
  {
    name: 'Service Layer Pattern',
    tag: 'Arquitetura',
    desc: 'Centraliza a lógica de negócio em serviços (StudentService, TransferService etc.). Controllers delegam para serviços, que por sua vez usam repositórios — mantendo responsabilidades bem definidas.',
    where: 'backend/src/application/**/*Service.ts',
  },
  {
    name: 'DTO + Validation Pattern',
    tag: 'Dados',
    desc: 'Zod valida e transforma os dados de entrada nas bordas da aplicação (routes/controllers). Os DTOs garantem que somente dados estruturados corretamente chegam às camadas internas.',
    where: 'backend/src/interfaces/dtos/',
  },
  {
    name: 'Table-per-Class Inheritance',
    tag: 'Banco de Dados',
    desc: 'A entidade base Usuario compartilha autenticação (email, senhaHash, papel). Cada perfil (Aluno, Professor, EmpresaParceira) tem sua própria tabela com FK para Usuario, evitando colunas nulas.',
    where: 'backend/prisma/schema.prisma',
  },
  {
    name: 'Context API + AuthProvider',
    tag: 'Frontend',
    desc: 'O estado de autenticação (user, token) é provido via React Context. O AuthProvider centraliza login, logout e refreshMe, persistindo o JWT no localStorage com expiração automática.',
    where: 'frontend/src/context/AuthContext.tsx',
  },
  {
    name: 'Feature-Based Architecture',
    tag: 'Frontend',
    desc: 'O frontend é organizado por funcionalidade (student/, company/, transfer/, perks/) em vez de por tipo de arquivo. Cada feature contém suas próprias páginas e lógica de API.',
    where: 'frontend/src/features/',
  },
  {
    name: 'JWT Bearer Authentication',
    tag: 'Segurança',
    desc: 'Tokens JWT são gerados no login e expiram em 7 dias. O middleware authMiddleware verifica o token em cada requisição protegida. O payload carrega id, email e papel do usuário.',
    where: 'backend/src/interfaces/middlewares/authMiddleware.ts',
  },
  {
    name: 'Observer via Coupon Events',
    tag: 'Comportamento',
    desc: 'Ao resgatar uma vantagem, o sistema notifica automaticamente aluno e empresa por email (console.log no protótipo). O pattern é explicitamente demonstrado na ResgateService.resgatar().',
    where: 'backend/src/application/resgate/ResgateService.ts',
  },
]

const TECH = [
  { name: 'Node.js + Express', role: 'API Backend', color: '#68a063' },
  { name: 'TypeScript', role: 'Tipagem estática', color: '#3178c6' },
  { name: 'Prisma ORM', role: 'Acesso ao banco', color: '#2d3748' },
  { name: 'SQLite', role: 'Banco de dados local', color: '#003b57' },
  { name: 'JWT (jsonwebtoken)', role: 'Autenticação', color: '#d63aff' },
  { name: 'bcryptjs', role: 'Hash de senhas', color: '#c9a84c' },
  { name: 'Zod', role: 'Validação de dados', color: '#ef4444' },
  { name: 'React 19', role: 'Interface de usuário', color: '#61dafb' },
  { name: 'React Router v7', role: 'Roteamento SPA', color: '#f44250' },
  { name: 'Recharts', role: 'Gráficos', color: '#8884d8' },
  { name: 'Framer Motion', role: 'Animações', color: '#ff0055' },
  { name: 'react-hot-toast', role: 'Notificações', color: '#f59e0b' },
]

export function DesignSystemPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Documentação Técnica</div>
          <h1 className="page-title">Design System</h1>
          <div className="page-subtitle">Guia de identidade visual, padrões de projeto e tecnologias</div>
        </div>
        <Link to="/slides" className="btn btn-crimson">▶ Ver Apresentação</Link>
      </div>

      {/* Inspiration */}
      <div className="card mb-6" style={{ borderColor: 'var(--crimson-600)', background: 'linear-gradient(135deg, var(--bg-card), rgba(139,0,0,0.08))' }}>
        <div className="card-header">
          <span className="card-title" style={{ color: 'var(--crimson-300)' }}>◆ Conceito Visual</span>
        </div>
        <div className="grid grid-3">
          <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🏛️</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--gold-400)', letterSpacing: '0.1em' }}>Casa da Moeda</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Estética de antigas casas de cunhagem — ornamentos gravados, tipografia imperial, moedas de ouro
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🎭</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--crimson-300)', letterSpacing: '0.1em' }}>La Casa de Papel</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Paleta crimson + dourado, tensão dramática, contraste profundo entre escuro e luminoso
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📜</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>Cédula Antiga</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Texturas de papel envelhecido, guilhoché, impressão de segurança e bordas ornamentadas
            </div>
          </div>
        </div>
      </div>

      {/* Color System */}
      <div className="ds-section">
        <div className="ds-section-title">◈ Paleta de Cores</div>
        <div className="ds-color-grid">
          {COLORS.map((c) => (
            <div key={c.name}>
              <div className="ds-color-box" style={{ background: c.hex }} />
              <div className="ds-color-label">{c.hex}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 2 }}>{c.name}</div>
            </div>
          ))}
        </div>
        <div className="alert alert-info mt-4" style={{ marginTop: 'var(--space-4)' }}>
          ◆ Toda a paleta é definida via CSS Custom Properties em <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>src/index.css</code> sob o seletor <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>:root</code>, permitindo theming futuro sem alterar componentes.
        </div>
      </div>

      {/* Typography */}
      <div className="ds-section">
        <div className="ds-section-title">◈ Tipografia</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="ds-font-sample">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
              Cinzel — Títulos e Navegação
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold-400)', letterSpacing: '0.08em' }}>
              Casa da Moeda Estudantil
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </div>
          </div>

          <div className="ds-font-sample">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
              Cinzel Decorative — Logo e Destaques
            </div>
            <div style={{ fontFamily: 'var(--font-decorative)', fontSize: '1.5rem', color: 'var(--gold-500)', letterSpacing: '0.1em', fontWeight: 900 }}>
              Casa da Moeda
            </div>
          </div>

          <div className="ds-font-sample">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
              EB Garamond — Corpo de Texto e Formulários
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
              O mérito estudantil é a única moeda que não se desvaloriza. Cada moeda distribuída representa reconhecimento genuíno pelo esforço e dedicação de cada aluno.
            </div>
          </div>

          <div className="ds-font-sample">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
              Courier Prime — Códigos, Números e Labels
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
              CDM-A1B2C3D4-K9XZ &nbsp;&nbsp; ⬡ 1.000 MOEDAS &nbsp;&nbsp; 2025-05-15
            </div>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="ds-section">
        <div className="ds-section-title">◈ Componentes</div>
        <div className="grid grid-2" style={{ gap: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Botões</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <button className="btn btn-primary">Primário</button>
              <button className="btn btn-crimson">Crimson</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-danger">Perigo</button>
              <button className="btn btn-primary btn-sm">Pequeno</button>
              <button className="btn btn-primary btn-lg">Grande</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Badges e Status</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <span className="badge badge-gold">Aluno</span>
              <span className="badge badge-blue">Professor</span>
              <span className="badge badge-green">Empresa</span>
              <span className="badge badge-crimson">Inativo</span>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div className="rank-badge rank-1">1</div>
              <div className="rank-badge rank-2">2</div>
              <div className="rank-badge rank-3">3</div>
              <div className="rank-badge rank-n">7</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rankings</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Moeda</span></div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <div className="coin-display">
                <div className="coin-icon">⬡</div>
                <span className="coin-amount" style={{ fontSize: '1.5rem' }}>1.000</span>
              </div>
              <div className="stat-card" style={{ flex: 1, minWidth: 140 }}>
                <div className="stat-label">Saldo Atual</div>
                <div className="stat-value">⬡ 250</div>
                <div className="stat-sub">moedas disponíveis</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Cupom</span></div>
            <div className="coupon-card">
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--gold-700)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Casa da Moeda Estudantil
              </div>
              <div className="coupon-code">CDM-A1B2-K9XZ</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Válido uma vez · Apresente ao parceiro
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Patterns */}
      <div className="ds-section">
        <div className="ds-section-title">◈ Padrões de Projeto Utilizados</div>
        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          {PATTERNS.map((p) => (
            <div key={p.name} className="ds-pattern-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <div className="ds-pattern-name">{p.name}</div>
                <span className="badge badge-gold">{p.tag}</span>
              </div>
              <div className="ds-pattern-desc">{p.desc}</div>
              <div className="ds-pattern-tag" style={{ marginTop: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                📁 {p.where}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="ds-section">
        <div className="ds-section-title">◈ Stack Tecnológico</div>
        <div className="grid grid-4" style={{ gap: 'var(--space-3)' }}>
          {TECH.map((t) => (
            <div key={t.name} style={{
              padding: 'var(--space-4)',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${t.color}33`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, marginBottom: 4 }} />
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>{t.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="ds-section">
        <div className="ds-section-title">◈ Arquitetura MVC (Layered)</div>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 700, margin: '0 auto' }}>
            {[
              { layer: 'Interfaces (HTTP)', desc: 'Controllers, Routes, DTOs, Middlewares', color: 'var(--crimson-600)' },
              { layer: 'Application (Services)', desc: 'Casos de uso: AuthService, TransferService, ResgateService...', color: 'var(--gold-600)' },
              { layer: 'Domain (Entities)', desc: 'Entidades, Interfaces, Enums — lógica pura de negócio', color: 'var(--gold-400)' },
              { layer: 'Infrastructure (Repositories)', desc: 'PrismaStudentRepository, PrismaCompanyRepository...', color: '#7ab8e8' },
              { layer: 'Banco de Dados (SQLite)', desc: 'Prisma ORM + SQLite local', color: '#90c890' },
            ].map((layer, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  minWidth: 8, height: 8, borderRadius: '50%',
                  background: layer.color,
                  boxShadow: `0 0 8px ${layer.color}`,
                  flexShrink: 0,
                }} />
                <div style={{
                  flex: 1,
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${layer.color}33`,
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: layer.color, letterSpacing: '0.06em' }}>{layer.layer}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{layer.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
