import React, { useState } from "react";
import { Card, Spin, Select, Tag, Drawer, Row, Col } from "antd";
import {
  EnvironmentOutlined,
  NodeIndexOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useGetStationList } from "src/queries/useStation";
import { StationsResponse } from "src/types/stations.type";
import { useGetRouteList } from "src/queries/useRoute";
import { Train } from "lucide-react";

const StationMapPage: React.FC = () => {
  const [selectedStation, setSelectedStation] =
    useState<StationsResponse | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationList();

  const { data: routesData, isLoading: routesLoading } = useGetRouteList();

  const stations = stationsData?.data?.data || [];
  const routes = routesData?.data?.data || [];

  const filteredStations = selectedRoute
    ? stations.filter((s) => s.routeId === selectedRoute)
    : stations;

  const sortedStations = [...filteredStations].sort(
    (a, b) => a.sequenceOrder - b.sequenceOrder
  );

  const getStationPosition = (
    station: StationsResponse,
    index: number,
    total: number
  ) => {
    if (index < stations.length) {
      return {
        left: `${8 + index * 6.5}%`,
        top: `${10 + index * 6.5}%`,
      };
    }

    const progress = index / Math.max(total - 1, 1);
    return {
      left: `${15 + progress * 75}%`,
      top: `${15 + progress * 35}%`,
    };
  };

  const handleStationClick = (station: StationsResponse) => {
    setSelectedStation(station);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-800 mb-2 flex items-center justify-center gap-3">
            <Train className="text-blue-600" size={40} />
            Bản đồ Metro HCMC
          </h1>
        </div>

        <Card className="!mb-6 !border-1 !border-black">
          <div className="flex items-center gap-3">
            <span className="font-medium text-cyan-800">Tuyến:</span>
            <Select
              style={{ width: 300 }}
              placeholder="Chọn tuyến"
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
            <div className="mt-4 pt-4 border-gray-200">
              <div className="flex flex-wrap gap-3">
                {routes.map((route) => (
                  <div key={route.routeId} className="flex items-center gap-2">
                    <NodeIndexOutlined className="!text-cyan-800" />
                    <span className="text-sm font-bold text-cyan-600">
                      Tuyến {route.routeId}: {route.routeName} (
                      {route.distanceInKm}km)
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-cyan-600">
                    Tổng số Ga:{" "}
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
            <Row>
              <Col xs={24} lg={18}>
                <Card bodyStyle={{ padding: 0 }}>
                  <div className="relative">
                    {stationsLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                        <Spin size="large" tip="Đang tải bản đồ..." />
                      </div>
                    )}

                    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                      {sortedStations.length > 1 && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 1 }}
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          {Object.entries(
                            sortedStations.reduce((acc, station) => {
                              if (!acc[station.routeId])
                                acc[station.routeId] = [];
                              acc[station.routeId].push(station);
                              return acc;
                            }, {} as Record<number, StationsResponse[]>)
                          ).map(([routeId, routeStations]) => {
                            const sortedRouteStations = routeStations.sort(
                              (a, b) => a.sequenceOrder - b.sequenceOrder
                            );

                            return (
                              <g key={routeId}>
                                {sortedRouteStations.map((station, index) => {
                                  if (index === sortedRouteStations.length - 1)
                                    return null;

                                  const currentPos = getStationPosition(
                                    station,
                                    index,
                                    sortedRouteStations.length
                                  );
                                  const nextStation =
                                    sortedRouteStations[index + 1];
                                  const nextPos = getStationPosition(
                                    nextStation,
                                    index + 1,
                                    sortedRouteStations.length
                                  );

                                  return (
                                    <g key={`${routeId}-${index}`}>
                                      <line
                                        x1={parseFloat(
                                          currentPos.left.replace("%", "")
                                        )}
                                        y1={parseFloat(
                                          currentPos.top.replace("%", "")
                                        )}
                                        x2={parseFloat(
                                          nextPos.left.replace("%", "")
                                        )}
                                        y2={parseFloat(
                                          nextPos.top.replace("%", "")
                                        )}
                                        stroke={"#1890ff"}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        opacity="0.3"
                                      />
                                      <line
                                        x1={parseFloat(
                                          currentPos.left.replace("%", "")
                                        )}
                                        y1={parseFloat(
                                          currentPos.top.replace("%", "")
                                        )}
                                        x2={parseFloat(
                                          nextPos.left.replace("%", "")
                                        )}
                                        y2={parseFloat(
                                          nextPos.top.replace("%", "")
                                        )}
                                        stroke={"#1890ff"}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                      />
                                    </g>
                                  );
                                })}
                              </g>
                            );
                          })}
                        </svg>
                      )}

                      {sortedStations.map((station, index) => {
                        const position = getStationPosition(
                          station,
                          index,
                          sortedStations.length
                        );
                        return (
                          <div
                            key={station.stationId}
                            className="absolute w-8 h-8 rounded-full border-4 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-10"
                            style={{
                              left: position.left,
                              top: position.top,
                              backgroundColor: "#1890ff",
                              transform: "translate(-50%, -50%)",
                            }}
                            onClick={() => handleStationClick(station)}
                            title={station.name}
                          >
                            <Train size={16} color="white" />

                            <div className="absolute -bottom-7 -left-2 transform -translate-x-1/2 text-cyan-800 px-2 py-1 text-xs font-bold whitespace-nowrap">
                              {station.name}
                            </div>

                            {station.status === "open" && (
                              <div
                                className="absolute inset-0 rounded-full animate-ping"
                                style={{
                                  backgroundColor: "#1890ff",
                                  opacity: 0.4,
                                }}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={6}>
                <Card title="Danh sách Ga">
                  <div className="space-y-3 max-h-[800px] overflow-y-auto">
                    {stationsLoading ? (
                      <div className="flex justify-center py-8">
                        <Spin tip="Đang tải danh sách Ga..." />
                      </div>
                    ) : sortedStations.length === 0 ? (
                      <div className="text-center py-8 text-cyan-800">
                        <EnvironmentOutlined
                          style={{ fontSize: "48px", color: "#d1d5db" }}
                        />
                        <p className="mt-2">Không có Ga nào</p>
                      </div>
                    ) : (
                      sortedStations.map((station) => (
                        <div
                          key={station.stationId}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative"
                          onClick={() => handleStationClick(station)}
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
                              {station.name}
                            </h4>
                            <div>
                              <Tag color="blue">{station.stationCode}</Tag>
                              <Tag color="green">{station.status}</Tag>
                            </div>
                          </div>

                          <p className="text-sm text-cyan-600">
                            <EnvironmentOutlined className="mr-1" />
                            {station.address}
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

        <Drawer
          title={
            <div className="flex items-center gap-2">
              <Train className="text-blue-600" />
              Thông tin Ga
            </div>
          }
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={400}
        >
          {selectedStation && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4">
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  {selectedStation.name}
                </h3>
                <div className="text-sm text-cyan-600">
                  Ga thứ{" "}
                  <span className="font-bold text-blue-600">
                    #{selectedStation.sequenceOrder}
                  </span>{" "}
                  trên tuyến
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <InfoCircleOutlined className="text-yellow-600" />
                  <span className="font-medium text-yellow-800">Kết nối</span>
                </div>
                <div className="text-sm text-yellow-600">
                  {selectedStation.sequenceOrder > 1 && (
                    <p>
                      ← Ga trước:{" "}
                      <strong>
                        Ga{" "}
                        {sortedStations[selectedStation.sequenceOrder - 2].name}
                      </strong>
                    </p>
                  )}
                  {selectedStation.sequenceOrder < sortedStations.length && (
                    <p>
                      → Ga sau:{" "}
                      <strong>
                        Ga {sortedStations[selectedStation.sequenceOrder].name}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default StationMapPage;
