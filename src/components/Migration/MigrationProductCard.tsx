import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Tag,
  Chip,
  Divider,
  Box,
  IconButton,
  Tooltip,
  VaporIcon
} from "@vapor/v3-components";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons/faInfoCircle";
import { faArrowRight } from "@fortawesome/pro-regular-svg-icons/faArrowRight";
import { faTrash } from "@fortawesome/pro-regular-svg-icons/faTrash";
import { useTranslation } from '@1f/react-sdk';
import { Product, TagType } from '../../types';

interface MigrationProductCardProps {
  product: Product;
  onRemove?: (id: string | number) => void;
  translateCategory?: (category?: string) => string;
  getCategoryTagType?: (category?: string) => TagType;
  formatPrice?: (price: number) => string;
  isMigrationSource?: boolean;
  isMigratable?: boolean;
  nonMigratableReason?: string;
  hasReplacement?: boolean;
  replacesProductId?: string | null;
}

/**
 * @component MigrationProductCard
 * @description Versione adattata di ConfiguredProductCard per il contesto della migrazione
 * Aggiunge indicatori di migrazione come etichette di stato e tooltips
 */
export const MigrationProductCard: React.FC<MigrationProductCardProps> = ({ 
  product, 
  onRemove, 
  translateCategory, 
  getCategoryTagType,
  formatPrice = (price) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price),
  isMigrationSource = false,
  isMigratable = true,
  nonMigratableReason = "",
  hasReplacement = false,
  replacesProductId = null
}) => {
  const { t } = useTranslation();
  // Calcola lo sconto se c'è un prezzo cliente personalizzato
  const hasCustomPrice = product.customerPrice && product.customerPrice !== product.price;
  const discount = hasCustomPrice && product.price && product.customerPrice
  ? Number(((product.price - product.customerPrice) / product.price * 100).toFixed(2))
  : 0;
  
  // Prezzo da usare per i calcoli
  const effectivePrice = product.customerPrice || product.price;
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: 2,
      opacity: isMigrationSource && !isMigratable ? 0.8 : 1,
      border: isMigrationSource && !isMigratable ? '1px solid' : '1px solid transparent',
      borderColor: isMigrationSource && !isMigratable ? 'error.light' : 'transparent',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: (isMigrationSource && !isMigratable) ? 'none' : 'translateY(-4px)',
        boxShadow: (isMigrationSource && !isMigratable) ? 1 : 4
      },
      position: 'relative'
    }}>
      <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={{ flex: 1 }}>
            {product.name}
          </Typography>
          {product.category && (
            <Tag 
              label={translateCategory ? translateCategory(product.category) : product.category} 
              type={getCategoryTagType ? getCategoryTagType(product.category) : 'tone1'}
              size="small"
              variant='duotone'
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ minHeight: '40px' }}>
          {product.description || t('components.migrationProductCard.noDescription')}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Informazioni sul Rate Plan */}
        {product.ratePlan && (
          <Box sx={{ my: 1 }}>
            <Typography variant="body2" color="text.primary" fontWeight="bold">
              {t('components.migrationProductCard.plan', { name: product.ratePlan.name})}
            </Typography>
            {product.ratePlan.Infrastructure__c && (
              <Typography variant="body2" color="text.secondary">
                {t('components.migrationProductCard.infrastructure', { name: product.ratePlan.Infrastructure__c})}
              </Typography>
            )}
            {product.charges && product.charges.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {product.charges.slice(0, 2).map((charge, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary">
                    {charge.name}: {charge.value} ({formatPrice(charge.calculatedPrice || 0)})
                  </Typography>
                ))}
                {product.charges.length > 2 && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    {t('components.migrationProductCard.otherComponents')}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
        
        {/* Indicatore di prodotto sostitutivo (solo per prodotti target) */}
        {!isMigrationSource && replacesProductId && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: 'action.hover',
            p: 1,
            borderRadius: 1,
            mt: 1
          }}>
            <VaporIcon icon={faArrowRight} size="s" color="primary" />
            <Typography variant="body2" color="text.secondary">
              {t('components.migrationProductCard.replacesProduct')}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        {/* Indicatore di migrazione (solo per prodotti source) */}
        {isMigrationSource && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: isMigratable ? 'success.light' : 'error.light',
            p: '4px 8px',
            borderRadius: '4px',
            mb: 1
          }}>
            <Tooltip 
              title={isMigratable ? t('components.migrationProductCard.migratableTooltip') : nonMigratableReason}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VaporIcon 
                  icon={isMigratable ? faInfoCircle : faExclamationTriangle} 
                  size="s" 
                  color="white"
                />
                <Typography 
                  variant="caption" 
                  color="contentLight"
                  sx={{ ml: 0.5 }}
                >
                  {isMigratable ? t('components.migrationProductCard.migratable') : t('components.migrationProductCard.nonMigratable')}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )}
        
        {/* Sezione prezzi */}
        <Box sx={{ my: 2 }}>
          {hasCustomPrice ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('components.migrationProductCard.listPrice')}
                </Typography>
                <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                  {formatPrice((product.price || 0) * (product.quantity || 1))}{t('components.migrationProductCard.perYear')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {t('components.migrationProductCard.discountedPrice')}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  {formatPrice((effectivePrice || 0) * (product.quantity || 1))}{t('components.migrationProductCard.perYear')}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body1" fontWeight="bold">
              {formatPrice((effectivePrice || 0) * (product.quantity || 1))}{t('components.migrationProductCard.perYear')}
            </Typography>
          )}
        </Box>
        
        {/* Azioni e Badge */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasCustomPrice && (
              <Chip 
                label={`-${discount}%`}
                color="success"
                size="small"
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Badge per prodotti con sostituto */}
            {isMigrationSource && isMigratable && hasReplacement && (
              <Tooltip title={t('components.migrationProductCard.replacementTooltip')}>
                <Chip
                  label={t('components.migrationProductCard.withReplacement')}
                  color="primary"
                  size="small"
                />
              </Tooltip>
            )}
            
            {/* Badge per prodotti che sostituiscono altri */}
            {!isMigrationSource && replacesProductId && (
              <Tooltip title={t('components.migrationProductCard.substitutiveTooltip')}>
                <Chip
                  label={t('components.migrationProductCard.substitutive')}
                  color="primary"
                  size="small"
                />
              </Tooltip>
            )}
            
            {/* Pulsante rimuovi */}
            {!isMigrationSource && onRemove && (
              <Tooltip title={t('components.migrationProductCard.removeProduct')}>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onRemove(product.id)}
                >
                  <VaporIcon icon={faTrash} size="l" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MigrationProductCard;