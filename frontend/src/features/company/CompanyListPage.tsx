import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, Button, Space, Popconfirm, Typography,
  Breadcrumb, Card, Input, App, Avatar,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ShopOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { PartnerCompany } from '../../types'
import { listCompanies, deleteCompany } from '../../services/companyService'

const { Title } = Typography

export function CompanyListPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [companies, setCompanies] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setCompanies(await listCompanies())
    } catch {
      message.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCompany(id)
      setCompanies((prev) => prev.filter((c) => c.id !== id))
      message.success('Empresa excluída com sucesso')
    } catch {
      message.error('Erro ao excluir empresa')
    }
  }

  const filtered = companies.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.descricao.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: ColumnsType<PartnerCompany> = [
    {
      title: 'Empresa',
      key: 'empresa',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            style={{ background: '#f0f5ff', color: '#1677ff', fontWeight: 700, flexShrink: 0 }}
            size={36}
          >
            {record.nome.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.nome}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      ellipsis: true,
      render: (desc: string) => (
        <span style={{ color: '#555' }}>{desc}</span>
      ),
    },
    {
      title: 'Cadastro',
      dataIndex: 'criadoEm',
      key: 'criadoEm',
      width: 150,
      render: (date: string) =>
        new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/companies/${record.id}/edit`)}
          />
          <Popconfirm
            title="Excluir empresa"
            description={`Deseja excluir "${record.nome}"? Todas as vantagens serão removidas.`}
            onConfirm={() => handleDelete(record.id)}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Breadcrumb
        items={[{ title: 'Início' }, { title: 'Empresas Parceiras' }]}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShopOutlined style={{ fontSize: 20, color: '#52c41a' }} />
          <Title level={4} style={{ margin: 0 }}>Empresas Parceiras</Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/companies/new')}
        >
          Nova Empresa
        </Button>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Buscar por nome, email ou descrição..."
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 360 }}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `${t} registros` }}
          size="middle"
          locale={{ emptyText: 'Nenhuma empresa encontrada' }}
        />
      </Card>
    </div>
  )
}
