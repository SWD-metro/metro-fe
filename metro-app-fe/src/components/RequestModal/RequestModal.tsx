/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Divider,
  Image,
  Typography,
  Row,
  Col,
  Spin,
} from "antd";
import {
  Plus,
  CreditCard,
  UploadIcon,
  User,
  X,
  CheckCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { useCreateStudentRequestMutation } from "src/queries/useUser";
import toast from "react-hot-toast";
import {
  compressImage,
  convertFileToBase64,
  formatDDMMYY,
} from "src/utils/utils";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Text } = Typography;

interface AddRequestModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [citizenIdFile, setCitizenIdFile] = useState<File | null>(null);
  const [studentCardBase64, setStudentCardBase64] = useState<string>("");
  const [citizenIdBase64, setCitizenIdBase64] = useState<string>("");
  const [studentCardPreview, setStudentCardPreview] = useState<string>("");
  const [citizenIdPreview, setCitizenIdPreview] = useState<string>("");
  const [uploadingStudentCard, setUploadingStudentCard] = useState(false);
  const [uploadingCitizenId, setUploadingCitizenId] = useState(false);
  const useCreateStudentRequest = useCreateStudentRequestMutation();

  const handleStudentCardUpload = async (file: File) => {
    setUploadingStudentCard(true);
    try {
      const compressedFile = await compressImage(file);

      if (!compressedFile) {
        toast.error("Không thể nén ảnh thẻ sinh viên!");
        return false;
      }
      const base64 = await convertFileToBase64(compressedFile);

      setStudentCardFile(compressedFile);
      setStudentCardBase64(base64);
      setStudentCardPreview(URL.createObjectURL(compressedFile));
      toast.success("Đã tải lên thẻ sinh viên thành công!");
    } catch (error) {
      toast.error("Có lỗi khi tải lên thẻ sinh viên!");
      console.error("Student card upload error:", error);
    } finally {
      setUploadingStudentCard(false);
    }
    return false;
  };

  const handleCitizenIdUpload = async (file: File) => {
    setUploadingCitizenId(true);
    try {
      const compressedFile = await compressImage(file);

      if (!compressedFile) {
        toast.error("Không thể nén ảnh CCCD/CMND!");
        return false;
      }

      const base64 = await convertFileToBase64(compressedFile);

      setCitizenIdFile(compressedFile);
      setCitizenIdBase64(base64);
      setCitizenIdPreview(URL.createObjectURL(compressedFile));
      toast.success("Đã tải lên CCCD/CMND thành công!");
    } catch (error) {
      toast.error("Có lỗi khi tải lên CCCD/CMND!");
      console.error("Citizen ID upload error:", error);
    } finally {
      setUploadingCitizenId(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    if (useCreateStudentRequest.isPending) return;

    if (!studentCardFile || !citizenIdFile) {
      toast.error("Vui lòng tải lên đầy đủ hình ảnh!");
      return;
    }

    try {
      const studentCardImageBase64 = studentCardBase64.split(",")[1];
      const citizenIdImageBase64 = citizenIdBase64.split(",")[1];

      if (!studentCardImageBase64 || !citizenIdImageBase64) {
        toast.error("Lỗi xử lý hình ảnh, vui lòng tải lại!");
        return;
      }

      const requestData = {
        content: values.content?.trim() || "",
        studentCardImage: studentCardImageBase64,
        citizenIdentityCardImage: citizenIdImageBase64,
        endDate: formatDDMMYY(values.endDate),
      };

      await useCreateStudentRequest.mutateAsync(requestData);

      toast.success("Đã gửi yêu cầu xác nhận sinh viên thành công!");
      handleCancel();
      onSubmit();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi yêu cầu!");
      console.error("Create request error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setStudentCardFile(null);
    setCitizenIdFile(null);
    setStudentCardPreview("");
    setCitizenIdPreview("");
    onCancel();
  };

  const removeStudentCard = () => {
    setStudentCardFile(null);
    setStudentCardPreview("");
    toast.bind("Đã xóa hình ảnh thẻ sinh viên");
  };

  const removeCitizenId = () => {
    setCitizenIdFile(null);
    setCitizenIdPreview("");
    toast.bind("Đã xóa hình ảnh CCCD/CMND");
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-xl font-semibold text-gray-800">
          <Plus className="w-6 h-6 mr-2 text-blue-600" />
          Xin xác nhận sinh viên - Metro HCMC
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      className="!top-8"
      destroyOnClose
    >
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Form.Item name="content" label="Nội dung" required>
          <TextArea
            rows={3}
            placeholder="Ví dụ: Tôi cần xin giấy xác nhận sinh viên để đăng ký mua vé tháng metro với giá ưu đãi cho sinh viên..."
            className="!rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Ngày cần có giấy xác nhận (tùy chọn)"
          required
        >
          <DatePicker
            size="large"
            placeholder="Chọn ngày cần có giấy"
            className="!w-full !rounded-lg"
            disabledDate={(current) =>
              current && current < dayjs().endOf("day")
            }
          />
        </Form.Item>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span className="flex items-center text-blue-600 font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Hình ảnh thẻ sinh viên
                </span>
              }
              required
            >
              {!studentCardFile ? (
                <Dragger
                  beforeUpload={handleStudentCardUpload}
                  showUploadList={false}
                  className="!rounded-lg"
                  disabled={uploadingStudentCard}
                >
                  <Spin spinning={uploadingStudentCard}>
                    <p className="ant-upload-drag-icon">
                      <UploadIcon className="w-12 h-12 text-blue-500 mx-auto" />
                    </p>
                    <p className="ant-upload-text">
                      {uploadingStudentCard
                        ? "Đang xử lý..."
                        : "Nhấn hoặc kéo thả để tải lên"}
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
                      src={studentCardPreview}
                      alt="Thẻ sinh viên"
                      className="!rounded-lg w-full"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                      preview={true}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<X className="w-4 h-4" />}
                      className="!absolute !top-2 !right-2 !bg-red-500 !text-white !rounded-full !w-8 !h-8 !p-0 hover:!bg-red-600"
                      onClick={removeStudentCard}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <Text className="text-green-700 text-sm">
                        {studentCardFile.name} (
                        {(studentCardFile.size / 1024).toFixed(1)} KB)
                      </Text>
                    </div>
                  </div>
                </div>
              )}
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span className="flex items-center text-green-600 font-medium">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Hình ảnh CCCD/CMND
                </span>
              }
              required
            >
              {!citizenIdFile ? (
                <Dragger
                  beforeUpload={handleCitizenIdUpload}
                  showUploadList={false}
                  className="!rounded-lg"
                  disabled={uploadingCitizenId}
                >
                  <Spin spinning={uploadingCitizenId}>
                    <p className="ant-upload-drag-icon">
                      <UploadIcon className="w-12 h-12 text-green-500 mx-auto" />
                    </p>
                    <p className="ant-upload-text">
                      {uploadingCitizenId
                        ? "Đang xử lý..."
                        : "Nhấn hoặc kéo thả để tải lên"}
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
                      src={citizenIdPreview}
                      alt="CCCD/CMND"
                      className="!rounded-lg w-full"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                      preview={true}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<X className="w-4 h-4" />}
                      className="!absolute !top-2 !right-2 !bg-red-500 !text-white !rounded-full !w-8 !h-8 !p-0 hover:!bg-red-600"
                      onClick={removeCitizenId}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <Text className="text-green-700 text-sm">
                        {citizenIdFile.name} (
                        {(citizenIdFile.size / 1024).toFixed(1)} KB)
                      </Text>
                    </div>
                  </div>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button
            size="large"
            onClick={handleCancel}
            className="!rounded-lg !px-8"
            disabled={useCreateStudentRequest.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={useCreateStudentRequest.isPending}
            className="!border-none !rounded-lg !px-8"
            disabled={
              !studentCardFile ||
              !citizenIdFile ||
              uploadingStudentCard ||
              uploadingCitizenId
            }
          >
            {useCreateStudentRequest.isPending
              ? "Đang gửi..."
              : "Gửi yêu cầu xác nhận"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddRequestModal;
