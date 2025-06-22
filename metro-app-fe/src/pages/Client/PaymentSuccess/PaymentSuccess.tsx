import React from "react";
import {
  Result,
  Card,
  Typography,
  Button,
  Divider,
  Spin,
  Avatar,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  CopyOutlined,
  CreditCardOutlined,
  GiftOutlined,
} from "@ant-design/icons";

import { useGetVNPayCallback } from "src/queries/usePayment";
import { useGetTicketById } from "src/queries/useTicket";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";

const { Title, Text } = Typography;

const PaymentSuccess: React.FC = () => {
  const { data: VnPayData, isLoading, isError } = useGetVNPayCallback();
  const navigate = useNavigate();

  const paymentData = VnPayData?.data.data;
  const ticketId = paymentData?.ticketId;

  const { data: ticketData } = useGetTicketById({
    id: ticketId || 0,
    enabled: !!ticketId,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !paymentData) {
    return (
      <Result
        status="error"
        title="Thanh toán thất bại"
        subTitle="Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại."
      />
    );
  }

  const ticket = ticketData?.data.data;

  if (paymentData.status === "invalid") {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-4">
            <CheckCircleOutlined className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-blue-100 text-lg">{paymentData.message}</p>
        </div>

        <Card className="rounded-2xl shadow-2xl border-0 overflow-hidden mb-6">
          <div className="bg-gradient-to-r !from-green-400 !to-emerald-500 p-8 text-center text-white -m-6 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <Avatar
                size={64}
                icon={<CheckCircleOutlined />}
                className="bg-white bg-opacity-20"
              />
              <div>
                <Text className="text-green-100 text-sm block">
                  Số tiền đã thanh toán
                </Text>
                <Title level={1} className="text-white m-0 text-4xl font-bold">
                  {paymentData.amount?.toLocaleString()} VNĐ
                </Title>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Title level={4} className="flex items-center text-gray-800 mb-4">
                <CreditCardOutlined className="text-blue-500 mr-2" />
                Chi tiết giao dịch
              </Title>

              <div className="bg-gray-50 rounded-xl p-6">
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Text className="text-gray-600">Mã giao dịch:</Text>
                        <div className="flex items-center space-x-2">
                          <Text
                            code
                            className="bg-blue-50 text-blue-600 px-2 py-1 rounded"
                          >
                            {paymentData.transactionId}
                          </Text>
                          <Button
                            type="text"
                            icon={<CopyOutlined />}
                            size="small"
                            className="hover:bg-blue-50"
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <Divider />

            {ticket && (
              <div>
                <Title
                  level={4}
                  className="flex items-center text-gray-800 mb-4"
                >
                  <GiftOutlined className="text-purple-500 mr-2" />
                  Thông tin vé
                </Title>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <div className="space-y-4">
                        <div>
                          <Text className="text-gray-600 text-sm block mb-1">
                            Loại vé
                          </Text>
                          <Title level={5} className="text-purple-700 m-0">
                            {ticket.name}
                          </Title>
                        </div>

                        <div>
                          <Text className="text-gray-600 text-sm block mb-1">
                            Mã vé
                          </Text>
                          <div className="flex items-center space-x-2">
                            <Text
                              code
                              className="bg-white px-3 py-2 rounded border border-purple-200 text-purple-600"
                            >
                              {ticket.ticketCode}
                            </Text>
                            <Button
                              type="text"
                              icon={<CopyOutlined />}
                              size="small"
                              className="hover:bg-white hover:bg-opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-6 pt-4 border-t border-purple-200">
                    <Text className="text-gray-600 text-sm block mb-1">
                      Hieu luc
                    </Text>
                    <Text className="text-lg font-semibold !text-purple-700">
                      {ticket.validFrom}
                    </Text>
                    <Text className="text-lg font-semibold !text-purple-700">
                      {ticket.validUntil}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
