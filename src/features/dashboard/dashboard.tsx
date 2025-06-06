import { VaporPage } from '@vapor/v3-components';

import { WelcomeMessage } from './welcome-message';

export const Dashboard = () => (
	<VaporPage title='Dashboard'>
		<VaporPage.Section>
			<WelcomeMessage />
		</VaporPage.Section>
	</VaporPage>
);
