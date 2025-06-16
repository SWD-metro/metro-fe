import React from 'react';
import {
  Card,
  Avatar,
  Typography,
  Switch,
  Button,
  Row,
  Col,
  Space,
  Tag,
  Layout,
} from 'antd';
import {
  BellOutlined,
  HistoryOutlined,
  LockOutlined,
  SettingOutlined,
  CarOutlined,
  CalendarOutlined,
  MessageOutlined as MessageIcon,
  EditOutlined, 
} from '@ant-design/icons';

import avt from '../../../assets/avt.jpg';
import Header from 'src/components/Header';
import { Content } from 'antd/es/layout/layout';
const { Title, Text } = Typography;

const favoriteTrips = [
  { id: 1, img: 'https://image.plo.vn/1200x630/Uploaded/2024/liwbzivo/2023_08_29/z4646004183998-657f73b4cd716691f68431172b5a8e4a-6054.jpg.webp', title: 'Ga Bến Thành - Suối Tiên', description: 'Tuyến số 1' },
  { id: 2, img: 'https://image.plo.vn/1200x630/Uploaded/2024/liwbzivo/2023_08_29/z4646004183998-657f73b4cd716691f68431172b5a8e4a-6054.jpg.webp', title: 'Ga Opera House - Thảo Điền', description: 'Tuyến số 1' },
  { id: 3, img: 'https://image.plo.vn/1200x630/Uploaded/2024/liwbzivo/2023_08_29/z4646004183998-657f73b4cd716691f68431172b5a8e4a-6054.jpg.webp', title: 'Ga Bến Thành - Ga Ba Son', description: 'Tuyến số 1' },
  { id: 4, img: 'https://image.plo.vn/1200x630/Uploaded/2024/liwbzivo/2023_08_29/z4646004183998-657f73b4cd716691f68431172b5a8e4a-6054.jpg.webp', title: 'Ga Công Viên 23/9 - Bến xe Miền Tây', description: 'Tuyến số 3A' },
];

const recentActivities = [
  {
    id: 1,
    name: 'Đặt vé: Bến Thành -> Suối Tiên',
    detail: 'Ngày 01/06/2025',
    icon: <CarOutlined className="text-blue-500" />,
    status: 'Đã hoàn thành',
  },
  {
    id: 2,
    name: 'Nạp tiền vào tài khoản',
    detail: '500.000 VNĐ - Ngày 30/05/2025',
    icon: <HistoryOutlined className="text-green-500" />,
    status: 'Thành công',
  },
  {
    id: 3,
    name: 'Đăng ký vé tháng',
    detail: 'Vé tháng Metro TPHCM',
    icon: <CalendarOutlined className="text-purple-500" />,
    status: 'Đang hoạt động',
  },
  {
    id: 4,
    name: 'Thay đổi mật khẩu',
    detail: 'Ngày 28/05/2025',
    icon: <LockOutlined className="text-gray-500" />,
    status: 'Đã cập nhật',
  },
  {
    id: 5,
    name: 'Đặt vé: Bến Thành -> Ga Ba Son',
    detail: 'Ngày 25/05/2025',
    icon: <CarOutlined className="text-blue-500" />,
    status: 'Đã hoàn thành',
  },
];

const DashboardProfileMetro: React.FC = () => {
  const avatarSize = 100; 
  const cardBackgroundHeight = 250; 

  return (
    <>
    <Layout className="min-h-screen">
      <Header />
      <Layout className="site-layout">
        <Content className="mx-6 my-6 bg-gray-100 p-6 rounded-lg relative z-10"
          style={{ marginTop: "-30px" }} 
        >
          <Card
            className="mb-6 overflow-hidden relative rounded-lg"
            style={{
              height: cardBackgroundHeight, 
              backgroundImage:
                'url("https://images.unsplash.com/photo-1627918451877-2e11a2f1c8a0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-300 opacity-80 rounded-lg"></div>
            <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex items-center space-x-6">
              <Avatar
                src={avt} 
                size={avatarSize}
                className="border-4 border-white shadow-md flex-shrink-0"
              />
              <div className='ml-[20px]'>
                <Title level={3} className="text-white mb-0">
                  Mày là con tao, Tao là bố chúng mày
                </Title>
                <Text className="text-white text-opacity-80">Thành viên thường - Mã KH: MT_123456</Text>
                <div className="flex items-center mt-2 space-x-4">
                  <Text className="text-white text-opacity-80">
                    <HistoryOutlined /> 50 chuyến đã đi
                  </Text>
                  <Text className="text-white text-opacity-80">
                    <BellOutlined /> 1200 điểm thưởng
                  </Text>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex items-center space-x-4">
              <Button type="text" icon={<EditOutlined />} className="text-white">
                Edit
              </Button>
              <Button type="text" icon={<MessageIcon />} className="text-white">
                Message
              </Button>
              <Button type="text" icon={<SettingOutlined />} className="text-white">
                Settings
              </Button>
            </div>
          </Card>
          <Row gutter={[24, 24]} className="mt-4"> 
            <Col xs={24} lg={8}> 
              <Card title="Cài đặt nền tảng" className="mb-6">
                <Title level={5} className="mt-0 mb-4 text-gray-700">
                  TÀI KHOẢN
                </Title>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Text>Thông báo khi ai đó theo dõi tôi</Text>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text>Thông báo khi ai đó bình luận bài viết của tôi</Text>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text>Thông báo khi ai đó nhắc đến tôi</Text>
                    <Switch />
                  </div>
                </div>
                <Title level={5} className="mt-6 mb-4 text-gray-700">
                  ỨNG DỤNG
                </Title>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Text>Các bản phát hành và dự án mới</Text>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text>Cập nhật sản phẩm hàng tháng</Text>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text>Đăng ký nhận bản tin</Text>
                    <Switch />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}> 
              <Card title={
                <div>
                  <Text strong>Thông tin cá nhân</Text>
                  
                  <Button type="text" icon={<EditOutlined />} className="text-white">
                Edit
              </Button>
                </div>
              } className="mb-6">
                <p className="text-gray-600 mb-4">
                  Chào, tôi là Nguyễn Văn A. Nếu bạn không thể quyết định, câu trả lời là nếu hai lượng bằng nhau, hãy chọn một lượng ít gây đau đớn nhất trong thời gian ngắn (tránh xa ảo tưởng về sự bình đẳng).
                </p>
                <Space direction="vertical" className="w-full">
                  <div className="flex items-center">
                    <Text strong className="min-w-[120px]">
                      Họ và tên:
                    </Text>
                    <Text>Nguyễn Văn A</Text>
                  </div>
                  <div className="flex items-center">
                    <Text strong className="min-w-[120px]">
                      Số điện thoại:
                    </Text>
                    <Text>0901 234 567</Text>
                  </div>
                  <div className="flex items-center">
                    <Text strong className="min-w-[120px]">
                      Email:
                    </Text>
                    <Text>nguyenvana@example.com</Text>
                  </div>
                  <div className="flex items-center">
                    <Text strong className="min-w-[120px]">
                      Địa điểm:
                    </Text>
                    <Text>TP. Hồ Chí Minh, Việt Nam</Text>
                  </div>
                  <div className="flex items-center">
                    <Text strong className="min-w-[120px]">
                      Mạng xã hội:
                    </Text>
                    <Space>
                      <Button type="link" icon={<i className="fab fa-facebook text-blue-600"></i>} />
                      <Button type="link" icon={<i className="fab fa-twitter text-blue-400"></i>} />
                      <Button type="link" icon={<i className="fab fa-instagram text-pink-500"></i>} />
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={8}> 
              <Card title="Lịch sử hoạt động"> 
                 <Space direction="vertical" className="w-full">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-200">
                      <div className="flex items-start space-x-3">
                        <Avatar icon={activity.icon} className="bg-gray-100 p-2 rounded-full" />
                        <div className='ml-[10px]'>
                          <Text strong className="block">{activity.name}</Text>
                          <Text type="secondary" className="text-sm">{activity.detail}</Text>
                        </div>
                      </div>
                      <Tag color={activity.status === 'Đã hoàn thành' || activity.status === 'Thành công' || activity.status === 'Đang hoạt động' ? 'success' : 'default'}>
                        {activity.status}
                      </Tag>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
          <Title level={4} className="mt-8 mb-4">
            Các chuyến đi yêu thích
          </Title>
          <Text className="block mb-6 text-gray-600">
            Các tuyến Metro bạn thường xuyên sử dụng hoặc đánh dấu yêu thích.
          </Text>
          <Row gutter={[24, 24]}>
            {favoriteTrips.map((trip) => (
              <Col key={trip.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={<img alt={trip.title} src={trip.img} className="rounded-t-lg h-48 object-cover" />}
                  className="rounded-lg shadow-md"
                >
                  <Card.Meta title={trip.title} description={trip.description} />
                  <div className="mt-4 flex justify-between items-center">
                    <Button type="primary" icon={<CarOutlined />}>
                      ĐẶT VÉ LẠI
                    </Button>
                    <Avatar.Group maxCount={3} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                      <Avatar src="https://via.placeholder.com/30?text=A" />
                      <Avatar src="https://via.placeholder.com/30?text=B" />
                      <Avatar src="https://via.placeholder.com/30?text=C" />
                    </Avatar.Group>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
    </>
  );
};

export default DashboardProfileMetro;