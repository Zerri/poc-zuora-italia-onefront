import React from 'react';
import {
  Typography,
  Box,
  Chip,
  FormControl,
  TextField
} from "@vapor/v3-components";
import { ExtendedCharge } from '../../types';
import { useTranslation } from '@1f/react-sdk';

interface ChargeConfiguratorProps {
  charges: ExtendedCharge[];
  chargeValues: Record<string, string>;
  onChargeValueChange: (chargeId: string | number, value: string) => void;
  calculateChargeTotal: (charge: ExtendedCharge) => number;
}

/**
 * @component ChargeConfigurator
 * @description Componente per configurare i valori delle charge di un rate plan
 */
export const ChargeConfigurator: React.FC<ChargeConfiguratorProps> = ({ 
  charges, 
  chargeValues, 
  onChargeValueChange, 
  calculateChargeTotal 
}) => {
  const { t } = useTranslation();
  const getChargeTypeLabel = (type: string): string => {
    switch (type) {
      case 'Recurring': return t('components.productDrawer.chargeConfigurator.chargeTypes.recurring');
      case 'OneTime': return t('components.productDrawer.chargeConfigurator.chargeTypes.oneTime');
      case 'Usage': return t('components.productDrawer.chargeConfigurator.chargeTypes.usage');
      default: return t('components.productDrawer.chargeConfigurator.chargeTypes.other');
    }
  };

  if (!charges || charges.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        {t('components.productDrawer.chargeConfigurator.noConfig')}
      </Box>
    );
  }

  // Formattazione valuta
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {t('components.productDrawer.chargeConfigurator.title')}
      </Typography>
      
      {charges.map((charge, index) => {
        const model = charge.model;
        const type = charge.type;
        const calculatedPrice = calculateChargeTotal(charge);

        // FIX: Determina il valore corrente per questo charge
        const currentValue = chargeValues[charge.id.toString()] || '';

        return (
          <Box key={index} sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2">{charge.name}</Typography>
                <Chip
                  label={getChargeTypeLabel(type)}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
              {/* FIX: Mostra sempre il prezzo calcolato, anche per FlatFee */}
              {calculatedPrice > 0 && (
                <Typography variant="subtitle2" fontWeight="bold">
                  {formatCurrency(calculatedPrice)}
                </Typography>
              )}
            </Box>

            {model === 'FlatFee' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  {t('components.productDrawer.chargeConfigurator.flatFee.fixedPrice')} {formatCurrency(charge.pricing?.[0]?.price ?? 0)}
                </Typography>
              </Box>
            )}

            {(model === 'PerUnit' || model === 'Volume') && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    type="number"
                    label={t('components.productDrawer.chargeConfigurator.perUnit.quantity')}
                    value={currentValue}
                    onChange={(e) => onChargeValueChange(charge.id, e.target.value)}
                    InputProps={{ 
                      inputProps: { min: 0 },
                      // FIX: Aggiungi un suffisso per mostrare l'unità di misura
                      endAdornment: charge.uom ? <Typography variant="body2" sx={{ ml: 1 }}>{charge.uom}</Typography> : null
                    }}
                    size="small"
                  />
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {model === 'PerUnit' ? (
                      <>{t('components.productDrawer.chargeConfigurator.perUnit.unitPrice')} {formatCurrency(charge.pricing?.[0]?.price ?? 0)}</>
                    ) : (
                      <>{t('components.productDrawer.chargeConfigurator.volume.price')}</>
                    )}
                  </Typography>
                </Box>
                
                {/* FIX: Aggiungi una spiegazione per i modelli di prezzo Volume */}
                {model === 'Volume' && 
                  charge.pricing?.[0]?.tiers && 
                  Array.isArray(charge.pricing[0].tiers) && 
                  charge.pricing[0].tiers.length > 0 && (
                    <Box sx={{ mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                        {t('components.productDrawer.chargeConfigurator.volume.priceTiers')}
                      </Typography>
                      {charge.pricing[0].tiers.map((tier, idx) => (
                        <Typography key={idx} variant="caption" display="block">
                          {tier.startingUnit ?? 0} - {tier.endingUnit ?? '∞'}: {formatCurrency(tier.price)}
                        </Typography>
                      ))}
                    </Box>
                  )}
              </Box>
            )}

            {model === 'Usage' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {/* 
                    Questa stringa è da sistemare:
                    Alle stringhe di traduzione è possibile passare dei parametri ma devono essere number.
                    La funzione formatCurrency però trasforma il numero in stringa e questo causa problemi di tipizzazione.
                  */}
                  {t('components.productDrawer.chargeConfigurator.usage.price')} {formatCurrency(charge.pricing?.[0]?.price ?? 0)} per {charge.uom || t('components.productDrawer.chargeConfigurator.unit')}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ChargeConfigurator;