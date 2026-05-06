import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Skeleton, Alert } from 'antd'
import { UserOutlined, ShopOutlined, DollarOutlined } from '@ant-design/icons'
import { listStudents } from '../../services/studentService'
import { listCompanies } from '../../services/companyService'
import type { Student } from '../../types'
import type { PartnerCompany } from '../../types'

const { Title, Text } = Typography

export function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [companies, setCompanies] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([listStudents(), listCompanies()])
      .then(([s, c]) => { setStudents(s); setCompanies(c) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const totalBalance = students.reduce((sum, s) => sum + s.saldoMoedas, 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        <Text type="secondary">Visão geral do sistema de moeda estudantil</Text>
      </div>

      {error && (
        <Alert
          type="warning"
          message="Não foi possível carregar os dados. Verifique se o backend está rodando."
          style={{ marginBottom: 24 }}
          showIcon
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {loading ? <Skeleton active paragraph={false} /> : (
              <Statistic
                title="Total de Alunos"
                value={students.length}
                prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                valueStyle={{ color: '#1677ff' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {loading ? <Skeleton active paragraph={false} /> : (
              <Statistic
                title="Empresas Parceiras"
                value={companies.length}
                prefix={<ShopOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {loading ? <Skeleton active paragraph={false} /> : (
              <Statistic
                title="Moedas em Circulação"
                value={totalBalance}
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
                suffix="MC"
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card
            title="Últimos Alunos Cadastrados"
            bordered={false}
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          >
            {loading ? <Skeleton active /> : students.length === 0 ? (
              <Text type="secondary">Nenhum aluno cadastrado ainda.</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {students.slice(-5).reverse().map((s) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>{s.nome}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{s.curso}</Text>
                    </div>
                    <Text style={{ color: '#1677ff', fontWeight: 600 }}>{s.saldoMoedas} MC</Text>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Empresas Parceiras"
            bordered={false}
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          >
            {loading ? <Skeleton active /> : companies.length === 0 ? (
              <Text type="secondary">Nenhuma empresa cadastrada ainda.</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {companies.slice(0, 5).map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>{c.nome}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{c.descricao.slice(0, 60)}{c.descricao.length > 60 ? '…' : ''}</Text>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
