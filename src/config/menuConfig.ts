// src/config/menuConfig.ts
import { faGauge } from "@fortawesome/pro-regular-svg-icons/faGauge";
import { faUsers } from "@fortawesome/pro-regular-svg-icons/faUsers";
import { faFileInvoice } from "@fortawesome/pro-regular-svg-icons/faFileInvoice";
import { faChartSimple } from "@fortawesome/pro-regular-svg-icons/faChartSimple";
import { faSliders } from "@fortawesome/pro-regular-svg-icons/faSliders";
import { faUserTie } from "@fortawesome/pro-regular-svg-icons/faUserTie";
import { faBook } from "@fortawesome/pro-regular-svg-icons/faBook";

export interface MenuItem {
  label: string;
  route?: string;
  icon?: any;
  children?: any[];
  onClickFunction?: () => void;
}

export interface MenuConfig {
  [role: string]: MenuItem[];
}

/**
 * Submenu Reports - mantenuto dall'implementazione originale
 */
const reportsItems = [
  {
    label: "nav.reports_items.invoicing",
    children: [
      {
        label: "nav.reports_items.invoices",
        onClickFunction: () => {}
      },
      {
        label: "nav.reports_items.reminders", 
        onClickFunction: () => {}
      },
      {
        label: "nav.reports_items.subscriptions",
        onClickFunction: () => {}
      }
    ]
  },
  {
    label: "nav.reports_items.customers",
    children: [
      {
        label: "nav.reports_items.customers",
        onClickFunction: () => {}
      },
      {
        label: "nav.reports_items.customer_groups",
        onClickFunction: () => {}
      },
      {
        label: "nav.reports_items.customer_setup",
        onClickFunction: () => {}
      }
    ]
  },
  {
    label: "nav.reports_items.packages",
    onClickFunction: () => {}
  },
  {
    label: "nav.reports_items.shipments",
    onClickFunction: () => {}
  }
];

/**
 * Submenu Settings - mantenuto dall'implementazione originale  
 */
const settingsItems = [
  {
    label: "nav.settings_items.vendors",
    onClickFunction: () => {}
  },
  {
    label: "nav.settings_items.purchase_orders", 
    onClickFunction: () => {}
  },
  {
    label: "nav.settings_items.purchase_receives",
    onClickFunction: () => {}
  },
  {
    label: "nav.settings_items.bills",
    onClickFunction: () => {}
  }
];

/**
 * Configurazione menu per ruolo utente
 */
export const ROLE_MENUS: MenuConfig = {
  ADMIN: [
    {
      label: "nav.dashboard",
      route: "/",
      icon: faGauge
    },
    {
      label: "nav.userManagement", 
      route: "/user-management",
      icon: faUsers
    },
    {
      label: "nav.adminQuotes",
      route: "/admin-quotes", 
      icon: faFileInvoice
    },
    {
      label: "nav.reports",
      // route: "/reports",
      icon: faChartSimple,
      children: reportsItems
    },
    {
      label: "nav.settings",
      // route: "/settings",
      icon: faSliders,
      children: settingsItems
    }
  ],

  SALES: [
    {
      label: "nav.dashboard",
      route: "/",
      icon: faGauge
    },
    {
      label: "nav.customers",
      route: "/customers",
      icon: faUserTie
    },
    {
      label: "nav.quotes", 
      route: "/quotes",
      icon: faFileInvoice
    },
    {
      label: "nav.catalog",
      route: "/catalog",
      icon: faBook
    },
    {
      label: "nav.settings",
      // route: "/settings", 
      icon: faSliders,
      children: settingsItems
    }
  ]
};

/**
 * Funzione per ottenere menu basato su ruolo utente
 */
export const getMenuByRole = (userRoles: string[]): MenuItem[] => {
  // Prende il primo ruolo dell'utente (assumendo un ruolo singolo)
  const primaryRole = userRoles[0];
  
  return ROLE_MENUS[primaryRole] || [];
};

/**
 * Funzione per verificare se utente ha accesso a una route
 */
export const hasRouteAccess = (userRoles: string[], route: string): boolean => {
  const userMenu = getMenuByRole(userRoles);
  
  const hasAccess = (items: MenuItem[]): boolean => {
    return items.some(item => {
      if (item.route === route) return true;
      if (item.children) return hasAccess(item.children);
      return false;
    });
  };
  
  return hasAccess(userMenu);
};