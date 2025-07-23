/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Empty,
  Table,
  Typography,
  Tabs,
  Badge,
  Space,
  Button,
} from "antd";
import { TicketIcon, CheckCircle, XCircle, Clock, ArrowUp } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import QRModal from "src/components/QrCodeModal";
import UpgradeTicketModal from "src/components/UpgradeTicketModal";
import { useGetTicketByUser } from "src/queries/useTicket";
import { OrderDetailResponse } from "src/types/orders.type";
import { TicketStatus } from "src/types/tickets.type";
import { formatDate } from "src/utils/utils";

const { Title } = Typography;

const MyTicket: React.FC = () => {
  const { t } = useTranslation("profile");
  const { data: ticketsData, isLoading } = useGetTicketByUser();
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [selectedTicketForUpgrade, setSelectedTicketForUpgrade] =
    useState<OrderDetailResponse | null>(null);

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

  const handleUpgradeClick = (record: OrderDetailResponse) => {
    setSelectedTicketForUpgrade(record);
    setUpgradeModalVisible(true);
  };

  const handleUpgradeModalClose = () => {
    setUpgradeModalVisible(false);
    setSelectedTicketForUpgrade(null);
  };

  const getColumns = (showAction: boolean = true) => [
    {
      title: t("myTicket.ticketName"),
      dataIndex: ["ticket", "name"],
      key: "name",
      ellipsis: true,
      render: (name: string) => (
        <span className="font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: t("myTicket.ticketCode"),
      dataIndex: ["ticket", "ticketCode"],
      key: "ticketCode",
      width: 250,
      render: (code: string) => (
        <span className="font-mono text-lg bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {code}
        </span>
      ),
    },
    {
      title: t("myTicket.time"),
      dataIndex: ["ticket", "createdAt"],
      key: "createdAt",
      ellipsis: true,
      render: (createdAt: string) => (
        <span className="font-medium text-gray-800">
          {formatDate(createdAt)}
        </span>
      ),
    },
    ...(showAction
      ? [
          {
            title: t("myTicket.action"),
            key: "action",
            width: 250,
            render: (_: any, record: OrderDetailResponse) => {
              if (record.ticket?.status === TicketStatus.EXPIRED) {
                return null;
              }

              return (
                <Space>
                  <QRModal ticket={record.ticket} />
                  {record.ticket.ticketTypeId === 5 && (
                    <Button
                      type="primary"
                      icon={<ArrowUp size={16} />}
                      onClick={() => handleUpgradeClick(record)}
                      className="!bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !border-0 !shadow-md !hover:shadow-lg !transition-all !transform hover:!scale-105 active:!scale-95 !duration-200"
                    >
                      {t("myTicket.upgrade")}
                    </Button>
                  )}
                </Space>
              );
            },
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
          <span>{t("myTicket.tabs.notUsed")}</span>
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
                  {t("myTicket.emptyMessages.notUsed")}
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
          <span>{t("myTicket.tabs.used")}</span>
          <Badge
            count={categorizedTickets.used.length}
            style={{ backgroundColor: "#52c41a" }}
          />
        </Space>
      ),
      children: (
        <Table
          columns={getColumns(true)}
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
                  {t("myTicket.emptyMessages.used")}
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
          <span>{t("myTicket.tabs.expired")}</span>
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
                  {t("myTicket.emptyMessages.expired")}
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
          {t("myTicket.title")}
        </Title>
        <p className="text-gray-600 mt-2">{t("myTicket.description")}</p>
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

      {selectedTicketForUpgrade && (
        <UpgradeTicketModal
          orderId={selectedTicketForUpgrade.orderId}
          visible={upgradeModalVisible}
          onCancel={handleUpgradeModalClose}
          ticket={selectedTicketForUpgrade.ticket}
        />
      )}
    </div>
  );
};

export default MyTicket;
