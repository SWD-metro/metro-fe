import React, { useState } from 'react';
import { FareMatrixRequest, FareMatrixResponse } from 'src/types/fares.type';
import { useCreateTicketFareMatrixMutation, useDeleteTicketFareMatrixMutation, useGetFareMatricesList } from 'src/queries/useTicket';
import { Table, TableProps, Button, Form, Input, InputNumber, App as AntdApp, Select, Space, Modal, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'; // Import ExclamationCircleOutlined
import { useGetStationList } from 'src/queries/useStation';
import { StationsResponse } from 'src/types/stations.type';
import toast from 'react-hot-toast';

const { Option } = Select;

const FareManagement = () => {
  const { modal } = AntdApp.useApp();
  const { data: fareMatrices, isLoading, isError, error, refetch } = useGetFareMatricesList();
  const { data: stationsData, isLoading: isLoadingStations, isError: isErrorStations, error: stationError } = useGetStationList();
  const createTicketFareMatrixMutation = useCreateTicketFareMatrixMutation();
  const deleteTicketFareMatrixMutation = useDeleteTicketFareMatrixMutation();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinishCreateFareMatrix = (formValues: FareMatrixRequest) => {
    createTicketFareMatrixMutation.mutate(formValues, {
      onSuccess: () => {
        toast.success('Tạo giá vé đơn thành công!');
        form.resetFields();
        refetch();
        setIsModalVisible(false);
      },
      onError: (err: any) => {
        toast.error(`Lỗi khi tạo giá vé đơn: ${err.message || 'Vui lòng thử lại.'}`);
        console.error('Lỗi khi tạo giá vé đơn:', err);
      },
    });
  };

  const handleDeleteConfirm = (fareMatrixId: number) => {
    modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa ma trận giá này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteTicketFareMatrixMutation.mutate(fareMatrixId, {
          onSuccess: () => {
            toast.success('Xóa ma trận giá thành công!');
            refetch();
          },
          onError: (err: any) => {
            toast.error(`Lỗi khi xóa ma trận giá: ${err.message || 'Vui lòng thử lại.'}`);
          },
        });
      },
      onCancel() {
      },
    });
  };

  if (isLoading || isLoadingStations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Lỗi tải dữ liệu giá vé đơn: {error.message}</span>
      </div>
    );
  }

  if (isErrorStations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Lỗi tải dữ liệu ga: {stationError.message}</span>
      </div>
    );
  }

  const getStationName = (stationId: number) => {
    const station = stationsData?.data?.data?.find((s: StationsResponse) => s.stationId === stationId);
    return station ? station.name : `Không tìm thấy ga (ID: ${stationId})`;
  };

  const columns: TableProps<FareMatrixResponse>['columns'] = [
    { title: 'Mã vé', dataIndex: 'fareMatrixId', key: 'fareMatrixId', width: 150, align: 'center' },
    {
      title: 'Ga Bắt Đầu',
      dataIndex: 'startStationId',
      key: 'startStationId',
      width: 250,
      render: (text) => getStationName(text),
    },
    {
      title: 'Ga Kết Thúc',
      dataIndex: 'endStationId',
      key: 'endStationId',
      width: 250,
      render: (text) => getStationName(text),
    },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (text) => `${text} VND` },
    { title: 'Tên Ma trận giá', dataIndex: 'name', key: 'name' },
    { title: 'Ngày Tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleDateString('vi-VN') },
    { title: 'Ngày Cập Nhật', dataIndex: 'updatedAt', key: 'updatedAt', render: (text) => new Date(text).toLocaleDateString('vi-VN') },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirm(record.fareMatrixId as number)} 
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const stationsOptions = stationsData?.data?.data?.map((station: StationsResponse) => (
    <Option key={station.stationId} value={station.stationId}>
      {station.name}
    </Option>
  )) || [];

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Quản lý Giá Vé Đơn</h2>
            <Typography.Text type="secondary">
              Quản lý các cấu hình giá vé đơn giữa các ga trong hệ thống metro.
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            size="large"
          >
            Tạo Ma trận Giá Mới
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={Array.isArray(fareMatrices?.data?.data) ? fareMatrices.data.data : fareMatrices?.data?.data ? [fareMatrices.data.data] : []}
            rowKey="fareMatrixId"
            pagination={{ pageSize: 10, className: 'mt-4' }}
            loading={isLoading || isLoadingStations}
          />
        </div>
      </div>

      <Modal
        title="Tạo Ma trận Giá Mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="create_fare_matrix"
          layout="vertical"
          onFinish={onFinishCreateFareMatrix}
          initialValues={{ price: 0 }}
        >
          <Form.Item
            name="name"
            label="Tên Ma trận giá"
            rules={[{ required: true, message: 'Vui lòng nhập tên ma trận giá!' }]}
          >
            <Input placeholder="Ví dụ: BXMD-TDU" />
          </Form.Item>

          <Form.Item
            name="startStationId"
            label="Ga Bắt Đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ga bắt đầu!' }]}
          >
            <Select placeholder="Chọn ga bắt đầu">
              {stationsOptions}
            </Select>
          </Form.Item>

          <Form.Item
            name="endStationId"
            label="Ga Kết Thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ga kết thúc!' }]}
          >
            <Select placeholder="Chọn ga kết thúc">
              {stationsOptions}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá Vé"
            rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }, { type: 'number', min: 0, message: 'Giá vé phải là số dương!' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
              placeholder="Nhập giá vé"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createTicketFareMatrixMutation.isPending}>
              Tạo Ma trận Giá
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FareManagement;