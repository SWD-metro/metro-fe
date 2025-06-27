import React, { useState, useMemo, useEffect } from 'react';
import {
  Select, Button, Space, App as AntdApp, Typography, Card, Divider,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { StationsRequest, StationsResponse } from 'src/types/stations.type';
import { RoutesResponse, RoutesRequest } from 'src/types/routes.type';
import {
  useGetStationList,
  useAddStationMutation,
  useDeleteStationMutation,
} from 'src/queries/useStation';
import { useGetRouteList, useAddRouteMutation, useDeleteRouteMutation } from 'src/queries/useRoute';
import toast from 'react-hot-toast';
import { AddStationModal, AddRouteModal, StationNode } from './StationComponents';

const ROUTE_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#f5222d'];

const StationManagement = () => {
  const { data: routesApiResponse, isLoading: isLoadingRoutes, isError: isErrorRoutes, error: routeError } = useGetRouteList();
  const { data: stationsData, isLoading: isLoadingStations, isError: isErrorStations, error: stationError } = useGetStationList();

  const addStationMutation = useAddStationMutation();
  const deleteStationMutation = useDeleteStationMutation();
  const addRouteMutation = useAddRouteMutation();
  const deleteRouteMutation = useDeleteRouteMutation();

  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>();
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const { modal } = AntdApp.useApp();

  const routes = useMemo(() => routesApiResponse?.data?.data ?? [], [routesApiResponse]);

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

  const handleOpenStationModal = () => setIsStationModalOpen(true);
  const handleCancelStationModal = () => setIsStationModalOpen(false);
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
      okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
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

  const handleOpenRouteModal = () => setIsRouteModalOpen(true);
  const handleCancelRouteModal = () => setIsRouteModalOpen(false);
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
  const handleOpenEditRouteModal = () => { };
  const handleDeleteRoute = (routeId: number, routeName: string) => {
    const stationsOnThisRoute = stationsData?.data?.data?.some((station: StationsResponse) => station.routeId === routeId);
    if (stationsOnThisRoute) {
      toast.error('Không thể xóa tuyến này vì vẫn còn ga trên tuyến. Vui lòng xóa hết các ga trước.');
      return;
    }
    modal.confirm({
      title: `Bạn có chắc chắn muốn xóa tuyến "${routeName}"?`,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa Tuyến', okType: 'danger', cancelText: 'Hủy',
      onOk: () => {
        deleteRouteMutation.mutate(routeId, {
          onSuccess: () => {
            toast.success(`Xóa tuyến "${routeName}" thành công!`);
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Xóa tuyến thất bại';
            toast.error(errorMessage);
          }
        });
      },
    });
  };

  if (isLoadingStations || isLoadingRoutes) {
    return <div className="bg-white rounded-xl shadow-md p-6 text-center"><Typography.Text>Đang tải dữ liệu...</Typography.Text></div>;
  }
  if (isErrorStations || isErrorRoutes) {
    const errorMsg = (stationError || routeError)?.message || "Lỗi không xác định";
    return <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-600"><Typography.Text>Lỗi khi tải dữ liệu: {errorMsg}</Typography.Text></div>;
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
                  <Button type="text" icon={<PlusOutlined />} block onClick={handleOpenRouteModal}>Thêm Tuyến mới</Button>
                </>
              )}
            >
              {routes.map((route, index) => (
                <Select.Option key={route.routeId} value={route.routeId}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length] }}></div>
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
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedRoute.color }}></div>
              <div>
                <Typography.Title level={4} className="mb-1">{selectedRoute.routeCode}</Typography.Title>
                <Typography.Text type="secondary">{selectedRoute.description} • {filteredStations.length} ga</Typography.Text>
              </div>
            </div>
            <Space>
              <Button icon={<EditOutlined />} onClick={handleOpenEditRouteModal}>Sửa</Button>
              <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteRoute(selectedRoute.routeId, selectedRoute.routeName)}>Xóa</Button>
            </Space>
          </div>
        </Card>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <Typography.Title level={5} className="mb-4 text-center">Sơ đồ các ga trên tuyến</Typography.Title>
        {filteredStations.length === 0 ? (
          <div className="text-center py-8">
            <Typography.Text type="secondary">Chưa có ga nào trên tuyến này. Hãy thêm ga mới!</Typography.Text>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {filteredStations.map((station, index) => (
              <StationNode
                key={station.stationId}
                station={station}
                isLast={index === filteredStations.length - 1}
                color={selectedRoute?.color || '#1890ff'}
                onDelete={handleDeleteStation}
              />
            ))}
          </div>
        )}
      </div>

      <AddStationModal
        open={isStationModalOpen}
        onCancel={handleCancelStationModal}
        onFinish={onFinishAddStation}
        isPending={addStationMutation.isPending}
        routes={routes}
        initialValues={{
          latitude: 10.7769,
          longitude: 106.7009,
          sequenceOrder: filteredStations.length + 1,
          routeId: selectedRouteId,
        }}
      />

      <AddRouteModal
        open={isRouteModalOpen}
        onCancel={handleCancelRouteModal}
        onFinish={onFinishAddRoute}
        isPending={addRouteMutation.isPending}
      />
    </div>
  );
};

const StationManagementPage = () => (
  <AntdApp>
    <StationManagement />
  </AntdApp>
);

export default StationManagementPage;