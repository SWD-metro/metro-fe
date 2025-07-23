import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Input, InputNumber, Select, Button, Space, Tag,
  Typography, Row, Col, Card, Badge, Spin
} from 'antd';
import { DeleteOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import { StationsRequest, StationsResponse, StationRouteRequest, Status, StationRouteResponse } from 'src/types/stations.type';
import { RoutesResponse, RoutesRequest } from 'src/types/routes.type';
import { useGetStationList } from 'src/queries/useStation';

const ROUTE_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#f5222d'];

// Status colors and labels mapping
const STATUS_CONFIG = {
  active: {
    color: '#52c41a',
    text: 'Hoạt động',
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f'
  },
  maintenance: {
    color: '#fa8c16',
    text: 'Bảo trì',
    bgColor: '#fff7e6',
    borderColor: '#ffd591'
  },
  decommissioned: {
    color: '#ff4d4f',
    text: 'Ngừng hoạt động',
    bgColor: '#fff2f0',
    borderColor: '#ffccc7'
  }
};

const renderStationStatus = (status: string) => {
  const statusKey = status as Status;
  const config = STATUS_CONFIG[statusKey];
  
  if (config) {
    return (
      <Tag 
        color={config.color}
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          color: config.color,
          fontWeight: 500
        }}
      >
        {config.text}
      </Tag>
    );
  }
  
  // Fallback for unknown status
  return <Tag color="default">{status}</Tag>;
};

interface StationNodeProps {
  station: StationRouteResponse;
  isLast: boolean;
  color: string;
  onDelete: (stationId: number, stationName: string) => void;
  onEdit?: (stationRouteId: number) => void;
  stationRouteId?: number;
}

export const StationNode = ({ station, isLast, color, onDelete, onEdit, stationRouteId }: StationNodeProps) => {
  const statusKey = station.status as Status;
  const isActive = statusKey === 'active';
  
  // Safe navigation để tránh lỗi undefined
  const stationInfo = station?.stationsResponse;
  if (!stationInfo) {
    return null; // Hoặc có thể return một placeholder
  }
  
  return (
    <div className="flex items-center mb-4">
      <div className="flex flex-col items-center mr-4">
        <div
          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: color,
            backgroundColor: isActive ? color : '#fff'
          }}
        >
          {isActive && (
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
              <Typography.Text strong className="text-lg">{stationInfo.name || 'Tên ga không xác định'}</Typography.Text>
              <Badge count={station.sequenceOrder} style={{ backgroundColor: color }} />
            </div>
            <Typography.Text type="secondary" className="block mb-1">Mã ga: {stationInfo.stationCode || 'N/A'}</Typography.Text>
            <Typography.Text type="secondary" className="block mb-2">{stationInfo.address || 'Địa chỉ không xác định'}</Typography.Text>
            <div className="flex items-center gap-2">
              {renderStationStatus(station.status)}
              <Typography.Text type="secondary" className="text-xs">
                Tọa độ: {stationInfo.latitude?.toFixed(4) || 'N/A'}, {stationInfo.longitude?.toFixed(4) || 'N/A'}
              </Typography.Text>
            </div>
          </div>
          <Space>
            {onEdit && stationRouteId && (
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => onEdit(stationRouteId)} 
                size="small"
              >
                Sửa
              </Button>
            )}
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(station.id, stationInfo.name || 'Ga không xác định')} size="small">
              Xóa
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

interface AddStationToRouteModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: StationRouteRequest) => void;
  isPending: boolean;
  routeId: number;
  existingStationIds: number[];
  nextSequenceOrder: number;
}

export const AddStationToRouteModal = ({ 
  open, 
  onCancel, 
  onFinish, 
  isPending, 
  routeId, 
  existingStationIds,
  nextSequenceOrder 
}: AddStationToRouteModalProps) => {
  const [form] = Form.useForm();
  const { data: stationsData, isLoading: isLoadingStations } = useGetStationList();
  
  const stations = stationsData?.data?.data || [];
  const availableStations = stations.filter(station => !existingStationIds.includes(station.stationId));

  const handleFinish = (values: any) => {
    const stationRouteData: StationRouteRequest = {
      stationId: values.stationId,
      routeId: routeId,
      sequenceOrder: values.sequenceOrder,
      status: 'operational'
    };
    onFinish(stationRouteData);
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        sequenceOrder: nextSequenceOrder
      });
    }
  }, [open, nextSequenceOrder, form]);

  return (
    <Modal 
      title="Thêm Ga vào Tuyến" 
      open={open} 
      onCancel={onCancel} 
      footer={null} 
      centered 
      destroyOnClose 
      width={600}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish} 
        className="mt-6"
      >
        <Form.Item 
          name="stationId" 
          label="Chọn Ga" 
          rules={[{ required: true, message: 'Vui lòng chọn ga!' }]}
        >
          <Select 
            placeholder="Chọn ga để thêm vào tuyến"
            loading={isLoadingStations}
            showSearch
            filterOption={(input, option) =>
              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {availableStations.map((station) => (
              <Select.Option key={station.stationId} value={station.stationId}>
                <div className="flex flex-col">
                  <span className="font-medium">{station.name}</span>
                  <span className="text-xs text-gray-500">{station.stationCode} - {station.address}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="sequenceOrder" 
          label="Thứ tự trên tuyến" 
          rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập thứ tự hợp lệ!' }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <div className="text-right pt-4 border-t">
          <Space>
            <Button onClick={onCancel} size="large">Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending} size="large">
              Thêm vào Tuyến
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

interface EditStationInRouteModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: { sequenceOrder: number; status: string }) => void;
  isPending: boolean;
  station: StationsResponse | null;
  currentSequenceOrder: number;
  currentStatus: string;
}

export const EditStationInRouteModal = ({ 
  open, 
  onCancel, 
  onFinish, 
  isPending, 
  station,
  currentSequenceOrder,
  currentStatus
}: EditStationInRouteModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && station) {
      form.setFieldsValue({
        sequenceOrder: currentSequenceOrder,
        status: currentStatus
      });
    }
  }, [open, station, currentSequenceOrder, currentStatus, form]);

  const statusOptions = [
    { 
      value: 'active', 
      label: (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_CONFIG.active.color }}></div>
          {STATUS_CONFIG.active.text}
        </div>
      )
    },
    { 
      value: 'maintenance', 
      label: (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_CONFIG.maintenance.color }}></div>
          {STATUS_CONFIG.maintenance.text}
        </div>
      )
    },
    { 
      value: 'decommissioned', 
      label: (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_CONFIG.decommissioned.color }}></div>
          {STATUS_CONFIG.decommissioned.text}
        </div>
      )
    }
  ];

  return (
    <Modal 
      title={`Chỉnh sửa Ga: ${station?.name}`}
      open={open} 
      onCancel={onCancel} 
      footer={null} 
      centered 
      destroyOnClose 
      width={500}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        className="mt-6"
      >
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <Typography.Text strong>Thông tin ga:</Typography.Text>
          <div className="mt-2">
            <Typography.Text className="block">Tên: {station?.name}</Typography.Text>
            <Typography.Text className="block">Mã: {station?.stationCode}</Typography.Text>
            <Typography.Text className="block">Địa chỉ: {station?.address}</Typography.Text>
          </div>
        </div>

        <Form.Item 
          name="sequenceOrder" 
          label="Thứ tự trên tuyến" 
          rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập thứ tự hợp lệ!' }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item 
          name="status" 
          label="Trạng thái" 
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select 
            placeholder="Chọn trạng thái"
            options={statusOptions}
          />
        </Form.Item>

        <div className="text-right pt-4 border-t">
          <Space>
            <Button onClick={onCancel} size="large">Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending} size="large">
              Cập nhật
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

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