import { faList } from "@fortawesome/pro-regular-svg-icons/faList";
import { List, ListItemButton, ListItemIcon, ListItemText, VaporIcon } from "@vapor/v3-components";
import { Link } from "react-router-dom";

export const NavContent = ({ basePath }: { basePath: string }) => (
  <List disablePadding>
    <ListItemButton component={Link} to={basePath} uishellItem>
      <ListItemIcon variant="menuIcon">
        <VaporIcon icon={faList} color='white' />
      </ListItemIcon>
      <ListItemText primary={"Examples"} />
    </ListItemButton>
  </List>
);
