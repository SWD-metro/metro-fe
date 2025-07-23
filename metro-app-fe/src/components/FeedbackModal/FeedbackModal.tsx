/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Image,
  Typography,
  Divider,
  Spin,
} from "antd";
import { UploadIcon, X, CheckCircle, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { compressImage, convertFileToBase64 } from "src/utils/utils";
import { useCreateFeedbackMutation } from "src/queries/useUser";
import { FeedbackCreationRequest } from "src/types/user.type";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Text } = Typography;

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  onSubmitted,
}) => {
  const { t } = useTranslation("profile");
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const feedbackMutation = useCreateFeedbackMutation();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      if (!compressed) {
        toast.error(t("feedbackForm.errors.cannotCompressImage"));
        return false;
      }

      const base64 = await convertFileToBase64(compressed);
      setImageFile(compressed);
      setImageBase64(base64);
      setImagePreview(URL.createObjectURL(compressed));
      toast.success(t("feedbackForm.success.imageUploaded"));
    } catch (err) {
      toast.error(t("feedbackForm.errors.imageUploadFailed"));
    } finally {
      setUploading(false);
    }
    return false;
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    toast(t("feedbackForm.success.imageRemoved"));
  };

  const handleSubmit = async (values: FeedbackCreationRequest) => {
    if (feedbackMutation.isPending) return;

    try {
      const data = {
        category: values.category,
        content: values.content.trim(),
        image: imageBase64 || undefined,
      };

      await feedbackMutation.mutateAsync(data);
      toast.success(t("feedbackForm.success.submitted"));
      form.resetFields();
      removeImage();
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error(t("feedbackForm.errors.submitFailed"));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      className="!top-10"
      title={
        <div className="flex items-center text-xl font-semibold text-gray-800">
          <MessageCircle className="w-5 h-5 mr-2 text-teal-600" />
          {t("feedbackForm.title")}
        </div>
      }
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Form.Item
          name="category"
          label={t("feedbackForm.fields.category.label")}
          rules={[
            {
              required: true,
              message: t("feedbackForm.fields.category.required"),
            },
          ]}
        >
          <Input placeholder={t("feedbackForm.fields.category.placeholder")} />
        </Form.Item>

        <Form.Item
          name="content"
          label={t("feedbackForm.fields.content.label")}
          rules={[
            {
              required: true,
              message: t("feedbackForm.fields.content.required"),
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={t("feedbackForm.fields.content.placeholder")}
            className="!rounded-lg"
          />
        </Form.Item>

        <Form.Item label={t("feedbackForm.fields.image.label")}>
          {!imageFile ? (
            <Dragger
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={uploading}
              accept="image/*"
            >
              <Spin spinning={uploading}>
                <p className="ant-upload-drag-icon">
                  <UploadIcon className="w-12 h-12 text-teal-500 mx-auto" />
                </p>
                <p className="ant-upload-text">
                  {uploading
                    ? t("feedbackForm.upload.processing")
                    : t("feedbackForm.upload.dragText")}
                </p>
                <p className="ant-upload-hint">
                  {t("feedbackForm.upload.supportedFormats")}
                </p>
              </Spin>
            </Dragger>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt={t("feedbackForm.upload.imageAlt")}
                  className="!rounded-lg w-full"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                  preview={true}
                />
                <Button
                  type="text"
                  danger
                  icon={<X className="w-4 h-4" />}
                  className="!absolute !top-2 !right-2 !bg-red-500 !text-white !rounded-full !w-8 !h-8 !p-0 hover:!bg-red-600"
                  onClick={removeImage}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <Text className="text-green-700 text-sm">
                    {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                  </Text>
                </div>
              </div>
            </div>
          )}
        </Form.Item>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <Button
            onClick={onClose}
            size="large"
            disabled={feedbackMutation.isPending}
            className="!rounded-lg !px-8"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={feedbackMutation.isPending}
            className="!rounded-lg !px-8"
          >
            {t("feedbackForm.actions.submit")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
