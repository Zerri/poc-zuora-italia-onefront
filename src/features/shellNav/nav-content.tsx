// src/features/shellNav/nav-content.tsx - VERSIONE CORRETTA

import { useEffect } from "react";
import { useMenu } from "@1f/react-sdk";
import { useNavigate } from "react-router-dom";
import { VaporIcon } from '@vapor/v3-components'
import { useTranslation } from '@1f/react-sdk';
import { usePermissions } from '../../hooks/usePermissions';
import { getMenuByRole, MenuItem } from '../../config/menuConfig';

export const NavContent = () => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const { setMenuTree } = useMenu();
  const { userRoles } = usePermissions();

  /**
   * Converte MenuItem[] in formato compatibile con setMenuTree
   * ✅ FIXED: Gestisce route anche nei submenu children
   */
  const convertMenuItems = (items: MenuItem[]) => {
    return items.map(item => {
      const baseItem: any = {
        label: t(item.label),
        icon: item.icon ? <VaporIcon icon={item.icon} /> : undefined,
        ...(item.route && { onClickFunction: () => navigate(item.route!) })
      };

      // Gestione children per Reports (badge support)
      if (item.label === "nav.reports") {
        baseItem.badgeProps = {
          variant: "dot",
          color: "primary"
        };
      }

      // ✅ FIXED: Gestione children con supporto completo per route
      if (item.children) {
        baseItem.children = item.children.map((child: any) => {
          
          // Se il child ha suoi children (nested submenu)
          if (child.children) {
            return {
              label: t(child.label),
              children: child.children.map((nestedChild: any) => ({
                label: t(nestedChild.label),
                // ✅ FIXED: Controlla prima route, poi onClickFunction
                onClickFunction: nestedChild.route 
                  ? () => {
                      console.log('🔧 Navigating to nested route:', nestedChild.route);
                      navigate(nestedChild.route);
                    }
                  : nestedChild.onClickFunction || (() => {
                      console.log('🔧 No route or function for nested child:', nestedChild.label);
                    }),
                closePopoverAfterClick: true
              }))
            };
          } else {
            // ✅ FIXED: Child semplice con supporto route
            return {
              label: t(child.label),
              onClickFunction: child.route 
                ? () => {
                    console.log('🔧 Navigating to child route:', child.route);
                    navigate(child.route);
                  }
                : child.onClickFunction || (() => {
                    console.log('🔧 No route or function for child:', child.label);
                  }),
              closePopoverAfterClick: true
            };
          }
        });
      }

      return baseItem;
    });
  };

  useEffect(() => {
    if (ready && userRoles.length > 0) {
      // Ottieni menu dinamico basato su ruolo
      const userMenuItems = getMenuByRole(userRoles);
      const menuTree = convertMenuItems(userMenuItems);
      
      console.log('🔧 Dynamic Menu - User Roles:', userRoles);
      console.log('🔧 Dynamic Menu - Menu Items:', userMenuItems);
      console.log('🔧 Dynamic Menu - Converted Tree:', menuTree);
      
      setMenuTree(menuTree);
    }
  }, [ready, userRoles, t, navigate, setMenuTree]);

  return null;
};