import React from 'react';
import {
  Typography,
  Grid,
  Box
} from "@vapor/v3-components";
import { Product } from '../../types';
import { useTranslation } from '@1f/react-sdk';

interface ProductInfoSectionProps {
  product: Product;
  translateCategory: (category?: string) => string;
}

/**
 * @component ProductInfoSection
 * @description Sezione per visualizzare le informazioni del prodotto con nuovo ordine
 */
export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ product, translateCategory }) => {
  const { t } = useTranslation();
  
  // Determina il tipo di prodotto
  const getProductType = (product: Product): string => {
    if (product.type) return product.type;
    if (product.categoria === 'enterprise') return t("components.productDrawer.productInfoSection.productTypes.enterprise");
    if (product.categoria === 'professional') return t("components.productDrawer.productInfoSection.productTypes.professional");
    return t("components.productDrawer.productInfoSection.productTypes.commercial");
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Prima riga: Nome */}
        <Grid item xs={12}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            {t("components.productDrawer.productInfoSection.name")}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {product.name}
          </Typography>
        </Grid>

        {/* Seconda riga: Descrizione */}
        <Grid item xs={12}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            {t("components.productDrawer.productInfoSection.description")}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {product.description || t("components.productDrawer.productInfoSection.noDescription")}
          </Typography>
        </Grid>

        {/* Terza riga: SKU, Categoria, Tipo */}
        <Grid item xs={4}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            {t("components.productDrawer.productInfoSection.sku")}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {product.sku || product.id || 'SKU-00000003'}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            {t("components.productDrawer.productInfoSection.category")}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {translateCategory(product.categoria) || 'Base Products'}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            {t("components.productDrawer.productInfoSection.type")}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {getProductType(product)}
          </Typography>
        </Grid>

        {/* Quarta riga: Validità */}
        <Grid item xs={12}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontWeight: 'medium', display: 'block', mb: 0.25 }}
          >
            {t("components.productDrawer.productInfoSection.validity")}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            2024-02-01 - 2030-02-01
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductInfoSection;