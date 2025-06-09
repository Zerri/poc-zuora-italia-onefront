import { List, ListItemButton, ListItemIcon, ListItemText, VaporIcon } from '@vapor/v3-components'
import { Link } from 'react-router-dom';
import { faFileInvoice } from "@fortawesome/pro-regular-svg-icons/faFileInvoice";

export const NavContent = () => (
	<List disablePadding>
		<ListItemButton component={Link} to={'/quotes'} uishellItem>
			<ListItemIcon variant="menuIcon">
				<VaporIcon icon={faFileInvoice} color='white' />
			</ListItemIcon>
			<ListItemText primary={'Preventivi'} />
		</ListItemButton>
	</List>
);
