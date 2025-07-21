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
        toast.error("Không thể nén ảnh phản hồi!");
        return false;
      }

      const base64 = await convertFileToBase64(compressed);
      setImageFile(compressed);
      setImageBase64(base64);
      setImagePreview(URL.createObjectURL(compressed));
      toast.success("Tải ảnh thành công!");
    } catch (err) {
      toast.error("Tải ảnh thất bại!");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    toast("Đã xoá ảnh đính kèm");
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
      toast.success("Gửi phản hồi thành công!");
      form.resetFields();
      removeImage();
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error("Lỗi khi gửi phản hồi");
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
          Gửi phản hồi
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
          label="Loại phản hồi"
          rules={[{ required: true, message: "Vui lòng chọn loại" }]}
        >
          <Input placeholder="VD: Góp ý, Lỗi hệ thống,..." />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập nội dung phản hồi tại đây..."
            className="!rounded-lg"
          />
        </Form.Item>

        <Form.Item label="Hình ảnh minh hoạ (tuỳ chọn)">
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
                  {uploading ? "Đang xử lý..." : "Nhấn hoặc kéo thả để tải ảnh"}
                </p>
                <p className="ant-upload-hint">
                  Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                </p>
              </Spin>
            </Dragger>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Ảnh phản hồi"
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
            Huỷ
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={feedbackMutation.isPending}
            className="!rounded-lg !px-8"
          >
            Gửi phản hồi
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
