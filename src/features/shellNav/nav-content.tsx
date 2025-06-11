import { useEffect } from "react";
import { useMenu } from "@1f/react-sdk";
import { useNavigate } from "react-router-dom";
import { VaporIcon } from '@vapor/v3-components'
import { faSliders } from "@fortawesome/pro-regular-svg-icons/faSliders";
import { faChartSimple } from "@fortawesome/pro-regular-svg-icons/faChartSimple";
import { faGauge } from "@fortawesome/pro-regular-svg-icons/faGauge";
import { faUserTie } from "@fortawesome/pro-regular-svg-icons/faUserTie";
import { faFileInvoice } from "@fortawesome/pro-regular-svg-icons/faFileInvoice";
import { faBook } from "@fortawesome/pro-regular-svg-icons/faBook";

export const NavContent = () => {
  const navigate = useNavigate();
  const { setMenuTree } = useMenu();

  const settingsItems = [
    {
      label: "Vendors",
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: "Purchase orders", 
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: "Purchase receives",
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: "Bills",
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    }
  ];

  const reportItems = [
    {
      label: "Invoicing",
      children: [
        {
          label: "Invoices",
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: "Reminders",
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: "Subscriptions",
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        }
      ]
    },
    {
      label: "Customers",
      children: [
        {
          label: "Customers",
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: "Customer groups",
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: "Customer setup",
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        }
      ]
    },
    {
      label: "Packages",
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: "Shipments",
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    }
  ];

  const menuTree = [
    {
      label: "Dashboard",
      icon: <VaporIcon icon={faGauge} />,
      // children: dashboardItems
      onClickFunction: () => {
        navigate("/");
      },
    },
    {
      label: "Clienti",
      icon: <VaporIcon icon={faUserTie} />,
      // children: customersItems
      onClickFunction: () => {
        navigate("/customers");
      },
    },
    {
      label: "Preventivi",
      icon: <VaporIcon icon={faFileInvoice} />,
      // children: quotesItems
      onClickFunction: () => {
        navigate("/quotes");
      },
    },
    {
      label: "Catalogo",
      icon: <VaporIcon icon={faBook} />,
      // children: catalogItems
      onClickFunction: () => {
        navigate("/catalog");
      },
    },
    {
      label: "Reports",
      icon: <VaporIcon icon={faChartSimple} />,
      badgeProps: {
        variant: "dot",
        color: "primary"
      },
      children: reportItems
    },
    {
      label: "Settings",
      icon: <VaporIcon icon={faSliders} />,
      children: settingsItems
    },
  ];
  
  useEffect(() => {
    setMenuTree(menuTree);
  }, []);

  return null;
};
