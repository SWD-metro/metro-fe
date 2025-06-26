import { Modal, Button } from "antd";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useGetTicketQRCode } from "src/queries/useTicket";
import { TicketResponse } from "src/types/tickets.type";
import { formatDate } from "src/utils/utils";

const QRModal = ({ ticket }: { ticket: TicketResponse }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: qrRes, isLoading } = useGetTicketQRCode(ticket.ticketCode);
  const qrCode = qrRes?.data?.data;

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <Button
        icon={<EyeIcon className="!mt-1" />}
        type="primary"
        onClick={showModal}
      >
        Xem vé
      </Button>

      <Modal
        title={""}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {isLoading ? (
          <p className="text-center text-gray-500">Đang tải mã QR...</p>
        ) : qrCode ? (
          <div className="flex justify-center">
            <div className="bg-white border border-blue-800 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code"
                  className="w-64 h-auto rounded"
                />
                <div className="text-center">
                  <p className="text-xl font-semibold text-blue-800">
                    {ticket.name}
                  </p>
                  <p className="text-sm text-red-500 break-all">
                    #{ticket.ticketCode}
                  </p>
                </div>
                <div className="text-sm text-blue-600 space-y-1 w-full text-left">
                  <p>
                    <span className="font-medium">Hiệu lực:</span>{" "}
                    {formatDate(ticket.validFrom)} →{" "}
                    {formatDate(ticket.validUntil)}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {ticket.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Không tìm thấy mã QR.</p>
        )}
      </Modal>
    </>
  );
};

export default QRModal;
