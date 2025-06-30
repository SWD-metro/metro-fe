import React, { useState } from 'react';
import { User } from 'src/types/user.type';
import { Table, Tag, Spin, Alert } from 'antd';
import type { TableProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useAccountMe } from 'src/queries/useUser';

const UserManagement = () => {
  const { data: users, isLoading, isError, error } = useAccountMe();

  const columns: TableProps<User>['columns'] = [
    { title: 'UserID', dataIndex: 'userId', key: 'userId', width: 100, align: 'center' },
    { 
      title: 'Username', 
      dataIndex: 'username', 
      key: 'username', 
      render: (text) => <span className="font-medium text-slate-800">{text}</span> 
    },
    { 
      title: 'Tên', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <span className="text-slate-600">{text || 'Chưa cập nhật'}</span> 
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email' 
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'volcano' : 'cyan'} className="font-medium">
          {role.toUpperCase()}
        </Tag>
      ),
    },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'createdAt', 
      key: 'createdAt', 
      render: (text) => new Date(text).toLocaleDateString('vi-VN') 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  if (isError) {
    return (
        <Content className="p-4 sm:p-6 lg:p-8">
            <Alert 
                message="Lỗi" 
                description={`Không thể tải danh sách người dùng: ${error.message}`}
                type="error" 
                showIcon 
            />
        </Content>
    );
  }

  return (
    <Content className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-screen">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Danh sách Người dùng</h2>
          <p className="text-slate-500 mt-1">Dưới đây là danh sách tất cả người dùng trong hệ thống.</p>
        </div>
        <div className="overflow-x-auto">
          <Table 
            columns={columns} 
            dataSource={Array.isArray(users?.data?.data) ? users.data.data : users?.data?.data ? [users.data.data] : []} 
            rowKey="userId" 
            pagination={{ pageSize: 10, className: 'mt-4' }} 
            loading={isLoading}
          />
        </div>
      </div>
    </Content>
  );
};

export default UserManagement;