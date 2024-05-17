import { Article } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@vapor/react-material';
import { Link } from 'react-router-dom';

export const NavContent = () => (
	<List>
		<ListItemButton component={Link} to={'/'}>
			<ListItemIcon>
				<Article />
			</ListItemIcon>
			<ListItemText primary={'Dashboard'} />
		</ListItemButton>
	</List>
);
