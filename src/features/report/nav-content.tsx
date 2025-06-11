import { useEffect } from "react";
import { useMenu } from "@1f/react-sdk";
import { VaporIcon } from '@vapor/v3-components'
import { faChartSimple } from "@fortawesome/pro-regular-svg-icons/faChartSimple";

const menuItems = [
  {
    label: "Invoicing",
    children: [
      {
        label: "Invoices",
        onClickFunction: () => {},
        closePopoverAfterClick: true
      },
      {
        label: "Reminders",
        onClickFunction: () => {},
        closePopoverAfterClick: true
      },
      {
        label: "Subscriptions",
        onClickFunction: () => {},
        closePopoverAfterClick: true
      }
    ]
  },
  {
    label: "Customers",
    children: [
      {
        label: "Customers",
        onClickFunction: () => {},
        closePopoverAfterClick: true
      },
      {
        label: "Customer groups",
        onClickFunction: () => {},
        closePopoverAfterClick: true
      },
      {
        label: "Customer setup",
        onClickFunction: () => {},
        closePopoverAfterClick: true
      }
    ]
  },
  {
    label: "Packages",
    onClickFunction: () => {},
    closePopoverAfterClick: true
  },
  {
    label: "Shipments",
    onClickFunction: () => {},
    closePopoverAfterClick: true
  }
];

const reportMenuTree = [
  {
    label: "Report",
    icon: <VaporIcon icon={faChartSimple} />,
    badgeProps: {
      variant: "dot",
      color: "primary"
    },
    children: menuItems
  }
];

export const NavContent = () => {
  const { menuTree, setMenuTree } = useMenu();

  console.log(menuTree);
  
  useEffect(() => {
    setMenuTree(prevTree => [...prevTree, reportMenuTree]);
  }, []);

  return null;
};
