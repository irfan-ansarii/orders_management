import { MinusOutlined } from "@ant-design/icons";
import {
  MdDashboard,
  MdInbox,
  MdPeopleAlt,
  MdSettings,
  MdManageAccounts,
  MdAssignment,
  MdBarChart,
  MdDiscount,
  MdLocalMall,
  MdLocationOn,
} from "react-icons/md";

import { RiShoppingBag3Fill, RiHome5Fill, RiAddBoxFill } from "react-icons/ri";
// tracking page menu items

// admin routes

export const ADMIN_MENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    title: "",
    icon: <MdDashboard className="text-lg" />,
  },
  {
    key: "orders",
    label: "Orders",
    title: "",
    icon: <MdInbox className="text-lg" />,
  },
  {
    key: "self-ship",
    label: "Self Ship",
    title: "",
    icon: <MdLocationOn className="text-lg" />,
  },
  {
    key: "checkouts",
    label: "Checkouts",
    title: "",
    icon: <MdLocalMall className="text-lg" />,
  },
  {
    key: "products",
    label: "Products",
    title: "",
    icon: <MdDiscount className="text-lg" />,
  },

  {
    key: "customers",
    label: "Customers",
    title: "",
    icon: <MdPeopleAlt className="text-lg" />,
  },
  {
    key: "timelines",
    label: "timelines",
    title: "",
    icon: <MdAssignment className="text-lg" />,
  },
  {
    key: "reports",
    label: "Reports",
    title: "",
    icon: <MdBarChart className="text-lg" />,
    children: [
      {
        key: "reports/orders",
        label: "Orders",
        title: "",
        icon: <MinusOutlined />,
      },
      {
        key: "reports/remittance",
        label: "Remittance",
        title: "",
        icon: <MinusOutlined />,
      },
      {
        key: "reports/shipping",
        label: "Shipping",
        title: "",
        icon: <MinusOutlined />,
      },
      {
        key: "reports/products",
        label: "Products",
        title: "",
        icon: <MinusOutlined />,
      },
      {
        key: "reports/rto",
        label: "RTO",
        title: "",
        icon: <MinusOutlined />,
      },
      {
        key: "reports/return",
        label: "Return",
        title: "",
        icon: <MinusOutlined />,
      },
      {
        key: "reports/exchange",
        label: "Exchange",
        title: "",
        icon: <MinusOutlined />,
      },
    ],
  },
  {
    key: "users",
    label: "Users",
    title: "",
    icon: <MdManageAccounts className="text-lg" />,
  },
  {
    key: "setting",
    label: "Setting",
    title: "",
    icon: <MdSettings className="text-lg" />,
  },
];

// rider routes
export const RIDER_MENU = [
  {
    key: "rider/overview",
    label: "overview",
    title: "",
    icon: <MdDashboard className="text-lg" />,
  },

  {
    key: "rider/orders/new",
    label: "new",
    title: "",
    icon: <RiAddBoxFill className="text-lg" />,
  },
  {
    key: "rider/orders/active",
    label: "active",
    title: "",
    icon: <RiShoppingBag3Fill className="text-lg" />,
  },

  {
    key: "rider/orders/completed",
    label: "completed",
    title: "",
    icon: <RiHome5Fill className="text-lg" />,
  },
];
