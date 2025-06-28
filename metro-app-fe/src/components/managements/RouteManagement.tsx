import React, { useState } from 'react';
import { initialRoutes } from 'src/assets/data/mockData'; 
import { RouteWithStations, RoutesResponse, RoutesRequest } from 'src/types/routes.type'; 
import { Table, Modal, Form, Input, InputNumber, Select, Button, Space, Tag, App as AntdApp, Row, Col } from 'antd'; 
import type { TableProps } from 'antd'; 
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'; 

const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);

const RouteManagement = () => {
  const [routes, setRoutes] = useState<RouteWithStations[]>(initialRoutes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RoutesResponse | null>(null);
  const [form] = Form.useForm();
  const { modal } = AntdApp.useApp();

  const handleOpenModal = (route: RoutesResponse | null = null) => {
    setEditingRoute(route);
    form.setFieldsValue(route ? { ...route } : {
      routeName: '', routeCode: '', distanceInKm: 0, status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRoute(null);
    form.resetFields();
  };

  const onFinish = (values: RoutesRequest & { status: string }) => {
    if (editingRoute) {
      setRoutes(routes.map(r => r.routeId === editingRoute.routeId ? { ...editingRoute, ...values, updatedAt: new Date().toISOString() } : r));
    } else {
      const newRoute: RouteWithStations = {
        ...values,
        routeId: generateNumericId(),
        // status: values.status || 'active', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stations: [],
      };
      setRoutes([...routes, newRoute]);
    }
    handleCancel();
  };

  const handleDelete = (routeId: number) => {
    modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa tuyến đường này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
      onOk: () => setRoutes(routes.filter(r => r.routeId !== routeId)),
    });
  };

  type RouteStatus = 'active' | 'inactive' | 'under_construction';

  const getStatusTag = (status: RouteStatus) => {
    switch (status) {
      case 'active': return <Tag color="success">Hoạt động</Tag>;
      case 'inactive': return <Tag color="warning">Tạm ngưng</Tag>;
      case 'under_construction': return <Tag color="processing">Đang xây dựng</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns: TableProps<RoutesResponse>['columns'] = [
    { title: 'Tên Tuyến', dataIndex: 'routeName', key: 'routeName', render: (text) => <span className="font-medium text-slate-800">{text}</span> },
    { title: 'Mã Tuyến', dataIndex: 'routeCode', key: 'routeCode', render: (text) => <span className="text-slate-600">{text}</span> },
    { title: 'Khoảng cách (km)', dataIndex: 'distanceInKm', key: 'distanceInKm', render: (text) => <span className="text-slate-600">{text} km</span> },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', render: (status: RouteStatus) => getStatusTag(status) },
    {
      title: 'Hành động', key: 'action', align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} className="text-indigo-600">Sửa</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.routeId)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">Quản lý Tuyến đường</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Tuyến</Button>
      </div>
      <div className="overflow-x-auto">
        <Table columns={columns} dataSource={routes} rowKey="routeId" pagination={{ pageSize: 5, className: 'mt-4' }} className="ant-table-custom" />
      </div>
      <Modal title={editingRoute ? 'Chỉnh sửa Tuyến đường' : 'Thêm Tuyến đường mới'} open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6 space-y-4">
          <Form.Item name="routeName" label={<span className="font-semibold text-slate-700">Tên Tuyến</span>} rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="routeCode" label={<span className="font-semibold text-slate-700">Mã Tuyến</span>} rules={[{ required: true, message: 'Vui lòng nhập mã tuyến!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="distanceInKm" label={<span className="font-semibold text-slate-700">Khoảng cách (km)</span>} rules={[{ required: true, type: 'number', message: 'Vui lòng nhập khoảng cách hợp lệ!' }]}>
            <InputNumber min={0} step={0.1} className="w-full" />
          </Form.Item>
          <Form.Item name="status" label={<span className="font-semibold text-slate-700">Trạng Thái</span>} rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Tạm ngưng</Select.Option>
              <Select.Option value="under_construction">Đang xây dựng</Select.Option>
            </Select>
          </Form.Item>
          <div className="text-right pt-4">
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// const RoutesManagementPage = () => {
//   return (
//     <Row gutter={[24, 24]} className="mt-6">
//             <Col xs={24}>
//               <StationManagement />
//             </Col>
//           </Row>
//   );
// }

export default RouteManagement;