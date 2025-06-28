import React from 'react';
import { 
  Layout, 
  Card, 
  Progress, 
  Avatar, 
  Button,
  Table,
  Timeline
} from 'antd';
import {
  SettingOutlined,
  MoreOutlined
} from '@ant-design/icons';
import StatisticsCards from 'src/components/statisticsCards/StatisticsCards';
import Charts from 'src/components/charts/Charts';

const {  Content } = Layout;

// Projects Table Component
const ProjectsTable = () => {
  const columns = [
    {
      title: 'COMPANIES',
      dataIndex: 'company',
      key: 'company',
      render: (text: string, record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar style={{ backgroundColor: record.color }} shape="square">{text.charAt(0)}</Avatar>
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'MEMBERS',
      dataIndex: 'members',
      key: 'members',
      render: (members: string[]) => (
        <Avatar.Group maxCount={4}>
          {members.map((member, index) => (
            <Avatar key={index} src={member} size="small" />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'BUDGET',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: 'COMPLETION',
      dataIndex: 'completion',
      key: 'completion',
      render: (completion: number) => (
        <div className="w-32">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{completion}%</span>
          </div>
          <Progress 
            percent={completion} 
            showInfo={false} 
            size="small" 
            strokeColor={completion === 100 ? '#10b981' : completion > 50 ? '#3b82f6' : '#f59e0b'}
          />
        </div>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      company: 'Material XD Version',
      members: ['/api/placeholder/30/30', '/api/placeholder/30/30', '/api/placeholder/30/30'],
      budget: '$14,000',
      completion: 60,
      color: '#9333ea'
    },
    {
      key: '2',
      company: 'Add Progress Track',
      members: ['/api/placeholder/30/30', '/api/placeholder/30/30'],
      budget: '$3,000',
      completion: 10,
      color: '#3b82f6'
    },
    {
      key: '3',
      company: 'Fix Platform Errors',
      members: ['/api/placeholder/30/30', '/api/placeholder/30/30'],
      budget: 'Not set',
      completion: 100,
      color: '#ef4444'
    },
    {
      key: '4',
      company: 'Launch our Mobile App',
      members: ['/api/placeholder/30/30', '/api/placeholder/30/30', '/api/placeholder/30/30'],
      budget: '$20,500',
      completion: 100,
      color: '#10b981'
    },
    {
      key: '5',
      company: 'Add the New Pricing Page',
      members: ['/api/placeholder/30/30'],
      budget: '$500',
      completion: 25,
      color: '#3b82f6'
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Projects</h3>
            <p className="text-gray-600 text-sm">30 done this month</p>
          </div>
          <Button type="text" icon={<MoreOutlined />} />
        </div>
      }
      className="shadow-sm"
      headStyle={{ borderBottom: '0', paddingBottom: '0' }}
    >
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false}
        size="small"
      />
    </Card>
  );
};

// Orders Overview Component
const OrdersOverview = () => {
  const orders = [
    {
      title: '$2400, Design changes',
      time: '22 DEC 7:20 PM',
      icon: <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    },
    {
      title: 'New order #1832412',
      time: '21 DEC 11 PM',
      icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>
    },
    {
      title: 'Server payments for April',
      time: '21 DEC 9:34 PM',
      icon: <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    },
    {
      title: 'New card added for order #4395133',
      time: '20 DEC 2:20 AM',
      icon: <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
    },
    {
      title: 'Unlock packages for development',
      time: '18 DEC 4:54 AM',
      icon: <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
    },
  ];

  return (
    <Card 
      title={
        <div>
          <h3 className="text-lg font-semibold">Orders Overview</h3>
          <p className="text-green-500 text-sm font-medium">+24% this month</p>
        </div>
      }
      className="shadow-sm"
      headStyle={{ borderBottom: '0', paddingBottom: '0' }}
      extra={<Button type="text" icon={<SettingOutlined />} />}
    >
      <Timeline
        items={orders.map((order, index) => ({
          dot: order.icon,
          children: (
            <div key={index}>
              <p className="font-medium text-gray-800">{order.title}</p>
              <p className="text-gray-500 text-sm">{order.time}</p>
            </div>
          ),
        }))}
      />
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  return (
      <Layout>
        <Content className="p-6 bg-gray-50 h-screen">
          <StatisticsCards />
          <Charts />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectsTable />
            </div>
            <div>
              <OrdersOverview />
            </div>
          </div>
        </Content>
      </Layout>
  );
};

export default Dashboard;