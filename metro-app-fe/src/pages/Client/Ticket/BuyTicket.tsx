import React, { useState } from "react";
import {
  Card,
  Button,
  Select,
  Tabs,
  message,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import background from "src/assets/feature_section.png";
import background2 from "src/assets/stats_section.jpg";
import { useGetStationList } from "src/queries/useStation";

const { Option } = Select;
const { TabPane } = Tabs;

interface SingleTicketPrice {
  from: string;
  to: string;
  price: number;
}

interface TicketPrice {
  type: "day" | "3day" | "month" | "student";
  price: number;
}

type TicketType = "single" | "day" | "3day" | "month" | "student";

const BuyTicketPage: React.FC = () => {
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType>("single");
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const { data: stations } = useGetStationList();
  const stationsList = stations?.data?.data || [];

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

  const ticketPrices: TicketPrice[] = [
    { type: "day", price: 30000 },
    { type: "3day", price: 90000 },
    { type: "month", price: 300000 },
    { type: "student", price: 150000 },
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
    } else {
      const priceData = ticketPrices.find((p) => p.type === selectedTicketType);
      return (priceData?.price || 30000) * 1;
    }
  };

  const handleBooking = () => {
    if (selectedTicketType === "single" && (!fromStation || !toStation)) {
      message.error("Vui lòng chọn ga đi và ga đến");
      return;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: `url(${background2})` }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          <Col sm={24} lg={15}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <div
                className="text-white p-6 -m-6 mb-6"
                style={{ backgroundImage: `url(${background})` }}
              >
                <h2 className="text-2xl font-bold mb-2">Đặt vé Metro</h2>
                <p className="text-blue-100">
                  Chọn loại vé và thông tin chuyến đi
                </p>
              </div>

              <Tabs
                activeKey={selectedTicketType}
                onChange={(key) => setSelectedTicketType(key as TicketType)}
              >
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
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CalendarOutlined />
                      Vé ngày
                    </span>
                  }
                  key="day"
                >
                  <div className="text-center py-8">
                    <div
                      className="text-white rounded-lg p-6 inline-block"
                      style={{ backgroundImage: `url(${background})` }}
                    >
                      <CalendarOutlined className="text-3xl mb-2" />
                      <h3 className="text-xl font-bold">Vé ngày - 30.000đ</h3>
                      <p className="text-blue-100 mt-2">
                        Sử dụng không giới hạn trong 24 giờ
                      </p>
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CalendarOutlined />
                      Vé 3 ngày
                    </span>
                  }
                  key="3day"
                >
                  <div className="text-center py-8">
                    <div
                      className="text-white rounded-lg p-6 inline-block"
                      style={{ backgroundImage: `url(${background})` }}
                    >
                      <CalendarOutlined className="text-3xl mb-2" />
                      <h3 className="text-xl font-bold">Vé 3 ngày - 90.000đ</h3>
                      <p className="text-green-100 mt-2">
                        Sử dụng không giới hạn trong 3 ngày
                      </p>
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CreditCardOutlined />
                      Vé tháng
                    </span>
                  }
                  key="month"
                >
                  <div className="text-center py-8">
                    <div
                      className="text-white rounded-lg p-6 inline-block"
                      style={{ backgroundImage: `url(${background})` }}
                    >
                      <CreditCardOutlined className="text-3xl mb-2" />
                      <h3 className="text-xl font-bold">Vé tháng - 300.000đ</h3>
                      <p className="text-purple-100 mt-2">
                        Sử dụng không giới hạn trong 30 ngày
                      </p>
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CreditCardOutlined />
                      Vé HS-SV
                    </span>
                  }
                  key="student"
                >
                  <div className="text-center py-8">
                    <div
                      className="text-white rounded-lg p-6 inline-block"
                      style={{ backgroundImage: `url(${background})` }}
                    >
                      <CreditCardOutlined className="text-3xl mb-2" />
                      <h3 className="text-xl font-bold">
                        Vé HS-SV tháng - 150.000đ
                      </h3>
                      <p className="text-orange-100 mt-2">
                        Dành cho học sinh, sinh viên (cần xuất trình thẻ)
                      </p>
                    </div>
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

              <div className="space-y-2">
                {selectedTicketType === "single" &&
                  fromStation &&
                  toStation && (
                    <div className="bg-gray-50 p-2 rounded-lg">
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
                    </div>
                  )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-800">Loại vé:</span>
                    <span className="font-medium">
                      {selectedTicketType === "single"
                        ? "Vé lượt"
                        : selectedTicketType === "day"
                        ? "Vé ngày"
                        : selectedTicketType === "3day"
                        ? "Vé 3 ngày"
                        : selectedTicketType === "month"
                        ? "Vé tháng"
                        : "Vé HS-SV tháng"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-800">Số lượng:</span>
                    <span className="font-medium">
                      {selectedTicketType === "single" ? quantity : 1}
                    </span>
                  </div>
                </div>

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
                        6.000đ → 19.000đ
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
                    <div className="flex justify-between">
                      <span>Vé ngày</span>
                      <span className="font-medium text-green-600">
                        30.000đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vé 3 ngày</span>
                      <span className="font-medium text-green-600">
                        90.000đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vé tháng</span>
                      <span className="font-medium text-green-600">
                        300.000đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vé HS-SV tháng</span>
                      <span className="font-medium text-orange-600">
                        150.000đ
                      </span>
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
