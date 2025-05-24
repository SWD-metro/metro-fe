import Footer from "../../components/Footer";
import Header from "../../components/Header";

interface Props {
  children?: React.ReactNode;
}
const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
