import React, { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Button,
  Typography,
  Space,
  Divider,
  Alert,
  Spin,
} from "antd";
import { ArrowUp, MapPin, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TicketResponse } from "src/types/tickets.type";
import {
  useGetStationsForUpdate,
  useGetUpgradeAmount,
} from "src/queries/useTicket";
import { useCreateVNPayUpgradeMutation } from "src/queries/usePayment";

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
  const { t } = useTranslation();
  const [selectedEndStationId, setSelectedEndStationId] = useState<
    number | null
  >(null);

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsForUpdate({
      ticketId: ticket.id,
    });

  const { data: upgradeAmountData, isLoading: amountLoading } =
    useGetUpgradeAmount({
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
      console.error("Error creating upgrade payment:", error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ArrowUp className="text-blue-500" size={24} />
          <span className="text-xl font-bold">{t("upgradeTicket.title")}</span>
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
          <Title level={5} className="!mb-2">
            {t("upgradeTicket.currentTicketInfo")}
          </Title>
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex justify-between">
              <Text strong>{t("upgradeTicket.ticketCode")}</Text>
              <Text className="font-mono">#{ticket.ticketCode}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>{t("upgradeTicket.ticketName")}</Text>
              <Text>{ticket.name}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>{t("upgradeTicket.currentPrice")}</Text>
              <Text className="text-green-600 font-semibold">
                {ticket.actualPrice.toLocaleString()}{" "}
                {t("upgradeTicket.currency")}
              </Text>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Station Selection */}
        <div>
          <Title level={5} className="!mb-3">
            <MapPin className="inline mr-2" size={20} />
            {t("upgradeTicket.selectNewDestination")}
          </Title>

          {stationsLoading ? (
            <div className="text-center py-4">
              <Spin size="large" />
              <div className="mt-2">{t("upgradeTicket.loadingStations")}</div>
            </div>
          ) : (
            <Select
              placeholder={t("upgradeTicket.selectDestinationPlaceholder")}
              style={{ width: "100%" }}
              size="large"
              value={selectedEndStationId}
              onChange={setSelectedEndStationId}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {stations.map((station) => (
                <Option
                  key={station.id}
                  value={station.stationsResponse.stationId}
                >
                  {station.stationsResponse.name} -{" "}
                  {station.stationsResponse.address}
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
              {t("upgradeTicket.upgradeCost")}
            </Title>

            {amountLoading ? (
              <div className="text-center py-2">
                <Spin />
                <span className="ml-2">{t("upgradeTicket.calculating")}</span>
              </div>
            ) : (
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex justify-between">
                  <Text>{t("upgradeTicket.upgradeTicketFee")}</Text>
                  <Text className="font-semibold">
                    {upgradeAmount.toLocaleString()}{" "}
                    {t("upgradeTicket.currency")}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>{t("upgradeTicket.serviceFee")}</Text>
                  <Text className="font-semibold">
                    10,000 {t("upgradeTicket.currency")}
                  </Text>
                </div>
                <Divider className="!my-2" />
                <div className="flex justify-between">
                  <Text strong className="text-lg">
                    {t("upgradeTicket.total")}
                  </Text>
                  <Text strong className="text-lg text-red-600">
                    {totalAmount.toLocaleString()} {t("upgradeTicket.currency")}
                  </Text>
                </div>
              </Space>
            )}
          </div>
        )}

        {/* Warning */}
        <Alert
          message={t("upgradeTicket.noteTitle")}
          description={t("upgradeTicket.noteDescription")}
          type="warning"
          showIcon
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button size="large" onClick={onCancel}>
            {t("upgradeTicket.cancel")}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleUpgrade}
            disabled={!selectedEndStationId || amountLoading}
            loading={createUpgradePaymentMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t("upgradeTicket.payWithVNPay")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeTicketModal;
