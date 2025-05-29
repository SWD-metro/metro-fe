import { BellOutlined, DashboardOutlined, LoginOutlined, TableOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React from 'react'

const Sidebar = () => {
  return (
    <Sider width={200} className="!bg-white shadow-sm h-dvh">
      <div className="p-4">
        <h2 className="text-gray-800 text-lg font-semibold">Mevantro</h2>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        className="border-r-0"
        items={[
          {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '2',
            icon: <UserOutlined />,
            label: 'Profile',
          },
          {
            key: '3',
            icon: <TableOutlined />,
            label: 'Tables',
          },
          {
            key: '4',
            icon: <BellOutlined />,
            label: 'Notifications',
          },
          {
            key: 'auth',
            label: 'AUTH PAGES',
            type: 'group',
            children: [
              {
                key: '5',
                icon: <LoginOutlined />,
                label: 'Sign In',
              },
              {
                key: '6',
                icon: <UserAddOutlined />,
                label: 'Sign Up',
              },
            ],
          },
        ]}
      />
    </Sider>
  )
}

export default Sidebar