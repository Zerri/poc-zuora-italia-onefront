import { VaporThemeProvider, VaporPage } from '@vapor/v3-components';
import { WelcomeMessage } from './welcome-message';
import { useRole } from '../../contexts/RoleContext';
import { AIDrawer } from './ai-drawer';

export const Dashboard = () => {
	const { role } = useRole();
	return (
		<VaporThemeProvider>
			<VaporPage title='Dashboard'>
				<VaporPage.Section>
					<WelcomeMessage />
					{role}
					<AIDrawer />
				</VaporPage.Section>
			</VaporPage>
		</VaporThemeProvider>
	);
}
