/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Card, Select, Tag, Row, Col, Spin } from "antd";
import { Train, Loader2 } from "lucide-react";
import { EnvironmentOutlined, NodeIndexOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { BusStation, StationRouteResponse } from "src/types/stations.type";
import { useGetRouteList } from "src/queries/useRoute";
import { useGetScheduleByStationId } from "src/queries/useSchedule";
import { useGetBusByStationId, useGetBusList } from "src/queries/useBus";
import background from "src/assets/stats_section.jpg";
import { useGetStationRoutesById } from "src/queries/useStation";
import MapView from "src/components/MapView";

const StationMapPage: React.FC = () => {
  const { t } = useTranslation("map");

  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] =
    useState<StationRouteResponse | null>(null);
  const [selectedBusStation, setSelectedBusStation] =
    useState<BusStation | null>(null);
  const [showBusStations, setShowBusStations] = useState(true);

  const { data: routesData, isLoading: routesLoading } = useGetRouteList();
  const { data: busData, isLoading: busLoading } = useGetBusList();
  const { data: stationRouteData, isLoading: stationRouteLoading } =
    useGetStationRoutesById(selectedRoute!);

  const routes = routesData?.data.data || [];
  const busStations = busData?.data.data || [];
  const stationRoutesList = stationRouteData?.data?.data || [];

  const initialLoading = routesLoading || busLoading;
  const contentLoading = stationRouteLoading;

  const filteredStations = selectedRoute
    ? stationRoutesList.filter((s) => s.RouteId === selectedRoute)
    : [];

  const sortedStations = [...filteredStations].sort(
    (a, b) => a.sequenceOrder - b.sequenceOrder
  );

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetScheduleByStationId(selectedStation?.stationsResponse.stationId);
  const schedules = schedulesData?.data.data;
  const { data: busStationDetailData, isLoading: busStationDetailLoading } =
    useGetBusByStationId(selectedBusStation?.id || 0);
  const busStationDetail = busStationDetailData?.data.data || [];

  useEffect(() => {
    setSelectedStation(null);
    setSelectedBusStation(null);
  }, [selectedRoute]);

  const handleStationSelect = (station: StationRouteResponse) => {
    setSelectedStation(station);
    setSelectedBusStation(null);
  };

  const handleBusStationSelect = (busStation: BusStation) => {
    setSelectedBusStation(busStation);
    setSelectedStation(null);
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
    setSelectedBusStation(null);
  };

  const handleShowBusStationsChange = (show: boolean) => {
    setShowBusStations(show);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{t("loading.metroMap")}</p>{" "}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-800 mb-2 flex items-center justify-center gap-3">
            <Train className="text-blue-600" size={40} />
            {t("title")}
          </h1>
          <p className="text-lg text-cyan-600">{t("subtitle")}</p>
        </div>

        <Card className="!mb-6 !border-1 !border-black">
          <div className="flex items-center gap-3">
            <span className="font-medium text-cyan-800">
              {t("route.label")}
            </span>
            <Select
              style={{ width: 300 }}
              placeholder={t("route.placeholder")}
              loading={routesLoading}
              allowClear
              value={selectedRoute}
              onChange={setSelectedRoute}
            >
              {routes.map((route) => (
                <Select.Option key={route.routeId} value={route.routeId}>
                  {route.routeName} ({route.routeCode})
                </Select.Option>
              ))}
            </Select>
          </div>

          {selectedRoute && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {routes
                  .filter((route) => route.routeId === selectedRoute)
                  .map((route) => (
                    <div
                      key={route.routeId}
                      className="flex items-center gap-2"
                    >
                      <NodeIndexOutlined className="!text-cyan-800" />
                      <span className="text-sm font-bold text-cyan-600">
                        {t("route.name")}
                        {route.routeId}: {route.routeName} ({route.distanceInKm}
                        km)
                      </span>
                    </div>
                  ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-cyan-600">
                    {t("route.totalStations")}{" "}
                    <span className="font-semibold">
                      {filteredStations.length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {selectedRoute && (
          <>
            <Row gutter={12}>
              <Col xs={24} lg={18}>
                <Card>
                  {contentLoading ? (
                    <div className="flex justify-center py-16">
                      <Spin size="large" tip={t("loading.routeData")} />
                    </div>
                  ) : (
                    <MapView
                      stations={sortedStations}
                      routes={routes.filter((r) => r.routeId === selectedRoute)}
                      busStations={busStations}
                      showBusStations={showBusStations}
                      onShowBusStationsChange={handleShowBusStationsChange}
                      onStationSelect={handleStationSelect}
                      onBusStationSelect={handleBusStationSelect}
                      selectedStation={selectedStation}
                      selectedBusStation={selectedBusStation}
                      busStationDetail={busStationDetail}
                      schedules={schedules || []}
                      schedulesLoading={schedulesLoading}
                      busStationDetailLoading={busStationDetailLoading}
                      onCloseModal={handleCloseModal}
                    />
                  )}
                </Card>
              </Col>
              <Col xs={24} lg={6}>
                <Card title={t("station.list")}>
                  <div className="space-y-3 max-h-144 overflow-y-auto">
                    {contentLoading ? (
                      <div className="flex justify-center py-8">
                        <Spin tip={t("loading.stationList")} />
                      </div>
                    ) : sortedStations.length === 0 ? (
                      <div className="text-center py-8 text-cyan-800">
                        <EnvironmentOutlined
                          style={{ fontSize: "48px", color: "#d1d5db" }}
                        />
                        <p className="mt-2">{t("station.noStations")}</p>
                      </div>
                    ) : (
                      sortedStations.map((station) => (
                        <div
                          key={station.stationsResponse.stationId}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative"
                          onClick={() => handleStationSelect(station)}
                          style={{ borderLeft: `4px solid #1890ff` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-cyan-800 flex items-center gap-2">
                              <span
                                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: "#1890ff" }}
                              >
                                #{station.sequenceOrder}
                              </span>
                              {station.stationsResponse.name}
                            </h4>
                            <div>
                              <Tag color="green">
                                {t(
                                  `station.status.${station.status.toLowerCase()}`
                                ) || station.status}
                              </Tag>
                            </div>
                          </div>

                          <p className="text-sm text-cyan-600">
                            <EnvironmentOutlined className="mr-1" />
                            {station.stationsResponse.address}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default StationMapPage;
