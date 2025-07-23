/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal, Button, Spin, message } from "antd";
import {
  EyeIcon,
  RefreshCw,
  Clock,
  Ticket,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGetTicketQRCode } from "src/queries/useTicket";
import { TicketResponse } from "src/types/tickets.type";
import { formatDate, formatDDMMYY } from "src/utils/utils";

const QRModal = ({ ticket }: { ticket: TicketResponse }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: qrRes,
    isLoading,
    refetch,
  } = useGetTicketQRCode(ticket.ticketCode);
  const qrCode = qrRes?.data?.data;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setCountdown(0);
  };

  const handleRefresh = async () => {
    if (countdown > 0) return;

    try {
      setCountdown(60);
      setRefreshKey((prev) => prev + 1);
      await refetch();
      message.success("Đã làm mới mã QR thành công!");
    } catch (error) {
      message.error("Không thể làm mới mã QR. Vui lòng thử lại!");
      setCountdown(0);
    }
  };

  return (
    <>
      <Button
        icon={<EyeIcon size={16} />}
        type="primary"
        onClick={showModal}
        className="!bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !border-0 !shadow-md !hover:shadow-lg !transition-all !transform hover:!scale-105 active:!scale-95 !duration-200"
      >
        Xem vé
      </Button>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
        className="[&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 !bg-gradient-to-r !from-cyan-500 !to-blue-600 rounded-full flex items-center justify-center">
                <Ticket className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Chi tiết vé
                </h3>
                <p className="text-sm text-gray-500">
                  Quét mã QR để sử dụng vé
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Spin size="large" />
              <p className="text-gray-500 animate-pulse">Đang tải mã QR...</p>
            </div>
          ) : qrCode ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <img
                      key={refreshKey}
                      src={`data:image/png;base64,${qrCode}`}
                      alt="QR Code"
                      className="w-84 h-84 rounded-xl animate-fade-in"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  icon={
                    <RefreshCw
                      size={18}
                      className={countdown > 0 ? "animate-spin" : ""}
                    />
                  }
                  onClick={handleRefresh}
                  disabled={countdown > 0 || isLoading}
                  size="large"
                  className={`
                          !px-8 !py-2 !h-12 !rounded-xl !font-medium !transition-all !duration-300 !transform hover:!scale-105 active:!scale-95 !shadow-lg
                          ${
                            countdown > 0
                              ? "!bg-gradient-to-r !from-gray-200 !to-gray-300 !text-gray-500 !cursor-not-allowed !shadow-sm !border-0"
                              : "!bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !text-white !border-0 hover:!shadow-xl"
                          }
                        `}
                >
                  {countdown > 0 ? (
                    <span className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>Làm mới sau {countdown}s</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span>Làm mới mã QR</span>
                    </span>
                  )}
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-2 border border-gray-100">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <Calendar
                        className="text-blue-500 mt-3 flex-shrink-0"
                        size={32}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">
                          Hiệu lực
                        </p>
                        <div className="flex justify-between text-lg text-gray-600 space-y-1">
                          <p>
                            <span className="text-green-600 font-medium">
                              Từ:
                            </span>{" "}
                            {formatDDMMYY(ticket.validFrom)}
                          </p>
                          <p>
                            <span className="text-red-600 font-medium">
                              Đến:
                            </span>{" "}
                            {formatDDMMYY(ticket.validUntil)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <p className="text-red-500 font-medium">Không tìm thấy mã QR</p>
              <p className="text-gray-500 text-sm text-center">
                Vui lòng liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default QRModal;
