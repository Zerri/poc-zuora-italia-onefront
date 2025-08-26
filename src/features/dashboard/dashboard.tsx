// src/features/dashboard/dashboard.tsx
import { VaporThemeProvider, VaporPage, Box, Typography, Paper, Chip } from '@vapor/v3-components';
import { WelcomeMessage } from './welcome-message';
import { useRole } from '../../contexts/RoleContext';
import { useUser } from '../reactRootWrapper/AppUserProvider';
import { usePermissions } from '../../hooks/usePermissions';
import { AIDrawer } from './ai-drawer';

export const Dashboard = () => {
	const { role } = useRole();
	const { user } = useUser();
	const { userName, userRoles, canView, canCreate } = usePermissions();

	return (
		<VaporThemeProvider>
			<VaporPage title='Dashboard'>
				<VaporPage.Section>
					<WelcomeMessage />
					
					{/* Dati utente da /me */}
					<Paper sx={{ p: 3, mb: 3 }}>
						<Typography variant="h6" gutterBottom>
							Informazioni Utente (da /me)
						</Typography>
						
						<Box display="flex" flexDirection="column" gap={2}>
							<Box>
								<Typography variant="body2" color="text.secondary">Nome:</Typography>
								<Typography variant="body1">{userName}</Typography>
							</Box>
							
							<Box>
								<Typography variant="body2" color="text.secondary">ID:</Typography>
								<Typography variant="body1">{user?.id}</Typography>
							</Box>
							
							<Box>
								<Typography variant="body2" color="text.secondary">Ruoli:</Typography>
								<Box display="flex" gap={1}>
									{userRoles.map(role => (
										<Chip key={role} label={role} size="small" color="primary" />
									))}
								</Box>
							</Box>
							
							<Box>
								<Typography variant="body2" color="text.secondary">Menu disponibile:</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{user?.menu.map((item, index) => (
										<Chip key={index} label={item.label} size="small" variant="outlined" />
									))}
								</Box>
							</Box>
							
							<Box>
								<Typography variant="body2" color="text.secondary">Permessi esempio:</Typography>
								<Typography variant="body1">
									Preventivi: VIEW={canView('quotes') ? '✓' : '✗'}, 
									CREATE={canCreate('quotes') ? '✓' : '✗'}
								</Typography>
							</Box>
						</Box>
					</Paper>

					{/* Vecchio role selector per confronto */}
					<Typography variant="body2" color="text.secondary">
						Vecchio role context: {role}
					</Typography>
					
					<AIDrawer />
				</VaporPage.Section>
			</VaporPage>
		</VaporThemeProvider>
	);
}