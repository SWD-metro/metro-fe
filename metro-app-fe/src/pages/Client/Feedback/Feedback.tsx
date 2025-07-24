import React, { useContext, useState } from "react";
import { Button, Card, Typography, List, Empty, Tag } from "antd";
import { MessageCircle, Clock, CheckCircle, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppContext } from "src/contexts/app.context";
import { useGetFeedbackListByUser } from "src/queries/useUser";
import FeedbackModal from "src/components/FeedbackModal/FeedbackModal";

const { Title, Text } = Typography;

const FeedbackPage = () => {
  const { t } = useTranslation("profile");
  const { profile } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);

  const { data: feedbacksData, refetch } = useGetFeedbackListByUser({
    id: profile?.userId || 0,
    enabled: !!profile?.userId,
  });

  const feedbacks = feedbacksData?.data?.data || [];
  const pendingCount = feedbacks.filter((f) => !f.reply).length;
  const repliedCount = feedbacks.filter((f) => f.reply).length;
  const totalCount = feedbacks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <Title level={2} className="!mb-2 !text-gray-800">
              <MessageCircle className="inline-block w-8 h-8 mr-3 text-blue-600" />
              {t("feedback.title")}
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowModal(true)}
              className="!bg-gradient-to-r !from-blue-600 !to-indigo-600 !border-none !h-12 !rounded-xl !shadow-lg hover:!shadow-xl !transition-all"
            >
              {t("feedback.sendFeedback")}
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
                <Text className="text-gray-600 block">
                  {t("feedback.stats.pending")}
                </Text>
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
                <Text className="text-gray-600 block">
                  {t("feedback.stats.replied")}
                </Text>
                <Title level={3} className="!my-0 !text-green-600">
                  {repliedCount}
                </Title>
              </div>
            </div>
          </Card>
          <Card className="!border-0 !shadow-lg !rounded-2xl !bg-gradient-to-r !from-blue-50 !to-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <Text className="text-gray-600 block">
                  {t("feedback.stats.totalFeedback")}
                </Text>
                <Title level={3} className="!my-0 !text-blue-600">
                  {totalCount}
                </Title>
              </div>
            </div>
          </Card>
        </div>

        <Card className="!border-0 !shadow-lg !rounded-2xl">
          <Title level={3} className="!mb-6 !text-gray-800">
            {t("feedback.listTitle")}
          </Title>
          {feedbacks.length > 0 ? (
            <List
              dataSource={feedbacks}
              renderItem={(fb) => (
                <Card key={fb.feedbackId} className="!mb-4 !rounded-xl">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 pr-4">
                      <div className="mb-2">
                        <Tag color="blue">{fb.category}</Tag>
                      </div>
                      <div className="mt-3 p-2 border-l-4 rounded-lg bg-blue-50 border-blue-400 pl-3">
                        <p className="text-blue-700 font-medium">
                          {t("feedback.content")}:
                        </p>
                        <Text>{fb.content}</Text>
                      </div>
                      {fb.image && (
                        <img
                          src={fb.image}
                          alt="feedback"
                          className="rounded-md max-h-48 mt-2 border"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/100x100?text=No+Image";
                          }}
                        />
                      )}
                      <Text className="text-xs text-gray-500 block mt-2">
                        {t("feedback.sentAt")} {fb.createdAt}
                      </Text>
                      {fb.reply && (
                        <div className="mt-3 p-2 border-l-4 rounded-lg bg-blue-50 border-blue-400 pl-3">
                          <p className="text-blue-700 font-medium">
                            {t("feedback.adminReply")}
                          </p>
                          <Text>{fb.reply}</Text>
                        </div>
                      )}
                    </div>
                    <Tag
                      color={fb.reply ? "green" : "orange"}
                      className="!px-4 !py-1 !rounded-full !font-medium"
                    >
                      {fb.reply
                        ? t("feedback.status.replied")
                        : t("feedback.status.pending")}
                    </Tag>
                  </div>
                </Card>
              )}
            />
          ) : (
            <Empty
              description={t("feedback.emptyMessage")}
              className="!py-12"
            />
          )}
        </Card>

        <FeedbackModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmitted={refetch}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
