import React, { useState } from 'react';
import { initialRoutes } from 'src/assets/data/mockData'; 
import { StationsRequest, StationsResponse } from 'src/types/stations.type'; 

// Import Ant Design components
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Tag,
  App as AntdApp,
  Typography,
  Row,
  Col,
} from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'; 

interface ApiResponse<T> {
  data: T[];
  message: string;
}

const useGetStationList = () => {
  const [data, setData] = useState<ApiResponse<StationsResponse> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setData({
        data: initialStations,
        message: "Stations fetched successfully"
      });
    }, 500);
  }, []);

  return { data, isLoading, isError, error };
};


const initialStations: StationsResponse[] = [
  { stationId: 1, stationCode: 'NHTP', name: 'Ga Nhà hát Thành phố', address: '123 Đồng Khởi, Q1', latitude: 10.7766, longitude: 106.7023, sequenceOrder: 1, status: 'under_construction', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), routeId: 1 },
  { stationId: 2, stationCode: 'BAS', name: 'Ga Ba Son', address: '2 Tôn Đức Thắng, Q1', latitude: 10.7801, longitude: 106.7098, sequenceOrder: 2, status: 'under_construction', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), routeId: 1 },
  { stationId: 3, stationCode: 'TD', name: 'Ga Tao Đàn', address: '56 Trương Định, Q3', latitude: 10.7725, longitude: 106.6925, sequenceOrder: 1, status: 'operational', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), routeId: 2 },
  { stationId: 4, stationCode: 'DC', name: 'Ga Dân Chủ', address: '32 CMT8, Q3', latitude: 10.7828, longitude: 106.6833, sequenceOrder: 2, status: 'operational', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), routeId: 2 },
];


const useAddStationMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (data: StationsRequest, callbacks: { onSuccess: () => void; onError: (error: any) => void }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      if (Math.random() > 0.1) { 
        callbacks.onSuccess();
      } else {
        callbacks.onError(new Error('Failed to add station (simulated error)'));
      }
    }, 1000);
  };
  return { mutate, isPending };
};

const useUpdateStationMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (data: StationsResponse, callbacks: { onSuccess: () => void; onError: (error: any) => void }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      if (Math.random() > 0.1) {
        callbacks.onSuccess();
      } else {
        callbacks.onError(new Error('Failed to update station (simulated error)'));
      }
    }, 1000);
  };
  return { mutate, isPending };
};

const useDeleteStationMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (stationId: number, callbacks: { onSuccess: () => void; onError: (error: any) => void }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      if (Math.random() > 0.1) {
        callbacks.onSuccess();
      } else {
        callbacks.onError(new Error('Failed to delete station (simulated error)'));
      }
    }, 1000);
  };
  return { mutate, isPending };
};


const StationManagement = () => {
  const { data: stationsApiResponse, isLoading: isLoadingStations, isError: isErrorStations, error: stationError } = useGetStationList();
  const addStationMutation = useAddStationMutation();
  const updateStationMutation = useUpdateStationMutation(); 
  const deleteStationMutation = useDeleteStationMutation(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<StationsResponse | null>(null);
  const [form] = Form.useForm();
  const { modal, message } = AntdApp.useApp(); 

  const getRouteName = (routeId: number) => initialRoutes.find(r => r.routeId === routeId)?.routeName || 'Không xác định';

  const handleOpenModal = (station: StationsResponse | null = null) => {
    setEditingStation(station);
    if (station) {
      form.setFieldsValue({ ...station });
    } else {
      form.resetFields(); 
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingStation(null);
    form.resetFields();
  };

  const onFinish = (formValues: StationsRequest) => {

    if (editingStation) {
      const updatedStation: StationsResponse = {
        ...editingStation, 
        ...formValues,
        updatedAt: new Date().toISOString(),
        status: (formValues as any).status || editingStation.status
      };

      updateStationMutation.mutate(updatedStation, {
        onSuccess: () => {
          message.success('Cập nhật ga thành công!');
          handleCancel();
        },
        onError: (error: any) => {
          message.error(`Cập nhật ga thất bại: ${error.message || 'Lỗi không xác định'}`);
        }
      });
    } else {
      const newStation: StationsRequest & { status: string } = {
        ...formValues,
        status: 'under_construction',
      };
      addStationMutation.mutate(newStation, {
        onSuccess: () => {
          message.success('Thêm ga thành công!');
          handleCancel();

        },
        onError: (error: any) => {
          message.error(`Thêm ga thất bại: ${error.message || 'Lỗi không xác định'}`);
        }
      });
    }
  };

  const handleDelete = (stationId: number) => {
    modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa ga này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
      onOk: () => {
        deleteStationMutation.mutate(stationId, {
          onSuccess: () => {
            message.success('Xóa ga thành công!');
          },
          onError: (error: any) => {
            message.error(`Xóa ga thất bại: ${error.message || 'Lỗi không xác định'}`);
          }
        });
      },
    });
  };

  const columns: TableProps<StationsResponse>['columns'] = [
    { title: 'Mã Ga', dataIndex: 'stationCode', key: 'stationCode', render: (text) => <span className="text-slate-600">{text}</span> },
    { title: 'Tên Ga', dataIndex: 'name', key: 'name', render: (text) => <span className="font-medium text-slate-800">{text}</span> },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', render: (text) => <span className="text-slate-600">{text}</span>, width: 250 },
    { title: 'Tuyến', dataIndex: 'routeId', key: 'routeId', render: (routeId) => <span className="text-slate-600">{getRouteName(routeId)}</span> },
    {
      title: 'Trạng Thái', dataIndex: 'status', key: 'status',
      render: (status: 'operational' | 'under_construction') => ( 
        <Tag color={status === 'operational' ? 'success' : 'processing'}>
          {status === 'operational' ? 'Hoạt động' : 'Đang xây dựng'}
        </Tag>
      ),
    },
    { title: 'Thứ tự', dataIndex: 'sequenceOrder', key: 'sequenceOrder', render: (text) => <span className="text-slate-600">{text}</span> },
    {
      title: 'Hành động', key: 'action', align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} className="text-indigo-600">Sửa</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.stationId)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  if (isLoadingStations) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
        <Typography.Text>Đang tải danh sách ga...</Typography.Text>
      </div>
    );
  }

  if (isErrorStations) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center text-red-600">
        <Typography.Text>Lỗi khi tải danh sách ga: {stationError?.message || "Lỗi không xác định"}</Typography.Text>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">Quản lý Ga</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Ga</Button>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={stationsApiResponse?.data || []}
          rowKey="stationId"
          pagination={{ pageSize: 5, className: 'mt-4' }}
          className="ant-table-custom"
          loading={isLoadingStations || addStationMutation.isPending || updateStationMutation.isPending || deleteStationMutation.isPending}
        />
      </div>
      <Modal
        title={editingStation ? 'Chỉnh sửa Ga' : 'Thêm Ga mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose 
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6 space-y-4"
          initialValues={{
            latitude: 10.7, 
            longitude: 106.6, 
            sequenceOrder: 1, 
            ...(editingStation ? { status: editingStation.status } : { status: 'under_construction' }),
          }}
        >
          <Form.Item name="name" label={<span className="font-semibold text-slate-700">Tên Ga</span>} rules={[{ required: true, message: 'Vui lòng nhập tên ga!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stationCode" label={<span className="font-semibold text-slate-700">Mã Ga</span>} rules={[{ required: true, message: 'Vui lòng nhập mã ga!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={<span className="font-semibold text-slate-700">Địa chỉ</span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="routeId" label={<span className="font-semibold text-slate-700">Thuộc Tuyến</span>} rules={[{ required: true, message: 'Vui lòng chọn tuyến!' }]}>
            <Select placeholder="Chọn tuyến đường">
              {initialRoutes.map(route => (
                <Select.Option key={route.routeId} value={route.routeId}>{route.routeName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="latitude" label={<span className="font-semibold text-slate-700">Vĩ độ</span>} rules={[{ required: true, type: 'number', message: 'Vui lòng nhập vĩ độ hợp lệ!' }]}>
                <InputNumber className="w-full" step={0.0001} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="longitude" label={<span className="font-semibold text-slate-700">Kinh độ</span>} rules={[{ required: true, type: 'number', message: 'Vui lòng nhập kinh độ hợp lệ!' }]}>
                <InputNumber className="w-full" step={0.0001} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="sequenceOrder" label={<span className="font-semibold text-slate-700">Thứ tự trên tuyến</span>} rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập thứ tự hợp lệ (tối thiểu 1)!' }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          {editingStation && ( 
            <Form.Item name="status" label={<span className="font-semibold text-slate-700">Trạng Thái</span>} rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="operational">Hoạt động</Select.Option>
                <Select.Option value="under_construction">Đang xây dựng</Select.Option>
              </Select>
            </Form.Item>
          )}

          <div className="text-right pt-2">
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addStationMutation.isPending || updateStationMutation.isPending} 
              >
                {editingStation ? 'Lưu thay đổi' : 'Thêm Ga'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManagement;