// import React, { useState } from 'react';
// import { initialTicketTypes } from 'src/assets/data/mockData'; 
// import { TicketTypeResponse } from 'src/types/tickets.type'; 
// import { Table, Modal, Form, Input, InputNumber, Select, Button, Space, Tag, App as AntdApp, Switch } from 'antd';
// import type { TableProps } from 'antd'; 
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'; 

// const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);

// const TicketManagement = () => {
//   const [ticketTypes, setTicketTypes] = useState<TicketTypeResponse[]>(initialTicketTypes);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTicket, setEditingTicket] = useState<TicketTypeResponse | null>(null);
//   const [form] = Form.useForm();
//   const { modal } = AntdApp.useApp();

//   const handleOpenModal = (ticket: TicketTypeResponse | null = null) => {
//     setEditingTicket(ticket);
//     form.setFieldsValue(ticket ? { ...ticket, validityDays: ticket.validityDuration } : { name: '', price: 0, validityDays: undefined, description: '' });
//     setIsModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setEditingTicket(null);
//     form.resetFields();
//   };

//   interface FormValues {
//     name: string;
//     price: number;
//     validityDays?: number; 
//     description: string;
//   }

//   const onFinish = (values: FormValues) => {
//     const ticketData: Omit<TicketTypeResponse, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> = {
//       name: values.name,
//       price: values.price,
//       description: values.description,
//       validityDuration: values.validityDays ?? 0, 
//     };

//     if (editingTicket) {
//       setTicketTypes(ticketTypes.map(t =>
//         t.id === editingTicket.id
//           ? {
//               ...editingTicket,
//               ...ticketData,
//               updatedAt: new Date().toISOString(),
//               isActive: editingTicket.isActive, 
//             }
//           : t
//       ));
//     } else {
//       setTicketTypes([
//         ...ticketTypes,
//         {
//           ...ticketData,
//           id: generateNumericId(),
//           isActive: true, 
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//       ]);
//     }
//     handleCancel();
//   };

//   const handleDelete = (ticketId: number) => { 
//     modal.confirm({
//       title: 'Bạn có chắc chắn muốn xóa loại vé này?',
//       content: 'Hành động này không thể hoàn tác.',
//       okText: 'Xóa',
//       okType: 'danger',
//       cancelText: 'Hủy',
//       onOk: () => setTicketTypes(ticketTypes.filter(t => t.id !== ticketId)),
//     });
//   };

//   const columns: TableProps<TicketTypeResponse>['columns'] = [
//     { title: 'Tên Loại Vé', dataIndex: 'name', key: 'name', render: (text) => <span className="font-medium text-slate-800">{text}</span> },
//     {
//       title: 'Giá (VND)', dataIndex: 'price', key: 'price',
//       render: (price) => <span className="text-slate-600">{price.toLocaleString('vi-VN')}</span>,
//     },
//     {
//       title: 'Thời hạn', dataIndex: 'validityDuration', key: 'validityDuration',
//       render: (duration) => <span className="text-slate-600">{duration ? `${duration} ngày` : 'Không giới hạn'}</span>,
//     },
//     {
//       title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true, 
//       render: (text) => <span className="text-slate-600">{text}</span>,
//     },
//     {
//       title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive',
//       render: (isActive: boolean) => (
//         <Tag color={isActive ? 'green' : 'red'}>
//           {isActive ? 'Hoạt động' : 'Không hoạt động'}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Hành động', key: 'action', align: 'right',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} className="text-indigo-600">Sửa</Button>
//           <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">Quản lý Loại Vé</h2>
//         <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Loại Vé</Button>
//       </div>
//       <div className="overflow-x-auto">
//         <Table columns={columns} dataSource={ticketTypes} rowKey="id" pagination={{ pageSize: 5, className: 'mt-4' }} className="ant-table-custom" />
//       </div>
//       <Modal title={editingTicket ? 'Chỉnh sửa Loại Vé' : 'Thêm Loại Vé mới'} open={isModalOpen} onCancel={handleCancel} footer={null} centered>
//         <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6 space-y-4">
//           <Form.Item
//             name="name"
//             label={<span className="font-semibold text-slate-700">Tên Loại Vé</span>}
//             rules={[{ required: true, message: 'Vui lòng nhập tên loại vé!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="price"
//             label={<span className="font-semibold text-slate-700">Giá (VND)</span>}
//             rules={[{ required: true, type: 'number', min: 0, message: 'Vui lòng nhập giá hợp lệ!' }]}
//           >
//             <InputNumber
//               min={0}
//               className="w-full"
//               formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//             //   parser={(value) => Number(value!.replace(/,*/g, ''))}
//             />
//           </Form.Item>
//           <Form.Item
//             name="validityDays"
//             label={<span className="font-semibold text-slate-700">Thời hạn (ngày, bỏ trống nếu không áp dụng)</span>}
//             rules={[{ type: 'number', min: 0, message: 'Vui lòng nhập số ngày hợp lệ!' }]}
//           >
//             <InputNumber min={0} className="w-full" />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label={<span className="font-semibold text-slate-700">Mô tả</span>}
//             rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
//           >
//             <Input.TextArea rows={3} />
//           </Form.Item>
//           {editingTicket && (
//             <Form.Item
//               name="isActive"
//               label={<span className="font-semibold text-slate-700">Trạng thái hoạt động</span>}
//               valuePropName="checked"
//             >
//               <Switch />
//             </Form.Item>
//           )}
//           <div className="text-right pt-2">
//             <Space>
//               <Button onClick={handleCancel}>Hủy</Button>
//               <Button type="primary" htmlType="submit">Lưu</Button>
//             </Space>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TicketManagement;