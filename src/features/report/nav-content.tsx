import { List, ListItemButton, ListItemIcon, ListItemText, VaporIcon } from '@vapor/v3-components'
import { faChartSimple } from "@fortawesome/pro-regular-svg-icons/faChartSimple";

export const NavContent = () => (
  <List disablePadding>
    <ListItemButton uishellItem>
      <ListItemIcon variant="menuIcon">
        <VaporIcon icon={faChartSimple} color='white' />
      </ListItemIcon>
      <ListItemText primary={'Report'} />
    </ListItemButton>
  </List>
);
