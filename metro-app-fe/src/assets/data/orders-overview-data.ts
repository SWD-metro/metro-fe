import { BankFilled, BellFilled, CreditCardFilled, PlusCircleFilled, ShoppingFilled, UnlockFilled } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
  
  interface OrderOverview {
    icon: React.ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>>;
    color: string;
    title: string;
    description: string;
  }
  
  export const ordersOverviewData: OrderOverview[] = [
    {
      icon: BellFilled,
      color: "text-blue-gray-300",
      title: "$2400, Design changes",
      description: "22 DEC 7:20 PM",
    },
    {
      icon: PlusCircleFilled,
      color: "text-blue-gray-300",
      title: "New order #1832412",
      description: "21 DEC 11 PM",
    },
    {
      icon: ShoppingFilled ,
      color: "text-blue-gray-300",
      title: "Server payments for April",
      description: "21 DEC 9:34 PM",
    },
    {
      icon: CreditCardFilled,
      color: "text-blue-gray-300",
      title: "New card added for order #4395133",
      description: "20 DEC 2:20 AM",
    },
    {
      icon: UnlockFilled,
      color: "text-blue-gray-300",
      title: "Unlock packages for development",
      description: "18 DEC 4:54 AM",
    },
    {
      icon: BankFilled,
      color: "text-blue-gray-300",
      title: "New order #9583120",
      description: "17 DEC",
    },
  ];
  
  export default ordersOverviewData;