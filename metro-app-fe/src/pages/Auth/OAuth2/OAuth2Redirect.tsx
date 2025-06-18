import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "src/contexts/app.context";
import { Spin, Typography } from "antd";
import toast from "react-hot-toast";

const { Text } = Typography;

const OAuth2RedirectHandler: React.FC = () => {
  const { isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Đăng nhập thành công!", {
        duration: 3000,
        style: {
          borderRadius: "8px",
          background: "#4BB543",
          color: "#fff",
          fontWeight: "500",
        },
      });
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Spin size="large" />
      <br />
      <Text>Đang xử lý đăng nhập Google...</Text>
    </div>
  );
};
export default OAuth2RedirectHandler;
