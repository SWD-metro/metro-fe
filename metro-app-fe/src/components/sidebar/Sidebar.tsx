import {
  BellOutlined,
  DashboardOutlined,
  ForkOutlined,
  LoginOutlined,
  TableOutlined,
  UserAddOutlined,
  UserOutlined,
  WalletOutlined,
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
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
