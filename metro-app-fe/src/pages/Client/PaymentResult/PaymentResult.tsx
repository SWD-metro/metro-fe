import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Divider,
  Result,
  Spin,
} from "antd";
import {
  CheckCircle,
  CreditCard,
  Gift,
  Copy,
  Home,
  Ticket,
} from "lucide-react";

import { useGetVNPayCallback } from "src/queries/usePayment";
import { useGetTicketById, useGetTicketQRCode } from "src/queries/useTicket";
import { useLocation, useNavigate } from "react-router-dom";
import path from "src/constants/path";
import background from "src/assets/feature_section.png";
import { formatDDMMYY, formatPrice } from "src/utils/utils";
const { Title, Text } = Typography;

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const { data: vnpayRes, isLoading } = useGetVNPayCallback(search);
  const payment = vnpayRes?.data.data;
  const ticketId = payment?.ticketId;

  const { data: ticketRes } = useGetTicketById({
    id: ticketId || 0,
    enabled: !!ticketId,
  });
  const ticket = ticketRes?.data.data;

  const ticketCode = ticket?.ticketCode;
  const { data: qrRes } = useGetTicketQRCode(ticketCode);
  const qrCode = qrRes?.data.data;

  const handleCopyTicketCode = () => {
    if (ticket?.ticketCode) {
      navigator.clipboard.writeText(ticket.ticketCode);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (payment?.status === "failed") {
    return (
      <Result
        status="error"
        title="Thanh toán thất bại"
        subTitle="Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại."
      />
    );
  }

  if (payment?.status === "invalid") {
    return (
      <Result
        status="warning"
        title="Giao dịch không hợp lệ"
        extra={
          <Button type="primary" onClick={() => navigate(path.home)}>
            Quay về trang chủ
          </Button>
        }
      />
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 border-4 border-green-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 !text-green-500 drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Thanh toán thành công!
          </h1>
          <p className="text-blue-100 text-xl font-medium">
            {payment?.message}
          </p>
        </div>

        <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden mb-8 backdrop-blur-sm">
          <div className="space-y-8 px-2">
            <div>
              <Title
                level={3}
                className="flex items-center !text-gray-800 !mb-6"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                Chi tiết giao dịch
              </Title>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-8 border-2 border-blue-200/50">
                <Row gutter={[32, 24]}>
                  <Col xs={12} md={12}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-gray-600 font-medium">
                          Mã giao dịch:
                        </Text>
                        <div className="flex items-center space-x-2">
                          <Text className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-mono text-sm font-semibold border border-blue-200">
                            {payment?.transactionId}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={12}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-gray-600 font-medium">
                          Số tiền đã thanh toán :
                        </Text>
                        <div className="flex items-center space-x-2">
                          <Text className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-mono text-sm font-semibold border border-blue-200">
                            {formatPrice(payment?.amount)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <Divider className="border-gray-200" />

            {ticket && (
              <div>
                <Title
                  level={3}
                  className="flex items-center !text-gray-800 !mb-6"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Gift className="w-5 h-5 text-blue-600" />
                  </div>
                  Thông tin vé
                </Title>

                <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200/50">
                  <Row gutter={[32, 24]}>
                    <Col xs={24} lg={14}>
                      <div className="space-y-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50">
                          <Text className="text-gray-600 text-sm font-medium block mb-2">
                            Vé:
                          </Text>
                          <Title
                            level={4}
                            className="!text-blue-600 !m-0 !text-xl"
                          >
                            {ticket.name}
                          </Title>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50">
                          <Text className="text-gray-600 text-sm font-medium block mb-3">
                            Mã vé:
                          </Text>
                          <div className="flex items-center space-x-3">
                            <Text className="bg-white px-4 py-3 rounded-lg border-2 border-blue-300 text-blue-700 font-mono text-lg font-bold shadow-sm">
                              {ticket.ticketCode}
                            </Text>
                            <Button
                              type="text"
                              shape="circle"
                              size="large"
                              className="!bg-blue-100 hover:!bg-blue-200 !border-blue-300 shadow-sm"
                              icon={<Copy className="w-4 h-4 text-blue-600" />}
                              onClick={handleCopyTicketCode}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col
                      xs={24}
                      lg={10}
                      className="!flex !justify-center !items-center"
                    >
                      <div className="bg-white p-4 rounded-2xl">
                        <div className="w-64 h-64 bg-gradient-to-br border-2 border-blue-300 flex items-center justify-center">
                          <img
                            src={`data:image/png;base64,${qrCode}`}
                            alt="QR Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-8 pt-6 border-t-2 border-blue-200/50">
                    <Text className="text-gray-600 text-sm font-medium block mb-3">
                      Hiệu lực
                    </Text>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50">
                        <Text className="text-lg font-bold text-blue-700 block">
                          {formatDDMMYY(ticket.validFrom)}
                        </Text>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50">
                        <Text className="text-lg font-bold text-blue-700 block">
                          {formatDDMMYY(ticket.validUntil)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              size="large"
              className="!bg-white !text-blue-600 !border-black hover:!bg-gray-50 !h-12 !px-8 !rounded-xl !font-semibold"
              icon={<Ticket className="w-5 h-5" />}
              onClick={() => navigate(path.myTicket)}
            >
              Vé của tôi
            </Button>
            <Button
              type="primary"
              size="large"
              className="!h-12 !px-8 !rounded-xl !font-semibold !shadow-lg"
              icon={<Home className="w-5 h-5" />}
              onClick={() => navigate(path.home)}
            >
              Quay về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;
