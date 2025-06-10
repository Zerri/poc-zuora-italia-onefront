import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Button,
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  Box,
  Divider,
  VaporToolbar,
  FormControlLabel,
  Checkbox
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { Product, ExtendedRatePlan, ExtendedCharge } from '../../types';

// Componenti importati
import ProductInfoSection from './ProductInfoSection';
import TechnologySelector from './TechnologySelector';
import RatePlanList from './RatePlanList';
import PricingModelInfo from './PricingModelInfo';
import ChargeConfigurator from './ChargeConfigurator';
import PriceSummary from './PriceSummary';

interface ExtendedProduct extends Product {
  productRatePlans?: ExtendedRatePlan[];
}

interface ChargeValuesMap {
  [key: string]: string;
}

interface RatePlanGroups {
  [key: string]: ExtendedRatePlan[];
}

interface ProductData {
  product: ExtendedProduct;
  selectedRatePlan: ExtendedRatePlan;
  customerPrice: number;
  totalPrice: number;
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  product: ExtendedProduct | null;
  translateCategory: (category?: string) => string;
  onAddToOffer: (data: ProductData) => void;
  isAddingToQuote?: boolean;
}

/**
 * @component ProductDrawer
 * @description Drawer per configurare un prodotto nell'offerta (versione refactored)
 */
export const ProductDrawer: React.FC<ProductDrawerProps> = ({ 
  open, 
  onClose, 
  product, 
  translateCategory, 
  onAddToOffer, 
  isAddingToQuote = false 
}) => {
  // State
  const [selectedProductRatePlan, setSelectedProductRatePlan] = useState<string | number>('');
  const [chargeValues, setChargeValues] = useState<ChargeValuesMap>({});
  const [showExpiredPlans, setShowExpiredPlans] = useState<boolean>(false);
  const [selectedTech, setSelectedTech] = useState<string>('');
  // NUOVO: State per il prezzo cliente personalizzato
  const [customerPrice, setCustomerPrice] = useState<number>(0);

  // Raggruppamento rate plan per tecnologia
  const ratePlanGroups = useMemo<RatePlanGroups>(() => {
    if (!product?.productRatePlans) return {};
    
    return product.productRatePlans.reduce<RatePlanGroups>((acc, ratePlan) => {
      let technology = ratePlan.Infrastructure__c || 'Other';
      
      if (!acc[technology]) {
        acc[technology] = [];
      }
      
      acc[technology].push(ratePlan);
      return acc;
    }, {});
  }, [product]);
  
  const technologies = Object.keys(ratePlanGroups);

  // Effetti
  useEffect(() => {
    if (product && product.productRatePlans && product.productRatePlans.length > 0) {
      const initialRatePlan = product.productRatePlans[0];
      const initialTech = initialRatePlan.Infrastructure__c || 'Other';
      
      setSelectedProductRatePlan(initialRatePlan.id);
      setSelectedTech(initialTech);
      resetChargeValues(initialRatePlan.id);
    }
  }, [product]);

  useEffect(() => {
    if (selectedProductRatePlan) {
      resetChargeValues(selectedProductRatePlan);
    }
  }, [selectedProductRatePlan]);

  // Gestori
  const resetChargeValues = (ratePlanId: string | number): void => {
    if (!product) return;
    const ratePlan = product.productRatePlans?.find(rp => rp.id === ratePlanId);
    if (!ratePlan) return;
    const initialValues: ChargeValuesMap = {};
    ratePlan.productRatePlanCharges.forEach(charge => {
      // Inizializza con un valore predefinito in base al tipo di charge
      if (charge.model === 'PerUnit') {
        initialValues[charge.id.toString()] = charge.defaultQuantity?.toString() || '1';
      } else if (charge.model === 'Volume') {
        initialValues[charge.id.toString()] = '1'; // Valore iniziale per volume
      } else {
        initialValues[charge.id.toString()] = '';
      }
    });
    setChargeValues(initialValues);
    
    // Reset anche del prezzo cliente
    const total = calculateTotalForRatePlan(ratePlan);
    setCustomerPrice(total);
  };

  const handleChargeValueChange = (chargeId: string | number, value: string): void => {
    setChargeValues(prevValues => {
      const newValues = {
        ...prevValues,
        [chargeId.toString()]: value
      };
      
      // FIX: Aggiorna il prezzo totale quando cambia un valore
      if (selectedRatePlan) {
        const newTotal = calculateTotal();
        setCustomerPrice(newTotal);
      }
      
      return newValues;
    });
  };

  // FIX: Calcola il totale per un rate plan specifico
  const calculateTotalForRatePlan = (ratePlan: ExtendedRatePlan): number => {
    if (!ratePlan) return 0;
    return ratePlan.productRatePlanCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge, ratePlan.id);
    }, 0);
  };

  // FIX: Versione corretta di calculateChargeTotal che prende in considerazione i valori utente
  const calculateChargeTotal = (charge: ExtendedCharge, ratePlanId: string | number = selectedProductRatePlan): number => {
    if (!charge) return 0;
    
    // Ottieni il valore inserito dall'utente per questa charge
    const userValue = parseFloat(chargeValues[charge.id.toString()] || '0');
    
    // Per charges di tipo Volume
    if (charge.model === 'Volume') {
      // Se non c'è un valore inserito dall'utente, ritorna 0
      if (!userValue) return 0;
      
      // Cerca l'oggetto pricing per EUR (di solito è l'indice 0)
      const pricing = charge.pricing?.find(p => p.currency === 'EUR') || charge.pricing?.[0];
      if (!pricing || !pricing.tiers) return 0;
      
      // Cerca la fascia di prezzo corretta
      const tier = pricing.tiers?.find(t => 
        userValue >= t.startingUnit && 
        (t.endingUnit === null || userValue <= t.endingUnit)
      );
      
      return tier ? tier.price : 0;
    }
    
    // Per PerUnit moltiplica prezzo unitario per quantità
    if (charge.model === 'PerUnit') {
      // Cerca l'oggetto pricing per EUR
      const pricing = charge.pricing?.find(p => p.currency === 'EUR') || charge.pricing?.[0];
      const unitPrice = pricing?.price || 0;
      return userValue * unitPrice;
    }
    
    // Per FlatFee ritorna il prezzo fisso
    if (charge.model === 'FlatFee') {
      const pricing = charge.pricing?.find(p => p.currency === 'EUR') || charge.pricing?.[0];
      return pricing?.price || 0;
    }
    
    return 0;
  };

  // MODIFICATO: Completa revisione della funzione per un corretto passaggio dei valori
  const handleAddToOffer = (): void => {
    if (onAddToOffer && selectedRatePlan && product) {
      // Aggiorna ogni charge con il valore inserito dall'utente e il prezzo calcolato
      const chargesWithValues = selectedRatePlan.productRatePlanCharges.map(charge => {
        const value = chargeValues[charge.id.toString()] || '';
        const calculatedPrice = calculateChargeTotal(charge);
        
        return {
          ...charge,
          value,
          calculatedPrice
        };
      });
      
      // Calcola il prezzo totale di listino
      const listPrice = calculateTotal();
      
      // Se il prezzo cliente non è stato impostato o è zero, usa il prezzo di listino
      const finalCustomerPrice = (customerPrice && customerPrice !== 0) ? customerPrice : listPrice;
      
      // Prepara l'oggetto da passare al componente genitore
      const productData: ProductData = {
        product,
        selectedRatePlan: {
          ...selectedRatePlan,
          productRatePlanCharges: chargesWithValues
        },
        customerPrice: finalCustomerPrice,
        totalPrice: listPrice // Aggiungi anche il prezzo totale di listino
      };
      
      console.log('Passing product data to parent:', productData);
      
      onAddToOffer(productData);
    }
    onClose();
  };

  const handleSelectTechnology = (tech: string): void => {
    setSelectedTech(tech);
    // Seleziona il primo rate plan per questa tecnologia
    const firstPlan = ratePlanGroups[tech][0];
    if (firstPlan) {
      setSelectedProductRatePlan(firstPlan.id);
    }
  };
  
  // NUOVO: Funzione per gestire il cambio del prezzo cliente
  const handleCustomerPriceChange = (price: number): void => {
    setCustomerPrice(price);
  };

  // FIX: Calcola il totale corretto considerando tutte le charges e i valori utente
  const calculateTotal = (): number => {
    if (!selectedRatePlan) return 0;
    return selectedRatePlan.productRatePlanCharges.reduce((acc, charge) => {
      return acc + calculateChargeTotal(charge);
    }, 0);
  };

  if (!product) return null;

  const selectedRatePlan = product.productRatePlans?.find(
    ratePlan => ratePlan.id === selectedProductRatePlan
  );

  const isDiscountProduct = (): boolean => {
    return !!product && product.name === 'Discount Poc';
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      width="35vw"
      hideBackdrop={false}
      sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
    >
      <Title
        title={product.name}
        description={translateCategory(product.categoria)}
        divider
        rightItems={[
          <IconButton key="close" size="small" variant="outlined" onClick={onClose}>
            <VaporIcon icon={faClose} size="xl" />
          </IconButton>
        ]}
      />

      <Box sx={{ p: 4, flex: 1, overflowY: 'auto', mb: 13 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Informazioni Generali
        </Typography>
        <ProductInfoSection product={product} translateCategory={translateCategory} />
        
        <Divider sx={{ my: 3 }} />
        
        {/* Sezione di selezione tecnologia e rate plan */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Infrastruttura
          </Typography>
          
          <TechnologySelector 
            technologies={technologies} 
            selectedTech={selectedTech}
            onSelectTechnology={handleSelectTechnology}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showExpiredPlans}
                  onChange={(e) => setShowExpiredPlans(e.target.checked)}
                  name="showExpiredPlans"
                />
              }
              label="Mostra piani scaduti"
            />
          </Box>
          
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Piano
          </Typography>
          
          <RatePlanList
            ratePlanGroups={ratePlanGroups}
            technologies={technologies}
            selectedTech={selectedTech}
            selectedRatePlanId={selectedProductRatePlan}
            showExpiredPlans={showExpiredPlans}
            onRatePlanSelect={setSelectedProductRatePlan}
          />
        </Box>

        {/* Sezione informazioni sul modello di prezzo */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Modello di prezzo
        </Typography>
        {selectedRatePlan && (
          <PricingModelInfo selectedRatePlan={selectedRatePlan} />
        )}

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Charge
        </Typography>
        {/* Sezione configurazione charges */}
        {selectedRatePlan && (
          <ChargeConfigurator
            charges={selectedRatePlan.productRatePlanCharges}
            chargeValues={chargeValues}
            onChargeValueChange={handleChargeValueChange}
            calculateChargeTotal={calculateChargeTotal}
          />
        )}

        {/* Sezione riepilogo prezzi */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Riepilogo prezzi
        </Typography>
        {selectedRatePlan && (
          <PriceSummary
            selectedRatePlan={selectedRatePlan}
            chargeValues={chargeValues}
            calculateChargeTotal={calculateChargeTotal}
            customerPrice={customerPrice}
            onCustomerPriceChange={handleCustomerPriceChange}
            isDiscountProduct={isDiscountProduct()}
          />
        )}
      </Box>

      <Divider />

      <VaporToolbar
        contentLeft={[
          <Typography key="total" variant="subtitle1">
            Totale: €{calculateTotal().toFixed(2)}
          </Typography>
        ]}
        contentRight={[
          <Button key="close" variant="outlined" color="secondary" onClick={onClose}>
            Chiudi
          </Button>,
          <Button 
            key="add" 
            variant="contained" 
            color="primary" 
            startIcon={<span>+</span>} 
            onClick={handleAddToOffer}
          >
            {isAddingToQuote ? 'Aggiungi al preventivo' : 'Aggiungi all\'offerta'}
          </Button>
        ]}
        size="medium"
        variant="regular"
        withoutAppBar
      />
    </Drawer>
  );
};

export default ProductDrawer;