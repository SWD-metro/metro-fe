import React, { useState, useMemo, useEffect } from 'react';
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
  Divider,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import { StationsRequest, StationsResponse } from 'src/types/stations.type';
import { RoutesResponse, RoutesRequest } from 'src/types/routes.type';
import {
  useGetStationList,
  useAddStationMutation,
  useDeleteStationMutation,
} from 'src/queries/useStation';
import { useGetRouteList, useAddRouteMutation } from 'src/queries/useRoute'; 
import toast from 'react-hot-toast';

const ROUTE_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#f5222d'];

const StationManagement = () => {

  const {
    data: routesApiResponse,
    isLoading: isLoadingRoutes,
    isError: isErrorRoutes,
    error: routeError,
  } = useGetRouteList();
  
  const {
    data: stationsData,
    isLoading: isLoadingStations,
    isError: isErrorStations,
    error: stationError,
  } = useGetStationList();

  const addStationMutation = useAddStationMutation();
  const deleteStationMutation = useDeleteStationMutation();
  const addRouteMutation = useAddRouteMutation(); 

  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>();
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false); 
  const [stationForm] = Form.useForm();
  const [routeForm] = Form.useForm(); 
  const { modal } = AntdApp.useApp();

  const routes = useMemo(() => {
    return routesApiResponse?.data?.data ?? [];
  }, [routesApiResponse]);

  useEffect(() => {
    if (routes.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routes[0].routeId);
    }
  }, [routes, selectedRouteId]);

  const filteredStations = useMemo(() => {
    if (!stationsData?.data?.data || !selectedRouteId) return [];
    return stationsData.data.data
      .filter(station => station.routeId === selectedRouteId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }, [stationsData, selectedRouteId]);

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    const routeInfo = routes.find(r => r.routeId === selectedRouteId);
    if (!routeInfo) return null;

    return {
      ...routeInfo,
      color: ROUTE_COLORS[routes.indexOf(routeInfo) % ROUTE_COLORS.length],
      description: `Tuyến ${routeInfo.routeCode} với quãng đường ${routeInfo.distanceInKm} km`,
    };
  }, [routes, selectedRouteId]);

  const handleOpenStationModal = () => {
    stationForm.resetFields();
    stationForm.setFieldsValue({
      latitude: 10.7769,
      longitude: 106.7009,
      sequenceOrder: filteredStations.length + 1,
      routeId: selectedRouteId,
    });
    setIsStationModalOpen(true);
  };

  const handleCancelStationModal = () => {
    setIsStationModalOpen(false);
    stationForm.resetFields();
  };
  
  const handleOpenEditRouteModal = () => {};
  const handleDeleteRoute = (routeId: number, routeName: string) => {};
  
  const onFinishAddStation = (formValues: StationsRequest) => {
    addStationMutation.mutate(formValues, {
      onSuccess: () => {
        toast.success('Thêm ga thành công!');
        handleCancelStationModal();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Thêm ga thất bại';
        toast.error(errorMessage);
      }
    });
  };

  const handleDeleteStation = (stationId: number, stationName: string) => {
    modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ga "${stationName}"?`,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        deleteStationMutation.mutate(stationId, {
          onSuccess: () => toast.success('Xóa ga thành công!'),
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Xóa ga thất bại';
            toast.error(errorMessage);
          }
        });
      },
    });
  };

  const handleOpenRouteModal = () => {
    setIsRouteModalOpen(true);
  };

  const handleCancelRouteModal = () => {
    setIsRouteModalOpen(false);
    routeForm.resetFields();
  };

  const onFinishAddRoute = (formValues: RoutesRequest) => {
    addRouteMutation.mutate(formValues as any, {
        onSuccess: () => {
            toast.success('Thêm tuyến thành công!');
            handleCancelRouteModal();
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Thêm tuyến thất bại';
            toast.error(errorMessage);
        }
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
              onClick={() => handleDeleteStation(station.stationId, station.name)}
              size="small"
            >
              Xóa
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );

  if (isLoadingStations || isLoadingRoutes) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <Typography.Text>Đang tải dữ liệu...</Typography.Text>
      </div>
    );
  }

  if (isErrorStations || isErrorRoutes) {
    const errorMsg = (stationError || routeError)?.message || "Lỗi không xác định";
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-600">
        <Typography.Text>Lỗi khi tải dữ liệu: {errorMsg}</Typography.Text>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex-1 mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Quản lý các Ga trên Tuyến</h2>
          <div className="flex items-center gap-4">
            <Typography.Text>Chọn tuyến:</Typography.Text>
            <Select
              value={selectedRouteId}
              onChange={(value) => setSelectedRouteId(value)}
              style={{ minWidth: 300 }}
              size="large"
              placeholder="Vui lòng chọn một tuyến"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Button type="text" icon={<PlusOutlined />} block onClick={handleOpenRouteModal}>
                    Thêm Tuyến mới
                  </Button>
                </>
              )}
            >
              {routes.map((route, index) => (
                <Select.Option key={route.routeId} value={route.routeId}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length] }}
                    ></div>
                    {route.routeCode}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenStationModal} size="large" disabled={!selectedRouteId}>
          Thêm Ga
        </Button>
      </div>

      {selectedRoute && (
        <Card className="mb-6" style={{ borderColor: selectedRoute.color }}>
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: selectedRoute.color }}
              ></div>
              <div>
                <Typography.Title level={4} className="mb-1">
                  {selectedRoute.routeCode}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {selectedRoute.description} • {filteredStations.length} ga
                </Typography.Text>
              </div>
            </div>
            <Space>
                <Button icon={<EditOutlined />} onClick={handleOpenEditRouteModal}>
                    Sửa
                </Button>
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteRoute(selectedRoute.routeId, selectedRoute.routeName)}
                >
                    Xóa
                </Button>
            </Space>
          </div>
        </Card>
      )}

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
      <Modal
        title="Thêm Ga mới"
        open={isStationModalOpen}
        onCancel={handleCancelStationModal}
        footer={null}
        centered
        destroyOnClose
        width={600}
      >
        <Form
          form={stationForm}
          layout="vertical"
          onFinish={onFinishAddStation}
          className="mt-6"
        >
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
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length] }}
                    ></div>
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
              <Button onClick={handleCancelStationModal} size="large">Hủy</Button>
              <Button type="primary" htmlType="submit" loading={addStationMutation.isPending} size="large">Thêm Ga</Button>
            </Space>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Thêm Tuyến mới"
        open={isRouteModalOpen}
        onCancel={handleCancelRouteModal}
        footer={null}
        centered
        destroyOnClose
        width={600}
      >
        <Form
            form={routeForm}
            layout="vertical"
            onFinish={onFinishAddRoute}
            className="mt-6"
        >
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
                    <Button onClick={handleCancelRouteModal} size="large">Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={addRouteMutation.isPending} size="large">Thêm Tuyến</Button>
                </Space>
            </div>
        </Form>
      </Modal>
    </div>
  );
};

// Bọc StationManagement trong AntdApp để sử dụng được `modal.confirm` và các tính năng khác của AntD
const StationManagementPage = () => (
  <AntdApp>
    <StationManagement />
  </AntdApp>
);

export default StationManagementPage;
