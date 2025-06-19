import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTicketById } from "src/queries/useTicket";
import { Row, Col, Button, Spin, Typography, Divider, Select } from "antd";
import { toast } from "react-hot-toast";
const { Title, Text } = Typography;

const OrderPage: React.FC = () => {
  const { id } = useParams();
  const { data: ticketData, isLoading } = useGetTicketById({ id: Number(id) });
  const ticket = ticketData?.data.data;
  const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
  const handleBuyTicket = () => {
    if (!ticket) {
      toast.error("Không tìm thấy thông tin vé.");
      return;
    }
  };
  if (isLoading) return <Spin tip="Đang tải thông tin vé..." />;
  if (!ticket) return <div>Không tìm thấy thông tin vé</div>;

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl my-10 border-2 border-gray-500">
        <Title level={3} className="text-center text-blue-600 mb-6">
          Chi tiết Vé #{ticket.ticketCode}
        </Title>

        <Row gutter={[16, 16]} className="text-gray-800 text-base">
          <Col xs={24} md={12}>
            <Text strong>Vé:</Text>
            <div>{ticket.name}</div>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Giá:</Text>
            <div className="text-green-600 font-semibold">
              {ticket.actualPrice.toLocaleString()} VND
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Hiệu lực từ:</Text>
            <div>{new Date(ticket.validFrom).toLocaleString()}</div>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Hiệu lực đến:</Text>
            <div>{new Date(ticket.validUntil).toLocaleString()}</div>
          </Col>
        </Row>

        <Divider className="my-6" />

        <div className="mt-6">
          <Text strong>Chọn phương thức thanh toán:</Text>
          <Select
            className="w-full mt-2"
            value={paymentMethodId}
            onChange={(value) => setPaymentMethodId(value)}
          >
            <Select.Option value={1}>VNPAY</Select.Option>
            <Select.Option value={2}>PayPal</Select.Option>
          </Select>
        </div>

        <div className="text-center mt-4">
          <Button
            type="primary"
            size="large"
            className="bg-green-600 hover:bg-green-700 px-10 py-2 rounded-full"
            onClick={handleBuyTicket}
          >
            Mua Vé Ngay
          </Button>
        </div>
      </div>
    </>
  );
};
export default OrderPage;
