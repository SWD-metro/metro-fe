/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  Badge,
  Card,
  Typography,
  Space,
  Tag,
  Avatar,
  Divider,
  Image,
  message,
  Row,
  Col,
  Select,
  Layout,
} from "antd";
import {
  MessageCircle,
  Reply,
  Eye,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Search,
  MessageCircleIcon,
} from "lucide-react";
import {
  useFeedbackReplyMutation,
  useGetFeedbacksList,
} from "src/queries/useUser";
import { Feedback } from "src/types/user.type";
import { formatDDMMYY } from "src/utils/utils";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Sider, Content } = Layout;

const ManageFeedbackPage: React.FC = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: feedbacksData, isLoading } = useGetFeedbacksList();
  const feedbacks = feedbacksData?.data?.data || [];

  const feedbackReplyMutation = useFeedbackReplyMutation();

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.content.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !feedback.reply) ||
      (statusFilter === "replied" && feedback.reply);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = feedbacks.filter((f) => !f.reply).length;
  const repliedCount = feedbacks.filter((f) => f.reply).length;

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.reply || "");
    setIsModalVisible(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      message.error("Vui lòng nhập nội dung phản hồi");
      return;
    }

    if (!selectedFeedback) {
      message.error("Không tìm thấy phản hồi để trả lời.");
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackReplyMutation.mutateAsync({
        feedbackId: selectedFeedback.feedbackId,
        content: replyText.trim(),
      });

      message.success("Phản hồi đã được gửi thành công!");
      setIsModalVisible(false);
      setReplyText("");
    } catch (error) {
      message.error("Gửi phản hồi thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "feedbackId",
      key: "feedbackId",
      width: 70,
      sorter: (a: Feedback, b: Feedback) => a.feedbackId - b.feedbackId,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: "Lỗi ứng dụng", value: "App Issue" },
        { text: "Góp ý", value: "Suggestion" },
        { text: "Khác", value: "Other" },
        { text: "Chung", value: "General" },
      ],
      onFilter: (value: any, record: Feedback) => record.category === value,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (content: string) => (
        <div className="max-w-xs">
          <Text ellipsis={{ tooltip: content }}>{content}</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record: Feedback) => (
        <Badge
          status={record.reply ? "success" : "processing"}
          text={record.reply ? "Đã phản hồi" : "Chờ phản hồi"}
        />
      ),
      filters: [
        { text: "Chờ phản hồi", value: "pending" },
        { text: "Đã phản hồi", value: "replied" },
      ],
      onFilter: (value: any, record: Feedback) =>
        value === "pending" ? !record.reply : !!record.reply,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
      sorter: (a: Feedback, b: Feedback) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record: Feedback) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewFeedback(record)}
          >
            Xem
          </Button>
          {!record.reply && (
            <Button
              type="default"
              size="small"
              icon={<Reply size={14} />}
              onClick={() => handleViewFeedback(record)}
            >
              Phản hồi
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Content className="w-full max-w-7xl mx-auto p-2">
        <div className="">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2 mt-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircleIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý phản hồi
                </h1>
                <p className="text-gray-600">
                  Xem, phản hồi và quản lý phản hồi từ người dùng
                </p>
              </div>
            </div>
          </div>

          <Row gutter={16} className="mb-6">
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="text-blue-500 mr-2" size={24} />
                  <Title level={3} className="!mt-2.5 !text-blue-600">
                    {feedbacks.length}
                  </Title>
                </div>
                <Text type="secondary">Tổng phản hồi</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="text-orange-500 mr-2" size={24} />
                  <Title level={3} className="!mt-2.5 !text-orange-600">
                    {pendingCount}
                  </Title>
                </div>
                <Text type="secondary">Chờ phản hồi</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="text-green-500 mr-2" size={24} />
                  <Title level={3} className="!mt-2.5 !text-green-600">
                    {repliedCount}
                  </Title>
                </div>
                <Text type="secondary">Đã phản hồi</Text>
              </Card>
            </Col>
          </Row>

          <Card className="mb-6">
            <Row gutter={16} align="middle">
              <Col xs={24} md={12}>
                <Input
                  placeholder="Tìm kiếm phản hồi..."
                  prefix={<Search size={16} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} md={6}>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Tất cả trạng thái"
                  className="w-full"
                >
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="pending">Chờ phản hồi</Option>
                  <Option value="replied">Đã phản hồi</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          <Card>
            <Table
              columns={columns}
              dataSource={filteredFeedbacks}
              rowKey="feedbackId"
              loading={isLoading}
              pagination={{
                total: filteredFeedbacks.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} phản hồi`,
                pageSizeOptions: ["5", "10", "20", "50"],
                defaultPageSize: 10,
              }}
              scroll={{ x: 800 }}
              size="small"
            />
          </Card>

          <Modal
            title="Chi tiết phản hồi"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={800}
            footer={null}
          >
            {selectedFeedback && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar size={48} icon={<User />} className="!mr-2" />
                      <div>
                        <Text strong>
                          ID người dùng: {selectedFeedback.userId}
                        </Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          <Calendar size={16} className="inline mr-1" />
                          {selectedFeedback.createdAt}
                        </Text>
                      </div>
                    </div>
                    <Tag color="blue">{selectedFeedback.category}</Tag>
                  </div>

                  <div className="mb-4">
                    <Text strong className="block mb-2">
                      Nội dung phản hồi:
                    </Text>
                    <div className="p-3 bg-blue-200 rounded-lg">
                      <Text>{selectedFeedback.content}</Text>
                    </div>
                  </div>

                  {selectedFeedback.image && (
                    <div className="mb-4">
                      <Text strong className="block mb-2">
                        Hình ảnh đính kèm:
                      </Text>
                      <Image
                        src={selectedFeedback.image}
                        alt="Feedback attachment"
                      />
                    </div>
                  )}

                  <Divider />

                  <div>
                    <Text strong className="block mb-2">
                      {selectedFeedback.reply
                        ? "Phản hồi của bạn:"
                        : "Gửi phản hồi:"}
                    </Text>
                    <div className="space-y-4">
                      <TextArea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập phản hồi của bạn ở đây..."
                        rows={4}
                        disabled={!!selectedFeedback.reply}
                      />
                      {!selectedFeedback.reply && (
                        <div className="text-right">
                          <Space>
                            <Button
                              type="primary"
                              onClick={handleReplySubmit}
                              loading={isSubmitting}
                              icon={<Reply size={16} />}
                              className="!mt-3"
                            >
                              Gửi phản hồi
                            </Button>
                            <Button
                              onClick={() => setIsModalVisible(false)}
                              className="!mt-3"
                            >
                              Hủy
                            </Button>
                          </Space>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default ManageFeedbackPage;
