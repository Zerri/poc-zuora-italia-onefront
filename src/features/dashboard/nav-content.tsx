import { faGauge } from "@fortawesome/pro-regular-svg-icons/faGauge";
import { List, ListItemButton, ListItemIcon, ListItemText, VaporIcon } from '@vapor/v3-components';
import { Link } from 'react-router-dom';

export const NavContent = () => (
	<List disablePadding>
		<ListItemButton component={Link} to={'/'} uishellItem>
			<ListItemIcon variant="menuIcon">
				<VaporIcon icon={faGauge} color='white' />
			</ListItemIcon>
			<ListItemText primary={'Dashboard'} />
		</ListItemButton>
	</List>
);
