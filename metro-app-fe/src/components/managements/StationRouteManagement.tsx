import React, { useState, useMemo, useEffect } from 'react';
import {
  Select, Button, Space, App as AntdApp, Typography, Card, Divider,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { StationRouteRequest, StationsResponse } from 'src/types/stations.type';
import {  RoutesRequest } from 'src/types/routes.type';
import {
  useGetStationRoutesByRouteId,
  useCreateStationRouteMutation,
  useDeleteStationRouteMutation,
  useReorderStationRouteAfterDeleteMutation,
  useUpdateStationRouteMutation,
  useUpdateStationRouteStatusMutation,
} from 'src/queries/useStationRoute';
import { useGetRouteList, useAddRouteMutation, useDeleteRouteMutation } from 'src/queries/useRoute';
import toast from 'react-hot-toast';
import { AddStationToRouteModal, AddRouteModal, StationNode, EditStationInRouteModal } from './StationComponents';
import { Content } from 'antd/es/layout/layout';

const ROUTE_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#f5222d'];

const StationRouteManagement = () => {
  const { data: routesApiResponse, isLoading: isLoadingRoutes, isError: isErrorRoutes, error: routeError } = useGetRouteList();
  
  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>();
  
  // Use station route APIs instead of station APIs
  const { data: stationRoutesData, isLoading: isLoadingStationRoutes, isError: isErrorStationRoutes, error: stationRouteError } = useGetStationRoutesByRouteId(selectedRouteId || 0);

  const createStationRouteMutation = useCreateStationRouteMutation();
  const deleteStationRouteMutation = useDeleteStationRouteMutation();
  const reorderStationRouteAfterDeleteMutation = useReorderStationRouteAfterDeleteMutation();
  const updateStationRouteMutation = useUpdateStationRouteMutation();
  const updateStationRouteStatusMutation = useUpdateStationRouteStatusMutation();
  const addRouteMutation = useAddRouteMutation();
  const deleteRouteMutation = useDeleteRouteMutation();

  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isEditStationModalOpen, setIsEditStationModalOpen] = useState(false);
  const [editingStationRoute, setEditingStationRoute] = useState<{
    id: number;
    stationId: number;
    sequenceOrder: number;
    status: string;
  } | null>(null);
  
  const { modal } = AntdApp.useApp();

  const routes = useMemo(() => routesApiResponse?.data?.data ?? [], [routesApiResponse]);

  useEffect(() => {
    if (routes.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routes[0].routeId);
    }
  }, [routes, selectedRouteId]);

  // Update to use station routes data instead of stations data
  const filteredStationRoutes = useMemo(() => {
    if (!stationRoutesData || !selectedRouteId) return [];
    return stationRoutesData
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }, [stationRoutesData, selectedRouteId]);

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

  // Get existing station IDs and next sequence order for the modal
  const existingStationIds = useMemo(() => {
    return filteredStationRoutes.map(sr => sr.stationsResponse.stationId);
  }, [filteredStationRoutes]);

  const nextSequenceOrder = useMemo(() => {
    return filteredStationRoutes.length + 1;
  }, [filteredStationRoutes]);

  const handleOpenStationModal = () => setIsStationModalOpen(true);
  const handleCancelStationModal = () => setIsStationModalOpen(false);
  
  // Update to use station route creation instead of station creation
  const onFinishAddStation = (formValues: StationRouteRequest) => {
    createStationRouteMutation.mutate(formValues, {
      onSuccess: () => {
        toast.success('Thêm ga vào tuyến thành công!');
        handleCancelStationModal();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Thêm ga vào tuyến thất bại';
        toast.error(errorMessage);
      }
    });
  };

  // Handle editing station in route
  const handleEditStation = (stationRouteId: number) => {
    const stationRoute = filteredStationRoutes.find(sr => sr.id === stationRouteId);
    if (stationRoute) {
      setEditingStationRoute({
        id: stationRouteId,
        stationId: stationRoute.stationsResponse.stationId,
        sequenceOrder: stationRoute.sequenceOrder,
        status: stationRoute.status
      });
      setIsEditStationModalOpen(true);
    }
  };

  const handleCancelEditStation = () => {
    setIsEditStationModalOpen(false);
    setEditingStationRoute(null);
  };

  const onFinishEditStation = async (values: { sequenceOrder: number; status: string }) => {
    if (!editingStationRoute) return;

    try {
      // Kiểm tra xem có thay đổi gì không
      const hasSequenceOrderChanged = values.sequenceOrder !== editingStationRoute.sequenceOrder;
      const hasStatusChanged = values.status !== editingStationRoute.status;

      if (!hasSequenceOrderChanged && !hasStatusChanged) {
        toast.info('Không có thay đổi nào để cập nhật');
        handleCancelEditStation();
        return;
      }

      const updatePromises: Promise<any>[] = [];

      // Nếu thay đổi vị trí, gọi API cập nhật vị trí
      if (hasSequenceOrderChanged) {
        const updatePositionData: StationRouteRequest = {
          stationId: editingStationRoute.stationId,
          routeId: selectedRouteId!,
          sequenceOrder: values.sequenceOrder,
        };

        const updatePositionPromise = updateStationRouteMutation.mutateAsync({
          id: editingStationRoute.id,
          stationRoute: updatePositionData
        });
        updatePromises.push(updatePositionPromise);
      }

      // Nếu thay đổi status, gọi API cập nhật status
      if (hasStatusChanged) {
        const updateStatusPromise = updateStationRouteStatusMutation.mutateAsync({
          id: editingStationRoute.id,
          status: values.status as any
        });
        updatePromises.push(updateStatusPromise);
      }

      // Chờ tất cả API hoàn thành
      await Promise.all(updatePromises);

      toast.success('Cập nhật ga trong tuyến thành công!');
      handleCancelEditStation();

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Cập nhật ga trong tuyến thất bại';
      toast.error(errorMessage);
    }
  };
  
  // Update to use station route deletion and reordering
  const handleDeleteStation = (stationRouteId: number, stationName: string) => {
    modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ga "${stationName}" khỏi tuyến?`,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
      onOk: () => {
        deleteStationRouteMutation.mutate(stationRouteId, {
          onSuccess: () => {
            toast.success('Xóa ga khỏi tuyến thành công!');
            // Reorder station routes after deletion
            if (selectedRouteId) {
              reorderStationRouteAfterDeleteMutation.mutate(selectedRouteId);
            }
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Xóa ga khỏi tuyến thất bại';
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
  
  // Update to check station routes instead of stations
  const handleDeleteRoute = (routeId: number, routeName: string) => {
    const stationRoutesOnThisRoute = filteredStationRoutes.length > 0;
    if (stationRoutesOnThisRoute) {
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

  // Update loading and error states
  if (isLoadingStationRoutes || isLoadingRoutes) {
    return <div className="bg-white rounded-xl shadow-md p-6 text-center"><Typography.Text>Đang tải dữ liệu...</Typography.Text></div>;
  }
  if (isErrorStationRoutes || isErrorRoutes) {
    const errorMsg = (stationRouteError || routeError)?.message || "Lỗi không xác định";
    return <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-600"><Typography.Text>Lỗi khi tải dữ liệu: {errorMsg}</Typography.Text></div>;
  }

  return (
    <Content className="p-4 sm:p-6 lg:p-8 w-screen h-screen">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-full ">
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleOpenStationModal} 
            size="large"
            disabled={!selectedRouteId}
          >
            Thêm Ga vào Tuyến
          </Button>
        </div>

        {selectedRoute && (
          <Card className="mb-6" style={{ borderColor: selectedRoute.color }}>
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedRoute.color }}></div>
                <div>
                  <Typography.Title level={4} className="mb-1">{selectedRoute.routeCode}</Typography.Title>
                  <Typography.Text type="secondary">{selectedRoute.description} • {filteredStationRoutes.length} ga</Typography.Text>
                </div>
              </div>
              <Space>
                <Button icon={<EditOutlined />} onClick={handleOpenEditRouteModal}>Sửa</Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteRoute(selectedRoute.routeId, selectedRoute.routeName)}>Xóa</Button>
              </Space>
            </div>
          </Card>
        )}

        <div className="bg-gray-50 rounded-lg p-4 ">
          <Typography.Title level={5} className="mb-4 text-center">Sơ đồ các ga trên tuyến</Typography.Title>
          {filteredStationRoutes.length === 0 ? (
            <div className="text-center py-8">
              <Typography.Text type="secondary">Chưa có ga nào trên tuyến này. Hãy thêm ga mới!</Typography.Text>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto pr-2">
              {filteredStationRoutes.map((stationRoute, index) => (
                <StationNode
                  key={stationRoute.id}
                  station={stationRoute}
                  isLast={index === filteredStationRoutes.length - 1}
                  color={selectedRoute?.color || '#1890ff'}
                  onDelete={(stationId, stationName) => handleDeleteStation(stationRoute.id, stationName)}
                  onEdit={handleEditStation}
                  stationRouteId={stationRoute.id}
                />
              ))}
            </div>
          )}
        </div>

        <AddStationToRouteModal
          open={isStationModalOpen}
          onCancel={handleCancelStationModal}
          onFinish={onFinishAddStation}
          isPending={createStationRouteMutation.isPending}
          routeId={selectedRouteId || 0}
          existingStationIds={existingStationIds}
          nextSequenceOrder={nextSequenceOrder}
        />

        <EditStationInRouteModal
          open={isEditStationModalOpen}
          onCancel={handleCancelEditStation}
          onFinish={onFinishEditStation}
          isPending={updateStationRouteMutation.isPending || updateStationRouteStatusMutation.isPending}
          station={editingStationRoute ? filteredStationRoutes.find(sr => sr.id === editingStationRoute.id)?.stationsResponse || null : null}
          currentSequenceOrder={editingStationRoute?.sequenceOrder || 1}
          currentStatus={editingStationRoute?.status || 'active'}
        />

        <AddRouteModal
          open={isRouteModalOpen}
          onCancel={handleCancelRouteModal}
          onFinish={onFinishAddRoute}
          isPending={addRouteMutation.isPending}
        />
      </div>
    </Content>
  );
};


export default StationRouteManagement;