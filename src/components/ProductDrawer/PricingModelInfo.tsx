import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@vapor/v3-components";
import { faCircle } from "@fortawesome/pro-solid-svg-icons/faCircle";
import { VaporIcon } from "@vapor/v3-components";
import { ExtendedRatePlan } from '../../types';
import { useTranslation } from '@1f/react-sdk';

interface PricingModelInfoProps {
  selectedRatePlan: ExtendedRatePlan | null;
}

interface TierStructure {
  startingUnit: number;
  endingUnit: number | null;
  price: number;
  priceFormat?: string;
}

interface PricingModelInfo {
  unitOfMeasure: string;
  hasTiers: boolean;
  hasUnitPrice: boolean;
  isLicenseAndFee: boolean;
  hasRecurringCharges: boolean;
  hasOneTimeCharges: boolean;
  hasVolumeCharges: boolean;
  tierStructure: TierStructure[];
  volumeModel: 'standard' | 'scaglioni' | 'soglie';
  billingPeriod: string;
  billingTiming: string;
  billingPeriodAlignment: string;
  billingDay: string;
  isPdl: boolean;
  isInvoice: boolean;
  isSubscription: boolean;
  isVolumiBTB: boolean;
}

/**
 * @component PricingModelInfo
 * @description Componente che mostra informazioni sul modello di pricing del prodotto
 */
export const PricingModelInfo: React.FC<PricingModelInfoProps> = ({ selectedRatePlan }) => {
  const { t } = useTranslation();
  if (!selectedRatePlan) return null;
  
  // Determina le caratteristiche del modello di pricing
  const getPricingModelInfo = (): PricingModelInfo => {
    const result: PricingModelInfo = {
      unitOfMeasure: selectedRatePlan.UdM__c || '',
      hasTiers: false,
      hasUnitPrice: false,
      isLicenseAndFee: false,
      hasRecurringCharges: false,
      hasOneTimeCharges: false,
      hasVolumeCharges: false,
      tierStructure: [],
      volumeModel: 'standard',
      // Aggiungiamo proprietà per le informazioni di billing
      billingPeriod: '',
      billingTiming: '',
      billingPeriodAlignment: '',
      billingDay: '',
      isPdl: false,
      isInvoice: false,
      isSubscription: false,
      isVolumiBTB: false
    };
    
    // Verifica il tipo di unità di misura (PDL o Fatture/Invoice)
    result.isPdl = result.unitOfMeasure === 'Pdl';
    result.isInvoice = result.unitOfMeasure === 'Fatture' || result.unitOfMeasure === 'Invoice';
    
    // Verifica la presenza dei vari tipi di charges
    selectedRatePlan.productRatePlanCharges?.forEach(charge => {
      // Verifica se ci sono charges di tipo Volume
      if (charge.model === 'Volume') {
        result.hasVolumeCharges = true;
        result.hasTiers = true;
        
        // Estrai la struttura dei tiers
        if (charge.pricing && charge.pricing.length > 0) {
          const pricing = charge.pricing[0]; // Prende il primo pricing (EUR o USD)
          if (pricing.tiers && pricing.tiers.length > 0) {
            result.tierStructure = pricing.tiers.map(tier => ({
              startingUnit: tier.startingUnit,
              endingUnit: tier.endingUnit,
              price: tier.price,
              ...(tier.priceFormat && { priceFormat: tier.priceFormat })
            }));
            
            // Determina se i tier sono modello "scaglioni" o "soglie"
            if (pricing.tiers.length > 1) {
              const firstTier = pricing.tiers[0];
              const secondTier = pricing.tiers[1];
              
              // Se il tier successivo parte da 1 unità dopo la fine del precedente,
              // allora è un modello a "scaglioni"
              if (secondTier.startingUnit === firstTier.endingUnit + 1) {
                result.volumeModel = 'scaglioni';
              } else if (secondTier.startingUnit > firstTier.endingUnit) {
                result.volumeModel = 'soglie';
              }
            }
          }
        }
      }
      
      // Verifica se ci sono charges di tipo PerUnit
      if (charge.model === 'PerUnit') {
        result.hasUnitPrice = true;
      }
      
      // Verifica il tipo di charge (OneTime o Recurring)
      if (charge.type === 'OneTime') {
        result.hasOneTimeCharges = true;
      }
      if (charge.type === 'Recurring') {
        result.hasRecurringCharges = true;
        
        // Estrai le informazioni di billing dalla prima charge ricorrente
        // Assumiamo che tutte le charge ricorrenti abbiano lo stesso periodo di billing
        if (!result.billingPeriod) {
          result.billingPeriod = charge.billingPeriod || '';
          result.billingTiming = charge.billingTiming || '';
          result.billingPeriodAlignment = charge.billingPeriodAlignment || '';
          result.billingDay = charge.billingDay || '';
        }
      }
    });
    
    // Determina la modalità di vendita
    const salesModel = selectedRatePlan.ModalitaDiVendita__c || '';
    result.isLicenseAndFee = salesModel.toLowerCase().includes('licenza');
    result.isSubscription = salesModel.toLowerCase().includes('subscription');
    result.isVolumiBTB = salesModel.toLowerCase().includes('volumi');
    
    return result;
  };
  
  const pricingInfo = getPricingModelInfo();
  
  // Funzione per tradurre termini di billing in italiano
  const translateBillingTerm = (term: string, type: 'period' | 'timing' | 'alignment' | 'day'): string => {
    if (type === 'period') {
      const periodMap: Record<string, string> = {
      'Annual': t('components.productDrawer.pricingModelInfo.billingPeriods.annual'),
      'Monthly': t('components.productDrawer.pricingModelInfo.billingPeriods.monthly'),
      'Quarterly': t('components.productDrawer.pricingModelInfo.billingPeriods.quarterly'),
      'Semiannual': t('components.productDrawer.pricingModelInfo.billingPeriods.semiannual')
      };
      return periodMap[term] || term;
    }
    
    if (type === 'timing') {
      const timingMap: Record<string, string> = {
        'IN_ADVANCE': t('components.productDrawer.pricingModelInfo.billingTimings.inAdvance'),
        'IN_ARREARS': t('components.productDrawer.pricingModelInfo.billingTimings.inArrears'),
      };
      return timingMap[term] || term;
    }
    
    if (type === 'alignment') {
      const alignmentMap: Record<string, string> = {
        'AlignToTermStart': t('components.productDrawer.pricingModelInfo.billingAlignments.alignToTermStart'),
        'AlignToTermEnd': t('components.productDrawer.pricingModelInfo.billingAlignments.alignToTermEnd'),
      };
      return alignmentMap[term] || term;
    }
    
    if (type === 'day') {
      const dayMap: Record<string, string> = {
        'TermStartDay': t('components.productDrawer.pricingModelInfo.billingDays.termStartDay'),
        'TermEndDay': t('components.productDrawer.pricingModelInfo.billingDays.termEndDay'),
        'ChargeTriggerDay': t('components.productDrawer.pricingModelInfo.billingDays.chargeTriggerDay'),
      };
      return dayMap[term] || term;
    }
    
    return term;
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        my: 3, 
        borderRadius: 2,
        bgcolor: '#f0f5ff',
        border: '1px solid #d0e0ff'
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        {t('components.productDrawer.pricingModelInfo.title')}
      </Typography>
      
      <List dense disablePadding>
        {/* Informazione sul modello a scaglioni/soglie per PDL */}
        {pricingInfo.isPdl && pricingInfo.hasVolumeCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{t('components.productDrawer.pricingModelInfo.pdlModel.upTo30')}</strong> {t('components.productDrawer.pricingModelInfo.pdlModel.tieredPrice')}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul modello a scaglioni/soglie per Fatture */}
        {pricingInfo.isInvoice && pricingInfo.hasVolumeCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{t("components.productDrawer.pricingModelInfo.invoiceModel.title")}</strong> {t(pricingInfo.volumeModel === 'scaglioni' 
                    ? "components.productDrawer.pricingModelInfo.invoiceModel.tieredPrice" 
                    : "components.productDrawer.pricingModelInfo.invoiceModel.thresholdPrice")}
                  {pricingInfo.tierStructure.length > 0 && t("components.productDrawer.pricingModelInfo.invoiceModel.range", {
                    min: pricingInfo.tierStructure[0].startingUnit,
                    max: pricingInfo.tierStructure[pricingInfo.tierStructure.length-1].endingUnit
                  })}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul prezzo unitario per PDL */}
        {pricingInfo.isPdl && pricingInfo.hasUnitPrice && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{t("components.productDrawer.pricingModelInfo.pdlUnitPrice.over30")}</strong> {t("components.productDrawer.pricingModelInfo.pdlUnitPrice.description")}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul tipo di piano */}
        {pricingInfo.isLicenseAndFee && pricingInfo.hasOneTimeCharges && pricingInfo.hasRecurringCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{t("components.productDrawer.pricingModelInfo.planTypes.title")}</strong> {t("components.productDrawer.pricingModelInfo.planTypes.licenseAndFee")}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul tipo di piano Subscription */}
        {pricingInfo.isSubscription && pricingInfo.hasRecurringCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{t("components.productDrawer.pricingModelInfo.planTypes.title")}</strong> {t("components.productDrawer.pricingModelInfo.planTypes.subscription")}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Informazione sul tipo di piano Volumi BTB */}
        {pricingInfo.isVolumiBTB && pricingInfo.hasOneTimeCharges && (
          <ListItem sx={{ pb: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <VaporIcon icon={faCircle} size="xs" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{t("components.productDrawer.pricingModelInfo.planTypes.title")}</strong> {t("components.productDrawer.pricingModelInfo.planTypes.volumiBTB")}
                </Typography>
              }
            />
          </ListItem>
        )}
        
        {/* Unità di misura */}
        <ListItem sx={{ pb: 1 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <VaporIcon icon={faCircle} size="xs" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2">
                <strong>{t("components.productDrawer.pricingModelInfo.unitOfMeasure.title")}</strong> {pricingInfo.isPdl ? t("components.productDrawer.pricingModelInfo.unitOfMeasure.pdl") : t("components.productDrawer.pricingModelInfo.unitOfMeasure.invoices") }
              </Typography>
            }
          />
        </ListItem>
        
        {/* NUOVA SEZIONE: Informazioni di fatturazione */}
        {pricingInfo.billingPeriod && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'primary.main' }}>
              {t("components.productDrawer.pricingModelInfo.billingInfo.title")}
            </Typography>
            
            {/* Periodo di fatturazione */}
            <ListItem sx={{ pb: 1 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <VaporIcon icon={faCircle} size="xs" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <strong>{t("components.productDrawer.pricingModelInfo.billingInfo.period")}</strong> {translateBillingTerm(pricingInfo.billingPeriod, 'period')}
                  </Typography>
                }
              />
            </ListItem>
            
            {/* Timing della fatturazione */}
            {pricingInfo.billingTiming && (
              <ListItem sx={{ pb: 1 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <VaporIcon icon={faCircle} size="xs" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <strong>{t("components.productDrawer.pricingModelInfo.billingInfo.timing")}</strong> {translateBillingTerm(pricingInfo.billingTiming, 'timing')}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            
            {/* Allineamento del periodo di fatturazione */}
            {pricingInfo.billingPeriodAlignment && (
              <ListItem sx={{ pb: 1 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <VaporIcon icon={faCircle} size="xs" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <strong>{t("components.productDrawer.pricingModelInfo.billingInfo.alignment")}</strong> {translateBillingTerm(pricingInfo.billingPeriodAlignment, 'alignment')}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            
            {/* Giorno di fatturazione */}
            {pricingInfo.billingDay && (
              <ListItem sx={{ pb: 1 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <VaporIcon icon={faCircle} size="xs" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <strong>{t("components.productDrawer.pricingModelInfo.billingInfo.date")}</strong> {translateBillingTerm(pricingInfo.billingDay, 'day')}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </>
        )}
      </List>
    </Paper>
  );
};

export default PricingModelInfo;