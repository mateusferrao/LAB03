import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, Button, Space, Popconfirm, Tag, Typography,
  Breadcrumb, Card, Input, App,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Student } from '../../types'
import { listStudents, deleteStudent } from '../../services/studentService'

const { Title } = Typography

export function StudentListPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setStudents(await listStudents())
    } catch {
      message.error('Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStudent(id)
      setStudents((prev) => prev.filter((s) => s.id !== id))
      message.success('Aluno excluído com sucesso')
    } catch {
      message.error('Erro ao excluir aluno')
    }
  }

  const filtered = students.filter(
    (s) =>
      s.nome.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.curso.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: ColumnsType<Student> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (nome, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{nome}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      render: (cpf: string) =>
        cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
    },
    {
      title: 'Curso',
      dataIndex: 'curso',
      key: 'curso',
    },
    {
      title: 'Cidade / UF',
      key: 'local',
      render: (_, r) => `${r.cidade} / ${r.estado}`,
    },
    {
      title: 'Saldo',
      dataIndex: 'saldoMoedas',
      key: 'saldoMoedas',
      align: 'right',
      sorter: (a, b) => a.saldoMoedas - b.saldoMoedas,
      render: (saldo: number) => (
        <Tag color={saldo > 0 ? 'blue' : 'default'}>{saldo} MC</Tag>
      ),
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
            onClick={() => navigate(`/students/${record.id}/edit`)}
          />
          <Popconfirm
            title="Excluir aluno"
            description={`Deseja excluir "${record.nome}"? Esta ação não pode ser desfeita.`}
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
        items={[{ title: 'Início' }, { title: 'Alunos' }]}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined style={{ fontSize: 20, color: '#1677ff' }} />
          <Title level={4} style={{ margin: 0 }}>Alunos</Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/students/new')}
        >
          Novo Aluno
        </Button>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Buscar por nome, email ou curso..."
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
          locale={{ emptyText: 'Nenhum aluno encontrado' }}
        />
      </Card>
    </div>
  )
}
