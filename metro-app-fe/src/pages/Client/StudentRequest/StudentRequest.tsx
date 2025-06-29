import React, { useContext, useState } from "react";
import { Button, Card, List, Tag, Typography, Empty, Row, Col } from "antd";
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Eye,
} from "lucide-react";
import AddRequestModal from "src/components/RequestModal";
import { AppContext } from "src/contexts/app.context";
import { useGetRequestListByUser } from "src/queries/useUser";
import { RequestDto, RequestStatus } from "src/types/user.type";
import { formatDDMMYY } from "src/utils/utils";
import RequestDetailModal from "src/components/RequestDetailModal";

const { Title, Text } = Typography;

export interface RequestCreationRequest {
  content?: string;
  studentCardImage: string;
  citizenIdentityCardImage: string;
  endDate?: string;
}
const StudentRequestPage: React.FC = () => {
  const { profile } = useContext(AppContext);
  const userId = profile?.userId;
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(
    null
  );
  const { data: requestsData, isLoading } = useGetRequestListByUser({
    id: userId as number,
    enabled: !!userId,
  });
  const requests: RequestDto[] = requestsData?.data.data || [];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return "orange";
      case RequestStatus.APPROVED:
        return "green";
      case RequestStatus.REJECTED:
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case RequestStatus.APPROVED:
        return <CheckCircle className="w-4 h-4" />;
      case RequestStatus.REJECTED:
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return "Đang chờ duyệt";
      case RequestStatus.APPROVED:
        return "Đã duyệt";
      case RequestStatus.REJECTED:
        return "Bị từ chối";
      default:
        return "Không xác định";
    }
  };

  const handleAddRequest = async () => {
    setIsModalVisible(false);
  };

  const pendingCount = requests.filter(
    (r) => r.requestStatus === RequestStatus.PENDING
  ).length;
  const approvedCount = requests.filter(
    (r) => r.requestStatus === RequestStatus.APPROVED
  ).length;
  const totalCount = requests.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <Title level={2} className="!mb-2 !text-gray-800">
                <FileText className="inline-block w-8 h-8 mr-3 text-blue-600" />
                Xác nhận sinh viên - Vé Metro TP.HCM
              </Title>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setIsModalVisible(true)}
              className="!bg-gradient-to-r !from-blue-600 !to-indigo-600 !border-none !h-12 !rounded-xl !shadow-lg hover:!shadow-xl !transition-all !duration-300"
            >
              Xin xác nhận mới
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="!border-0 !shadow-lg !rounded-2xl !bg-gradient-to-r !from-orange-50 !to-orange-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <Text className="text-gray-600 block">Đang chờ duyệt</Text>
                <Title level={3} className="!my-0 !text-orange-600">
                  {pendingCount}
                </Title>
              </div>
            </div>
          </Card>

          <Card className="!border-0 !shadow-lg !rounded-2xl !bg-gradient-to-r !from-green-50 !to-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <Text className="text-gray-600 block">Đã duyệt</Text>
                <Title level={3} className="!my-0 !text-green-600">
                  {approvedCount}
                </Title>
              </div>
            </div>
          </Card>

          <Card className="!border-0 !shadow-lg !rounded-2xl !bg-gradient-to-r !from-blue-50 !to-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <Text className="text-gray-600 block">Tổng yêu cầu</Text>
                <Title level={3} className="!my-0 !text-blue-600">
                  {totalCount}
                </Title>
              </div>
            </div>
          </Card>
        </div>

        <Card className="!border-0 !shadow-lg !rounded-2xl">
          <Title level={3} className="!mb-6 !text-gray-800">
            Danh sách yêu cầu xác nhận sinh viên
          </Title>

          {requests.length > 0 ? (
            <List
              dataSource={requests}
              renderItem={(request: RequestDto) => (
                <Card
                  key={request.requestId}
                  className="!mb-4 !border !border-gray-200 !rounded-xl hover:!shadow-lg !transition-all !duration-300"
                  bodyStyle={{ padding: "20px" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center mb-4">
                        <div className="flex items-center text-gray-700">
                          <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <Title
                            level={4}
                            className="!mb-0 !text-gray-800 !font-semibold"
                          >
                            ID: #{request.requestId}
                          </Title>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-blue-600 text-lg leading-relaxed bg-gray-50 p-3 rounded-md border-l-4 border-blue-400">
                          {request.content}
                        </p>
                      </div>

                      <Row gutter={[16, 8]} className="mb-4">
                        <Col xs={24} sm={12} md={12}>
                          <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                            <div className="bg-green-100 p-1 rounded mr-2">
                              <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <Text className="text-sm font-medium">
                              Tạo: {request.createdAt}
                            </Text>
                          </div>
                        </Col>

                        {request.endDate && (
                          <Col xs={24} sm={12} md={12}>
                            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                              <div className="bg-orange-100 p-1 rounded mr-2">
                                <Clock className="w-4 h-4 text-orange-600" />
                              </div>
                              <Text className="text-sm font-medium">
                                Hạn: {formatDDMMYY(request.endDate)}
                              </Text>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <Tag
                        color={getStatusColor(request.requestStatus)}
                        className="!px-4 !py-2 !flex !items-center !gap-2 !rounded-full !font-medium !text-sm shadow-sm"
                      >
                        {getStatusIcon(request.requestStatus)}
                        {getStatusText(request.requestStatus)}
                      </Tag>

                      <Button
                        type="primary"
                        ghost
                        icon={<Eye className="w-4 h-4" />}
                        className="!border-blue-400 !text-blue-600 hover:!bg-blue-50 hover:!border-blue-500 !rounded-lg !font-medium !px-4 !py-2 !h-auto !shadow-sm hover:!shadow-md transition-all duration-200"
                        onClick={() => {
                          setSelectedRequest(request);
                          setOpenDetail(true);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            />
          ) : (
            <Empty
              description="Chưa có yêu cầu nào"
              className="!py-12"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        <RequestDetailModal
          open={openDetail}
          onClose={() => {
            setOpenDetail(false);
            setSelectedRequest(null);
          }}
          data={selectedRequest}
        />

        <AddRequestModal
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleAddRequest}
        />
      </div>
    </div>
  );
};

export default StudentRequestPage;
