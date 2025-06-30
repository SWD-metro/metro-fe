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
import { AppContext } from "src/contexts/app.context";
import { useGetOrderByUserId } from "src/queries/useOrder";
import { OrderResponse, OrderStatus } from "src/types/orders.type";
import { formatDate, formatPrice } from "src/utils/utils";
const { Title, Text } = Typography;

const OrderHistory: React.FC = () => {
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
      title: "Mã giao dịch",
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => (
        <Text strong className="text-blue-600 !text-lg">
          {text}
        </Text>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <Text strong className="!text-blue-500 !text-lg">
          {formatPrice(amount)}
        </Text>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text className="text-gray-600">{formatDate(date)}</Text>
      ),
    },
    {
      title: "Phương thức thanh toán",
      key: "paymentMethod",
      render: (record: OrderResponse) => (
        <Tag color="blue" className="px-3 py-1 rounded-full font-medium">
          {record.transaction?.paymentMethodName || "Không rõ"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
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
      title: "Hành động",
      key: "actions",
      render: (_: any, record: OrderResponse) =>
        record.status === OrderStatus.PENDING ? (
          <>
            <Button
              type="primary"
              className="!rounded-lg !bg-blue-500 hover:!bg-blue-600"
            >
              Thanh toán
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
            Lịch sử giao dịch
          </Title>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="text-center  hover:shadow-xl transition-all duration-300">
              <Statistic
                title={
                  <span className="text-blue-500 font-semibold">
                    Tổng số đơn
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
                    Đã hoàn thành
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
                    Tổng chi tiêu
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
                  description="Không có giao dịch nào"
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
