/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import {
  DashboardOutlined,
  ForkOutlined,
  LogoutOutlined,
  UserOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Menu, App as AntdApp, Avatar, Divider } from "antd";
import logo from "src/assets/HCMC_Metro_Logo.png";
import Sider from "antd/es/layout/Sider";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useLogoutMutation } from "src/queries/useAuth";
import { AppContext } from "src/contexts/app.context";
import { FormInputIcon, MessageCircleIcon } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogoutMutation();
  const { modal } = AntdApp.useApp();
  const { reset } = useContext(AppContext);

  const getSelectedKey = (pathname: string): string | undefined => {
    if (pathname.startsWith("/admin/dashboard")) {
      return "1";
    }
    if (pathname.startsWith("/admin/user")) {
      return "2";
    }
    if (pathname.startsWith("/admin/ticket")) {
      return "3";
    }
    if (pathname.startsWith("/admin/routes")) {
      return "4";
    }
    if (pathname.startsWith("/admin/schedule")) {
      return "5";
    }
    if (pathname.startsWith("/admin/verify-student-request")) {
      return "6";
    }
    return undefined;
  };

  const currentSelectedKey = getSelectedKey(location.pathname);

  const selectedKeys = currentSelectedKey ? [currentSelectedKey] : [];

  const handleLogout = () => {
    modal.confirm({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        logoutMutation.mutate(undefined, {
          onSuccess: () => {
            toast.success("Đăng xuất thành công!");
            setTimeout(() => {
              reset();
              navigate("/");
            }, 500);
          },
          onError: (error: any) => {
            toast.error(
              `Lỗi khi đăng xuất: ${error.message || "Vui lòng thử lại."}`
            );
            console.error("Error logging out:", error);
          },
        });
      },
      onCancel() {},
    });
  };

  return (
    <Sider width={250} className="!bg-white shadow-sm ">
      <div className="p-4">
        <div className="text-center flex flex-col items-center">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="w-[120px]" />
          </NavLink>
        </div>
        <Divider className="my-2" />
        <div className="px-4 py-2 flex flex-col items-center gap-2">
          <NavLink to="/">
            <Avatar
              size={64}
              icon={<CrownOutlined />}
              className="!bg-amber-400 text-white"
            />
            <div className="text-center">
              <p className="font-semibold text-base">Administrator</p>
              <p className="text-xs text-gray-500">Bảng điều khiển</p>
            </div>
          </NavLink>
        </div>
        <Divider className="my-2" />
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        className="border-r-0"
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to="/admin/user">Người dùng</Link>,
          },
          {
            key: "3",
            icon: <WalletOutlined />,
            label: <Link to="/admin/ticket">Quản lí vé</Link>,
          },
          {
            key: "4",
            icon: <ForkOutlined />,
            label: <Link to="/admin/routes">Tuyến đường</Link>,
          },
          {
            key: "5",
            icon: <ScheduleOutlined />,
            label: <Link to="/admin/schedule">Lịch trình</Link>,
          },
          {
            key: "6",
            icon: <FormInputIcon />,
            label: (
              <Link to="/admin/verify-student-request">
                Yêu cầu của sinh viên
              </Link>
            ),
          },
          {
            key: "7",
            icon: <MessageCircleIcon />,
            label: <Link to="/admin/feedbacks">Đánh giá</Link>,
          },
          {
            key: "auth",
            label: "AUTH",
            type: "group",
            children: [
              {
                key: "8",
                icon: <LogoutOutlined />,
                label: (
                  <span
                    onClick={handleLogout}
                    style={{
                      pointerEvents: logoutMutation.isPending ? "none" : "auto",
                      opacity: logoutMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    Log out
                  </span>
                ),
                disabled: logoutMutation.isPending,
              },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
