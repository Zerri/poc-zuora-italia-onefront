import { List, ListItemButton, ListItemIcon, ListItemText, VaporIcon } from '@vapor/v3-components'
import { faSliders } from "@fortawesome/pro-regular-svg-icons/faSliders";

export const NavContent = () => (
  <List disablePadding>
    <ListItemButton uishellItem>
      <ListItemIcon variant="menuIcon">
        <VaporIcon icon={faSliders} color='white' />
      </ListItemIcon>
      <ListItemText primary={'Settings'} />
    </ListItemButton>
  </List>
);
