import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Form, Input, Button, Card, Row, Col,
  Typography, Breadcrumb, Divider, App, Skeleton,
} from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { createCompany, getCompany, updateCompany } from '../../services/companyService'

const { Title } = Typography

export function CompanyFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getCompany(id!)
      .then((c) => form.setFieldsValue({ nome: c.nome, email: c.email, descricao: c.descricao }))
      .catch(() => message.error('Erro ao carregar empresa'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(values: any) {
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateCompany(id!, { nome: values.nome, descricao: values.descricao })
        message.success('Empresa atualizada com sucesso')
      } else {
        await createCompany(values)
        message.success('Empresa cadastrada com sucesso')
      }
      navigate('/companies')
    } catch (err: any) {
      const details = err.response?.data?.details
      if (details) {
        details.forEach((d: any) => message.error(`${d.campo}: ${d.mensagem}`))
      } else {
        message.error(err.response?.data?.error ?? 'Erro ao salvar empresa')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    )
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { title: 'Início' },
          { title: 'Empresas Parceiras', onClick: () => navigate('/companies') },
          { title: isEdit ? 'Editar' : 'Nova Empresa' },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/companies')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Editar Empresa Parceira' : 'Cadastrar Empresa Parceira'}
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
          title="Dados da Empresa"
          bordered={false}
          style={{ marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="nome"
                label="Nome da empresa"
                rules={[{ required: true, message: 'Nome é obrigatório' }]}
              >
                <Input placeholder="Ex: Café do Campus" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="E-mail de contato"
                rules={[
                  { required: true, message: 'E-mail é obrigatório' },
                  { type: 'email', message: 'E-mail inválido' },
                ]}
              >
                <Input placeholder="contato@empresa.com" disabled={isEdit} />
              </Form.Item>
            </Col>
            {!isEdit && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="senha"
                  label="Senha de acesso"
                  rules={[
                    { required: true, message: 'Senha é obrigatória' },
                    { min: 6, message: 'Mínimo 6 caracteres' },
                  ]}
                >
                  <Input.Password placeholder="Mínimo 6 caracteres" />
                </Form.Item>
              </Col>
            )}
            <Col xs={24}>
              <Form.Item
                name="descricao"
                label="Descrição"
                rules={[{ required: true, message: 'Descrição é obrigatória' }]}
              >
                <Input.TextArea
                  placeholder="Descreva os produtos/serviços e benefícios oferecidos aos alunos..."
                  rows={4}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button onClick={() => navigate('/companies')}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={submitting} icon={<SaveOutlined />}>
            {isEdit ? 'Salvar alterações' : 'Cadastrar empresa'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
