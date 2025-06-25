import React, { useContext } from "react";
import { Menu, Avatar } from "antd";
import { UserOutlined, SafetyOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";
import { ListOrderedIcon, TicketIcon } from "lucide-react";

const ProfileSidebar: React.FC = () => {
  const { profile } = useContext(AppContext);

  const getAvatarText = (): string => {
    return profile?.name ? profile.name.charAt(0).toUpperCase() : "";
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center mb-8 p-4 bg-white/70 rounded-2xl border">
        <div className="relative">
          <Avatar
            size={48}
            className="!bg-gradient-to-r from-red-500 to-blue-500 text-white !font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-110 transition-all duration-500 border-2 border-white/50"
          >
            {getAvatarText()}
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <div className="ml-4 flex-1">
          <h5 className="text-lg font-bold text-gray-800 mb-1 truncate">
            {profile?.name}
          </h5>
          <p className="text-xs text-red-500 font-medium">VIP</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm border border-white/20 overflow-hidden">
        <Menu
          mode="vertical"
          className="!bg-transparent !border-none"
          style={{
            backgroundColor: "transparent",
          }}
        >
          <Menu.Item
            key="account"
            icon={<UserOutlined className="!text-blue-500" />}
            className="!mx-2 !my-1 !rounded-xl hover:!bg-blue-50 transition-all duration-300 group"
          >
            <Link
              to={path.profile}
              className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
            >
              Tài khoản
            </Link>
          </Menu.Item>

          <Menu.Item
            key="password"
            icon={<SafetyOutlined className="!text-green-500" />}
            className="!mx-2 !my-1 !rounded-xl hover:!bg-green-50 transition-all duration-300 group"
          >
            <Link
              to={path.changePassword}
              className="font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300"
            >
              Mật khẩu & Bảo mật
            </Link>
          </Menu.Item>

          <Menu.Item
            key="my-tickets"
            icon={<TicketIcon className="!text-purple-500 !pt-2" />}
            className="!mx-2 !my-1 !rounded-xl hover:!bg-purple-50 transition-all duration-300 group"
          >
            <Link
              to={path.myTicket}
              className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-300"
            >
              Vé của tôi
            </Link>
          </Menu.Item>

          <Menu.Item
            key="my-orders"
            icon={<ListOrderedIcon className="!text-orange-500 !pt-2" />}
            className="!mx-2 !my-1 !rounded-xl hover:!bg-orange-50 transition-all duration-300 group"
          >
            <Link
              to={path.orderHistory}
              className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300"
            >
              Lịch sử giao dịch
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default ProfileSidebar;
