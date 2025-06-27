import React from 'react';
import {
  Modal, Form, Input, InputNumber, Select, Button, Space, Tag,
  Typography, Row, Col, Card, Badge
} from 'antd';
import { DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { StationsRequest, StationsResponse } from 'src/types/stations.type';
import { RoutesResponse, RoutesRequest } from 'src/types/routes.type';

const ROUTE_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#f5222d'];

const renderStationStatus = (status: string) => {
  let color = 'default';
  let text = 'Không xác định';
  if (status === 'open' || status === 'operational') {
    color = 'success';
    text = 'Hoạt động';
  } else if (status === 'under_construction') {
    color = 'processing';
    text = 'Đang xây dựng';
  } else {
    color = 'default';
    text = status;
  }
  return <Tag color={color}>{text}</Tag>;
};

interface StationNodeProps {
  station: StationsResponse;
  isLast: boolean;
  color: string;
  onDelete: (stationId: number, stationName: string) => void;
}

export const StationNode = ({ station, isLast, color, onDelete }: StationNodeProps) => (
  <div className="flex items-center mb-4">
    <div className="flex flex-col items-center mr-4">
      <div
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: color,
          backgroundColor: station.status === 'open' || station.status === 'operational' ? color : '#fff'
        }}
      >
        {(station.status === 'open' || station.status === 'operational') && (
          <div className="w-2 h-2 rounded-full bg-white"></div>
        )}
      </div>
      {!isLast && (
        <div className="w-0.5 h-16 mt-1" style={{ backgroundColor: color }}></div>
      )}
    </div>
    <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow" bodyStyle={{ padding: '12px 16px' }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <EnvironmentOutlined style={{ color }} />
            <Typography.Text strong className="text-lg">{station.name}</Typography.Text>
            <Badge count={station.sequenceOrder} style={{ backgroundColor: color }} />
          </div>
          <Typography.Text type="secondary" className="block mb-1">Mã ga: {station.stationCode}</Typography.Text>
          <Typography.Text type="secondary" className="block mb-2">{station.address}</Typography.Text>
          <div className="flex items-center gap-2">
            {renderStationStatus(station.status)}
            <Typography.Text type="secondary" className="text-xs">
              Tọa độ: {station.latitude?.toFixed(4)}, {station.longitude?.toFixed(4)}
            </Typography.Text>
          </div>
        </div>
        <Space>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(station.stationId, station.name)} size="small">
            Xóa
          </Button>
        </Space>
      </div>
    </Card>
  </div>
);

interface AddStationModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: StationsRequest) => void;
  isPending: boolean;
  initialValues: Partial<StationsRequest>;
  routes: RoutesResponse[];
}

export const AddStationModal = ({ open, onCancel, onFinish, isPending, initialValues, routes }: AddStationModalProps) => {
  const [form] = Form.useForm();

  return (
    <Modal title="Thêm Ga mới" open={open} onCancel={onCancel} footer={null} centered destroyOnClose width={600}>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues} className="mt-6">
        <Form.Item name="name" label="Tên Ga" rules={[{ required: true, message: 'Vui lòng nhập tên ga!' }]}>
          <Input placeholder="VD: Ga Bến Thành" />
        </Form.Item>
        <Form.Item name="stationCode" label="Mã Ga" rules={[{ required: true, message: 'Vui lòng nhập mã ga!' }]}>
          <Input placeholder="VD: BT01" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết của ga" />
        </Form.Item>
        <Form.Item name="routeId" label="Thuộc Tuyến" rules={[{ required: true, message: 'Vui lòng chọn tuyến!' }]}>
          <Select placeholder="Chọn tuyến đường">
            {routes.map((route, index) => (
              <Select.Option key={route.routeId} value={route.routeId}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length] }}></div>
                  {route.routeName}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="latitude" label="Vĩ độ" rules={[{ required: true, type: 'number', message: 'Vui lòng nhập vĩ độ hợp lệ!' }]}>
              <InputNumber className="w-full" step={0.0001} placeholder="10.7xxx" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="longitude" label="Kinh độ" rules={[{ required: true, type: 'number', message: 'Vui lòng nhập kinh độ hợp lệ!' }]}>
              <InputNumber className="w-full" step={0.0001} placeholder="106.6xxx" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="sequenceOrder" label="Thứ tự trên tuyến" rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập thứ tự hợp lệ (tối thiểu 1)!' }]}>
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <div className="text-right pt-4 border-t">
          <Space>
            <Button onClick={onCancel} size="large">Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending} size="large">Thêm Ga</Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

interface AddRouteModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: RoutesRequest) => void;
  isPending: boolean;
}

export const AddRouteModal = ({ open, onCancel, onFinish, isPending }: AddRouteModalProps) => {
  const [form] = Form.useForm();
  return (
    <Modal title="Thêm Tuyến mới" open={open} onCancel={onCancel} footer={null} centered destroyOnClose width={600}>
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
        <Form.Item name="routeName" label="Tên Tuyến" rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}>
          <Input placeholder="VD: Tuyến số 5 (Bảy Hiền - Cầu Sài Gòn)" />
        </Form.Item>
        <Form.Item name="routeCode" label="Mã Tuyến" rules={[{ required: true, message: 'Vui lòng nhập mã tuyến!' }]}>
          <Input placeholder="VD: T5" />
        </Form.Item>
        <Form.Item name="distanceInKm" label="Quãng đường (km)" rules={[{ required: true, type: 'number', min: 0, message: 'Vui lòng nhập quãng đường hợp lệ!' }]}>
          <InputNumber min={0} className="w-full" placeholder="VD: 8.9" />
        </Form.Item>
        <div className="text-right pt-4 border-t">
          <Space>
            <Button onClick={onCancel} size="large">Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending} size="large">Thêm Tuyến</Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};