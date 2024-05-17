import { Article } from "@mui/icons-material";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@vapor/react-material";
import { Link } from "react-router-dom";

export const NavContent = ({ basePath }: { basePath: string }) => (
  <List>
    <ListItemButton component={Link} to={basePath}>
      <ListItemIcon>
        <Article />
      </ListItemIcon>
      <ListItemText primary={"Examples"} />
    </ListItemButton>
  </List>
);
