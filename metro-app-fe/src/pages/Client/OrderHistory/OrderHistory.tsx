/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import {
  Table,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Statistic,
  Empty,
  Tag,
} from "antd";
import { ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { AppContext } from "src/contexts/app.context";
import { useGetOrderByUserId } from "src/queries/useOrder";
import { OrderResponse, OrderStatus } from "src/types/orders.type";
import { formatDate, formatPrice } from "src/utils/utils";
import { useCreateVNPayMutation } from "src/queries/usePayment";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const OrderHistory: React.FC = () => {
  const { t } = useTranslation("profile");
  const { profile } = useContext(AppContext);
  const userId = profile?.userId;

  const { data: ordersData, isLoading } = useGetOrderByUserId({
    id: userId as number,
    enabled: !!userId,
  });

  const orders = ordersData?.data.data || [];
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const completedOrders = orders.filter(
    (order) => order.status === OrderStatus.SUCCESSFUL
  ).length;

  const useCreateVNPay = useCreateVNPayMutation();

  const handlePayment = async (orderId: number) => {
    const paymentResponse = await useCreateVNPay.mutateAsync(orderId);
    const redirectUrl = paymentResponse?.data?.data?.paymentUrl;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      toast.error(t("orderHistory.paymentError"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "success";
      case "PENDING":
        return "processing";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: t("orderHistory.transactionCode"),
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => (
        <Text strong className="text-blue-600 !text-lg">
          {text}
        </Text>
      ),
    },
    {
      title: t("orderHistory.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <Text strong className="!text-blue-500 !text-lg">
          {formatPrice(amount)}
        </Text>
      ),
    },
    {
      title: t("orderHistory.orderDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text className="text-gray-600">{formatDate(date)}</Text>
      ),
    },
    {
      title: t("orderHistory.paymentMethod"),
      key: "paymentMethod",
      render: (record: OrderResponse) => (
        <Tag color="blue" className="px-3 py-1 rounded-full font-medium">
          {record.transaction?.paymentMethodName || t("orderHistory.unknown")}
        </Tag>
      ),
    },
    {
      title: t("orderHistory.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          className="px-3 py-1 rounded-full font-medium"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: t("orderHistory.action"),
      key: "actions",
      render: (_: any, record: OrderResponse) =>
        record.status === OrderStatus.PENDING ? (
          <>
            <Button
              type="primary"
              className="!rounded-lg !bg-blue-500 hover:!bg-blue-600"
              onClick={() => handlePayment(record.orderId)}
            >
              {t("orderHistory.payment")}
            </Button>
          </>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <>
      <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
        <div className="mb-8">
          <Title level={2} className="!mb-2 !text-gray-800 !font-bold">
            <ShoppingCartOutlined className="mr-3 text-blue-500" />
            {t("orderHistory.title")}
          </Title>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <Statistic
                title={
                  <span className="text-blue-500 font-semibold">
                    {t("orderHistory.stats.totalOrders")}
                  </span>
                }
                value={orders.length}
                prefix={<ShoppingCartOutlined className="!text-blue-500" />}
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <Statistic
                title={
                  <span className="text-green-500 font-semibold">
                    {t("orderHistory.stats.completed")}
                  </span>
                }
                value={completedOrders}
                prefix={<CheckCircleOutlined className="!text-green-500" />}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <Statistic
                title={
                  <span className="text-purple-500 font-semibold">
                    {t("orderHistory.stats.totalSpent")}
                  </span>
                }
                value={totalAmount}
                suffix="₫"
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        </Row>

        <Card className="!border-1 backdrop-blur-sm">
          <Table
            columns={columns}
            dataSource={orders}
            loading={isLoading}
            bordered
            className="!rounded-lg overflow-hidden [&_.ant-table-cell]:text-center [&_.ant-table-thead_th]:!text-center"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t("orderHistory.emptyMessage")}
                  className="!my-8 text-center"
                />
              ),
            }}
          />
        </Card>
      </div>
    </>
  );
};

export default OrderHistory;
