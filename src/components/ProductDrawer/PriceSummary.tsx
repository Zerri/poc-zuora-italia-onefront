import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Chip,
  TextField,
  InputAdornment
} from "@vapor/v3-components";
import { ExtendedRatePlan, ExtendedCharge } from '../../types';
import { useTranslation } from '@1f/react-sdk';

interface PriceSummaryProps {
  selectedRatePlan: ExtendedRatePlan;
  chargeValues: Record<string, string>;
  calculateChargeTotal: (charge: ExtendedCharge) => number;
  customerPrice?: number | string;
  onCustomerPriceChange?: (price: number) => void;
  isDiscountProduct?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  selectedRatePlan, 
  chargeValues, 
  calculateChargeTotal,
  customerPrice: propCustomerPrice, // Rinominato per evitare confusione
  onCustomerPriceChange, // Prop per gestire il cambio di prezzo cliente
  isDiscountProduct = false
}) => {
  const { t } = useTranslation();
  // State locale per il prezzo cliente
  const [customerPrice, setCustomerPrice] = useState<number | string>('');
  
  // Effetto per aggiornare il prezzo cliente quando cambiano i dati esterni
  useEffect(() => {
    if (selectedRatePlan) {
      const calculatedTotal = calculateTotalPrice();
      
      if (propCustomerPrice !== undefined) {
        // Verifica se il valore è numerico e non NaN
        if (!isNaN(Number(propCustomerPrice))) {
          // Se non è zero o una stringa vuota, imposta il valore
          setCustomerPrice(propCustomerPrice);
        } else {
          // Se non è un numero valido ma è definito (potrebbe essere "-" o una stringa non valida)
          // lascia il valore come stringa per consentirne la modifica
          setCustomerPrice(propCustomerPrice.toString());
        }
      } else {
        // Altrimenti usa il prezzo calcolato
        setCustomerPrice(calculatedTotal);
        
        // Notifica il componente genitore del prezzo iniziale
        if (onCustomerPriceChange) {
          onCustomerPriceChange(calculatedTotal);
        }
      }
    }
  }, [selectedRatePlan, chargeValues, propCustomerPrice]);
  
  // Se non abbiamo un rate plan selezionato, mostriamo un messaggio vuoto
  if (!selectedRatePlan) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          my: 3, 
          borderRadius: 2,
          bgcolor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {t('components.productDrawer.priceSummary.selectPlan')}
        </Typography>
      </Paper>
    );
  }
  
  // Determina se il rate plan selezionato ha una struttura "Licenza + canone"
  const hasLicense = selectedRatePlan.ModalitaDiVendita__c === 'Licenza + canone';
  
  // Ottiene tutte le charges e le suddivide per tipo
  const recurringCharges = selectedRatePlan.productRatePlanCharges.filter(c => c.type === 'Recurring');
  const onetimeCharges = selectedRatePlan.productRatePlanCharges.filter(c => c.type === 'OneTime');
  
  // Determina il numero di PDL o fatture selezionato
  let unitCharge: ExtendedCharge | undefined;
  let unitValue: string = '';
  let unitCount: number = 0;
  let unitLabel: string = '';
  
  if (selectedRatePlan.UdM__c === 'Pdl') {
    unitCharge = recurringCharges.find(c => c.uom === 'Pdl');
    unitValue = unitCharge && chargeValues[unitCharge.id.toString()] ? 
      chargeValues[unitCharge.id.toString()] : '5'; // Default a 5 PDL
    unitCount = parseInt(unitValue, 10);
    unitLabel = 'PDL';
  } else if (selectedRatePlan.UdM__c === 'Fatture' || selectedRatePlan.UdM__c === 'Invoice') {
    unitCharge = recurringCharges.find(c => c.uom === 'Invoice' || c.uom === 'Fatture');
    unitValue = unitCharge && chargeValues[unitCharge.id.toString()] ? 
      chargeValues[unitCharge.id.toString()] : '500'; // Default a 500 fatture
    unitCount = parseInt(unitValue, 10);
    unitLabel = 'fatture';
  }
  
  // Funzione per calcolare i totali
  const calculateTotalPrice = (): number => {
    const annualTotal = recurringCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge);
    }, 0);
    
    const licenseTotal = onetimeCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge);
    }, 0);
    
    return annualTotal + licenseTotal;
  };
  
  // Calcolo dei totali
  const annualTotal = recurringCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const licenseTotal = onetimeCharges.reduce((acc, charge) => {
    return acc + calculateChargeTotal(charge);
  }, 0);
  
  const firstYearTotal = annualTotal + licenseTotal;
  
  // Calcolo dello sconto
  const calculateDiscount = (): string => {
    const customerPriceValue = parseFloat(customerPrice.toString()) || 0;
    if (!customerPriceValue || !firstYearTotal || customerPriceValue >= firstYearTotal) return '0';
    return ((firstYearTotal - customerPriceValue) / firstYearTotal * 100).toFixed(2);
  };
  
  // Gestione del cambio di prezzo cliente
  const handleCustomerPriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    
    // Se è un prodotto di sconto, consenti valori negativi
    if (isDiscountProduct) {
      // Per il prodotto "Discount Poc", consenti valori negativi
      if (value === '' || value === '-') {
        // Mantieni il valore come digitato per consentire l'inserimento di '-'
        setCustomerPrice(value);
      } else {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          setCustomerPrice(numericValue);
          
          if (onCustomerPriceChange) {
            onCustomerPriceChange(numericValue);
          }
        }
      }
    } else {
      // Per tutti gli altri prodotti, consenti solo valori positivi
      if (value === '') {
        setCustomerPrice(value);
      } else {
        const numericValue = parseFloat(value);
        // Controlla che sia un numero valido E positivo
        if (!isNaN(numericValue) && numericValue >= 0) {
          setCustomerPrice(numericValue);
          
          if (onCustomerPriceChange) {
            onCustomerPriceChange(numericValue);
          }
        }
      }
    }
  };
    
  // Calcolo costi per unità
  const costPerUnit = unitCount ? (annualTotal / unitCount) : 0;
  const onetimePerUnit = unitCount && hasLicense ? (licenseTotal / unitCount) : 0;
  
  // Ottieni la prima charge ricorrente per le informazioni di billing
  const firstRecurringCharge = recurringCharges[0];
  const billingPeriod = firstRecurringCharge?.billingPeriod || 'Annual';
  const billingTiming = firstRecurringCharge?.billingTiming || 'IN_ADVANCE';
  
  // Formattazione
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Traduzione del periodo di billing
  const translateBillingPeriod = (period: string): string => {
    const periodMap: Record<string, string> = {
      'Annual': t('components.productDrawer.priceSummary.billingPeriods.annual'),
      'Monthly': t('components.productDrawer.priceSummary.billingPeriods.monthly'),
      'Quarterly': t('components.productDrawer.priceSummary.billingPeriods.quarterly'),
      'Semiannual': t('components.productDrawer.priceSummary.billingPeriods.semiannual')
    };
    return periodMap[period] || period;
  };
  
  // Traduzione del timing di billing
  const translateBillingTiming = (timing: string): string => {
    const timingMap: Record<string, string> = {
      'IN_ADVANCE': t('components.productDrawer.priceSummary.billingTimings.inAdvance'),
      'IN_ARREARS': t('components.productDrawer.priceSummary.billingTimings.inArrears'),
    };
    return timingMap[timing] || timing;
  };

  // Calcolo sconto attuale
  const discountPercentage = calculateDiscount();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        my: 3, 
        borderRadius: 2,
        bgcolor: '#f8f9fa',
        border: '1px solid #e0e0e0'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {t('components.productDrawer.priceSummary.summary')}
        </Typography>
        
        {/* Mostra il periodo di fatturazione come chip */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`${translateBillingPeriod(billingPeriod)}`}
            color="primary"
            size="small"
          />
          <Chip 
            label={`${translateBillingTiming(billingTiming)}`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
      
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
        {t('components.productDrawer.priceSummary.priceDetails')}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1 
        }}>
          <Typography variant="body1">
            {t('components.productDrawer.priceSummary.fee')} {translateBillingPeriod(billingPeriod).toLowerCase()} {unitCount > 0 && `(${unitCount} ${unitLabel})`}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(annualTotal)}
          </Typography>
        </Box>
        
        {hasLicense && licenseTotal > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Typography variant="body1">
              {t('components.productDrawer.priceSummary.oneTimeLicense')} {unitCount > 0 && `(${unitCount} ${unitLabel})`}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatCurrency(licenseTotal)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="body1" fontWeight="bold">
            {t('components.productDrawer.priceSummary.listPrice')}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatCurrency(firstYearTotal)}
          </Typography>
        </Box>

        {/* Input per prezzo cliente personalizzato */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="body1" fontWeight="bold">
            {t('components.productDrawer.priceSummary.customerPrice')}
            {parseFloat(discountPercentage) > 0 && (
              <Chip 
                label={`-${discountPercentage}%`}
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <TextField
            value={customerPrice}
            onChange={handleCustomerPriceChange}
            type="number"
            size="small"
            sx={{ width: '120px' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: isDiscountProduct ? undefined : 0 }
            }}
          />
        </Box>
        
        {hasLicense && licenseTotal > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1,
            color: 'text.secondary'
          }}>
            <Typography variant="body2">
              {t('components.productDrawer.priceSummary.feeFromSecondYear')} - {translateBillingPeriod(billingPeriod)}
            </Typography>
            <Typography variant="body2">
              {formatCurrency(annualTotal)}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ 
        bgcolor: '#e6f2ff', 
        p: 2, 
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
      }}>
        <Typography variant="body1" fontWeight="medium">
          {t('components.productDrawer.priceSummary.costPerUnit')} {unitLabel === 'PDL' ? 'PDL' : 'fattura'}
        </Typography>
        <Typography variant="body2">
          {formatCurrency(costPerUnit)} / {billingPeriod === 'Annual' ? t('components.productDrawer.priceSummary.year') : billingPeriod.toLowerCase()}
          {hasLicense && onetimePerUnit > 0 && ` + ${formatCurrency(onetimePerUnit)} una tantum`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PriceSummary;