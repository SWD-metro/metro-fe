import { useLocation } from "react-router-dom";
import { formatPrice } from "src/utils/utils";
import React, { useContext, useState } from "react";
import { Button, Col, Row, Select } from "antd";
import {
  useGetFareMatrixById,
  useGetTicketTypeById,
} from "src/queries/useTicket";
import { AppContext } from "src/contexts/app.context";
import {
  useCreateOrderDaysMutation,
  useCreateOrderSingleMutation,
} from "src/queries/useOrder";
import {
  useCreateVNPayMutation,
  useGetPaymentMethodList,
} from "src/queries/usePayment";
import toast from "react-hot-toast";
import {
  OrderTicketDaysRequest,
  OrderTicketSingleRequest,
} from "src/types/orders.type";

const { Option } = Select;

const OrderPage: React.FC = () => {
  const location = useLocation();
  const {
    type,
    fareMatrixId,
    ticketTypeId,
    quantity,
  }: {
    type: "single" | "days";
    fareMatrixId?: number;
    ticketTypeId?: number;
    quantity: number;
  } = location.state || {};
  const { profile } = useContext(AppContext);
  const [paymentMethod, setPaymentMethod] = useState<number>(1);
  const { data: paymentMethodData } = useGetPaymentMethodList();
  const paymentMethods = paymentMethodData?.data.data;

  const useCreateOrderSingle = useCreateOrderSingleMutation();
  const useCreateOrderDays = useCreateOrderDaysMutation();
  const useCreateVNPay = useCreateVNPayMutation();

  const { data: fareData } = useGetFareMatrixById({
    id: fareMatrixId!,
    enabled: Boolean(fareMatrixId),
  });
  const { data: ticketData } = useGetTicketTypeById({
    id: ticketTypeId!,
    enabled: Boolean(ticketTypeId),
  });
  const fareMatrix = fareData?.data.data;
  const ticketType = ticketData?.data?.data;

  const handlePayment = async () => {
    if (!profile) {
      toast.error("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    if (useCreateOrderSingle.isPending || useCreateOrderDays.isPending) return;
    try {
      let orderPayload: OrderTicketSingleRequest | OrderTicketDaysRequest;
      let orderResponse;
      if (type === "single") {
        if (!fareMatrixId) {
          toast.error("Không tìm thấy thông tin giá vé");
          return;
        }
        orderPayload = {
          userId: profile.userId,
          fareMatrixId: { id: fareMatrixId },
          paymentMethodId: paymentMethod,
        };
        orderResponse = await useCreateOrderSingle.mutateAsync(orderPayload);
      } else {
        if (!ticketTypeId) {
          toast.error("Không tìm thấy loại vé hợp lệ");
          return;
        }
        orderPayload = {
          userId: profile.userId,
          ticketId: { id: ticketTypeId },
          paymentMethodId: paymentMethod,
        };
        orderResponse = await useCreateOrderDays.mutateAsync(orderPayload);
      }
      const ordersData = orderResponse.data.data;
      if (ordersData) {
        const paymentResponse = await useCreateVNPay.mutateAsync(
          ordersData.orderId
        );
        const redirectUrl = paymentResponse?.data?.data?.paymentUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          toast.error("Không nhận được URL thanh toán.");
        }
      }
    } catch (error) {
      toast.error("Lỗi khi tạo vé");
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl my-20 border-2 border-blue-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Xác nhận mua vé
      </h1>

      <div className="space-y-4 text-[16px]">
        {type === "single" && fareMatrix && (
          <div className="p-4 rounded-lg border">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Thông tin vé lượt
            </h2>
            <Row gutter={[0, 12]}>
              <Col span={12} className="text-gray-600">
                Tuyến:
              </Col>
              <Col span={12} className="font-medium">
                {fareMatrix.name}
              </Col>

              <Col span={12} className="text-gray-600">
                Giá vé 1 lượt:
              </Col>
              <Col span={12} className="text-blue-600 font-bold">
                {formatPrice(fareMatrix.price)}
              </Col>

              <Col span={12} className="text-gray-600">
                Số lượng:
              </Col>
              <Col span={12} className="font-medium">
                {quantity}
              </Col>

              <Col span={24}>
                <div className="border-t my-2"></div>
              </Col>

              <Col span={12} className="text-gray-600 !text-lg">
                Tổng tiền:
              </Col>
              <Col span={12} className="text-red-600 font-bold !text-lg">
                {formatPrice(fareMatrix.price * quantity)}
              </Col>
            </Row>
          </div>
        )}

        {type === "days" && ticketType && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Thông tin vé
            </h2>
            <Row gutter={[0, 12]}>
              <Col span={12} className="text-gray-600">
                Loại vé:
              </Col>
              <Col span={12} className="font-medium">
                {ticketType.name}
              </Col>

              <Col span={12} className="text-gray-600">
                Mã vé:
              </Col>
              <Col span={12}>{ticketTypeId}</Col>

              <Col span={12} className="text-gray-600">
                Hiệu lực:
              </Col>
              <Col span={12}>{ticketType.validityDuration} ngày</Col>

              <Col span={12} className="text-gray-600">
                Giá vé:
              </Col>
              <Col span={12} className="text-red-600 font-bold">
                {formatPrice(ticketType.price)}
              </Col>
            </Row>
          </div>
        )}

        <div className="pt-6 border-t mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Chọn phương thức thanh toán
          </h2>
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            size="large"
            className="w-full"
            placeholder="Chọn phương thức thanh toán"
          >
            {paymentMethods?.map((method) => (
              <Option
                key={method.paymentMethodName}
                value={method.paymentMethodId}
              >
                {method.paymentMethodName}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        className="w-full mt-6 rounded-xl font-semibold"
        onClick={handlePayment}
      >
        Thanh toán ngay
      </Button>
    </div>
  );
};

export default OrderPage;
