import { Col, Layout, Row } from "antd";
import { App as AntdApp } from 'antd'
import TicketTypeManagement from "src/components/managements/TicketTypeManagement";
import UserManagement from "src/components/managements/UserManagement";
import FareManagement from "src/components/managements/FareManagement";

const { Content } = Layout;

const Manage: React.FC = () => {
  return (
    <Layout className="bg-slate-50 min-h-screen">
      <style>
        {`
          .ant-table-custom .ant-table-thead > tr > th {
            background-color: #f8fafc;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            border-bottom: 1px solid #e2e8f0;
            }
            .ant-table-custom .ant-table-tbody > tr > td {
              padding-top: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f1f5f9;
              }
              .ant-table-custom .ant-table-tbody > tr:last-child > td {
                border-bottom: none;
                }
                `}
      </style>
      <AntdApp>
        <Content className="p-4 sm:p-6 lg:p-8">
          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24}>
              <TicketTypeManagement />
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24}>
              <FareManagement/>
            </Col>
          </Row>


        </Content>
      </AntdApp>
    </Layout>
  );
};

export default Manage;