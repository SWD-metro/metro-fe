import React, { useContext, useState } from "react";
import { Card, Button, Select, Tabs, Row, Col, Radio, Divider } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import background from "src/assets/feature_section.png";
import background2 from "src/assets/stats_section.jpg";
import { useGetStationRoutesById } from "src/queries/useStation";
import {
  useGetFareMatricesList,
  useGetTicketTypeList,
} from "src/queries/useTicket";
import { TicketTypeResponse } from "src/types/tickets.type";
import toast from "react-hot-toast";
import { formatPrice } from "src/utils/utils";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { useGetRouteList } from "src/queries/useRoute";
import { AppContext } from "src/contexts/app.context";
import { GraduationCap } from "lucide-react";
import path from "src/constants/path";
import { useTranslation } from "react-i18next";

type TicketType = "single" | "days";

const { Option } = Select;
const { TabPane } = Tabs;

const BuyTicketPage: React.FC = () => {
  const { t } = useTranslation("ticket");
  const { profile } = useContext(AppContext);
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType>("single");
  const [fromStation, setFromStation] = useState<number | null>(null);
  const [toStation, setToStation] = useState<number | null>(null);
  const [selectedTicketInfo, setSelectedTicketInfo] =
    useState<TicketTypeResponse | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>();
  const navigate = useNavigate();

  const { data: routes } = useGetRouteList();
  const routesList = routes?.data?.data || [];

  const { data: ticketTypes } = useGetTicketTypeList();
  const ticketTypesList = ticketTypes?.data?.data || [];

  const { data: fareMatrices } = useGetFareMatricesList();
  const fareMatricesList = fareMatrices?.data.data || [];

  const { data: stationRouteData } = useGetStationRoutesById(selectedRouteId);
  const stationRoutesList = stationRouteData?.data?.data || [];

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
      return singlePrice * 1;
    } else if (selectedTicketInfo) {
      return selectedTicketInfo.price;
    }
    return 0;
  };

  const handleBooking = async () => {
    if (selectedTicketType === "single" && (!fromStation || !toStation)) {
      toast.error(t("messages.selectStations"));
      return;
    }

    if (selectedTicketType !== "single" && !selectedTicketInfo) {
      toast.error(t("messages.selectTicketType"));
      return;
    }

    try {
      if (selectedTicketType === "single") {
        const fareMatrix = fareMatricesList.find(
          (p) =>
            p.startStationId === fromStation && p.endStationId === toStation
        );

        const fareMatrixId = fareMatrix?.fareMatrixId;
        const price = fareMatrix?.price;

        if (!fareMatrixId || !price) {
          toast.error(t("messages.fareNotFound"));
          return;
        }

        const fromName =
          stationRoutesList.find(
            (s) => s.stationsResponse.stationId === fromStation
          )?.stationsResponse.name || "";
        const toName =
          stationRoutesList.find(
            (s) => s.stationsResponse.stationId === toStation
          )?.stationsResponse.name || "";

        const slug = slugify(`${fromName}-to-${toName}`, {
          lower: true,
          locale: "vi",
          strict: true,
        });

        navigate(`/order/single/${slug}`, {
          state: {
            type: "single",
            fareMatrixId,
            quantity: 1,
          },
        });
      } else {
        const ticketTypeId = selectedTicketInfo?.id;
        const price = selectedTicketInfo?.price;

        if (!ticketTypeId || !price) {
          toast.error(t("messages.ticketTypeNotFound"));
          return;
        }

        const slug = slugify(selectedTicketInfo.description, {
          lower: true,
          locale: "vi",
          strict: true,
        });

        navigate(`/order/days/${slug}`, {
          state: {
            type: "days",
            ticketTypeId,
            quantity: 1,
          },
        });
      }
    } catch (error) {
      toast.error(t("messages.error"));
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
      {!profile?.isStudent && (
        <>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 rounded-2xl p-6 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("studentVerification.title")}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {t("studentVerification.description")}
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow"
              onClick={() => navigate(path.studentRequest)}
            >
              {t("studentVerification.submitRequest")}
            </Button>
          </div>
        </>
      )}
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
                <h2 className="text-2xl font-bold mb-2">
                  {t("buyTicket.title")}
                </h2>
                <p className="text-blue-100">{t("buyTicket.subtitle")}</p>
              </div>

              <Tabs activeKey={selectedTicketType} onChange={handleTabChange}>
                <TabPane
                  tab={
                    <span className="flex items-center gap-2 text-base font-medium">
                      <SwapOutlined />
                      {t("buyTicket.singleTicket")}
                    </span>
                  }
                  key="single"
                >
                  <div className="space-y-8 p-4 bg-white rounded-xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("buyTicket.route")}
                      </label>
                      <Select
                        placeholder={t("buyTicket.selectRoute")}
                        className="w-full"
                        size="large"
                        value={selectedRouteId}
                        onChange={(value) => {
                          setSelectedRouteId(value);
                          setFromStation(null);
                          setToStation(null);
                        }}
                      >
                        {routesList.map((route) => (
                          <Option key={route.routeId} value={route.routeId}>
                            {route.routeName}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <EnvironmentOutlined className="mr-1 text-blue-500" />
                          {t("buyTicket.fromStation")}
                        </label>

                        <Select
                          placeholder={t("buyTicket.selectFromStation")}
                          value={fromStation}
                          onChange={setFromStation}
                          className="w-full"
                          size="large"
                        >
                          {stationRoutesList.map((station) => {
                            const stationInfo = station.stationsResponse;
                            const isInactive = station.status !== "active";
                            const isDisabled = isInactive;

                            return (
                              <Option
                                key={stationInfo.stationId}
                                value={stationInfo.stationId}
                                disabled={isDisabled}
                                style={{
                                  opacity: isInactive ? 0.5 : 1,
                                  color: isInactive ? "#9ca3af" : "inherit",
                                }}
                              >
                                <div style={{ padding: "0.5rem 0" }}>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      color: "#1f2937",
                                    }}
                                  >
                                    {stationInfo.name} (
                                    {stationInfo.stationCode})
                                    {isInactive &&
                                      ` (${t("buyTicket.unavailable")})`}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.875rem",
                                      color: "#6b7280",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {stationInfo.address}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      color:
                                        station.status === "active"
                                          ? "#059669"
                                          : "#dc2626",
                                      marginTop: "1px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    ● {station.status.toUpperCase()}
                                  </div>
                                </div>
                              </Option>
                            );
                          })}
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <EnvironmentOutlined className="mr-1 text-green-500" />
                          {t("buyTicket.toStation")}
                        </label>
                        <Select
                          placeholder={t("buyTicket.selectToStation")}
                          value={toStation}
                          onChange={setToStation}
                          className="w-full"
                          size="large"
                        >
                          {stationRoutesList
                            .filter(
                              (station) =>
                                station.stationsResponse.stationId !==
                                fromStation
                            )
                            .map((station) => {
                              const stationInfo = station.stationsResponse;
                              const isInactive = station.status !== "active";
                              const isDisabled = isInactive;

                              return (
                                <Option
                                  key={stationInfo.stationId}
                                  value={stationInfo.stationId}
                                  disabled={isDisabled}
                                  style={{
                                    opacity: isInactive ? 0.5 : 1,
                                    color: isInactive ? "#9ca3af" : "inherit",
                                  }}
                                >
                                  <div style={{ padding: "0.5rem 0" }}>
                                    <div
                                      style={{
                                        fontWeight: 600,
                                        color: "#1f2937",
                                      }}
                                    >
                                      {stationInfo.name} (
                                      {stationInfo.stationCode})
                                      {isInactive &&
                                        ` (${t("buyTicket.unavailable")})`}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.875rem",
                                        color: "#6b7280",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {stationInfo.address}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.75rem",
                                        color:
                                          station.status === "active"
                                            ? "#059669"
                                            : "#dc2626",
                                        marginTop: "1px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      ● {station.status.toUpperCase()}
                                    </div>
                                  </div>
                                </Option>
                              );
                            })}
                        </Select>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                      {t("buyTicket.priceNote")}
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CreditCardOutlined />
                      {t("buyTicket.multiDayTicket")}
                    </span>
                  }
                  key="days"
                >
                  {selectedTicketInfo && (
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4">
                      <span className="text-sm text-blue-500">
                        {t("buyTicket.selected")}{" "}
                        <strong>{selectedTicketInfo.name}</strong>
                      </span>
                      <Button type="primary" onClick={resetTicketSelection}>
                        {t("buyTicket.deselect")}
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
                        {ticketTypesList
                          .filter(
                            (ticket) =>
                              (!ticket.forStudent ||
                                profile?.isStudent === true) &&
                              ticket.price > 0
                          )
                          .map((ticket) => (
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
                                    {t("buyTicket.validity")}{" "}
                                    {ticket.validityDuration}{" "}
                                    {t("buyTicket.days")}
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
                  {t("buyTicket.bookingInfo")}
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded"></div>
              </div>

              <div className="space-y-4">
                {selectedTicketType === "single" &&
                  fromStation &&
                  toStation && (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                        <span className="text-sm text-cyan-800">
                          {t("buyTicket.routeLabel")}
                        </span>
                        <span
                          className="font-medium text-sm text-ellipsis overflow-hidden whitespace-nowrap max-w-full sm:max-w-[70%]"
                          title={`${
                            stationRoutesList.find(
                              (s) =>
                                s.stationsResponse.stationId === fromStation
                            )?.stationsResponse.name
                          } → ${
                            stationRoutesList.find(
                              (s) => s.stationsResponse.stationId === toStation
                            )?.stationsResponse.name
                          }`}
                        >
                          {
                            stationRoutesList.find(
                              (s) =>
                                s.stationsResponse.stationId === fromStation
                            )?.stationsResponse.name
                          }{" "}
                          →{" "}
                          {
                            stationRoutesList.find(
                              (s) => s.stationsResponse.stationId === toStation
                            )?.stationsResponse.name
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyan-800">
                          {t("buyTicket.singleTicketPrice")}
                        </span>
                        <span className="font-bold text-blue-600 text-base">
                          {formatPrice(
                            getSingleTicketPrice(fromStation, toStation)
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                {selectedTicketType !== "single" && selectedTicketInfo && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-800">
                        {t("buyTicket.ticketType")}
                      </span>
                      <span className="font-medium text-sm">
                        {selectedTicketInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-800">
                        {t("buyTicket.ticketPrice")}
                      </span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(selectedTicketInfo.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyan-800">
                        {t("buyTicket.validityLabel")}
                      </span>
                      <span className="font-medium text-sm">
                        {selectedTicketInfo.validityDuration}{" "}
                        {t("buyTicket.days")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>{t("buyTicket.totalAmount")}</span>
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
                  {t("buyTicket.buyNow")}
                </Button>
              </div>

              <Divider />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BuyTicketPage;
