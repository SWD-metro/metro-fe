import React from "react";
import { Drawer, Spin, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

import { Train, Info } from "lucide-react";
import { StationsResponse } from "src/types/stations.type";
import { useGetScheduleByStationId } from "src/queries/useSchedule";

interface StationInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedStation: StationsResponse | null;
  sortedStations: StationsResponse[];
}

const StationInfoDrawer: React.FC<StationInfoDrawerProps> = ({
  open,
  onClose,
  selectedStation,
  sortedStations,
}) => {
  const { data: schedulesData, isLoading } = useGetScheduleByStationId({
    id: Number(selectedStation?.stationId),
  });
  const schedules = schedulesData?.data?.data;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <Train className="text-blue-600" />
          Thông tin trạm
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      {selectedStation && (
        <div className="space-y-4">
          <div className="bg-blue-50 px-4 py-2 flex justify-between items-center border border-blue-200">
            <h3 className="text-xl font-bold text-cyan-800">
              #{selectedStation.sequenceOrder} {selectedStation.name}
            </h3>
            <Tag color="blue">{selectedStation.stationCode}</Tag>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-yellow-600" />
              <span className="font-medium text-yellow-600">Kết nối</span>
            </div>
            <div className="text-sm text-yellow-600">
              {selectedStation.sequenceOrder > 1 && (
                <p>
                  ← Ga trước:{" "}
                  <strong>
                    {sortedStations[selectedStation.sequenceOrder - 2].name}
                  </strong>
                </p>
              )}
              {selectedStation.sequenceOrder < sortedStations.length && (
                <p>
                  → Ga sau:{" "}
                  <strong>
                    {sortedStations[selectedStation.sequenceOrder].name}
                  </strong>
                </p>
              )}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <ClockCircleOutlined className="text-green-600" />
              <span className="font-medium text-green-800">Lịch trình</span>
            </div>

            {isLoading && (
              <div className="flex justify-center py-4">
                <Spin size="small" />
              </div>
            )}

            {schedules && schedules.length > 0 && (
              <div className="space-y-2">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.scheduleId}
                    className="bg-white p-3 rounded border border-green-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-green-600">
                        {schedule.direction}
                      </span>
                    </div>
                    <div className="text-sm text-cyan-800">
                      <div className="flex justify-between">
                        <span>
                          Đến: <strong>{schedule.timeArrival}</strong>
                        </span>
                        <span>
                          Đi: <strong>{schedule.timeDeparture}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default StationInfoDrawer;
