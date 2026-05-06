import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Typography, Avatar } from 'antd'
import {
  UserOutlined,
  ShopOutlined,
  DashboardOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { StudentListPage } from './features/student/StudentListPage'
import { StudentFormPage } from './features/student/StudentFormPage'
import { CompanyListPage } from './features/company/CompanyListPage'
import { CompanyFormPage } from './features/company/CompanyFormPage'

const { Sider, Header, Content, Footer } = Layout

const menuItems = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/students', label: 'Alunos', icon: <UserOutlined /> },
  { key: '/companies', label: 'Empresas Parceiras', icon: <ShopOutlined /> },
]

function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey =
    menuItems.find((item) => item.key !== '/' && location.pathname.startsWith(item.key))?.key ??
    (location.pathname === '/' ? '/' : '')

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100, overflow: 'auto' }}
        theme="dark"
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Avatar
            size={32}
            style={{ background: '#1677ff', flexShrink: 0 }}
            icon={<TrophyOutlined />}
          />
          <div style={{ overflow: 'hidden' }}>
            <Typography.Text strong style={{ color: '#fff', fontSize: 13, display: 'block', lineHeight: '18px' }}>
              Moeda Estudantil
            </Typography.Text>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
              Sistema de Méritos
            </Typography.Text>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
        }}>
          <Typography.Text style={{ color: '#666', fontSize: 13 }}>
            Laboratório de Desenvolvimento de Software — Release 1
          </Typography.Text>
        </Header>

        <Content style={{ padding: 24, minHeight: 'calc(100vh - 64px - 48px)' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/new" element={<StudentFormPage />} />
            <Route path="/students/:id/edit" element={<StudentFormPage />} />
            <Route path="/companies" element={<CompanyListPage />} />
            <Route path="/companies/new" element={<CompanyFormPage />} />
            <Route path="/companies/:id/edit" element={<CompanyFormPage />} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center', color: '#999', fontSize: 12, padding: '12px 24px' }}>
          PUC Minas — Sistema de Moeda Estudantil © 2025
        </Footer>
      </Layout>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
