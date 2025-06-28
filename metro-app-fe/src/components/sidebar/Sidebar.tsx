import React, { useContext } from "react";
import {
  DashboardOutlined,
  ForkOutlined,
  LogoutOutlined,
  UserOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Menu, App as AntdApp } from "antd";
import logo from "src/assets/HCMC_Metro_Logo.png";
import Sider from "antd/es/layout/Sider";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLogoutMutation } from "src/queries/useAuth";
import { AppContext } from "src/contexts/app.context";

const Sidebar = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const { modal } = AntdApp.useApp();
  const { reset } = useContext(AppContext);

  const handleLogout = () => {
    modal.confirm({
      title: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
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
            toast.error(`Lỗi khi đăng xuất: ${error.message || "Vui lòng thử lại."}`);
            console.error("Error logging out:", error);
          },
        });
      },
      onCancel() {
      },
    });
  };

  return (
    <Sider width={200} className="!bg-white shadow-sm ">
      <div className="p-4 ">
        <div className="text-center flex flex-col items-center">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="w-[120px]" />
          </NavLink>
        </div>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="border-r-0"
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to="/admin/user">User</Link>,
          },

          {
            key: "3",
            icon: <WalletOutlined />,
            label: <Link to="/admin/ticket">Ticket</Link>,
          },
          {
            key: "4",
            icon: <ForkOutlined />,
            label: <Link to="/admin/routes">Routes</Link>,
          },
          {
            key: "5",
            icon: <ScheduleOutlined />,
            label: <Link to="/admin/schedule">Schedule</Link>,
          },
          {
            key: "auth",
            label: "AUTH",
            type: "group",
            children: [
              {
                key: "6",
                icon: <LogoutOutlined />,
                label: (
                  <span
                    onClick={handleLogout}
                    style={{
                      pointerEvents: logoutMutation.isPending ? 'none' : 'auto',
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