// src/features/dashboard/dashboard.tsx
import { VaporThemeProvider, VaporPage, Box, Typography, Paper, Chip } from '@vapor/v3-components';
import { WelcomeMessage } from './welcome-message';
import { useUser } from '../reactRootWrapper/AppUserProvider';
import { AIDrawer } from './ai-drawer';
import { useRouteAccess } from '../../hooks/useRouteAccess';

export const Dashboard = () => {
	const { user } = useUser();
	const { canAccess } = useRouteAccess();
	
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
							{/* Nome */}
							<Box>
								<Typography variant="body2" color="text.secondary">
									Nome:
								</Typography>
								<Typography variant="body1">{user.name}</Typography>
							</Box>

							{/* ID */}
							<Box>
								<Typography variant="body2" color="text.secondary">
									ID:
								</Typography>
								<Typography variant="body1">{user.id}</Typography>
							</Box>

							{/* Ruoli */}
							<Box>
								<Typography variant="body2" color="text.secondary">
									Ruoli:
								</Typography>
								<Box display="flex" gap={1}>
									{user.roles.map((role) => (
										<Chip key={role} label={role} size="small" color="primary" />
									))}
								</Box>
							</Box>

							{/* Menu */}
							<Box>
								<Typography variant="body2" color="text.secondary">
									Menu disponibile:
								</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{user.menu.map((item, index) => (
										<Chip key={index} label={item.label} size="small" variant="outlined" />
									))}
								</Box>
							</Box>

							{/* Permessi */}
							<Box>
								<Typography variant="body2" color="text.secondary">
									Permessi:
								</Typography>

								<Box display="flex" flexDirection="column" gap={1}>
									{Object.entries(user.permissions).map(([section, perms]) => (
										<Box key={section}>
											<Typography variant="body1" fontWeight="bold">
												{section}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{Object.entries(perms).map(([perm, allowed]) => (
													<span key={perm} style={{ marginRight: 12 }}>
														{perm}={allowed ? "✓" : "✗"}
													</span>
												))}
											</Typography>
										</Box>
									))}
								</Box>
							</Box>
						</Box>
					</Paper>
					
					{/* Mostra AIDrawer solo se SALES e feature abilitata */}
          {canAccess("aiDrawer") && <AIDrawer />}
				</VaporPage.Section>
			</VaporPage>
		</VaporThemeProvider>
	);
}