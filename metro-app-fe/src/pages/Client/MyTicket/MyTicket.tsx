/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Empty, Table, Typography } from "antd";
import { TicketIcon } from "lucide-react";
import React from "react";
import QRModal from "src/components/QrCodeModal";
import { useGetTicketByUser } from "src/queries/useTicket";
import { OrderDetailResponse } from "src/types/orders.type";
import { TicketStatus } from "src/types/tickets.type";

const { Title } = Typography;

const MyTicket: React.FC = () => {
  const { data: ticketsData, isLoading } = useGetTicketByUser();
  const ticketList =
    ticketsData?.data?.data?.filter(
      (item) => item.ticket.status === TicketStatus.NOT_USED
    ) || [];
  const columns = [
    {
      title: "Mã vé",
      dataIndex: ["ticket", "id"],
      key: "ticketId",
    },
    {
      title: "Tên vé",
      dataIndex: ["ticket", "name"],
      key: "name",
    },
    {
      title: "Code",
      dataIndex: ["ticket", "ticketCode"],
      key: "ticketCode",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: OrderDetailResponse) =>
        record.ticket.status === TicketStatus.NOT_USED ? (
          <>
            <QRModal ticket={record.ticket} />
          </>
        ) : (
          <></>
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
      </div>
      <Card className="!border-1 backdrop-blur-sm">
        <Table
          columns={columns}
          dataSource={ticketList}
          loading={isLoading}
          bordered
          className="!rounded-lg overflow-hidden [&_.ant-table-cell]:text-center [&_.ant-table-thead_th]:!text-center"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có giao dịch nào"
                className="!my-8 text-center"
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};
export default MyTicket;
