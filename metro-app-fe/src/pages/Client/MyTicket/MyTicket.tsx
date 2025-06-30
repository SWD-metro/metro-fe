/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Empty, Table, Typography, Tabs, Badge, Space } from "antd";
import { TicketIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import React, { useMemo } from "react";
import QRModal from "src/components/QrCodeModal";
import { useGetTicketByUser } from "src/queries/useTicket";
import { OrderDetailResponse } from "src/types/orders.type";
import { TicketStatus } from "src/types/tickets.type";

const { Title } = Typography;

const MyTicket: React.FC = () => {
  const { data: ticketsData, isLoading } = useGetTicketByUser();

  const categorizedTickets = useMemo(() => {
    const allTickets = ticketsData?.data?.data || [];

    return {
      notUsed: allTickets.filter(
        (item) => item.ticket.status === TicketStatus.NOT_USED
      ),
      used: allTickets.filter(
        (item) => item.ticket.status === TicketStatus.USED
      ),
      expired: allTickets.filter(
        (item) => item.ticket.status === TicketStatus.EXPIRED
      ),
    };
  }, [ticketsData]);

  const getColumns = (showAction: boolean = true) => [
    {
      title: "Mã vé",
      dataIndex: ["ticket", "id"],
      key: "ticketId",
      width: 120,
      render: (id: string) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          #{id}
        </span>
      ),
    },
    {
      title: "Tên vé",
      dataIndex: ["ticket", "name"],
      key: "name",
      ellipsis: true,
      render: (name: string) => (
        <span className="font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: "Mã code",
      dataIndex: ["ticket", "ticketCode"],
      key: "ticketCode",
      width: 250,
      render: (code: string) => (
        <span className="font-mono text-lg bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {code}
        </span>
      ),
    },
    ...(showAction
      ? [
          {
            key: "action",
            width: 120,
            render: (_: any, record: OrderDetailResponse) => (
              <QRModal ticket={record.ticket} />
            ),
          },
        ]
      : []),
  ];

  const tabItems = [
    {
      key: TicketStatus.NOT_USED,
      label: (
        <Space>
          <XCircle size={20} className="text-blue-500" />
          <span>Chưa sử dụng</span>
          <Badge
            count={categorizedTickets.notUsed.length}
            style={{ backgroundColor: "blue" }}
          />
        </Space>
      ),
      children: (
        <Table
          columns={getColumns(true)}
          dataSource={categorizedTickets.notUsed}
          loading={isLoading}
          bordered
          size="middle"
          className="!rounded-lg overflow-hidden [&_.ant-table-cell]:text-center [&_.ant-table-thead_th]:!text-center"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="!my-8"
                description={null}
              >
                <span className="font-mono text-lg bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  Tất cả vé của bạn đã được sử dụng hoặc hết hạn
                </span>
              </Empty>
            ),
          }}
        />
      ),
    },
    {
      key: TicketStatus.USED,
      label: (
        <Space>
          <CheckCircle size={20} className="text-green-500" />
          <span>Đã sử dụng</span>
          <Badge
            count={categorizedTickets.used.length}
            style={{ backgroundColor: "#52c41a" }}
          />
        </Space>
      ),
      children: (
        <Table
          columns={getColumns(false)}
          dataSource={categorizedTickets.used}
          loading={isLoading}
          bordered
          size="middle"
          className="!rounded-lg overflow-hidden [&_.ant-table-cell]:text-center [&_.ant-table-thead_th]:!text-center"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="!my-8"
                description={null}
              >
                <span className="font-mono text-lg bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  Bạn chưa sử dụng vé nào
                </span>
              </Empty>
            ),
          }}
        />
      ),
    },
    {
      key: TicketStatus.EXPIRED,
      label: (
        <Space>
          <Clock size={20} className="text-red-500" />
          <span>Hết hạn</span>
          <Badge
            count={categorizedTickets.expired.length}
            style={{ backgroundColor: "#ff4d4f" }}
          />
        </Space>
      ),
      children: (
        <Table
          columns={getColumns(false)}
          dataSource={categorizedTickets.expired}
          loading={isLoading}
          bordered
          size="middle"
          className="!rounded-lg overflow-hidden [&_.ant-table-cell]:text-center [&_.ant-table-thead_th]:!text-center"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="!my-8"
                description={null}
              >
                <span className="font-mono text-lg bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  Không có vé nào hết hạn
                </span>
              </Empty>
            ),
          }}
        />
      ),
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
      <div className="mb-8">
        <Title level={2} className="flex !mb-2 !text-gray-800 !font-bold">
          <TicketIcon size={42} className="mr-3 text-blue-500" />
          Vé của tôi
        </Title>
        <p className="text-gray-600 mt-2">
          Quản lý và theo dõi tất cả vé của bạn tại đây
        </p>
      </div>

      <Card
        className="!border-0 shadow-lg backdrop-blur-sm bg-white/80"
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          defaultActiveKey={TicketStatus.NOT_USED}
          items={tabItems}
          size="large"
          className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:bg-gray-50/20 [&_.ant-tabs-nav]:!px-6 [&_.ant-tabs-content-holder]:!p-5"
          tabBarStyle={{
            margin: 0,
            borderBottom: "1px solid #f0f0f0",
          }}
        />
      </Card>
    </div>
  );
};

export default MyTicket;
