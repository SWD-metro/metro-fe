import { useLocation } from "react-router-dom";
import { formatPrice } from "src/utils/utils";
import React, { useContext } from "react";
import { Button, Col, Row } from "antd";
import {
  useGetFareMatrixById,
  useGetTicketTypeById,
} from "src/queries/useTicket";
import { AppContext } from "src/contexts/app.context";
import {
  useCreateOrderDaysMutation,
  useCreateOrderSingleMutation,
} from "src/queries/useOrder";
import { useCreateVNPayMutation } from "src/queries/usePayment";
import toast from "react-hot-toast";
import {
  OrderTicketDaysRequest,
  OrderTicketSingleRequest,
} from "src/types/orders.type";
import { BankOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const OrderPage: React.FC = () => {
  const { t } = useTranslation("ticket");
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
      toast.error(t("orderPage.loginRequired"));
      return;
    }

    if (useCreateOrderSingle.isPending || useCreateOrderDays.isPending) return;
    try {
      let orderPayload: OrderTicketSingleRequest | OrderTicketDaysRequest;
      let orderResponse;
      if (type === "single") {
        if (!fareMatrixId) {
          toast.error(t("orderPage.fareInfoNotFound"));
          return;
        }
        orderPayload = {
          userId: profile.userId,
          fareMatrixId: { id: fareMatrixId },
          paymentMethodId: 1,
        };
        orderResponse = await useCreateOrderSingle.mutateAsync(orderPayload);
      } else {
        if (!ticketTypeId) {
          toast.error(t("orderPage.ticketTypeNotFound"));
          return;
        }
        orderPayload = {
          userId: profile.userId,
          ticketId: { id: ticketTypeId },
          paymentMethodId: 1,
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
          toast.error(t("orderPage.paymentUrlNotReceived"));
        }
      }
    } catch (error) {
      toast.error(t("orderPage.errorCreatingTicket"));
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl my-20 border-2 border-blue-100 shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        {t("orderPage.title")}
      </h1>

      <div className="space-y-6 text-[16px]">
        {type === "single" && fareMatrix && (
          <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/30">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">
              {t("orderPage.singleTicketInfo")}
            </h2>
            <Row gutter={[0, 12]}>
              <Col span={12} className="text-gray-600">
                {t("orderPage.route")}
              </Col>
              <Col span={12} className="font-medium">
                {fareMatrix.name}
              </Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.singleTicketPrice")}
              </Col>
              <Col span={12} className="text-blue-600 font-bold">
                {formatPrice(fareMatrix.price)}
              </Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.quantity")}
              </Col>
              <Col span={12}>{quantity}</Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.purchaseDate")}
              </Col>
              <Col span={12}>
                {new Date(fareMatrix.createdAt).toLocaleDateString("vi-VN")}
              </Col>

              <Col span={24}>
                <div className="border-t my-3"></div>
              </Col>

              <Col span={12} className="text-lg text-gray-800 font-semibold">
                {t("orderPage.totalAmount")}
              </Col>
              <Col span={12} className="text-lg font-bold text-red-600">
                {formatPrice(fareMatrix.price * quantity)}
              </Col>
            </Row>
          </div>
        )}

        {type === "days" && ticketType && (
          <div className="p-6 rounded-xl border border-yellow-100 bg-yellow-50/40">
            <h2 className="text-lg font-semibold text-yellow-700 mb-4">
              {t("orderPage.multiDayTicketInfo")}
            </h2>
            <Row gutter={[0, 12]}>
              <Col span={12} className="text-gray-600">
                {t("orderPage.ticketType")}
              </Col>
              <Col span={12} className="font-medium">
                {ticketType.name}
              </Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.description")}
              </Col>
              <Col span={12} className="text-gray-700 italic">
                {ticketType.description}
              </Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.ticketPrice")}
              </Col>
              <Col span={12} className="text-red-600 font-bold">
                {formatPrice(ticketType.price)}
              </Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.forStudents")}
              </Col>
              <Col span={12}>
                {ticketType.forStudent ? t("orderPage.yes") : t("orderPage.no")}
              </Col>

              <Col span={12} className="text-gray-600">
                {t("orderPage.createdDate")}
              </Col>
              <Col span={12}>
                {new Date(ticketType.createdAt).toLocaleDateString("vi-VN")}
              </Col>
            </Row>
          </div>
        )}
      </div>

      <Button
        type="primary"
        size="large"
        className="w-full mt-8 rounded-xl font-semibold shadow-md"
        onClick={handlePayment}
      >
        {t("orderPage.payNowVNPay")} <BankOutlined />
      </Button>
    </div>
  );
};

export default OrderPage;
