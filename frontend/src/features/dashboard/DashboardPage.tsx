import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import type { Stats, Transferencia, Resgate } from '../../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={accent ? { color: accent } : {}}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

function AlunoView() {
  const { user, refreshMe } = useAuth()
  const [transfers, setTransfers] = useState<Transferencia[]>([])
  const [resgates, setResgates] = useState<Resgate[]>([])

  useEffect(() => {
    refreshMe()
    if (user?.id) {
      api.get(`/transfers/aluno/${user.id}`).then((r) => setTransfers(r.data.slice(0, 5))).catch(() => {})
      api.get(`/resgates/aluno/${user.id}`).then((r) => setResgates(r.data.slice(0, 5))).catch(() => {})
    }
  }, [user?.id])

  const chartData = transfers.map((t) => ({
    data: new Date(t.realizadaEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    moedas: t.valor,
  })).reverse()

  return (
    <>
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard label="Saldo Atual" value={`⬡ ${user?.saldoMoedas ?? 0}`} sub="moedas disponíveis" />
        <StatCard label="Recebidas" value={transfers.reduce((s, t) => s + t.valor, 0)} sub="total acumulado" accent="var(--gold-400)" />
        <StatCard label="Resgates" value={resgates.length} sub="vantagens utilizadas" accent="#90c890" />
      </div>

      <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Últimas Transações Recebidas</span>
            <Link to="/statement" className="btn btn-ghost btn-sm">Ver tudo</Link>
          </div>
          {transfers.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-icon">⬡</div>
              <div className="empty-state-title">Nenhuma transação</div>
              <div className="empty-state-desc">Aguarde um professor enviar moedas</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {transfers.map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      Prof. {t.professor?.nome ?? '—'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{t.motivo}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(t.realizadaEm).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="coin-display">
                    <div className="coin-icon">⬡</div>
                    <span className="coin-amount" style={{ fontSize: '1rem' }}>+{t.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Evolução de Moedas</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="data" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
                <Bar dataKey="moedas" fill="var(--gold-600)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-desc">Sem dados para exibir</div>
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header"><span className="card-title">Ações Rápidas</span></div>
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <Link to="/perks" className="btn btn-primary">⬡ Ver Vantagens</Link>
          <Link to="/statement" className="btn btn-ghost">◉ Meu Extrato</Link>
          <Link to="/leaderboard" className="btn btn-ghost">⬡ Ranking</Link>
        </div>
      </div>
    </>
  )
}

function ProfessorView() {
  const { user, refreshMe } = useAuth()
  const [transfers, setTransfers] = useState<Transferencia[]>([])

  useEffect(() => {
    refreshMe()
    if (user?.id) {
      api.get(`/transfers/professor/${user.id}`).then((r) => setTransfers(r.data.slice(0, 5))).catch(() => {})
    }
  }, [user?.id])

  const totalEnviado = transfers.reduce((s, t) => s + t.valor, 0)

  return (
    <>
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard label="Saldo Disponível" value={`⬡ ${user?.saldoMoedas ?? 0}`} sub="para distribuir" />
        <StatCard label="Total Distribuído" value={totalEnviado} sub="moedas enviadas" accent="var(--gold-400)" />
        <StatCard label="Alunos Reconhecidos" value={new Set(transfers.map((t) => t.alunoId)).size} sub="estudantes" accent="#7ab8e8" />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Últimas Distribuições</span>
            <Link to="/statement" className="btn btn-ghost btn-sm">Ver tudo</Link>
          </div>
          {transfers.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-title">Nenhuma distribuição</div>
              <div className="empty-state-desc">Comece reconhecendo seus alunos</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {transfers.map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>{t.aluno?.nome ?? '—'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{t.motivo}</div>
                  </div>
                  <div className="coin-display">
                    <div className="coin-icon">⬡</div>
                    <span className="coin-amount">-{t.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Ações Rápidas</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/transfer" className="btn btn-primary btn-full">⬡ Enviar Moedas a Aluno</Link>
            <Link to="/students" className="btn btn-ghost btn-full">◈ Consultar Alunos</Link>
            <Link to="/leaderboard" className="btn btn-ghost btn-full">⬡ Ver Ranking</Link>
            <Link to="/statement" className="btn btn-ghost btn-full">◉ Meu Extrato</Link>
          </div>
        </div>
      </div>
    </>
  )
}

function EmpresaView() {
  const { user } = useAuth()
  const [resgates, setResgates] = useState<Resgate[]>([])

  useEffect(() => {
    if (user?.id) {
      api.get(`/resgates/empresa/${user.id}`).then((r) => setResgates(r.data.slice(0, 5))).catch(() => {})
    }
  }, [user?.id])

  const moedasResgatadas = resgates.reduce((s, r) => s + r.valor, 0)

  return (
    <>
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard label="Resgates Totais" value={resgates.length} sub="cupons emitidos" />
        <StatCard label="Moedas Recebidas" value={moedasResgatadas} sub="em vantagens" accent="var(--gold-400)" />
        <StatCard label="Alunos Atendidos" value={new Set(resgates.map((r) => r.alunoId)).size} sub="clientes únicos" accent="#90c890" />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Últimos Resgates</span>
            <Link to="/statement" className="btn btn-ghost btn-sm">Ver tudo</Link>
          </div>
          {resgates.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-title">Nenhum resgate ainda</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {resgates.map((r) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem' }}>{r.aluno?.nome ?? '—'}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--crimson-300)', marginTop: 2 }}>{r.codigoCupom}</div>
                  </div>
                  <div className="coin-display">
                    <div className="coin-icon">⬡</div>
                    <span className="coin-amount">{r.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Ações</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/perks" className="btn btn-primary btn-full">⬡ Gerenciar Vantagens</Link>
            <Link to="/statement" className="btn btn-ghost btn-full">◉ Histórico de Resgates</Link>
          </div>
        </div>
      </div>
    </>
  )
}

function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/leaderboard/stats').then((r) => setStats(r.data)).catch(() => {})
  }, [])

  return (
    <div className="grid grid-3">
      <StatCard label="Alunos" value={stats?.totalAlunos ?? '—'} sub="cadastrados" />
      <StatCard label="Professores" value={stats?.totalProfessores ?? '—'} sub="ativos" accent="#7ab8e8" />
      <StatCard label="Empresas" value={stats?.totalEmpresas ?? '—'} sub="parceiras" accent="#90c890" />
      <StatCard label="Transferências" value={stats?.totalTransferencias ?? '—'} sub="realizadas" accent="var(--gold-400)" />
      <StatCard label="Resgates" value={stats?.totalResgates ?? '—'} sub="cupons emitidos" accent="var(--crimson-300)" />
      <StatCard label="Em Circulação" value={`⬡ ${stats?.moedasCirculando ?? '—'}`} sub="moedas em saldo" />
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const showAdminOverview = user?.papel !== 'ALUNO'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-super">Casa da Moeda — {new Date().getFullYear()}</div>
          <h1 className="page-title">
            {user?.papel === 'ALUNO' ? `Bem-vindo, ${user.nome?.split(' ')[0] ?? 'Aluno'}` :
             user?.papel === 'PROFESSOR' ? `Prof. ${user.nome?.split(' ').slice(-1)[0] ?? ''}` :
             user?.papel === 'EMPRESA_PARCEIRA' ? (user.nome ?? 'Empresa') :
             'Painel Principal'}
          </h1>
          <div className="page-subtitle">
            {user?.papel === 'ALUNO' ? 'Seu desempenho acadêmico em números' :
             user?.papel === 'PROFESSOR' ? 'Distribua moedas e reconheça seus alunos' :
             user?.papel === 'EMPRESA_PARCEIRA' ? 'Gerencie suas vantagens e resgates' :
             'Visão geral do sistema'}
          </div>
        </div>
      </div>

      {showAdminOverview && <AdminOverview />}

      {showAdminOverview && (user?.papel === 'PROFESSOR' || user?.papel === 'EMPRESA_PARCEIRA') && (
        <div className="ornamental-divider mt-6 mb-6">
          {user?.papel === 'PROFESSOR' ? 'Painel do Professor' : 'Painel da Empresa'}
        </div>
      )}

      {user?.papel === 'ALUNO' && <AlunoView />}
      {user?.papel === 'PROFESSOR' && <ProfessorView />}
      {user?.papel === 'EMPRESA_PARCEIRA' && <EmpresaView />}
    </div>
  )
}
