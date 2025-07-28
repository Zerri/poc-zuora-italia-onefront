// features/quotes/components/QuoteDrawer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  Typography,
  Box,
  Tag,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  VaporToolbar
} from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { Quote, StatusTranslations, TypeTranslations } from './types';
import {
  formatDate,
  formatCurrency,
  calculateQuoteValue,
  getStatusTagType,
  getStatusTagVariant,
  getTypeTagVariant
} from './utils';

interface QuoteDrawerProps {
  open: boolean;
  quote: Quote | null;
  onClose: () => void;
  statusTranslations: StatusTranslations;
  typeTranslations: TypeTranslations;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  open,
  quote,
  onClose,
  statusTranslations,
  typeTranslations,
}) => {

  console.log("QuoteDrawer opened with quote:", quote);
  if (!quote) return null;
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      width="30vw"
      hideBackdrop={false}
      sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
    >
      {quote && (
        <>
          <Title
            title={quote.customer.name}
            description={t("features.quotes.drawer.quoteNumber", { number: quote.number })}
            divider
            rightItems={[
              <IconButton size="small" variant='outlined' onClick={onClose}>
                <VaporIcon icon={faClose} size="xl" />
              </IconButton>
            ]}
          />
          
          <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" fontWeight="medium">
                {t("features.quotes.drawer.sector", { sector: quote.customer.sector })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tag 
                  label={typeTranslations[quote.type]} 
                  type="warning"
                  size="medium"
                  variant={getTypeTagVariant(quote.type)}
                />
                <Tag 
                  label={statusTranslations[quote.status]} 
                  type={getStatusTagType(quote.status)}
                  size="medium"
                  variant={getStatusTagVariant(quote.status)}
                />
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t("features.quotes.drawer.quoteDetails")}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">{t("features.quotes.drawer.createdOn")}</Typography>
                <Typography variant="body1" fontWeight="medium">{formatDate(quote.createdAt)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">{t("features.quotes.drawer.totalValue")}</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(quote.products && quote.products.length > 0 ? calculateQuoteValue(quote.products) : quote.value || 0)}{t("features.quotes.drawer.perYear")}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t("features.quotes.drawer.includedProducts")}
            </Typography>
            
            {quote.products && quote.products.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                {quote.products.map((product, index) => (
                  <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium">{product.name}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">
                          {t("features.quotes.drawer.quantity", { quantity: product.quantity })}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(product.price * product.quantity)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t("features.quotes.drawer.noProducts")}
              </Typography>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {quote.notes && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t("features.quotes.drawer.notes")}
                </Typography>
                <Typography variant="body2" paragraph>
                  {quote.notes || t("features.quotes.drawer.noNotes")}
                </Typography>
              </>
            )}
          </Box>
          
          <VaporToolbar
            contentRight={[
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={onClose}
              >
                {t("features.quotes.actions.close")}
              </Button>,
              <Link to={`/quote/${quote._id}`}>
                <Button 
                  variant="contained" 
                  color="primary"
                >
                  {t("features.quotes.actions.editQuote")}
                </Button>
              </Link>
            ]}
            size="medium"
            variant="regular"
            withoutAppBar
          />
        </>
      )}
    </Drawer>
  );
};