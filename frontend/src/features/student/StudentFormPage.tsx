import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Form, Input, Select, Button, Card, Row, Col,
  Typography, Breadcrumb, Divider, App, Skeleton,
} from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { Institution } from '../../types'
import { createStudent, getStudent, updateStudent } from '../../services/studentService'
import { listInstitutions } from '../../services/institutionService'

const { Title } = Typography

export function StudentFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchInstitutions = listInstitutions().then(setInstitutions)

    if (isEdit) {
      Promise.all([getStudent(id!), fetchInstitutions])
        .then(([student]) => {
          form.setFieldsValue({
            nome: student.nome,
            email: student.email,
            cpf: student.cpf,
            rg: student.rg,
            curso: student.curso,
            instituicaoId: student.instituicaoId,
            logradouro: student.logradouro,
            cidade: student.cidade,
            estado: student.estado,
            cep: student.cep,
          })
        })
        .catch(() => message.error('Erro ao carregar dados do aluno'))
        .finally(() => setLoading(false))
    } else {
      fetchInstitutions.finally(() => setLoading(false))
    }
  }, [id])

  async function handleSubmit(values: any) {
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateStudent(id!, values)
        message.success('Aluno atualizado com sucesso')
      } else {
        await createStudent(values)
        message.success('Aluno cadastrado com sucesso')
      }
      navigate('/students')
    } catch (err: any) {
      const details = err.response?.data?.details
      if (details) {
        details.forEach((d: any) => message.error(`${d.campo}: ${d.mensagem}`))
      } else {
        message.error(err.response?.data?.error ?? 'Erro ao salvar aluno')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const ufs = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
    'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
    'SP','SE','TO',
  ]

  if (loading) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    )
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { title: 'Início' },
          { title: 'Alunos', onClick: () => navigate('/students'), className: 'cursor-pointer' },
          { title: isEdit ? 'Editar' : 'Novo Aluno' },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/students')}
        />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        scrollToFirstError
      >
        <Card
          title="Dados Pessoais"
          bordered={false}
          style={{ marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="nome"
                label="Nome completo"
                rules={[{ required: true, message: 'Nome é obrigatório' }]}
              >
                <Input placeholder="Ex: João da Silva" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  { required: true, message: 'E-mail é obrigatório' },
                  { type: 'email', message: 'E-mail inválido' },
                ]}
              >
                <Input placeholder="joao@email.com" disabled={isEdit} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="cpf"
                label="CPF"
                rules={[
                  { required: true, message: 'CPF é obrigatório' },
                  { len: 11, message: 'CPF deve ter 11 dígitos' },
                  { pattern: /^\d+$/, message: 'Apenas números' },
                ]}
              >
                <Input placeholder="00000000000" maxLength={11} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="rg"
                label="RG"
                rules={[{ required: true, message: 'RG é obrigatório' }]}
              >
                <Input placeholder="Ex: MG-12.345.678" />
              </Form.Item>
            </Col>
            {!isEdit && (
              <Col xs={24} md={8}>
                <Form.Item
                  name="senha"
                  label="Senha"
                  rules={[
                    { required: true, message: 'Senha é obrigatória' },
                    { min: 6, message: 'Mínimo 6 caracteres' },
                  ]}
                >
                  <Input.Password placeholder="Mínimo 6 caracteres" />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>

        <Card
          title="Informações Acadêmicas"
          bordered={false}
          style={{ marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="curso"
                label="Curso"
                rules={[{ required: true, message: 'Curso é obrigatório' }]}
              >
                <Input placeholder="Ex: Sistemas de Informação" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="instituicaoId"
                label="Instituição de ensino"
                rules={[{ required: true, message: 'Selecione a instituição' }]}
              >
                <Select
                  placeholder="Selecione a instituição"
                  options={institutions.map((i) => ({ value: i.id, label: i.nome }))}
                  showSearch
                  filterOption={(input, opt) =>
                    (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          title="Endereço"
          bordered={false}
          style={{ marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        >
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="logradouro"
                label="Logradouro"
                rules={[{ required: true, message: 'Logradouro é obrigatório' }]}
              >
                <Input placeholder="Rua, Av., Alameda..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="cep"
                label="CEP"
                rules={[
                  { required: true, message: 'CEP é obrigatório' },
                  { len: 8, message: 'CEP deve ter 8 dígitos' },
                  { pattern: /^\d+$/, message: 'Apenas números' },
                ]}
              >
                <Input placeholder="00000000" maxLength={8} />
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item
                name="cidade"
                label="Cidade"
                rules={[{ required: true, message: 'Cidade é obrigatória' }]}
              >
                <Input placeholder="Ex: Belo Horizonte" />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                name="estado"
                label="Estado (UF)"
                rules={[{ required: true, message: 'UF é obrigatória' }]}
              >
                <Select
                  placeholder="Selecione"
                  options={ufs.map((uf) => ({ value: uf, label: uf }))}
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button onClick={() => navigate('/students')}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={submitting} icon={<SaveOutlined />}>
            {isEdit ? 'Salvar alterações' : 'Cadastrar aluno'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
