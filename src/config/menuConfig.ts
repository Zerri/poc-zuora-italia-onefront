// src/config/menuConfig.ts
import { faGauge } from "@fortawesome/pro-regular-svg-icons/faGauge";
import { faUsers } from "@fortawesome/pro-regular-svg-icons/faUsers";
import { faFileInvoice } from "@fortawesome/pro-regular-svg-icons/faFileInvoice";
import { faChartSimple } from "@fortawesome/pro-regular-svg-icons/faChartSimple";
import { faSliders } from "@fortawesome/pro-regular-svg-icons/faSliders";
import { faUserTie } from "@fortawesome/pro-regular-svg-icons/faUserTie";
import { faBook } from "@fortawesome/pro-regular-svg-icons/faBook";
import { faUserShield } from "@fortawesome/pro-regular-svg-icons/faUserShield";

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
        route: "/reports/invoices"
      },
      {
        label: "nav.reports_items.reminders", 
        route: "/reports/reminders"
      },
      {
        label: "nav.reports_items.subscriptions",
        route: "/reports/subscriptions"
      }
    ]
  },
  {
    label: "nav.reports_items.customers",
    children: [
      {
        label: "nav.reports_items.customers",
        route: "/reports/customers"
      },
      {
        label: "nav.reports_items.customer_groups",
        route: "/reports/customer-groups"
      },
      {
        label: "nav.reports_items.customer_setup",
        route: "/reports/customer-setup"
      }
    ]
  },
  {
    label: "nav.reports_items.packages",
    route: "/report/package"
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
      route: "/admin/users",
      icon: faUsers
    },
    {
      label: "nav.customerManagement",
      route: "/admin/customers",
      icon: faUserTie
    },
    {
      label: "nav.adminQuotes",
      route: "/admin/quotes", 
      icon: faFileInvoice
    },
    {
      label: "nav.reports",
      icon: faChartSimple,
      children: reportsItems
    },
    {
      label: "nav.settings",
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
    }
  ],

  BACKOFFICE: [
    {
      label: "nav.dashboard",
      route: "/",
      icon: faGauge
    }
  ]
};

/**
 * Funzione per ottenere menu basato su ruolo utente - NUOVA IMPLEMENTAZIONE
 * Gestisce ruoli singoli e multipli con raggruppamento admin
 */
export const getMenuByRole = (userRoles: string[]): MenuItem[] => {
  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  // CASO 1: Ruolo singolo - logica invariata
  if (userRoles.length === 1) {
    const singleRole = userRoles[0];
    return ROLE_MENUS[singleRole] || [];
  }

  // CASO 2: Ruoli multipli - nuova logica
  if (userRoles.length > 1) {
    return buildMultiRoleMenu(userRoles);
  }

  return [];
};

/**
 * Costruisce menu per utenti con ruoli multipli
 * Priorità: SALES first, ADMIN sotto "Amministrazione"
 */
const buildMultiRoleMenu = (userRoles: string[]): MenuItem[] => {
  const finalMenu: MenuItem[] = [];
  const adminItems: MenuItem[] = [];
  
  // Ordina ruoli: non-ADMIN first, ADMIN last
  const sortedRoles = [...userRoles].sort((a, b) => {
    if (a === 'ADMIN' && b !== 'ADMIN') return 1;
    if (a !== 'ADMIN' && b === 'ADMIN') return -1;
    return 0;
  });

  console.log('🔧 Multi-role menu build - Original roles:', userRoles);
  console.log('🔧 Multi-role menu build - Sorted roles:', sortedRoles);

  // Processa ogni ruolo
  sortedRoles.forEach(role => {
    const roleMenu = ROLE_MENUS[role] || [];
    
    if (role === 'ADMIN') {
      // Raccogli voci ADMIN per raggrupparle
      adminItems.push(...roleMenu);
    } else {
      // Aggiungi voci non-ADMIN direttamente al menu principale
      roleMenu.forEach(item => {
        // Evita duplicati (es. Dashboard presente in più ruoli)
        const existingItem = finalMenu.find(existing => 
          existing.label === item.label || existing.route === item.route
        );
        
        if (!existingItem) {
          finalMenu.push({...item});
        }
      });
    }
  });

  // Se ci sono voci admin, aggiungile sotto "Amministrazione"
  if (adminItems.length > 0) {
    const administrationMenuItem: MenuItem = {
      label: "nav.administration",
      icon: faUserShield,
      children: adminItems.map(item => ({
        label: item.label,
        // SEMPLIFICATO: Mantieni la route originale per il NavContent esistente
        route: item.route,
        // Mantieni onClickFunction per voci senza route
        onClickFunction: item.onClickFunction,
        // Mantieni children per submenu complessi (Reports, Settings)
        ...(item.children && { children: item.children })
      }))
    };

    finalMenu.push(administrationMenuItem);
  }

  console.log('🔧 Multi-role menu build - Final menu:', finalMenu);
  
  return finalMenu;
};
