interface Props {
  children?: React.ReactNode;
}
const MainLayout: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default MainLayout;
