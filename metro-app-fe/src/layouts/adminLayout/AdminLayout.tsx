import React from "react";
import { Card, Layout } from "antd";
import Sidebar from "src/components/sidebar/Sidebar";
import { App } from 'antd';
import { Outlet } from "react-router-dom";

const { Content } = Layout;

// AdminLayout.tsx
const AdminLayout: React.FC = () => {
  return (
    <App>
      <Layout className="min-h-screen">
        <Layout className="site-layout">
          <Content
            className="mx-6 my-6 bg-gray-100 p-6 rounded-lg relative z-10"
            style={{ marginTop: "-30px" }}
          >
            <Card className="mb-6 overflow-hidden relative rounded-lg">
              <Layout className="min-h-screen">
                <Sidebar />
                <Outlet />
              </Layout>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </App>
  );
};

export default AdminLayout;
