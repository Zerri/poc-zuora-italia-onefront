import { useEffect } from "react";
import { useMenu } from "@1f/react-sdk";
import { VaporIcon } from '@vapor/v3-components'
import { faSliders } from "@fortawesome/pro-regular-svg-icons/faSliders";

const menuItems = [
  {
    label: "Vendors",
    onClickFunction: () => {},
    closePopoverAfterClick: true
  },
  {
    label: "Purchase orders", 
    onClickFunction: () => {},
    closePopoverAfterClick: true
  },
  {
    label: "Purchase receives",
    onClickFunction: () => {},
    closePopoverAfterClick: true
  },
  {
    label: "Bills",
    onClickFunction: () => {},
    closePopoverAfterClick: true
  }
];

const settingsMenuTree = [
  {
    label: "Settings",
    icon: <VaporIcon icon={faSliders} />,
    // badgeProps: {
    //   variant: "dot",
    //   color: "primary"
    // },
    children: menuItems
  }
];

export const NavContent = () => {
  const { menuTree, setMenuTree } = useMenu();
  console.log(menuTree);
  
  useEffect(() => {
    setMenuTree([...menuTree, ...settingsMenuTree]);
  }, []);

  return null;
};