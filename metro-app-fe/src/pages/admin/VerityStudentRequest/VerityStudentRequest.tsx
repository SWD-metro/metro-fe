/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Modal,
  Button,
  Input,
  Select,
  Space,
  Image,
  Spin,
} from "antd";
import {
  FileText,
  Check,
  X,
  Search,
  Filter,
  Eye,
  CreditCard,
  GraduationCap,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useGetRequestsList,
  useGetUserByUserId,
  useVerifyRequestMutation,
} from "src/queries/useUser";
import {
  RequestDto,
  RequestStatus,
  VerifyRequestParams,
} from "src/types/user.type";
import toast from "react-hot-toast";

const { Content } = Layout;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { TextArea } = Input;

const VerifyStudentRequest: React.FC = () => {
  const { data: requestsData, isLoading } = useGetRequestsList();
  const requests = requestsData?.data?.data;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: userData, isLoading: isLoadingUser } = useGetUserByUserId({
    id: selectedRequest?.userId || 0,
    enabled: !!selectedRequest?.userId,
  });

  const verifyRequestMutation = useVerifyRequestMutation();

  const filteredRequests = useMemo(() => {
    if (!requests || !Array.isArray(requests)) return [];

    return requests.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        String(request.requestId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(request.userId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (request.content &&
          request.content.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || request.requestStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

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
        return null;
    }
  };

  const handleViewRequest = (request: RequestDto) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApproveRequest = async (request: RequestDto) => {
    try {
      const params: VerifyRequestParams = {
        requestId: request.requestId,
        isApproved: true,
        rejectionReason: "",
      };

      await verifyRequestMutation.mutateAsync(params);
      toast.success("Request approved successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Vui lòng cung cấp lý do từ chối");
      return;
    }

    if (!selectedRequest) {
      toast.error("Không tìm thấy yêu cầu để từ chối");
      return;
    }

    try {
      const params: VerifyRequestParams = {
        requestId: selectedRequest.requestId,
        isApproved: false,
        rejectionReason: rejectionReason.trim(),
      };

      await verifyRequestMutation.mutateAsync(params);
      toast.success("Request rejected successfully!");
      setShowRejectModal(false);
      setShowModal(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestId",
      key: "requestId",
      render: (text: string) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          #{text}
        </span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <div className="max-w-xs truncate" title={text}>
          {text || "Không có nội dung"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "requestStatus",
      key: "status",
      render: (status: RequestStatus) => (
        <Tag
          color={getStatusColor(status)}
          className="!flex !items-center gap-1 w-fit"
        >
          <span>{getStatusIcon(status)}</span>
          <span>
            {
              {
                PENDING: "Đang chờ",
                APPROVED: "Đã duyệt",
                REJECTED: "Từ chối",
              }[status]
            }
          </span>
        </Tag>
      ),
    },
    {
      title: "Hạn xác nhận",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => (
        <span className="text-sm text-gray-600">{date || "Không rõ"}</span>
      ),
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-sm text-gray-600">{date}</span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: RequestDto) => (
        <Button
          type="primary"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewRequest(record)}
          className="bg-blue-500 hover:bg-blue-600 border-0"
        >
          Xem
        </Button>
      ),
    },
  ];

  const selectedUser = userData?.data.data || null;

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Content className="w-full max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Xác minh yêu cầu sinh viên
              </h1>
              <p className="text-gray-600">
                Kiểm tra và xử lý yêu cầu giảm giá dành cho sinh viên
              </p>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {requests?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {requests?.filter((r) => r.requestStatus === "PENDING")
                      .length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {requests?.filter((r) => r.requestStatus === "APPROVED")
                      .length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {requests?.filter((r) => r.requestStatus === "REJECTED")
                      .length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="mb-6 border-0 shadow-lg">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={18}>
              <AntSearch
                placeholder="Tìm kiếm theo requestId, userId hoặc nội dung..."
                onSearch={setSearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                prefix={<Search className="w-4 h-4 text-gray-400" />}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} md={6}>
              <Space className="w-full justify-end" wrap>
                <Filter className="w-4 h-4 text-gray-400" />
                <Select
                  defaultValue="ALL"
                  className="w-32"
                  onChange={setStatusFilter}
                  size="large"
                >
                  <Option value="ALL">Tất cả</Option>
                  <Option value="PENDING">Đang chờ</Option>
                  <Option value="APPROVED">Đã duyệt</Option>
                  <Option value="REJECTED">Từ chối</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="border-0 shadow-lg">
          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="requestId"
            loading={isLoading}
            scroll={{ x: "max-content" }}
            className="custom-table"
            locale={{
              emptyText: isLoading
                ? "Đang tải..."
                : "Không tìm thấy yêu cầu nào",
            }}
          />
        </Card>

        <Modal
          open={showModal}
          onCancel={() => setShowModal(false)}
          width={900}
          centered
          footer={
            selectedRequest && selectedRequest.requestStatus === "PENDING" ? (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleApproveRequest(selectedRequest)}
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 border-0 text-white px-6"
                  icon={<Check className="w-4 h-4" />}
                >
                  Xác nhận
                </Button>
                <Button
                  danger
                  onClick={() => setShowRejectModal(true)}
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 border-0 text-white px-6"
                  icon={<X className="w-4 h-4" />}
                >
                  Từ chối
                </Button>
              </div>
            ) : null
          }
        >
          {selectedRequest && (
            <div className="relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                  <Spin size="large" />
                </div>
              )}

              <div className="py-6">
                <Row gutter={[32, 32]} className="mb-8">
                  <Col xs={24} md={24}>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        {" "}
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-blue-700">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Thông tin yêu cầu & người dùng
                        </h3>
                        <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                          <span className="font-semibold text-blue-600">
                            Yêu cầu #{selectedRequest.requestId}
                          </span>
                        </div>
                      </div>

                      <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                          <Space
                            direction="vertical"
                            size="middle"
                            className="w-full"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-700">
                                Trạng thái:{" "}
                              </span>
                              <Tag
                                color={getStatusColor(
                                  selectedRequest.requestStatus
                                )}
                                className="!flex !items-center gap-1 w-fit"
                              >
                                <span>
                                  {getStatusIcon(selectedRequest.requestStatus)}
                                </span>
                                <span>
                                  {
                                    {
                                      PENDING: "Đang chờ",
                                      APPROVED: "Đã duyệt",
                                      REJECTED: "Từ chối",
                                    }[selectedRequest.requestStatus]
                                  }
                                </span>
                              </Tag>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-700">
                                Mô tả:
                              </span>
                              <p className="text-gray-600">
                                {selectedRequest.content}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Ngày gửi:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {selectedRequest.createdAt}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Hạn xử lí:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {selectedRequest.endDate}
                              </span>
                            </div>
                          </Space>
                        </Col>

                        <Col xs={24} md={12}>
                          <h4 className="text-md font-semibold mb-4 flex items-center gap-2 text-blue-700">
                            <Users className="w-5 h-5" />
                            Thông tin người dùng
                          </h4>
                          {isLoadingUser ? (
                            <div className="flex items-center justify-center h-32">
                              <Spin size="large" />
                            </div>
                          ) : selectedUser ? (
                            <Space
                              direction="vertical"
                              size="middle"
                              className="w-full"
                            >
                              <div>
                                <span className="font-medium text-gray-700">
                                  Tên người dùng:
                                </span>
                                <span className="ml-2 text-gray-600">
                                  {selectedUser.name}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Email:
                                </span>
                                <span className="ml-2 text-gray-600">
                                  {selectedUser.email}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Thành viên từ:
                                </span>
                                <span className="ml-2 text-gray-600">
                                  {selectedUser.createdAt}
                                </span>
                              </div>
                            </Space>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>Không thể tải thông tin người dùng</p>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row gutter={[32, 32]} className="mb-6">
                  <Col xs={24} md={12}>
                    <div className="text-gray-700 text-sm mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      CMND/CCCD{" "}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                      {selectedRequest.citizenIdentityCardImage ? (
                        <Image
                          src={selectedRequest.citizenIdentityCardImage}
                          alt="Citizen Identity Card"
                          className="w-full h-48 object-contain rounded"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Không có hình ảnh có sẵn</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="text-gray-700 text-sm mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Thẻ sinh viên{" "}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                      {selectedRequest.studentCardImage ? (
                        <Image
                          src={selectedRequest.studentCardImage}
                          alt="Student Card"
                          className="w-full h-48 object-contain rounded"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Không có hình ảnh có sẵn</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                {selectedRequest.rejectionReason && (
                  <div className="mb-6">
                    <div className="text-gray-700 text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Lý do từ chối
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 m-0">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <Modal
          open={showRejectModal}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectionReason("");
          }}
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Từ chối yêu cầu
            </div>
          }
          footer={null}
          centered
        >
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <TextArea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="Cung cấp lý do từ chối rõ ràng........"
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowRejectModal(false)}>Hủy</Button>
              <Button
                type="primary"
                onClick={handleRejectRequest}
                loading={isSubmitting}
                danger
                className="bg-red-500 hover:bg-red-600 border-0"
              >
                Xác nhận từ chối
              </Button>
            </div>
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default VerifyStudentRequest;
