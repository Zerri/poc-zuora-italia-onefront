import { VaporPage } from '@vapor/v3-components';

import { WelcomeMessage } from './welcome-message';

export const Customers = () => (
	<VaporPage title='Clienti'>
		<VaporPage.Section>
			<WelcomeMessage />
		</VaporPage.Section>
	</VaporPage>
);
