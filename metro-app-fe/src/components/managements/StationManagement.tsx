import React, { useState, useMemo } from 'react';

// Giả sử đây là dữ liệu tĩnh hoặc được fetch từ nơi khác
const initialRoutes = [
  { routeId: 1, routeName: 'Tuyến số 1 (Bến Thành - Suối Tiên)', description: 'Tuyến Metro đầu tiên của TP.HCM', color: '#1890ff' },
  { routeId: 2, routeName: 'Tuyến số 2 (Bến Thành - Tham Lương)', description: 'Tuyến Metro thứ hai của TP.HCM', color: '#52c41a' },
  { routeId: 3, routeName: 'Tuyến số 3 (Quận 1 - Gò Vấp)', description: 'Tuyến Metro thứ ba của TP.HCM', color: '#fa8c16' },
  { routeId: 4, routeName: 'Tuyến số 4 (Thủ Đức - Bình Chánh)', description: 'Tuyến Metro thứ tư của TP.HCM', color: '#eb2f96' },
];

import { StationsRequest, StationsResponse } from 'src/types/stations.type';

// Import Ant Design components
import {
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
  Card,
  Badge,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';

// Import React Query hooks
import {
  useGetStationList,
  useAddStationMutation,
  useDeleteStationMutation,
} from 'src/queries/useStation';

const StationManagement = () => {
  const {
    data: stations,
    isLoading: isLoadingStations,
    isError: isErrorStations,
    error: stationError,
  } = useGetStationList();

  const addStationMutation = useAddStationMutation();
  const deleteStationMutation = useDeleteStationMutation();

  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { modal, message } = AntdApp.useApp();

  const filteredStations = useMemo(() => {
    if (!stations?.data?.data) return [];
    return stations.data.data
      .filter(station => station.routeId === selectedRouteId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }, [stations, selectedRouteId]);

  const selectedRoute = initialRoutes.find(route => route.routeId === selectedRouteId);

  const handleOpenModal = () => {
    form.resetFields();
    form.setFieldsValue({
      // Dữ liệu mặc định cho form
      latitude: 10.7769, // Tọa độ trung tâm TP.HCM
      longitude: 106.7009,
      sequenceOrder: filteredStations.length + 1,
      routeId: selectedRouteId,
      // Không cần set 'status' vì nó không có trong form và không được gửi đi
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // --- HÀM ADD STATION ĐÃ ĐƯỢC VIẾT LẠI ---
  const onFinish = (formValues: any) => {
    // Tường minh xây dựng payload chỉ với các trường yêu cầu từ param
    const newStationPayload: StationsRequest = {
      routeId: formValues.routeId,
      stationCode: formValues.stationCode,
      name: formValues.name,
      address: formValues.address,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
      sequenceOrder: formValues.sequenceOrder,
    };

    // Log payload để kiểm tra trước khi gửi, rất hữu ích cho việc debug
    console.log('Submitting payload to create station:', newStationPayload);

    addStationMutation.mutate(newStationPayload, {
      onSuccess: () => {
        message.success('Thêm ga thành công!');
        handleCancel();
      },
      onError: (error: any) => {
        // Hiển thị thông báo lỗi chi tiết hơn từ API
        const errorMessage = error?.response?.data?.message || error.message || 'Lỗi không xác định';
        message.error(`Thêm ga thất bại: ${errorMessage}`);
      }
    });
  };

  const handleDelete = (stationId: number, stationName: string) => {
    modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ga "${stationName}"?`,
      content: 'Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn ga khỏi hệ thống.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        deleteStationMutation.mutate(stationId, {
          onSuccess: () => {
            message.success('Xóa ga thành công!');
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error.message || 'Lỗi không xác định';
            message.error(`Xóa ga thất bại: ${errorMessage}`);
          }
        });
      },
    });
  };

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

  const StationNode = ({ station, isLast }: { station: StationsResponse; isLast: boolean }) => (
    <div className="flex items-center mb-4">
      <div className="flex flex-col items-center mr-4">
        <div
          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: selectedRoute?.color || '#1890ff',
            backgroundColor: station.status === 'open' || station.status === 'operational'
              ? selectedRoute?.color || '#1890ff'
              : '#fff'
          }}
        >
          {(station.status === 'open' || station.status === 'operational') && (
            <div className="w-2 h-2 rounded-full bg-white"></div>
          )}
        </div>
        {!isLast && (
          <div
            className="w-0.5 h-16 mt-1"
            style={{ backgroundColor: selectedRoute?.color || '#1890ff' }}
          ></div>
        )}
      </div>
      <Card
        className="flex-1 shadow-sm hover:shadow-md transition-shadow"
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <EnvironmentOutlined style={{ color: selectedRoute?.color || '#1890ff' }} />
              <Typography.Text strong className="text-lg">
                {station.name}
              </Typography.Text>
              <Badge count={station.sequenceOrder} style={{ backgroundColor: selectedRoute?.color || '#1890ff' }} />
            </div>
            <Typography.Text type="secondary" className="block mb-1">
              Mã ga: {station.stationCode}
            </Typography.Text>
            <Typography.Text type="secondary" className="block mb-2">
              {station.address}
            </Typography.Text>
            <div className="flex items-center gap-2">
              {renderStationStatus(station.status)}
              <Typography.Text type="secondary" className="text-xs">
                Tọa độ: {station.latitude?.toFixed(4)}, {station.longitude?.toFixed(4)}
              </Typography.Text>
            </div>
          </div>
          <Space>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(station.stationId, station.name)}
              size="small"
            >
              Xóa
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex-1 mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Sơ đồ Tuyến Metro</h2>
          <div className="flex items-center gap-4">
            <Typography.Text>Chọn tuyến:</Typography.Text>
            <Select
              value={selectedRouteId}
              onChange={(value) => setSelectedRouteId(value)}
              style={{ minWidth: 300 }}
              size="large"
            >
              {initialRoutes.map(route => (
                <Select.Option key={route.routeId} value={route.routeId}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    ></div>
                    {route.routeName}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          size="large"
        >
          Thêm Ga
        </Button>
      </div>

      {/* Thông tin tuyến */}
      {selectedRoute && (
        <Card className="mb-6" style={{ borderColor: selectedRoute.color }}>
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: selectedRoute.color }}
            ></div>
            <div>
              <Typography.Title level={4} className="mb-1">
                {selectedRoute.routeName}
              </Typography.Title>
              <Typography.Text type="secondary">
                {selectedRoute.description} • {filteredStations.length} ga
              </Typography.Text>
            </div>
          </div>
        </Card>
      )}

      {/* Sơ đồ ga */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Typography.Title level={5} className="mb-4 text-center">
          Sơ đồ các ga trên tuyến
        </Typography.Title>

        {filteredStations.length === 0 ? (
          <div className="text-center py-8">
            <Typography.Text type="secondary">
              Chưa có ga nào trên tuyến này. Hãy thêm ga mới!
            </Typography.Text>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {filteredStations.map((station, index) => (
              <StationNode
                key={station.stationId}
                station={station}
                isLast={index === filteredStations.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal thêm ga */}
      <Modal
        title="Thêm Ga mới"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-slate-700">Tên Ga</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên ga!' }]}
          >
            <Input placeholder="VD: Ga Bến Thành" />
          </Form.Item>

          <Form.Item
            name="stationCode"
            label={<span className="font-semibold text-slate-700">Mã Ga</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mã ga!' }]}
          >
            <Input placeholder="VD: BT01" />
          </Form.Item>

          <Form.Item
            name="address"
            label={<span className="font-semibold text-slate-700">Địa chỉ</span>}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết của ga" />
          </Form.Item>

          <Form.Item
            name="routeId"
            label={<span className="font-semibold text-slate-700">Thuộc Tuyến</span>}
            rules={[{ required: true, message: 'Vui lòng chọn tuyến!' }]}
          >
            <Select placeholder="Chọn tuyến đường">
              {initialRoutes.map(route => (
                <Select.Option key={route.routeId} value={route.routeId}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    ></div>
                    {route.routeName}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label={<span className="font-semibold text-slate-700">Vĩ độ</span>}
                rules={[{ required: true, type: 'number', message: 'Vui lòng nhập vĩ độ hợp lệ!' }]}
              >
                <InputNumber className="w-full" step={0.0001} placeholder="10.7xxx" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label={<span className="font-semibold text-slate-700">Kinh độ</span>}
                rules={[{ required: true, type: 'number', message: 'Vui lòng nhập kinh độ hợp lệ!' }]}
              >
                <InputNumber className="w-full" step={0.0001} placeholder="106.6xxx" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="sequenceOrder"
            label={<span className="font-semibold text-slate-700">Thứ tự trên tuyến</span>}
            rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập thứ tự hợp lệ (tối thiểu 1)!' }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <div className="text-right pt-4 border-t">
            <Space>
              <Button onClick={handleCancel} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addStationMutation.isPending}
                size="large"
              >
                Thêm Ga
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManagement;