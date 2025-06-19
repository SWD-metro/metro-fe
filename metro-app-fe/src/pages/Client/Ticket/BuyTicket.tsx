import React, { useContext, useState } from "react";
import { Card, Button, Select, Tabs, Row, Col, InputNumber, Radio } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import background from "src/assets/feature_section.png";
import background2 from "src/assets/stats_section.jpg";
import { useGetStationList } from "src/queries/useStation";
import {
  useGetFareMatricesList,
  useGetTicketTypeList,
} from "src/queries/useTicket";
import { TicketTypeResponse } from "src/types/tickets.type";
import toast from "react-hot-toast";
import { formatPrice } from "src/utils/utils";
import {
  useCreateOrderDaysMutation,
  useCreateOrderSingleMutation,
} from "src/queries/useOrder";
import { useCreatePaymentMutation } from "src/queries/usePayment";
import { AppContext } from "src/contexts/app.context";
import {
  OrderTicketDaysRequest,
  OrderTicketSingleRequest,
} from "src/types/orders.type";

type TicketType = "single" | "days";

const { Option } = Select;
const { TabPane } = Tabs;

const BuyTicketPage: React.FC = () => {
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType>("single");
  const [fromStation, setFromStation] = useState<number | null>(null);
  const [toStation, setToStation] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTicketInfo, setSelectedTicketInfo] =
    useState<TicketTypeResponse | null>(null);
  const { profile } = useContext(AppContext);

  const { data: stations } = useGetStationList();
  const stationsList = stations?.data?.data || [];

  const { data: ticketTypes } = useGetTicketTypeList();
  const ticketTypesList = ticketTypes?.data?.data || [];

  const useCreateOrderSingle = useCreateOrderSingleMutation();
  const useCreateOrderDays = useCreateOrderDaysMutation();

  const useCreatePayment = useCreatePaymentMutation();

  const { data: fareMatrices } = useGetFareMatricesList();
  const fareMatricesList = fareMatrices?.data.data || [];

  const getSingleTicketPrice = (from: number, to: number) => {
    if (!from || !to || from === to) return 0;

    let priceData = fareMatricesList.find(
      (p) => p.startStationId === from && p.endStationId === to
    );

    if (!priceData) {
      priceData = fareMatricesList.find(
        (p) => p.startStationId === to && p.endStationId === from
      );
    }

    return priceData?.price || 0;
  };

  const calculatePrice = () => {
    if (selectedTicketType === "single") {
      if (!fromStation || !toStation) return 0;

      const singlePrice = getSingleTicketPrice(fromStation, toStation);
      return singlePrice * quantity;
    } else if (selectedTicketInfo) {
      return selectedTicketInfo.price;
    }
    return 0;
  };

  const handleBooking = async () => {
    if (!profile) {
      toast.error("Vui lòng đăng nhập để đặt vé.");
      return;
    }
    if (selectedTicketType === "single" && (!fromStation || !toStation)) {
      toast.error("Vui lòng chọn ga đi và ga đến");
      return;
    }

    if (selectedTicketType !== "single" && !selectedTicketInfo) {
      toast.error("Vui lòng chọn loại vé");
      return;
    }

    if (useCreateOrderSingle.isPending) return;

    try {
      let orderPayload: OrderTicketSingleRequest | OrderTicketDaysRequest;
      let orderResponse;
      if (selectedTicketType === "single") {
        const fareMatrix = fareMatricesList.find(
          (p) =>
            (p.startStationId === fromStation &&
              p.endStationId === toStation) ||
            (p.startStationId === toStation && p.endStationId === fromStation)
        );

        const fareMatrixId = fareMatrix?.fareMatrixId;
        if (!fareMatrixId) {
          toast.error("Không tìm thấy thông tin giá vé");
          return;
        }
        orderPayload = {
          userId: profile.userId,
          fareMatrixId: { id: fareMatrixId },
          paymentMethodId: 1,
        };
        orderResponse = await useCreateOrderSingle.mutateAsync(orderPayload);
      } else {
        const ticketTypeId = selectedTicketInfo?.id;
        if (!ticketTypeId) {
          toast.error("Không tìm thấy loại vé hợp lệ");
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
        const paymentResponse = await useCreatePayment.mutateAsync(
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

  const handleTicketSelection = (ticket: TicketTypeResponse) => {
    setSelectedTicketInfo(ticket);
  };

  const resetTicketSelection = () => {
    setSelectedTicketInfo(null);
  };

  const handleTabChange = (key: string) => {
    setSelectedTicketType(key as TicketType);
    if (key !== "single") {
      setFromStation(null);
      setToStation(null);
    }
    if (key === "single") {
      resetTicketSelection();
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${background2})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          <Col sm={24} lg={15}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <div
                className="text-white p-6 -m-6 mb-6"
                style={{
                  backgroundImage: `url(${background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h2 className="text-2xl font-bold mb-2">Đặt vé Metro</h2>
                <p className="text-blue-100">
                  Chọn loại vé và thông tin chuyến đi
                </p>
              </div>

              <Tabs activeKey={selectedTicketType} onChange={handleTabChange}>
                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <SwapOutlined />
                      Vé lượt
                    </span>
                  }
                  key="single"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <EnvironmentOutlined className="mr-1" />
                          Ga đi
                        </label>
                        <Select
                          placeholder="Chọn ga đi"
                          value={fromStation}
                          onChange={setFromStation}
                          className="w-full"
                          size="large"
                        >
                          {stationsList.map((station) => (
                            <Option
                              key={station.stationId}
                              value={station.stationId}
                            >
                              {station.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <EnvironmentOutlined className="mr-1" />
                          Ga đến
                        </label>
                        <Select
                          placeholder="Chọn ga đến"
                          value={toStation}
                          onChange={setToStation}
                          className="w-full"
                          size="large"
                        >
                          {stationsList
                            .filter(
                              (station) => station.stationId !== fromStation
                            )
                            .map((station) => (
                              <Option
                                key={station.stationId}
                                value={station.stationId}
                              >
                                {station.name}
                              </Option>
                            ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng vé
                        </label>
                        <InputNumber
                          min={1}
                          value={quantity}
                          onChange={(value) => setQuantity(value || 1)}
                          className="w-full"
                          size="large"
                        />
                      </div>
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CreditCardOutlined />
                      Các loại vé khác
                    </span>
                  }
                  key="days"
                >
                  {selectedTicketInfo && (
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4">
                      <span className="text-sm text-blue-500">
                        Đã chọn: <strong>{selectedTicketInfo.name}</strong>
                      </span>
                      <Button type="primary" onClick={resetTicketSelection}>
                        Bỏ chọn
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    <Radio.Group
                      value={selectedTicketInfo?.id}
                      onChange={(e) => {
                        const selectedTicket = ticketTypesList.find(
                          (ticket) => ticket.id === e.target.value
                        );
                        if (selectedTicket) {
                          handleTicketSelection(selectedTicket);
                        }
                      }}
                      className="w-full"
                    >
                      <div className="space-y-4">
                        {ticketTypesList.map((ticket) =>
                          ticket.price > 0 ? (
                            <div key={ticket.id} className="relative">
                              <Radio
                                value={ticket.id}
                                className="absolute top-4 right-4 z-10"
                              />
                              <div
                                className={`rounded-xl text-white p-6 shadow-lg cursor-pointer transition-all duration-200 ${
                                  selectedTicketInfo?.id === ticket.id
                                    ? "ring-4 ring-blue-300 transform scale-105"
                                    : "hover:transform hover:scale-102"
                                }`}
                                style={{
                                  backgroundImage: `url(${background})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                                onClick={() => handleTicketSelection(ticket)}
                              >
                                {selectedTicketInfo?.id === ticket.id && (
                                  <div className="absolute top-2 left-2">
                                    <CheckCircleOutlined className="text-2xl !text-green-400" />
                                  </div>
                                )}
                                <div className="mb-3 ms-2">
                                  <CalendarOutlined className="text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold">
                                  {ticket.name}
                                </h3>
                                <p className="mt-2">{ticket.description}</p>
                                <div className="flex justify-between items-center mt-3">
                                  <p className="text-2xl font-bold text-green-400">
                                    {formatPrice(ticket.price)}
                                  </p>
                                  <p className="text-2xl font-bold text-green-400">
                                    Hiệu lực: {ticket.validityDuration} ngày
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    </Radio.Group>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          <Col sm={24} lg={9}>
            <Card className="shadow-lg border-0 rounded-xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-2">
                  Thông tin đặt vé
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded"></div>
              </div>

              <div className="space-y-4">
                {selectedTicketType === "single" &&
                  fromStation &&
                  toStation && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-cyan-800">Tuyến:</span>
                        <span className="font-medium text-sm">
                          {
                            stationsList.find(
                              (s) => s.stationId === fromStation
                            )?.name
                          }{" "}
                          →{" "}
                          {
                            stationsList.find((s) => s.stationId === toStation)
                              ?.name
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyan-800">
                          Giá vé lượt:
                        </span>
                        <span className="font-bold text-blue-600">
                          {formatPrice(
                            getSingleTicketPrice(fromStation, toStation)
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-cyan-800">Số lượng:</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                    </div>
                  )}

                {selectedTicketType !== "single" && selectedTicketInfo && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-800">Loại vé:</span>
                      <span className="font-medium text-sm">
                        {selectedTicketInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-800">Giá vé:</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(selectedTicketInfo.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyan-800">Hiệu lực:</span>
                      <span className="font-medium text-sm">
                        {selectedTicketInfo.validityDuration} ngày
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Tổng tiền:</span>
                    <span className="text-2xl text-blue-600">
                      {formatPrice(calculatePrice())}
                    </span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleBooking}
                  className="w-full"
                  disabled={
                    (selectedTicketType === "single" &&
                      (!fromStation || !toStation)) ||
                    (selectedTicketType !== "single" && !selectedTicketInfo)
                  }
                >
                  Đặt vé ngay
                </Button>
              </div>

              <h4 className="text-lg font-bold text-cyan-800 mt-6 mb-4">
                Bảng giá vé Metro HCMC
              </h4>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                    <div className="flex justify-between">
                      <div className="text-sm font-semibold text-cyan-800 mb-2">
                        Vé lượt
                      </div>
                      <span className="font-medium text-blue-600">
                        6.000₫ → 19.000₫
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                      *Giá vé khác nhau tùy theo cặp ga. Chọn ga để xem giá
                      chính xác.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BuyTicketPage;
