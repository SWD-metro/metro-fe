import React, { useState } from "react";
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
  useCreateTicketTypeMutation,
  useGetTicketTypeList,
} from "src/queries/useTicket";
import { TicketTypeResponse } from "src/types/tickets.type";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type TicketType = "single" | "days";

interface SingleTicketPrice {
  from: string;
  to: string;
  price: number;
}

const { Option } = Select;
const { TabPane } = Tabs;

const BuyTicketPage: React.FC = () => {
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType>("single");
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTicketInfo, setSelectedTicketInfo] =
    useState<TicketTypeResponse | null>(null);
  const navigate = useNavigate();

  const { data: stations } = useGetStationList();
  const stationsList = stations?.data?.data || [];

  const { data: ticketTypes } = useGetTicketTypeList();
  const ticketTypesList = ticketTypes?.data?.data || [];

  const useCreateTicketType = useCreateTicketTypeMutation();

  const singleTicketPrices: SingleTicketPrice[] = [
    // Từ BT
    { from: "1", to: "2", price: 6000 },
    { from: "1", to: "3", price: 6000 },
    { from: "1", to: "4", price: 6000 },
    { from: "1", to: "5", price: 6000 },
    { from: "1", to: "6", price: 6000 },
    { from: "1", to: "7", price: 6000 },
    { from: "1", to: "8", price: 8000 },
    { from: "1", to: "9", price: 9000 },
    { from: "1", to: "10", price: 11000 },
    { from: "1", to: "11", price: 13000 },
    { from: "1", to: "12", price: 15000 },
    { from: "1", to: "13", price: 17000 },
    { from: "1", to: "14", price: 19000 },

    // Từ NTPT
    { from: "2", to: "1", price: 6000 },
    { from: "2", to: "3", price: 6000 },
    { from: "2", to: "4", price: 6000 },
    { from: "2", to: "5", price: 6000 },
    { from: "2", to: "6", price: 6000 },
    { from: "2", to: "7", price: 6000 },
    { from: "2", to: "8", price: 7000 },
    { from: "2", to: "9", price: 9000 },
    { from: "2", to: "10", price: 10000 },
    { from: "2", to: "11", price: 12000 },
    { from: "2", to: "12", price: 15000 },
    { from: "2", to: "13", price: 16000 },
    { from: "2", to: "14", price: 19000 },
  ];

  const getSingleTicketPrice = (from: string, to: string) => {
    if (!from || !to || from === to) return 0;

    let priceData = singleTicketPrices.find(
      (p) => p.from === from && p.to === to
    );

    if (!priceData) {
      priceData = singleTicketPrices.find(
        (p) => p.from === to && p.to === from
      );
    }

    return priceData?.price || 10000;
  };

  const calculatePrice = () => {
    if (selectedTicketType === "single") {
      const singlePrice = getSingleTicketPrice(fromStation, toStation);
      return singlePrice * quantity;
    } else if (selectedTicketInfo) {
      return selectedTicketInfo.price * quantity;
    }
    return 0;
  };

  const handleBooking = async () => {
    if (selectedTicketType === "single" && (!fromStation || !toStation)) {
      toast.error("Vui lòng chọn ga đi và ga đến");
      return;
    }

    if (selectedTicketType !== "single" && !selectedTicketInfo) {
      toast.error("Vui lòng chọn loại vé");
      return;
    }

    if (useCreateTicketType.isPending) return;

    try {
      let ticket;

      if (selectedTicketType === "single") {
        console.log();
      } else {
        const ticketTypeId = selectedTicketInfo?.id;
        if (!ticketTypeId) {
          toast.error("Không tìm thấy loại vé hợp lệ");
          return;
        }
        ticket = await useCreateTicketType.mutateAsync(ticketTypeId);
      }
      console.log(ticket);
      const id = ticket?.data.data?.id;
      if (id) {
        toast.success("Đặt vé thành công!");
        navigate(`/order/${id}`);
      }
    } catch (error) {
      toast.error("Lỗi khi tạo vé");
      console.log(error);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
      setFromStation("");
      setToStation("");
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
                              key={station.stationCode}
                              value={station.stationCode}
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
                              (station) => station.stationCode !== fromStation
                            )
                            .map((station) => (
                              <Option
                                key={station.stationCode}
                                value={station.stationCode}
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
                          max={10}
                          value={quantity}
                          onChange={(value) => setQuantity(value || 1)}
                          className="w-full"
                          size="large"
                        />
                      </div>
                    </div>
                    {fromStation && toStation && fromStation !== toStation && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-cyan-800 mb-2">
                          Thông tin giá vé
                        </h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-cyan-800">
                            {
                              stationsList.find(
                                (s) => s.stationCode === fromStation
                              )?.name
                            }{" "}
                            →{" "}
                            {
                              stationsList.find(
                                (s) => s.stationCode === toStation
                              )?.name
                            }
                          </span>
                          <span className="font-bold text-blue-600 text-lg">
                            {formatPrice(
                              getSingleTicketPrice(fromStation, toStation)
                            )}
                          </span>
                        </div>
                        {quantity > 1 && (
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                            <span className="text-sm text-cyan-800">
                              Tổng cộng ({quantity} vé):
                            </span>
                            <span className="font-bold text-blue-600 text-lg">
                              {formatPrice(calculatePrice())}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CreditCardOutlined />
                      Các loại vé khác
                    </span>
                  }
                  key="day"
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
                        {ticketTypesList.map((ticket) => (
                          <div key={ticket.id} className="relative">
                            <Radio
                              value={ticket.id}
                              className="absolute top-4 right-4 z-10"
                            ></Radio>
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
                        ))}
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
                              (s) => s.stationCode === fromStation
                            )?.name
                          }{" "}
                          →{" "}
                          {
                            stationsList.find(
                              (s) => s.stationCode === toStation
                            )?.name
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

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-cyan-800 mb-2">
                    Vé theo thời gian
                  </div>
                  <div className="space-y-1 text-sm">
                    {ticketTypesList.map((ticket) => (
                      <div key={ticket.id} className="flex justify-between">
                        <span>{ticket.name}</span>
                        <span className="font-medium text-green-600">
                          {formatPrice(ticket.price)}
                        </span>
                      </div>
                    ))}
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
