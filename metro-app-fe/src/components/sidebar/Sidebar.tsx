import {
  BellOutlined,
  DashboardOutlined,
  LoginOutlined,
  TableOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import logo from "src/assets/HCMC_Metro_Logo.png";
import Sider from "antd/es/layout/Sider";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
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
            label: <Link to="/admin/profile">User</Link>,
          },

          {
            key: "3",
            icon: <TableOutlined />,
            label: <Link to="/admin/manage">Manage</Link>,
          },
          {
            key: "4",
            icon: <BellOutlined />,
            label: <Link to="/admin/notifications">Notifications</Link>,
          },
          {
            key: "auth",
            label: "AUTH PAGES",
            type: "group",
            children: [
              {
                key: "5",
                icon: <LoginOutlined />,
                label: <Link to="/auth/login">Sign In</Link>,
              },
              {
                key: "6",
                icon: <UserAddOutlined />,
                label: <Link to="/auth/register">Sign Up</Link>,
              },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
