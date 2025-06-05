import { List, ListItemButton, ListItemIcon, ListItemText } from '@vapor/v3-components'
import { Link } from 'react-router-dom';
import  VaporIcon from "@vapor/v3-components/VaporIcon";
import { faUserTie } from "@fortawesome/pro-regular-svg-icons/faUserTie";

export const NavContent = () => (
	<List>
		<ListItemButton component={Link} to={'/customers'} uishellItem>
			<ListItemIcon variant="menuIcon">
				<VaporIcon icon={faUserTie} color='white' />
			</ListItemIcon>
			<ListItemText primary={'Clienti'} />
		</ListItemButton>
	</List>
);
