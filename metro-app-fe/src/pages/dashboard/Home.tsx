import React from 'react'

import Dashboard from './Dashboard'
import { Card, Layout } from 'antd'
import Header from 'src/components/Header'
import { Content } from 'antd/es/layout/layout'
import Sidebar from 'src/components/sidebar/Sidebar'


const Home = () => {

  return (
    <>
      <Layout className="min-h-screen">
        <Header />
        <Layout className="site-layout">
        <Content 
        className="mx-6 my-6 bg-gray-100 p-6 rounded-lg relative z-10"
        style={{ marginTop: '-30px' }}
        >
        <Card className="mb-6 overflow-hidden relative rounded-lg">
            <Layout className="min-h-screen">
            <Sidebar />
            <Dashboard />
            </Layout>
        </Card>
        </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default Home