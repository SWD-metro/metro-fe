import React, { useState } from 'react';
import { initialUsers } from 'src/assets/data/mockData';
import { User, AuthProvider } from 'src/types/user.type';
import { Table, Modal, Form, Input, Select, Button, Space, Tag, App as AntdApp } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';

const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { modal } = AntdApp.useApp();

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    form.setFieldsValue(user ? { ...user } : { name: '', email: '', role: 'user' });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const onFinish = (values: Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'authProvider' | 'isStudent' | 'studentExpiredDate' | 'googleId' | 'pictureUrl'>) => {
    if (editingUser) {
      setUsers(users.map(u => u.userId === editingUser.userId ? { ...editingUser, ...values } : u));
    } else {
      setUsers([...users, {
        ...values,
        userId: generateNumericId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authProvider: AuthProvider.LOCAL,
        isStudent: false,
      } as User]);
    }
    handleCancel();
  };

  const handleDelete = (userId: number) => {
    modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => setUsers(users.filter(u => u.userId !== userId)),
    });
  };

  const columns: TableProps<User>['columns'] = [
    { title: 'Tên', dataIndex: 'name', key: 'name', render: (name) => <span className="font-medium text-slate-800">{name}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (email) => <span className="text-slate-600">{email}</span> },
    {
      title: 'Vai trò', dataIndex: 'role', key: 'role',
      render: (role: 'admin' | 'user') => (
        <Tag color={role === 'admin' ? 'volcano' : 'cyan'} className="font-medium">
          {role.toUpperCase()}
        </Tag>
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => <span className="text-slate-600">{new Date(text).toLocaleDateString('vi-VN')}</span> },
    {
      title: 'Hành động', key: 'action', align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} className="text-indigo-600">Sửa</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.userId)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <Content className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">Quản lý Người dùng</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Người dùng</Button>
        </div>
        <div className="overflow-x-auto">
          {/* Use rowKey="userId" */}
          <Table columns={columns} dataSource={users} rowKey="userId" pagination={{ pageSize: 5, className: 'mt-4' }} className="ant-table-custom" />
        </div>
        <Modal title={editingUser ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng mới'} open={isModalOpen} onCancel={handleCancel} footer={null} centered>
          <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6 space-y-4">
            <Form.Item name="name" label={<span className="font-semibold text-slate-700">Tên</span>} rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label={<span className="font-semibold text-slate-700">Email</span>} rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="role" label={<span className="font-semibold text-slate-700">Vai trò</span>} rules={[{ required: true }]}>
              <Select>
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
            <div className="text-right pt-2">
              <Space>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit">Lưu</Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default UserManagement;