import { useTokenData, useTranslation } from '@1f/react-sdk';
import { Box, Typography } from '@vapor/v3-components';

export const WelcomeMessage = () => {
	const tokenData = useTokenData();
	const { t } = useTranslation();

	return (
		<Box>
			<Typography>{t('common.welcome_user', { name: tokenData?.name })}</Typography>
		</Box>
	);
};
