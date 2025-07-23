import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "src/components/ProfileComponent/SideBar";
import background from "src/assets/stats_section.jpg";

const { Sider, Content } = Layout;

const ProfileLayout: React.FC = () => {
  return (
    <>
      <div
        className="min-h-screen"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Layout
          className="!min-h-screen mx-auto !bg-transparent rounded-3xl overflow-hidden"
          style={{ width: "80%", margin: "0 auto" }}
        >
          <Sider
            width={320}
            className="!bg-transparent "
            style={{
              background: "transparent",
            }}
          >
            <ProfileSidebar />
          </Sider>
          <Content className="!bg-transparent">
            <div className="h-full">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </div>
    </>
  );
};

export default ProfileLayout;
