/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Map as MapIcon,
  MapPin,
  Navigation,
  Bus,
  Train,
  Info,
  Route,
  Circle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { StationRouteResponse } from "src/types/stations.type";
import { RoutesResponse } from "src/types/routes.type";
import { BusStation, BusStationDetail } from "src/types/stations.type";
import { SchedulesResponse } from "src/types/schedules.type";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  stations: StationRouteResponse[];
  routes: RoutesResponse[];
  busStations: BusStation[];
  showBusStations: boolean;
  onShowBusStationsChange: (show: boolean) => void;
  onStationSelect: (station: StationRouteResponse) => void;
  onBusStationSelect: (busStation: BusStation) => void;
  selectedStation: StationRouteResponse | null;
  selectedBusStation: BusStation | null;
  busStationDetail: BusStationDetail | null;
  schedules: SchedulesResponse[];
  schedulesLoading: boolean;
  busStationDetailLoading: boolean;
  onCloseModal: () => void;
}

const createStationIcon = (status: string) => {
  const color = status === "open" ? "#10b981" : "#ef4444";
  const trainIconSvg = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="white"/>
      <path d="m4 10 16 0" stroke="white" stroke-width="2"/>
      <path d="m6 14 0 2" stroke="white" stroke-width="2"/>
      <path d="m18 14 0 2" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return L.divIcon({
    className: "custom-station-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${trainIconSvg}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createBusStationIcon = (isActive: number) => {
  const color = isActive === 1 ? "#10b981" : "#6b7280";
  const busIconSvg = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6v6" stroke="${color}" stroke-width="2"/>
      <path d="M16 6v6" stroke="${color}" stroke-width="2"/>
      <path d="M2 12h19.6" stroke="${color}" stroke-width="2"/>
      <path d="m2 7 1.7-3.3c.4-.8 1.2-1.2 2.1-1.2h12.4c.9 0 1.7.4 2.1 1.2L22 7" stroke="${color}" stroke-width="2"/>
      <path d="m20 17.5c0 .8-.7 1.5-1.5 1.5S17 18.3 17 17.5s.7-1.5 1.5-1.5s1.5.7 1.5 1.5Z" stroke="${color}" stroke-width="2"/>
      <path d="m7 17.5c0 .8-.7 1.5-1.5 1.5S4 18.3 4 17.5s.7-1.5 1.5-1.5S7 16.7 7 17.5Z" stroke="${color}" stroke-width="2"/>
      <path d="M5 12V7h14v5" stroke="${color}" stroke-width="2"/>
    </svg>
  `;

  return L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background-color: white;
        border-radius: 6px;
        border: 2px solid ${color};
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${busIconSvg}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const LoaderContainer: React.FC<{ text?: string }> = ({ text }) => {
  const { t } = useTranslation("home");

  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">
        {text || t("loading.general")}
      </span>{" "}
    </div>
  );
};

const MapView: React.FC<MapViewProps> = ({
  stations,
  routes,
  busStations,
  showBusStations,
  onShowBusStationsChange,
  onStationSelect,
  onBusStationSelect,
  selectedStation,
  selectedBusStation,
  busStationDetail,
  schedules,
  schedulesLoading,
  busStationDetailLoading,
  onCloseModal,
}) => {
  const { t } = useTranslation("map");

  const getDisplayedBusStations = (): BusStation[] => {
    if (!showBusStations) return [];
    return busStations.filter((busStation) => {
      return busStation.latitude && busStation.longitude;
    });
  };

  const getMapCenter = (): [number, number] => {
    const displayedBusStations = getDisplayedBusStations();
    const allStations = [...stations, ...displayedBusStations];
    if (allStations.length === 0) return [10.8231, 106.6297];

    const validStations = allStations.filter((s) => {
      if ("stationsResponse" in s) {
        return s.stationsResponse.latitude && s.stationsResponse.longitude;
      }
      return s.latitude && s.longitude;
    });
    if (validStations.length === 0) return [10.8231, 106.6297];

    const avgLat =
      validStations.reduce((sum, station) => {
        if ("stationsResponse" in station) {
          return sum + station.stationsResponse.latitude;
        }
        return sum + station.latitude;
      }, 0) / validStations.length;

    const avgLng =
      validStations.reduce((sum, station) => {
        if ("stationsResponse" in station) {
          return sum + station.stationsResponse.longitude;
        }
        return sum + station.longitude;
      }, 0) / validStations.length;

    return [avgLat, avgLng];
  };

  const getRoutePolylines = () => {
    const stationsByRoute = stations.reduce((acc, station) => {
      if (!acc[station.RouteId]) acc[station.RouteId] = [];
      acc[station.RouteId].push(station);
      return acc;
    }, {} as Record<number, StationRouteResponse[]>);

    return Object.entries(stationsByRoute)
      .map(([routeId, routeStations]) => {
        const sortedStations = routeStations
          .filter(
            (s) => s.stationsResponse.latitude && s.stationsResponse.longitude
          )
          .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

        const coordinates: [number, number][] = sortedStations.map(
          (station) => [
            station.stationsResponse.latitude,
            station.stationsResponse.longitude,
          ]
        );

        return {
          routeId: parseInt(routeId),
          coordinates,
          route: routes.find((r) => r.routeId === parseInt(routeId)),
        };
      })
      .filter((route) => route.coordinates.length > 1);
  };

  const mapCenter = getMapCenter();
  const routePolylines = getRoutePolylines();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-cyan-800 mb-4 flex items-center">
          <MapIcon className="w-5 h-5 mr-2 text-blue-600" />
          {t("map.title")}
        </h2>

        <div className="h-144 rounded-lg overflow-hidden border border-gray-200 relative">
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
            <div className="flex flex-col space-y-3">
              <div className="border-b pb-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showBusStations}
                    onChange={(e) => onShowBusStationsChange(e.target.checked)}
                    className="rounded"
                  />
                  {showBusStations ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  <span>{t("busStation.show")}</span>{" "}
                </label>
              </div>
              {showBusStations && (
                <div className="text-xs text-gray-500 flex items-center">
                  <Bus className="w-3 h-3 mr-1" />
                  {t("busStation.showing", {
                    displayed: getDisplayedBusStations().length,
                    total: busStations.length,
                  })}{" "}
                </div>
              )}
            </div>
          </div>

          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {routePolylines.map((routeLine) => (
              <Polyline
                key={routeLine.routeId}
                positions={routeLine.coordinates}
                color="#2563eb"
                weight={4}
                opacity={0.8}
              />
            ))}

            {stations
              .filter(
                (station) =>
                  station.stationsResponse.latitude &&
                  station.stationsResponse.longitude
              )
              .map((station) => (
                <Marker
                  key={station.stationsResponse.stationId}
                  position={[
                    station.stationsResponse.latitude,
                    station.stationsResponse.longitude,
                  ]}
                  icon={createStationIcon(station.status)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <Train className="w-4 h-4 mr-1" />
                        {station.stationsResponse.name}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center">
                          <Circle className="w-3 h-3 mr-1" />
                          <strong>{t("common.code")}:</strong>{" "}
                          {station.stationsResponse.stationCode}
                        </p>
                        <p className="flex items-center">
                          <Navigation className="w-3 h-3 mr-1" />
                          <strong>{t("common.sequence")}:</strong>{" "}
                          {station.sequenceOrder}
                        </p>
                        <p className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <strong>{t("common.status")}:</strong>{" "}
                          <span
                            className={`ml-1 font-medium ${
                              station.stationsResponse.status === "open"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {t(
                              `station.status.${station.status.toLowerCase()}`
                            ) || station.status}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <Route className="w-3 h-3 mr-1" />
                          <strong>{t("common.route")}:</strong>{" "}
                          {
                            routes.find((r) => r.routeId === station.RouteId)
                              ?.routeName
                          }
                        </p>
                        {station.stationsResponse.address && (
                          <p className="flex items-start">
                            <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                            <strong>{t("common.address")}:</strong>{" "}
                            {station.stationsResponse.address}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onStationSelect(station)}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        {t("map.viewDetails")}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {getDisplayedBusStations().map((busStation) => (
              <Marker
                key={busStation.id}
                position={[busStation.latitude, busStation.longitude]}
                icon={createBusStationIcon(busStation.isActive)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Bus className="w-4 h-4 mr-1" />
                      {busStation.name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <Circle className="w-3 h-3 mr-1" />
                        <strong>{t("common.code")}:</strong> {busStation.code}{" "}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <strong>{t("common.status")}:</strong>{" "}
                        <span
                          className={`ml-1 font-medium ${
                            busStation.isActive === 1
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {t(
                            `common.${
                              busStation.isActive === 1 ? "active" : "inactive"
                            }`
                          )}{" "}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <Bus className="w-3 h-3 mr-1" />
                        <strong>{t("common.type")}:</strong>{" "}
                        {t("busStation.information")}{" "}
                      </p>
                      {busStation.address && (
                        <p className="flex items-start">
                          <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                          <strong>{t("common.address")}:</strong>{" "}
                          {busStation.address}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onBusStationSelect(busStation)}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Info className="w-3 h-3 mr-1" />
                      {t("map.viewDetails")}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <Modal
        title={
          selectedStation ? (
            <div className="bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
              <h1 className="text-2xl font-bold flex items-center">
                <Train className="w-6 h-6 mr-2" />
                {selectedStation?.stationsResponse.name}
              </h1>
              <p className="text-blue-100 mt-1 flex items-center">
                <Route className="w-4 h-4 mr-1" />
                {selectedStation &&
                  routes.find((r) => r.routeId === selectedStation.RouteId)
                    ?.routeName}{" "}
                - {selectedStation?.stationsResponse.stationCode}
              </p>
            </div>
          ) : selectedBusStation ? (
            <div className="bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
              <h1 className="text-2xl font-bold flex items-center">
                <Bus className="w-6 h-6 mr-2" />
                {selectedBusStation?.name}
              </h1>
              <p className="text-blue-100 mt-1 flex items-center">
                <Bus className="w-4 h-4 mr-1" />
                {t("busStation.information")} - {selectedBusStation?.code}{" "}
              </p>
            </div>
          ) : null
        }
        open={!!(selectedStation || selectedBusStation)}
        onCancel={onCloseModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "24px" }}
      >
        {selectedStation && (
          <>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                {t("station.information")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("station.code")}:</span>{" "}
                    <span className="font-medium">
                      {selectedStation.stationsResponse.stationCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("station.sequence")}:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedStation.sequenceOrder}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("common.status")}:</span>{" "}
                    <span
                      className={`font-medium flex items-center ${
                        selectedStation.stationsResponse.status === "open"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          selectedStation.stationsResponse.status === "open"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {t(
                        `station.status.${selectedStation.status.toLowerCase()}`
                      ) || selectedStation.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("common.route")}:</span>{" "}
                    <span className="font-medium">
                      {
                        routes.find(
                          (r) => r.routeId === selectedStation.RouteId
                        )?.routeName
                      }
                    </span>
                  </div>
                  {selectedStation.stationsResponse.latitude &&
                    selectedStation.stationsResponse.longitude && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("common.coordinates")}:
                        </span>{" "}
                        <span className="font-medium text-sm">
                          {selectedStation.stationsResponse.latitude.toFixed(4)}
                          ,{" "}
                          {selectedStation.stationsResponse.longitude.toFixed(
                            4
                          )}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {selectedStation.stationsResponse.address && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {t("common.address")}:
                  </span>
                  <p className="font-medium mt-1">
                    {selectedStation.stationsResponse.address}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                {t("schedule.title")}
              </h2>

              {schedulesLoading ? (
                <LoaderContainer />
              ) : schedules?.length > 0 ? (
                <div className="space-y-4">
                  {schedules.filter((s) => s.direction === "forward").length >
                    0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <Navigation className="w-4 h-4 mr-2 text-green-600" />
                        {t("schedule.direction.forward")}{" "}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {schedules
                          .filter((s) => s.direction === "forward")
                          .map((schedule) => (
                            <div
                              key={schedule.scheduleId}
                              className="bg-green-50 border border-green-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-green-800 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {t("schedule.arrival")}{" "}
                                </span>
                                <span className="text-lg font-bold text-green-900">
                                  {schedule.timeArrival}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-green-800 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {t("schedule.departure")}{" "}
                                </span>
                                <span className="text-lg font-bold text-green-900">
                                  {schedule.timeDeparture}
                                </span>
                              </div>
                              {schedule.description && (
                                <p className="text-xs text-green-700 mt-2">
                                  {schedule.description}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {schedules.filter((s) => s.direction === "backward").length >
                    0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <Navigation className="w-4 h-4 mr-2 text-orange-600 transform rotate-180" />
                        {t("schedule.direction.backward")}{" "}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {schedules
                          .filter((s) => s.direction === "backward")
                          .map((schedule) => (
                            <div
                              key={schedule.scheduleId}
                              className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-orange-800 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {t("schedule.arrival")}{" "}
                                </span>
                                <span className="text-lg font-bold text-orange-900">
                                  {schedule.timeArrival}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-orange-800 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {t("schedule.departure")}{" "}
                                  {/* Replace "Departure" */}
                                </span>
                                <span className="text-lg font-bold text-orange-900">
                                  {schedule.timeDeparture}
                                </span>
                              </div>
                              {schedule.description && (
                                <p className="text-xs text-orange-700 mt-2">
                                  {schedule.description}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t("schedule.noSchedule")} </p>
                </div>
              )}
            </div>
          </>
        )}

        {selectedBusStation && (
          <>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Bus className="w-5 h-5 mr-2 text-blue-600" />
                {t("busStation.information")}{" "}
              </h2>

              {busStationDetailLoading ? (
                <LoaderContainer />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("station.code")}:
                        </span>{" "}
                        <span className="font-medium">
                          {selectedBusStation.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("common.status")}:
                        </span>{" "}
                        <span
                          className={`font-medium flex items-center ${
                            selectedBusStation.isActive === 1
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded mr-2 ${
                              selectedBusStation.isActive === 1
                                ? "bg-blue-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {t(
                            `common.${
                              selectedBusStation.isActive === 1
                                ? "active"
                                : "inactive"
                            }`
                          )}{" "}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("common.stationId")}:
                        </span>{" "}
                        <span className="font-medium">
                          {selectedBusStation.id}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("common.type")}:
                        </span>{" "}
                        <span className="font-medium flex items-center">
                          <Bus className="w-3 h-3 mr-1" />
                          {t("busStation.information")}{" "}
                        </span>
                      </div>
                      {busStationDetail && busStationDetail.code && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("station.code")}:
                          </span>{" "}
                          <span className="font-medium">
                            {busStationDetail.code}
                          </span>
                        </div>
                      )}
                      {selectedBusStation.latitude &&
                        selectedBusStation.longitude && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {t("common.coordinates")}:
                            </span>{" "}
                            <span className="font-medium text-sm">
                              {selectedBusStation.latitude.toFixed(4)},{" "}
                              {selectedBusStation.longitude.toFixed(4)}
                            </span>
                          </div>
                        )}
                      {busStationDetail && busStationDetail.routes && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("busStation.availableRoutes")}:{" "}
                          </span>
                          <span className="font-medium">
                            {busStationDetail.routes.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedBusStation.address && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <span className="text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {t("common.address")}:
                      </span>
                      <p className="font-medium mt-1">
                        {selectedBusStation.address}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {busStationDetail &&
              busStationDetail.routes &&
              busStationDetail.routes.length > 0 && (
                <div className="bg-white rounded-lg border border-blue-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Route className="w-5 h-5 mr-2 text-blue-600" />
                    {t("route.availableBusRoutes")}{" "}
                  </h3>

                  <div className="space-y-4">
                    {busStationDetail.routes.map((route) => (
                      <div
                        key={route.id}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4
                              className="font-bold text-xl text-blue-900 mb-2 truncate flex items-center"
                              title={route.name}
                            >
                              <Bus className="w-5 h-5 mr-2" />
                              {route.name}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-200 px-3 py-1 rounded-full font-medium text-blue-800 flex items-center">
                                <Route className="w-3 h-3 mr-1" />
                                {t("route.number", {
                                  routeNum: route.route_num,
                                })}{" "}
                              </span>
                              <span
                                className="text-blue-700 font-medium truncate flex items-center"
                                title={route.direction}
                              >
                                <Navigation className="w-3 h-3 mr-1" />
                                {route.direction}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <span className="text-blue-700 font-medium text-sm flex items-center gap-2 mb-1">
                              <Route className="w-3 h-3" />
                              {t("route.distance")}: {route.distance}{" "}
                              {t("common.km")}{" "}
                            </span>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <span className="text-blue-700 font-medium text-sm flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3" />
                              {t("route.duration")}: {route.duration}{" "}
                              {t("common.min")}{" "}
                            </span>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <span className="text-blue-700 font-medium text-sm flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3" />
                              {t("route.startTime")}: {route.start_time}{" "}
                            </span>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <span className="text-blue-700 font-medium text-sm flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3" />
                              {t("route.endTime")}: {route.end_time}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1 flex items-center">
                    <Bus className="w-4 h-4 mr-1" />
                    {t("busStation.notice.title")}{" "}
                  </h4>
                  <p className="text-sm text-blue-800">
                    {busStationDetail &&
                    busStationDetail.routes &&
                    busStationDetail.routes.length > 0
                      ? t("busStation.notice.withRoutes")
                      : t("busStation.notice.withoutRoutes")}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MapView;
