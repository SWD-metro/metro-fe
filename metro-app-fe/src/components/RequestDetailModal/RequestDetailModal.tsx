import { Modal, Typography, Image, Row, Col } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { RequestDto } from "src/types/user.type";
import { Calendar, Clock, FileText, CreditCard, User } from "lucide-react";

const { Text, Paragraph, Title } = Typography;

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  data?: RequestDto | null;
}

const RequestDetailModal: React.FC<DetailModalProps> = ({
  open,
  onClose,
  data,
}) => {
  const { t } = useTranslation("profile");

  if (!data) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <Title level={4} className="!mb-0 !text-gray-800">
            #{data.requestId}
          </Title>
        </div>
      }
      width={900}
      className="!top-6"
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-100 p-1 rounded">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <Text strong className="text-lg text-gray-800">
              {t("requestDetail.sections.description")}
            </Text>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Paragraph className="!mb-0 !text-xl !text-blue-500 font-bold leading-relaxed">
              {data.content}
            </Paragraph>
          </div>
        </div>

        {(data.studentCardImage || data.citizenIdentityCardImage) && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-purple-100 p-1 rounded">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
              <Text strong className="text-lg text-gray-800">
                {t("requestDetail.sections.attachedImages")}
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              {data.studentCardImage && (
                <Col xs={24} lg={12}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <Text strong className="text-gray-700">
                        {t("requestDetail.images.studentCard")}
                      </Text>
                    </div>
                    <div className="relative group">
                      <Image
                        src={data.studentCardImage}
                        alt={t("requestDetail.images.studentCardAlt")}
                        className="!rounded-xl !border-2 !border-gray-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        width="100%"
                        style={{
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Col>
              )}

              {data.citizenIdentityCardImage && (
                <Col xs={24} lg={12}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-1 rounded">
                        <CreditCard className="w-4 h-4 text-orange-600" />
                      </div>
                      <Text strong className="text-gray-700">
                        {t("requestDetail.images.citizenId")}
                      </Text>
                    </div>
                    <div className="relative group">
                      <Image
                        src={data.citizenIdentityCardImage}
                        alt={t("requestDetail.images.citizenIdAlt")}
                        className="!rounded-xl !border-2 !border-gray-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        width="100%"
                        style={{
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-100 p-1 rounded">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <Text strong className="text-lg text-gray-800">
              {t("requestDetail.sections.timeInfo")}
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <Text className="text-sm text-green-700 font-medium block">
                    {t("requestDetail.time.createdDate")}
                  </Text>
                  <Text className="text-green-800 font-semibold">
                    {data.createdAt}
                  </Text>
                </div>
              </div>
            </Col>

            {data.endDate && (
              <Col xs={24} sm={12}>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <Text className="text-sm text-orange-700 font-medium block">
                      {t("requestDetail.time.processingDeadline")}
                    </Text>
                    <Text className="text-orange-800 font-semibold">
                      {data.endDate}
                    </Text>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default RequestDetailModal;
