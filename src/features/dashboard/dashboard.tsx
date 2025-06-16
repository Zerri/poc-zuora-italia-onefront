import { VaporPage } from '@vapor/v3-components';
import { WelcomeMessage } from './welcome-message';
import { useRole } from '../../contexts/RoleContext';

export const Dashboard = () => {
	const { role } = useRole();
	return (
		<VaporPage title='Dashboard'>
			<VaporPage.Section>
				<WelcomeMessage />
				{role}
			</VaporPage.Section>
		</VaporPage>
	);
}
