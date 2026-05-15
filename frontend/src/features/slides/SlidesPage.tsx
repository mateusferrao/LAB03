import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface Slide {
  id: number
  tag: string
  title: string
  subtitle?: string
  content: React.ReactNode
  accent?: string
}

const slides: Slide[] = [
  {
    id: 0,
    tag: 'ABERTURA',
    title: 'Casa da Moeda',
    subtitle: 'Sistema de Mérito Estudantil — Release 1',
    accent: 'var(--gold-400)',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)', marginTop: 'var(--space-6)' }}>
        <div style={{
          width: 140, height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, var(--gold-300), var(--gold-700))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '4rem',
          boxShadow: '0 0 0 6px var(--bg-void), 0 0 0 8px var(--border-gold), 0 0 60px rgba(201,168,76,0.4)',
        }}>🏛️</div>
        <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Laboratório de Dev de Software', 'Sprint 03 — Final', 'PUC Minas · 2025'].map((t) => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 1,
    tag: 'OBJETIVO',
    title: 'O Problema que Resolvemos',
    accent: 'var(--crimson-300)',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)', textAlign: 'left' }}>
        {[
          { icon: '❌', title: 'Sem reconhecimento', desc: 'Alunos com bom desempenho não recebem incentivos concretos além de notas.' },
          { icon: '❌', title: 'Sem visibilidade', desc: 'Professores não têm uma forma estruturada de reconhecer comportamento e participação.' },
          { icon: '✅', title: 'Nossa solução', desc: 'Moeda virtual distribuída por professores, resgatável em empresas parceiras.' },
          { icon: '✅', title: 'Ecossistema completo', desc: 'Alunos, professores e empresas num ciclo de valor acadêmico circular.' },
        ].map((item) => (
          <div key={item.title} style={{ padding: 'var(--space-5)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--gold-400)', letterSpacing: '0.06em', marginBottom: 'var(--space-2)' }}>{item.title}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 2,
    tag: 'FLUXO',
    title: 'Diagrama de Fluxo do Sistema',
    accent: 'var(--gold-400)',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {[
            { icon: '🏛️', label: 'Instituição', sub: 'Pré-cadastra professores', color: 'var(--text-muted)' },
            { arrow: '→' },
            { icon: '👨‍🏫', label: 'Professor', sub: '1.000 moedas/semestre', color: '#7ab8e8' },
            { arrow: '→' },
            { icon: '🎓', label: 'Aluno', sub: 'Recebe + acumula moedas', color: 'var(--gold-400)' },
            { arrow: '→' },
            { icon: '🏪', label: 'Empresa', sub: 'Oferece vantagens', color: '#90c890' },
          ].map((item, i) =>
            'arrow' in item ? (
              <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--border-gold)' }}>{item.arrow}</div>
            ) : (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-5)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: `1px solid ${item.color}44`, minWidth: 120 }}>
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: item.color, letterSpacing: '0.06em' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.05em' }}>{item.sub}</div>
              </div>
            )
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            '📧 Email notifica aluno ao receber moedas',
            '📧 Cupom enviado ao aluno e empresa no resgate',
            '⬡ Saldo acumulável entre semestres (professor)',
          ].map((t) => (
            <div key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', padding: 'var(--space-2) var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    tag: 'CASOS DE USO',
    title: 'Histórias do Usuário Implementadas',
    accent: '#7ab8e8',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-5)', textAlign: 'left' }}>
        {[
          { us: 'US01', who: 'Aluno', action: 'Cadastrar-se no sistema com CPF, RG, endereço e curso' },
          { us: 'US02', who: 'Professor', action: 'Enviar moedas a alunos com motivo obrigatório' },
          { us: 'US03', who: 'Aluno', action: 'Receber notificação por email ao ganhar moedas' },
          { us: 'US04', who: 'Aluno', action: 'Visualizar extrato com transações e resgates' },
          { us: 'US05', who: 'Professor', action: 'Consultar extrato de distribuições realizadas' },
          { us: 'US06', who: 'Aluno', action: 'Resgatar vantagem com cupom gerado automaticamente' },
          { us: 'US07', who: 'Empresa', action: 'Cadastrar vantagens com foto, descrição e custo' },
          { us: 'US08', who: 'Empresa', action: 'Receber email com cupom ao confirmar resgate' },
          { us: 'US09', who: 'Todos', action: 'Autenticar-se com email e senha via JWT' },
        ].map((us) => (
          <div key={us.us} style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold-500)', letterSpacing: '0.1em' }}>{us.us}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{us.who}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{us.action}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 4,
    tag: 'ARQUITETURA',
    title: 'Arquitetura MVC em Camadas',
    accent: 'var(--gold-400)',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-5)', textAlign: 'left', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--gold-500)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Backend (Node.js + Express)</div>
          {[
            { layer: 'Interfaces', icon: '🌐', desc: 'Routes → Controllers → DTOs (Zod)', color: 'var(--crimson-400)' },
            { layer: 'Application', icon: '⚙️', desc: 'Services: lógica de negócio e casos de uso', color: 'var(--gold-500)' },
            { layer: 'Domain', icon: '🏛️', desc: 'Entities, Interfaces, Enums — puro negócio', color: 'var(--gold-400)' },
            { layer: 'Infrastructure', icon: '🗃️', desc: 'Prisma Repositories → SQLite', color: '#7ab8e8' },
          ].map((l) => (
            <div key={l.layer} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-3)', marginBottom: 'var(--space-2)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: `1px solid ${l.color}33` }}>
              <span style={{ fontSize: '1.2rem' }}>{l.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: l.color }}>{l.layer}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: '#7ab8e8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Frontend (React 19 + Vite)</div>
          {[
            { layer: 'Pages', icon: '📄', desc: 'Feature-based: student/, company/, perks/...', color: '#7ab8e8' },
            { layer: 'Context', icon: '🔐', desc: 'AuthContext: JWT, user state global', color: 'var(--gold-400)' },
            { layer: 'Services', icon: '🔌', desc: 'Axios com interceptors → API REST', color: '#90c890' },
            { layer: 'Design System', icon: '🎨', desc: 'CSS Custom Properties + Cinzel + Garamond', color: 'var(--crimson-300)' },
          ].map((l) => (
            <div key={l.layer} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-3)', marginBottom: 'var(--space-2)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: `1px solid ${l.color}33` }}>
              <span style={{ fontSize: '1.2rem' }}>{l.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: l.color }}>{l.layer}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5,
    tag: 'TECNOLOGIAS',
    title: 'Stack Tecnológico Completo',
    accent: '#90c890',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
        {[
          { name: 'Node.js', icon: '🟢', role: 'Runtime Backend' },
          { name: 'Express.js', icon: '🚂', role: 'Framework HTTP' },
          { name: 'TypeScript', icon: '🔷', role: 'Tipagem Estática' },
          { name: 'Prisma ORM', icon: '🗃️', role: 'Acesso ao BD' },
          { name: 'SQLite', icon: '📦', role: 'Banco Local' },
          { name: 'JWT', icon: '🔐', role: 'Autenticação' },
          { name: 'Zod', icon: '✅', role: 'Validação de Dados' },
          { name: 'bcryptjs', icon: '🔒', role: 'Hash de Senhas' },
          { name: 'React 19', icon: '⚛️', role: 'UI Framework' },
          { name: 'Vite', icon: '⚡', role: 'Build Tool' },
          { name: 'React Router', icon: '🧭', role: 'Roteamento SPA' },
          { name: 'Recharts', icon: '📊', role: 'Visualização de Dados' },
        ].map((t) => (
          <div key={t.name} style={{ padding: 'var(--space-4)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ fontSize: '2rem' }}>{t.icon}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--gold-400)', letterSpacing: '0.05em' }}>{t.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{t.role}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 6,
    tag: 'BANCO DE DADOS',
    title: 'Modelo de Dados (ER)',
    accent: 'var(--crimson-300)',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginTop: 'var(--space-5)', textAlign: 'left' }}>
        {[
          { entity: 'Usuario', fields: ['id (uuid)', 'email (unique)', 'senhaHash', 'papel (enum)', 'criadoEm'], color: 'var(--crimson-400)' },
          { entity: 'Aluno → Usuario', fields: ['nome, cpf, rg', 'logradouro, cidade, estado, cep', 'curso, saldoMoedas', 'instituicaoId (FK)'], color: 'var(--gold-400)' },
          { entity: 'Professor → Usuario', fields: ['nome, cpf, departamento', 'saldoMoedas (default: 1000)', 'instituicaoId (FK)'], color: '#7ab8e8' },
          { entity: 'EmpresaParceira → Usuario', fields: ['nome, descricao'], color: '#90c890' },
          { entity: 'Vantagem', fields: ['nome, descricao, urlFoto', 'custoMoedas, ativa', 'empresaId (FK)'], color: 'var(--gold-500)' },
          { entity: 'TransferenciaMoedas', fields: ['professorId (FK)', 'alunoId (FK)', 'valor, motivo, realizadaEm'], color: 'var(--crimson-300)' },
          { entity: 'Resgate', fields: ['alunoId (FK)', 'vantagemId (FK)', 'codigoCupom (unique)', 'valor, resgatadoEm'], color: 'var(--text-secondary)' },
          { entity: 'Instituicao', fields: ['nome, descricao', '→ Aluno[], Professor[]'], color: 'var(--text-muted)' },
        ].map((e) => (
          <div key={e.entity} style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: `1px solid ${e.color}33` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: e.color, letterSpacing: '0.1em', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>{e.entity}</div>
            {e.fields.map((f) => (
              <div key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '2px 0' }}>· {f}</div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 7,
    tag: 'DIFERENCIAIS',
    title: 'Funcionalidades Extras',
    accent: 'var(--gold-300)',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
        {[
          { icon: '⬡', title: 'Ranking de Méritos', desc: 'Leaderboard com top 10 alunos por saldo, medalhas gold/silver/bronze.' },
          { icon: '📊', title: 'Dashboard com Gráficos', desc: 'Gráfico de barras mostrando evolução de moedas recebidas via Recharts.' },
          { icon: '🎫', title: 'Cupom com Código Único', desc: 'Código CDM-XXXX-XXXX gerado com crypto.randomBytes, único por resgate.' },
          { icon: '🎨', title: 'Design System Temático', desc: 'Paleta "Casa da Moeda" inspirada em cédulas antigas e La Casa de Papel.' },
          { icon: '🔐', title: 'Auth Completo JWT', desc: 'Login/Register por papel (Aluno, Professor, Empresa) com middleware de proteção.' },
          { icon: '📦', title: 'Execução Local', desc: 'SQLite local: clone, instale e rode sem infraestrutura extra.' },
          { icon: '📬', title: 'Email Simulado', desc: 'Notificações de moedas e cupons logadas no console (prod-ready via SMTP).' },
          { icon: '🌱', title: 'Seed Completo', desc: 'Dados de exemplo: 5 instituições, 4 professores, 6 alunos, 3 empresas, 7 vantagens.' },
        ].map((f) => (
          <div key={f.title} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', padding: 'var(--space-4)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
            <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--gold-400)', letterSpacing: '0.06em', marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 8,
    tag: 'SPRINT 03',
    title: 'Entregáveis desta Sprint',
    accent: 'var(--crimson-300)',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
        {[
          { ok: true, item: 'CRUD final de Aluno (frontend + backend + validação)' },
          { ok: true, item: 'CRUD final de Empresa Parceira com gerenciamento de vantagens' },
          { ok: true, item: 'Autenticação completa: login, registro, JWT, middleware de papéis' },
          { ok: true, item: 'Transferência de moedas Professor → Aluno com validação de saldo' },
          { ok: true, item: 'Resgate de vantagem com geração de cupom único' },
          { ok: true, item: 'Extrato por papel (Professor: envios | Aluno: recebimentos + resgates | Empresa: resgates)' },
          { ok: true, item: 'Ranking de méritos (leaderboard top 10 alunos)' },
          { ok: true, item: 'Dashboard role-based com gráficos e estatísticas globais' },
          { ok: true, item: 'Página de Design System com padrões, cores, tipografia e componentes' },
          { ok: true, item: 'Apresentação interativa (este slide) com fluxo, arquitetura e tecnologias' },
          { ok: true, item: 'Migração para SQLite local' },
          { ok: true, item: 'Tema visual "Casa da Moeda" com fontes Cinzel + EB Garamond' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: item.ok ? 'rgba(76,175,80,0.06)' : 'rgba(139,0,0,0.06)', borderRadius: 'var(--radius-md)', border: `1px solid ${item.ok ? 'rgba(76,175,80,0.25)' : 'rgba(139,0,0,0.25)'}` }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: item.ok ? '#90c890' : 'var(--crimson-300)', flexShrink: 0 }}>{item.ok ? '✓' : '✗'}</span>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 9,
    tag: 'OBRIGADO',
    title: 'Obrigado!',
    subtitle: 'O mérito acadêmico agora tem valor de mercado.',
    accent: 'var(--gold-400)',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          fontFamily: 'var(--font-decorative)',
          fontSize: '3rem',
          color: 'var(--gold-400)',
          textShadow: '0 0 40px rgba(201,168,76,0.5)',
          letterSpacing: '0.1em',
        }}>
          ⬡ ⬡ ⬡
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Laboratório de Desenvolvimento de Software — PUC Minas · 2025
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          {['🏛️ React 19', '⚙️ Node.js', '🗃️ Prisma + SQLite', '🔐 JWT Auth', '🎨 Cinzel + Garamond'].map((t) => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', padding: '6px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>{t}</span>
          ))}
        </div>
      </div>
    ),
  },
]

export function SlidesPage() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const slide = slides[current]

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent((c) => Math.min(slides.length - 1, c + 1)), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, navigate])

  return (
    <div className="slides-fullscreen">
      {/* Top stripe */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--crimson-600), var(--gold-500), var(--crimson-600))', flexShrink: 0 }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px var(--space-6)',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: 'var(--font-decorative)', fontSize: '0.75rem', color: 'var(--gold-600)', letterSpacing: '0.15em' }}>
          CASA DA MOEDA
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>✕ Fechar</button>
      </div>

      {/* Slide body */}
      <div className="slide-body" style={{ overflowY: 'auto', padding: 'var(--space-8) var(--space-12)' }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.015,
          backgroundImage: 'repeating-linear-gradient(0deg, var(--gold-500) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--gold-500) 0px, transparent 1px, transparent 40px)',
          pointerEvents: 'none',
        }} />

        {/* Tag */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: slide.accent ?? 'var(--gold-400)',
          opacity: 0.8,
          marginBottom: 'var(--space-3)',
        }}>
          ◆ {slide.tag}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: slide.accent ?? 'var(--gold-400)',
          textShadow: `0 0 40px ${slide.accent ?? 'var(--gold-400)'}33`,
          marginBottom: slide.subtitle ? 'var(--space-2)' : 'var(--space-2)',
        }}>
          {slide.title}
        </h2>

        {slide.subtitle && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)',
            fontStyle: 'italic',
          }}>
            {slide.subtitle}
          </div>
        )}

        {slide.content}
      </div>

      {/* Nav bar */}
      <div className="slide-nav-bar">
        <button className="btn btn-ghost btn-sm" onClick={prev} disabled={current === 0}>
          ← Anterior
        </button>

        <div className="slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`slide-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button className="btn btn-ghost btn-sm" onClick={next} disabled={current === slides.length - 1}>
          Próximo →
        </button>
      </div>
    </div>
  )
}
