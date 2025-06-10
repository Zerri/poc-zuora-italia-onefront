import { List, ListItemButton, ListItemIcon, ListItemText, VaporIcon } from '@vapor/v3-components'
import { Link } from 'react-router-dom';
import { faBook } from "@fortawesome/pro-regular-svg-icons/faBook";

export const NavContent = () => (
  <List disablePadding>
    <ListItemButton component={Link} to={'/catalog'} uishellItem>
      <ListItemIcon variant="menuIcon">
        <VaporIcon icon={faBook} color='white' />
      </ListItemIcon>
      <ListItemText primary={'Catalogo'} />
    </ListItemButton>
  </List>
);
