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
import { faUsers } from "@fortawesome/pro-regular-svg-icons/faUsers";
import { useTranslation } from '@1f/react-sdk';

export const NavContent = () => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const { setMenuTree } = useMenu();

  const settingsItems = [
    {
      label: t("nav.settings_items.vendors"),
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: t("nav.settings_items.purchase_orders"),
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: t("nav.settings_items.purchase_receives"),
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: t("nav.settings_items.bills"),
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    }
  ];

  const reportsItems = [
    {
      label: t("nav.reports_items.invoicing"),
      children: [
        {
          label: t("nav.reports_items.invoices"),
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: t("nav.reports_items.reminders"),
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: t("nav.reports_items.subscriptions"),
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        }
      ]
    },
    {
      label: t("nav.reports_items.customers"),
      children: [
        {
          label: t("nav.reports_items.customers"),
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: t("nav.reports_items.customer_groups"),
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        },
        {
          label: t("nav.reports_items.customer_setup"),
          onClickFunction: () => {},
          // closePopoverAfterClick: true
        }
      ]
    },
    {
      label: t("nav.reports_items.packages"),
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    },
    {
      label: t("nav.reports_items.shipments"),
      onClickFunction: () => {},
      // closePopoverAfterClick: true
    }
  ];

  const menuTree = [
    {
      label: t("nav.dashboard"),
      icon: <VaporIcon icon={faGauge} />,
      // children: dashboardItems
      onClickFunction: () => {
        navigate("/");
      },
    },
    {
      label: t("nav.customers"),
      icon: <VaporIcon icon={faUserTie} />,
      // children: customersItems
      onClickFunction: () => {
        navigate("/customers");
      },
    },
    {
      label: t("nav.quotes"),
      icon: <VaporIcon icon={faFileInvoice} />,
      // children: quotesItems
      onClickFunction: () => {
        navigate("/quotes");
      },
    },
    {
      label: t("nav.catalog"),
      icon: <VaporIcon icon={faBook} />,
      // children: catalogItems
      onClickFunction: () => {
        navigate("/catalog");
      },
    },
    {
      label: t("nav.userManagement"),
      icon: <VaporIcon icon={faUsers} />,
      onClickFunction: () => {
        navigate("/user-management");
      },
    },
    {
      label: t("nav.adminQuotes"),
      icon: <VaporIcon icon={faFileInvoice} />,
      onClickFunction: () => {
        navigate("/admin-quotes");
      },
    },
    {
      label: t("nav.reports"),
      icon: <VaporIcon icon={faChartSimple} />,
      badgeProps: {
        variant: "dot",
        color: "primary"
      },
      children: reportsItems
    },
    {
      label: t("nav.settings"),
      icon: <VaporIcon icon={faSliders} />,
      children: settingsItems
    },
  ];
  
  useEffect(() => {
    if (ready) {
      setMenuTree(menuTree);
    }
  }, [ready]);

  return null;
};
