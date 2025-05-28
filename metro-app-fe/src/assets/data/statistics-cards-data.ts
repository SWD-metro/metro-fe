import { AreaChartOutlined, BankFilled, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
  
  interface StatisticsCardFooter {
    color: string;
    value: string;
    label: string;
  }
  
  interface StatisticsCard {
    color: string;
    icon: React.ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>>;
    title: string;
    value: string;
    footer: StatisticsCardFooter;
  }
  
  export const statisticsCardsData: StatisticsCard[] = [
    {
      color: "gray",
      icon: BankFilled,
      title: "Today's Money",
      value: "$53k",
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
    {
      color: "gray",
      icon: UserOutlined,
      title: "Today's Users",
      value: "2,300",
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: UsergroupAddOutlined,
      title: "New Clients",
      value: "3,462",
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than yesterday",
      },
    },
    {
      color: "gray",
      icon: AreaChartOutlined,
      title: "Sales",
      value: "$103,430",
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
  ];
  
  export default statisticsCardsData;