import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Typography, Space, Divider, Alert, Spin } from 'antd';
import { ArrowUp, MapPin, DollarSign } from 'lucide-react';
import { TicketResponse } from 'src/types/tickets.type';
import { useGetStationsForUpdate, useGetUpgradeAmount } from 'src/queries/useTicket';
import { useCreateVNPayUpgradeMutation } from 'src/queries/usePayment';

const { Title, Text } = Typography;
const { Option } = Select;

interface UpgradeTicketModalProps {
  visible: boolean;
  onCancel: () => void;
  orderId: number;
  ticket: TicketResponse;
}

const UpgradeTicketModal: React.FC<UpgradeTicketModalProps> = ({
  visible,
  onCancel,
  orderId,
  ticket,
}) => {
  const [selectedEndStationId, setSelectedEndStationId] = useState<number | null>(null);
  
  const { data: stationsData, isLoading: stationsLoading } = useGetStationsForUpdate({
    ticketId: ticket.id,
  });

  const { data: upgradeAmountData, isLoading: amountLoading } = useGetUpgradeAmount({
    ticketId: ticket.id,
    endStationId: selectedEndStationId || 0,
  });

  const createUpgradePaymentMutation = useCreateVNPayUpgradeMutation();

  const stations = stationsData?.data?.data || [];
  const upgradeAmount = (upgradeAmountData?.data?.data || 0) - 10000;
  const totalAmount = upgradeAmount + 10000; // Adding 10000 VND fee

  useEffect(() => {
    if (!visible) {
      setSelectedEndStationId(null);
    }
  }, [visible]);

  const handleUpgrade = async () => {
    if (!selectedEndStationId) return;

    try {
      const response = await createUpgradePaymentMutation.mutateAsync({
        ticketId: orderId,
        endStationId: selectedEndStationId,
      });

      if (response.data?.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      }
    } catch (error) {
      console.error('Error creating upgrade payment:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ArrowUp className="text-blue-500" size={24} />
          <span className="text-xl font-bold">Nâng cấp vé</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="upgrade-ticket-modal"
    >
      <div className="space-y-6">
        {/* Current Ticket Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Title level={5} className="!mb-2">Thông tin vé hiện tại</Title>
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex justify-between">
              <Text strong>Mã vé:</Text>
              <Text className="font-mono">#{ticket.ticketCode}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Tên vé:</Text>
              <Text>{ticket.name}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Giá hiện tại:</Text>
              <Text className="text-green-600 font-semibold">
                {ticket.actualPrice.toLocaleString()} VND
              </Text>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Station Selection */}
        <div>
          <Title level={5} className="!mb-3">
            <MapPin className="inline mr-2" size={20} />
            Chọn ga đích mới
          </Title>
          
          {stationsLoading ? (
            <div className="text-center py-4">
              <Spin size="large" />
              <div className="mt-2">Đang tải danh sách ga...</div>
            </div>
          ) : (
            <Select
              placeholder="Chọn ga đích mới"
              style={{ width: '100%' }}
              size="large"
              value={selectedEndStationId}
              onChange={setSelectedEndStationId}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {stations.map((station) => (
                <Option key={station.id} value={station.stationsResponse.stationId}>
                  {station.stationsResponse.name} - {station.stationsResponse.address}
                </Option>
              ))}
            </Select>
          )}
        </div>

        {/* Upgrade Cost */}
        {selectedEndStationId && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <Title level={5} className="!mb-3">
              <DollarSign className="inline mr-2" size={20} />
              Chi phí nâng cấp
            </Title>
            
            {amountLoading ? (
              <div className="text-center py-2">
                <Spin />
                <span className="ml-2">Đang tính toán...</span>
              </div>
            ) : (
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex justify-between">
                  <Text>Phí nâng cấp vé:</Text>
                  <Text className="font-semibold">
                    {upgradeAmount.toLocaleString()} VND
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Phí dịch vụ:</Text>
                  <Text className="font-semibold">10,000 VND</Text>
                </div>
                <Divider className="!my-2" />
                <div className="flex justify-between">
                  <Text strong className="text-lg">Tổng cộng:</Text>
                  <Text strong className="text-lg text-red-600">
                    {totalAmount.toLocaleString()} VND
                  </Text>
                </div>
              </Space>
            )}
          </div>
        )}

        {/* Warning */}
        <Alert
          message="Lưu ý"
          description="Sau khi nâng cấp thành công, vé của bạn sẽ được cập nhật với ga đích mới. Quá trình này không thể hoàn tác."
          type="warning"
          showIcon
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button size="large" onClick={onCancel}>
            Hủy
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleUpgrade}
            disabled={!selectedEndStationId || amountLoading}
            loading={createUpgradePaymentMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thanh toán qua VNPay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeTicketModal;