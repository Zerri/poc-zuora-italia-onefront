import { VaporPage } from '@vapor/react-custom';

import { WelcomeMessage } from './welcome-message';

export const Dashboard = () => (
	<VaporPage title='Dashboard'>
		<VaporPage.Section>
			<WelcomeMessage />
		</VaporPage.Section>
	</VaporPage>
);
