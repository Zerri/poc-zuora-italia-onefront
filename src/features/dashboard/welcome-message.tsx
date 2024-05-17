import { useTokenData, useTranslation } from '@1f/react-sdk';
import { Typography } from '@vapor/react-extended';
import { Box } from '@vapor/react-material';

export const WelcomeMessage = () => {
	const tokenData = useTokenData();
	const { t } = useTranslation();

	return (
		<Box>
			<Typography>{t('welcome_user', { name: tokenData?.name })}</Typography>
		</Box>
	);
};
