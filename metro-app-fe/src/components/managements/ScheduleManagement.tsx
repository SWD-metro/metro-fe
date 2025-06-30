import React, { useState, useMemo } from 'react'; // Thêm useMemo
import {
  Table,
  TableProps,
  Button,
  Form,
  App as AntdApp,
  Select,
  Space,
  Modal,
  Typography,
  TimePicker,
  Row, // Thêm Row
  Col, // Thêm Col
} from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

import { useGetStationList } from 'src/queries/useStation';
import { StationsResponse } from 'src/types/stations.type';
import { SchedulesRequest, SchedulesResponse, Direction } from 'src/types/schedules.type';
import {
  useGetScheduleList,
  useAddScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from 'src/queries/useSchedule';
import { Content } from 'antd/es/layout/layout';

const { Option } = Select;

const ScheduleManagement = () => {
  const { modal } = AntdApp.useApp();
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<SchedulesResponse | null>(null);
  const [filteredInfo, setFilteredInfo] = useState<{ stationName?: string[] | null; direction?: string[] | null }>({});
  const { data: schedulesData, isLoading, isError, error } = useGetScheduleList();
  const { data: stationsData, isLoading: isLoadingStations, isError: isErrorStations, error: stationError } = useGetStationList();

  const addScheduleMutation = useAddScheduleMutation();
  const updateScheduleMutation = useUpdateScheduleMutation();
  const deleteScheduleMutation = useDeleteScheduleMutation();

  const showCreateModal = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: SchedulesResponse) => {
    setEditingSchedule(record);
    form.setFieldsValue({
      ...record,
      timeArrival: record.timeArrival ? dayjs(record.timeArrival, 'HH:mm:ss') : null,
      timeDeparture: record.timeDeparture ? dayjs(record.timeDeparture, 'HH:mm:ss') : null,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSchedule(null);
    form.resetFields();
  };

  const handleTableChange: TableProps<SchedulesResponse>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };



  const onFinish = (values: any) => {
    const formattedValues: SchedulesRequest = {
      stationId: values.stationId,
      direction: values.direction,
      timeArrival: values.timeArrival.format('HH:mm:ss'),
      timeDeparture: values.timeDeparture.format('HH:mm:ss'),
    };

    if (editingSchedule) {
      updateScheduleMutation.mutate(
        { id: editingSchedule.scheduleId, ...formattedValues },
        {
          onSuccess: () => {
            toast.success('Cập nhật lịch trình thành công!');
            handleCancel();
          },
          onError: (err: any) => {
            toast.error(`Lỗi khi cập nhật lịch trình: ${err.message || 'Vui lòng thử lại.'}`);
          },
        }
      );
    } else {
      addScheduleMutation.mutate(formattedValues, {
        onSuccess: () => {
          toast.success('Tạo lịch trình thành công!');
          handleCancel();
        },
        onError: (err: any) => {
          toast.error(`Lỗi khi tạo lịch trình: ${err.message || 'Vui lòng thử lại.'}`);
        },
      });
    }
  };

  const handleDeleteConfirm = (scheduleId: number) => {
    modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa lịch trình này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteScheduleMutation.mutate(scheduleId, {
          onSuccess: () => {
            toast.success('Xóa lịch trình thành công!');
          },
          onError: (err: any) => {
            toast.error(`Lỗi khi xóa lịch trình: ${err.message || 'Vui lòng thử lại.'}`);
          },
        });
      },
    });
  };

  const stationsOptions = useMemo(() => stationsData?.data?.data?.map((station: StationsResponse) => (
    <Option key={station.stationId} value={station.stationId}>
      {station.name}
    </Option>
  )) || [], [stationsData]);

  const scheduleDataSource = useMemo(() => {
    const data = Array.isArray(schedulesData?.data?.data)
        ? schedulesData.data.data
        : schedulesData?.data?.data ? [schedulesData.data.data] : [];
    return data;
  }, [schedulesData]);

  if (isLoading || isLoadingStations) {
    return <div className="flex justify-center items-center h-screen"><span>Đang tải dữ liệu...</span></div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen"><span>Lỗi tải dữ liệu lịch trình: {error?.message}</span></div>;
  }

  if (isErrorStations) {
    return <div className="flex justify-center items-center h-screen"><span>Lỗi tải dữ liệu ga: {stationError?.message}</span></div>;
  }

  const columns: TableProps<SchedulesResponse>['columns'] = [
    { title: 'Mã Lịch trình', dataIndex: 'scheduleId', key: 'scheduleId', width: 120, align: 'center' },
    { 
      title: 'Tên Ga', 
      dataIndex: 'stationName', 
      key: 'stationName', 
      width: 250,
      filters: (stationsData?.data?.data ?? []).map((station: StationsResponse) => ({ text: station.name, value: station.name })),
      filteredValue: filteredInfo.stationName || null,
      onFilter: (value, record) => record.stationName.includes(value as string),
      sorter: (a, b) => a.stationName.localeCompare(b.stationName),
    },
    { 
      title: 'Giờ Đến', 
      dataIndex: 'timeArrival', 
      key: 'timeArrival', 
      align: 'center',
      sorter: (a, b) => {
        if (!a.timeArrival) return 1; 
        if (!b.timeArrival) return -1;
        return a.timeArrival.localeCompare(b.timeArrival);
      },
    },
    { 
      title: 'Giờ Đi', 
      dataIndex: 'timeDeparture', 
      key: 'timeDeparture', 
      align: 'center',
      sorter: (a, b) => {
        if (!a.timeDeparture) return 1; 
        if (!b.timeDeparture) return -1;
        return a.timeDeparture.localeCompare(b.timeDeparture);
      },
    },
    {
      title: 'Chiều',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => direction === Direction.FORWARD ? 'Chiều đi' : 'Chiều về',
      filters: [
        { text: 'Chiều đi', value: Direction.FORWARD },
        { text: 'Chiều về', value: Direction.BACKWARD },
      ],
      filteredValue: filteredInfo.direction || null,
      onFilter: (value, record) => record.direction.includes(value as string),
    },
    { title: 'Ngày Tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => text ? new Date(text).toLocaleDateString('vi-VN') : '' },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirm(record.scheduleId as number)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Content className="p-4 sm:p-6 lg:p-8 h-screen">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Quản lý Lịch trình Tàu</h2>
            <Typography.Text type="secondary">
              Quản lý thời gian biểu và lịch trình di chuyển của các chuyến tàu qua từng ga.
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            size="large"
          >
            Tạo Lịch trình Mới
          </Button>
        </div>
        <div className="mb-4">
            <Button onClick={clearFilters}>Xóa bộ lọc</Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={scheduleDataSource}
            rowKey="scheduleId"
            pagination={{ pageSize: 11, className: 'mt-4' }}
            loading={isLoading || isLoadingStations || deleteScheduleMutation.isPending}
            onChange={handleTableChange} // Thêm props onChange
          />
        </div>
      </div>

      <Modal
        title={editingSchedule ? "Chỉnh sửa Lịch trình" : "Tạo Lịch trình Mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          name="schedule_form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            direction: Direction.FORWARD,
          }}
        >
          <Form.Item
            name="stationId"
            label="Tên Ga"
            rules={[{ required: true, message: 'Vui lòng chọn ga!' }]}
          >
            <Select placeholder="Chọn ga" showSearch optionFilterProp="children">
              {stationsOptions}
            </Select>
          </Form.Item>

          <Form.Item
            name="timeArrival"
            label="Giờ Đến"
            rules={[{ required: true, message: 'Vui lòng chọn giờ đến!' }]}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="timeDeparture"
            label="Giờ Đi"
            rules={[{ required: true, message: 'Vui lòng chọn giờ đi!' }]}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="direction"
            label="Chiều di chuyển"
            rules={[{ required: true, message: 'Vui lòng chọn chiều di chuyển!' }]}
          >
            <Select placeholder="Chọn chiều di chuyển">
              <Option value={Direction.FORWARD}>Chiều đi</Option>
              <Option value={Direction.BACKWARD}>Chiều về</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addScheduleMutation.isPending || updateScheduleMutation.isPending}>
              {editingSchedule ? 'Lưu thay đổi' : 'Tạo Lịch trình'}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default ScheduleManagement;