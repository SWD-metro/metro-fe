import React, { useState } from 'react';
import {
    Table,
    Modal,
    Form,
    Input,
    // Bỏ Select vì người dùng tự nhập
    Button,
    Space,
    Tag,
    App as AntdApp,
    Typography,
    Row,
    Col,
    Card,
    InputNumber, // Sẽ dùng InputNumber cho validityDuration
    Switch,
} from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import {
    useGetTicketTypeList,
    useCreateTicketTypeMutation,
    useDeleteTicketTypeMutation,
} from 'src/queries/useTicket';
import { TicketTypeRequest, TicketTypeResponse } from 'src/types/tickets.type';
import toast from 'react-hot-toast';

// KHÔNG CẦN VALIDITY_DURATIONS NẾU NGƯỜI DÙNG TỰ NHẬP HOÀN TOÀN
// Tuy nhiên, nếu bạn vẫn muốn gợi ý, bạn có thể giữ nó và dùng cho placeholder hoặc hướng dẫn.
// Nếu bạn muốn người dùng CHỌN và KHÔNG TỰ NHẬP, thì phải dùng Select và giữ lại VALIDITY_DURATIONS.
// Tôi sẽ giữ nó để minh họa cho hàm render trong bảng.
const VALIDITY_DURATIONS_LABELS = [
    { value: 0, label: 'Vé đơn' },
    { value: 1, label: 'Vé 1 ngày' },
    { value: 3, label: 'Vé 3 ngày' },
    { value: 7, label: 'Vé tuần (7 ngày)' },
    { value: 30, label: 'Vé tháng (30 ngày)' },
];

const TicketTypeManagement = () => {
    const {
        data: ticketTypesResponse,
        isLoading: isLoadingTicketTypes,
        isError: isErrorTicketTypes,
        error: ticketTypeError,
    } = useGetTicketTypeList();

    const createTicketTypeMutation = useCreateTicketTypeMutation();
    const deleteTicketTypeMutation = useDeleteTicketTypeMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { modal } = AntdApp.useApp();

    const handleOpenModal = () => {
        form.resetFields();
        form.setFieldsValue({
            isActive: true,
            price: 0,
            validityDuration: 1, // Giá trị mặc định là số nguyên (ví dụ: 1 ngày)
            description: '', // Đảm bảo có giá trị mặc định cho description
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = (values: any) => {
        const payload: TicketTypeRequest = {
            name: values.name,
            description: values.description || '',
            price: values.price,
            isActive: values.isActive,
            validityDuration: values.validityDuration, // Đây sẽ là số nguyên từ InputNumber
        };

        console.log('Submitting payload:', payload);

        createTicketTypeMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Thêm loại vé thành công!');
                handleCancel();
                // Invalidate queries here if using react-query to refetch list
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || error.message || 'Lỗi không xác định';
                toast.error(`Thêm loại vé thất bại: ${errorMessage}`);
            },
        });
    };

    const handleDelete = (ticketTypeId: number, ticketTypeName: string) => {
        modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa loại vé này?',
            content: (
                <div>
                    <p>Loại vé: <strong>{ticketTypeName}</strong></p>
                    <p className="text-red-500">⚠️ Thao tác này không thể hoàn tác!</p>
                </div>
            ),
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                deleteTicketTypeMutation.mutate(ticketTypeId, {
                    onSuccess: () => {
                        toast.success('Xóa loại vé thành công!');
                        // Invalidate queries here if using react-query
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.message || error.message || 'Lỗi không xác định';
                        toast.error(`Xóa loại vé thất bại: ${errorMessage}`);
                    },
                });
            },
        });
    };

    const renderIsActive = (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
    );

    // Hàm để hiển thị thời hạn sử dụng trong bảng
    const renderValidityDuration = (durationValue: number) => {
        const found = VALIDITY_DURATIONS_LABELS.find(d => d.value === durationValue);
        return found ? found.label : `${durationValue} ngày`;
    };

    const columns: TableProps<TicketTypeResponse>['columns'] = [
        {
            title: 'Tên Loại Vé',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text) => <span className="font-medium text-slate-800">{text}</span>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            ellipsis: true,
            render: (text) => <span className="text-slate-600">{text}</span>,
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            align: 'right',
            render: (price) => <span className="text-slate-600">{price.toLocaleString('vi-VN')}</span>,
        },
        {
            title: 'Thời hạn', // Hiển thị thời hạn trong bảng
            dataIndex: 'validityDuration',
            key: 'validityDuration',
            width: 120,
            align: 'center',
            render: (duration: number) => renderValidityDuration(duration),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 150,
            align: 'center',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'right',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        // TODO: Implement showEditModal logic later
                        // onClick={() => handleOpenModal(record)}
                        className="text-indigo-600"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id, record.name)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    if (isLoadingTicketTypes) {
        return (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
                <Typography.Text>Đang tải danh sách loại vé...</Typography.Text>
            </div>
        );
    }

    if (isErrorTicketTypes) {
        return (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center text-red-600">
                <Typography.Text>Lỗi khi tải danh sách loại vé: {ticketTypeError?.message || "Lỗi không xác định"}</Typography.Text>
            </div>
        );
    }

    const ticketTypesData = ticketTypesResponse?.data?.data && Array.isArray(ticketTypesResponse.data.data)
        ? ticketTypesResponse.data.data
        : [];

    const activeTicketTypesCount = ticketTypesData.filter((type: TicketTypeResponse) => type.isActive).length;
    const inactiveTicketTypesCount = ticketTypesData.length - activeTicketTypesCount;

    return (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Quản lý Loại Vé Metro</h2>
                    <Typography.Text type="secondary">
                        Quản lý các loại vé, giá và thời hạn sử dụng cho hệ thống metro
                    </Typography.Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenModal}
                    size="large"
                >
                    Thêm Loại Vé
                </Button>
            </div>
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {ticketTypesData.length}
                        </div>
                        <div className="text-slate-600">Tổng số loại vé</div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {activeTicketTypesCount}
                        </div>
                        <div className="text-slate-600">Đang hoạt động</div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {inactiveTicketTypesCount}
                        </div>
                        <div className="text-slate-600">Không hoạt động</div>
                    </Card>
                </Col>
            </Row>
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={ticketTypesData}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} loại vé`,
                        className: 'mt-4'
                    }}
                    className="ant-table-custom"
                    loading={isLoadingTicketTypes || createTicketTypeMutation.isPending || deleteTicketTypeMutation.isPending}
                />
            </div>
            <Modal
                title={'Thêm Loại Vé mới'}
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
                    initialValues={{
                        isActive: true, // Giá trị mặc định cho Switch
                        price: 0, // Giá trị mặc định cho InputNumber
                        validityDuration: 1 // Giá trị mặc định cho InputNumber - ví dụ
                    }}
                >
                    <Form.Item
                        name="name"
                        label={<span className="font-semibold text-slate-700">Tên loại vé</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại vé!' }]}
                    >
                        <Input placeholder="VD: Vé một ngày" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="font-semibold text-slate-700">Mô tả</span>}
                        // description không có @NotNull ở backend, nhưng @Size có thể yêu cầu không rỗng
                        // Nếu bạn muốn mô tả là bắt buộc, thêm rules: [{ required: true, message: 'Vui lòng nhập mô tả!' }]
                    >
                        <Input.TextArea
                            rows={2}
                            placeholder="Mô tả chi tiết về loại vé này..."
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label={<span className="font-semibold text-slate-700">Giá (VNĐ)</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập giá!', type: 'number', min: 0 }]}
                            >
                                <InputNumber<number>
                                    className="w-full"
                                    min={0}
                                    step={1000}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, '') || '0')}
                                    placeholder="0"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="validityDuration"
                                label={<span className="font-semibold text-slate-700">Thời hạn sử dụng (ngày)</span>}
                                // Rules cho số nguyên: phải là số, không được rỗng, min/max theo backend
                                rules={[
                                    { required: true, message: 'Vui lòng nhập thời hạn sử dụng!' },
                                    { type: 'number', min: 0, message: 'Thời hạn phải là số không âm!' },
                                    { type: 'number', max: 365, message: 'Thời hạn không quá 365 ngày!' } // Giả định theo backend DTO
                                ]}
                            >
                                {/* ĐÃ SỬA: Sử dụng InputNumber để người dùng tự nhập số */}
                                <InputNumber<number>
                                    className="w-full"
                                    min={0} // Theo @PositiveOrZero của backend
                                    max={365} // Theo @Max của backend
                                    placeholder="VD: 1, 3, 7, 30..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="isActive"
                        label={<span className="font-semibold text-slate-700">Trạng thái hoạt động</span>}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Hoạt động"
                            unCheckedChildren="Không hoạt động"
                        />
                    </Form.Item>

                    <div className="text-right pt-4 border-t">
                        <Space>
                            <Button onClick={handleCancel} size="large">
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createTicketTypeMutation.isPending}
                                size="large"
                            >
                                Thêm Loại Vé
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default TicketTypeManagement;