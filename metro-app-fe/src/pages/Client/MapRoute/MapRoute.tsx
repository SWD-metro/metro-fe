import React, { useState } from "react";
import { Input } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "src/assets/HCMC_Metro_Logo.png";

interface Station {
  id: string;
  code: string;
  name: string;
  x: number;
  y: number;
  description?: string;
}

const stations: Station[] = [
  {
    id: "L1-01",
    code: "L1\n01",
    name: "Ga Bến Thành",
    x: 450,
    y: 550,
  },
  {
    id: "L1-02",
    code: "L1\n02",
    name: "Ga Nhà Hát Thành Phố",
    x: 550,
    y: 450,
  },
  {
    id: "L1-03",
    code: "L1\n03",
    name: "Ga Ba Son",
    x: 650,
    y: 350,
  },
  {
    id: "L1-04",
    code: "L1\n04",
    name: "Ga Văn Thánh",
    x: 750,
    y: 250,
  },
  {
    id: "L1-05",
    code: "L1\n05",
    name: "Ga Tân Cảng",
    x: 850,
    y: 150,
  },
  {
    id: "L1-06",
    code: "L1\n06",
    name: "Ga Thảo Điền",
    x: 950,
    y: 100,
  },
  {
    id: "L1-07",
    code: "L1\n07",
    name: "Ga An Phủ",
    x: 1050,
    y: 80,
  },
  {
    id: "L1-08",
    code: "L1\n08",
    name: "Ga Rạch Chiếc",
    x: 1150,
    y: 60,
  },
  {
    id: "L1-09",
    code: "L1\n09",
    name: "Ga Phước Long",
    x: 1200,
    y: 10,
  },
  {
    id: "L1-10",
    code: "L1\n10",
    name: "Ga Bình Thái",
    x: 1200,
    y: -80,
  },
  {
    id: "L1-11",
    code: "L1\n11",
    name: "Ga Thủ Đức",
    x: 1250,
    y: -140,
  },
  {
    id: "L1-12",
    code: "L1\n12",
    name: "Ga Khu Công Nghệ Cao",
    x: 1300,
    y: -200,
  },
  {
    id: "L1-13",
    code: "L1\n13",
    name: "Ga ĐH Quốc Gia",
    x: 1350,
    y: -250,
  },
  {
    id: "L1-14",
    code: "L1\n14",
    name: "Ga Bến Xe Suối Tiên",
    x: 1400,
    y: -320,
  },
];

const HCMCMetroMap: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [viewBox, setViewBox] = useState("0 0 1900 150");
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleStationClick = (stationId: string) => {
    if (selectedStation === stationId) {
      setSelectedStation(null);
      resetZoom();
    } else {
      setSelectedStation(stationId);
      zoomToStation(stationId);
    }
  };

  const zoomToStation = (stationId: string) => {
    const station = stations.find((s) => s.id === stationId);
    if (station) {
      const zoomFactor = 0.9;
      const viewWidth = 1900 * zoomFactor;
      const viewHeight = 150 * zoomFactor;

      const centerX = station.x - viewWidth / 2;
      const centerY = station.y - viewHeight / 2;

      setViewBox(`${centerX} ${centerY} ${viewWidth} ${viewHeight}`);
      setZoomLevel(2.5);
    }
  };

  const resetZoom = () => {
    setViewBox("0 0 1900 150");
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    const currentZoom = zoomLevel * 1.5;
    if (currentZoom <= 5) {
      setZoomLevel(currentZoom);
    }
  };

  const handleZoomOut = () => {
    const currentZoom = zoomLevel / 1.5;
    if (currentZoom >= 1) {
      setZoomLevel(currentZoom);
    }
  };

  const selectedStationData = stations.find((s) => s.id === selectedStation);

  return (
    <div className="max-w-7xl mx-auto flex h-screen bg-gray-50">
      <div className="w-80 flex flex-col shadow-lg">
        <div className="p-3 border-b">
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded-lg"
            size="small"
          />
        </div>

        <div className="flex-1">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className={`flex items-center p-2 cursor-pointer transition-all duration-200 hover:bg-blue-50 border-b border-gray-100 ${
                selectedStation === station.id
                  ? "bg-blue-100 border-l-4 border-l-blue-600 shadow-sm"
                  : ""
              }`}
              onClick={() => handleStationClick(station.id)}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                  selectedStation === station.id
                    ? "bg-blue-600 shadow-md"
                    : "bg-gray-100"
                }`}
              >
                <div
                  className={`text-xs font-bold text-center leading-tight ${
                    selectedStation === station.id
                      ? "text-white"
                      : "text-cyan-800"
                  }`}
                >
                  {station.code}
                </div>
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium text-sm transition-colors ${
                    selectedStation === station.id
                      ? "text-cyan-600"
                      : "text-cyan-800"
                  }`}
                >
                  {station.name}
                </div>
              </div>
              {selectedStation === station.id && (
                <div className="text-cyan-400">
                  <CheckOutlined />
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedStation && (
          <div className="p-3 border-t">
            <button
              onClick={() => {
                setSelectedStation(null);
                resetZoom();
              }}
              className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer font-medium"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="relative overflow-hidden h-screen">
          <div className="absolute top-20 left-20 z-10">
            <div>
              <img src={logo} alt="Logo" className="w-[120px]" />
            </div>
          </div>

          {selectedStationData && (
            <div className="absolute top-20 right-0 z-20 bg-white rounded-lg shadow-xl p-4 min-w-64">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedStationData.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Mã ga: {selectedStationData.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedStation(null);
                    resetZoom();
                  }}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 text-xl ml-4"
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>
          )}

          <svg
            width="100%"
            height="100%"
            viewBox={viewBox}
            className="w-full h-full transition-all duration-700 ease-in-out"
            style={{ transform: `scale(${zoomLevel * 1.6})` }}
          >
            <defs>
              <linearGradient
                id="bgGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="50%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#f3e8ff" />
              </linearGradient>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="stationGlow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M 450 550 L 550 450 L 650 350 L 750 250 L 850 150 L 950 100 L 1050 80 L 1150 60 L 1200 20 L 1200 -80 L 1250 -140 L 1300 -200 L 1350 -250 L 1400 -320"
              stroke="url(#lineGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />

            {stations.map((station, index) => {
              const isVisible =
                searchValue === "" ||
                station.name.toLowerCase().includes(searchValue.toLowerCase());
              const isSelected = selectedStation === station.id;

              return (
                <g key={station.id} opacity={isVisible ? 1 : 0.3}>
                  {isSelected && (
                    <>
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r="40"
                        fill="rgba(239, 68, 68, 0.1)"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="8,4"
                        className="animate-pulse"
                      />
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r="25"
                        fill="rgba(239, 68, 68, 0.2)"
                        className="animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </>
                  )}

                  <rect
                    x={station.x - 15}
                    y={station.y - 12}
                    width="30"
                    height="28"
                    fill={
                      isSelected ? "#ef4444" : isVisible ? "#1e40af" : "#94a3b8"
                    }
                    stroke="#ffffff"
                    strokeWidth="2"
                    rx="3"
                    className="cursor-pointer drop-shadow-md transition-transform duration-200"
                    onClick={() => handleStationClick(station.id)}
                    filter={isSelected ? "url(#stationGlow)" : "none"}
                  />

                  <text
                    x={station.x}
                    y={station.y}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white cursor-pointer select-none"
                    onClick={() => handleStationClick(station.id)}
                  >
                    L1
                  </text>

                  <text
                    x={station.x}
                    y={station.y + 12}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white cursor-pointer select-none"
                    onClick={() => handleStationClick(station.id)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </text>

                  <text
                    x={station.x + 25}
                    y={station.y + 15}
                    textAnchor="start"
                    className={`text-sm font-bold cursor-pointer select-none transition-colors duration-200 ${
                      isSelected
                        ? "fill-red-600"
                        : isVisible
                        ? "fill-cyan-800"
                        : "fill-cyan-400"
                    }`}
                    onClick={() => handleStationClick(station.id)}
                  >
                    {station.name.replace("Ga ", "")}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-0 right-5 z-20 flex flex-col">
            <div className="bg-white shadow-lg border overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="block w-12 h-10 cursor-pointer hover:bg-cyan-400 transition-colors text-xl font-bold text-cyan-800 border-b"
                disabled={zoomLevel >= 5}
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="block w-12 h-10 cursor-pointer hover:bg-cyan-400 transition-colors text-xl font-bold text-cyan-800"
                disabled={zoomLevel <= 1}
              >
                −
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HCMCMetroMap;
