import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  VaporIcon,
  Chip,
} from "@vapor/v3-components";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import ConfiguredProductList from '../ConfiguredProductList';
import MigrationProductCard from './MigrationProductCard';

import { Product, TagType } from '../../types';

interface MigrationProductListProps {
  products?: Product[];
  onRemoveProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  title?: string;
  isMigrationSource?: boolean;
  nonMigrableProductIds?: string[];
  nonMigrableReasons?: Record<string, string>;
  replacementMap?: Record<string, string>;
  translateCategory?: (category?: string) => string;
  getCategoryTagType?: (category?: string) => TagType;
}

/**
 * @component MigrationProductList
 * @description Wrapper di ConfiguredProductList con funzionalità specifiche per la migrazione
 * Mantiene le funzionalità di base di ConfiguredProductList ma aggiunge indicatori di migrazione
 */
export const MigrationProductList: React.FC<MigrationProductListProps> = ({ 
  products = [], 
  onRemoveProduct, 
  onAddProduct,
  title = "Articoli selezionati",
  isMigrationSource = false,
  nonMigrableProductIds = [],
  nonMigrableReasons = {},
  replacementMap = {},
  translateCategory, 
  getCategoryTagType 
}) => {
  // Funzione per calcolare il totale di listino
  const calculateListTotal = (): number => {
    return products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  // Funzione per calcolare il totale cliente
  const calculateTotal = (): number => {
    return products.reduce((total, product) => {
      const effectivePrice = product.customerPrice || product.price || 0;
      const quantity = product.quantity || 1;
      return total + (effectivePrice * quantity);
    }, 0);
  };

  // Calcolo dello sconto totale
  const listTotal = calculateListTotal();
  const customerTotal = calculateTotal();
  
  // Funzione per formattare i prezzi
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Conta i prodotti migrabili e non migrabili
  const migrableCount = isMigrationSource ? 
    products.filter(p => !nonMigrableProductIds.includes(`${p.id}`)).length : null;
  const nonMigrableCount = isMigrationSource ? 
    products.length - (migrableCount ?? 0) : null;

  // Determina se un prodotto è migrabile
  const isProductMigratable = (productId: string): boolean => {
    return !nonMigrableProductIds.includes(productId);
  };

  // Ottiene la ragione della non migrabilità
  const getNonMigratableReason = (productId: string): string => {
    return nonMigrableReasons[productId] || "Questo prodotto non può essere migrato";
  };

  // Verifica se un prodotto ha un sostituto
  const hasReplacement = (productId: string): boolean => {
    return !!replacementMap[productId];
  };

  // Renderizzazione personalizzata del titolo per i prodotti sorgente
  const renderCustomHeader = (): React.ReactNode => {
    if (!isMigrationSource) return null;
    
    return (
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Procedura Lynfa Azienda
          </Typography>
          <Typography variant="bodySmallRegular" color="text.secondary">
            Subscription: Prodotti Attuali ({products.length})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`Non Migrabili (${nonMigrableCount})`}
            color="error"
            variant="outlined"
            size="small"
            icon={<VaporIcon icon={faExclamationTriangle} size="s" />}
          />
          <Chip
            label={`Migrabili (${migrableCount})`}
            color="success"
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
    );
  };

  // Renderizzazione personalizzata per i prodotti target vuoti
  const renderEmptyState = (): React.ReactNode => {
    if (isMigrationSource) {
      return (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary">
            Nessun prodotto presente nella sottoscrizione attuale
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center', 
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px dashed',
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Nessun prodotto proposto. Aggiungi prodotti dal catalogo.
        </Typography>
        {onAddProduct && (
          <Button
            variant="contained"
            size="small"
            startIcon={<VaporIcon icon={faPlus} />}
            onClick={onAddProduct}
            sx={{ mt: 1 }}
          >
            Aggiungi dal catalogo
          </Button>
        )}
      </Box>
    );
  };

  // Restituisci il componente ConfiguredProductList con i parametri adattati
  return (
    <Box>
      {/* Header personalizzato per i prodotti sorgente */}
      {renderCustomHeader()}
      
      {/* Se non c'è l'header personalizzato, usa il titolo standard */}
      {!isMigrationSource && (
        <Box sx={{ 
          mb: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            {title} ({products.length})
          </Typography>
          {onAddProduct && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<VaporIcon icon={faPlus} />}
              onClick={onAddProduct}
            >
              Aggiungi
            </Button>
          )}
        </Box>
      )}
      
      {/* Contenuto principale */}
      {products && products.length > 0 ? (
        <ConfiguredProductList 
          products={products}
          onRemoveProduct={onRemoveProduct}
          onAddProduct={onAddProduct}
          translateCategory={translateCategory}
          getCategoryTagType={getCategoryTagType}
          customProductCard={(product) => (
            <MigrationProductCard
              product={product}
              onRemove={onRemoveProduct ? () => onRemoveProduct(product) : undefined}
              translateCategory={translateCategory}
              getCategoryTagType={getCategoryTagType}
              formatPrice={formatPrice}
              isMigrationSource={isMigrationSource}
              isMigratable={isMigrationSource ? isProductMigratable(`${product.id}`) : true}
              nonMigratableReason={isMigrationSource ? getNonMigratableReason(`${product.id}`) : ""}
              hasReplacement={isMigrationSource ? hasReplacement(`${product.id}`) : false}
              replacesProductId={product.replacesProductId}
            />
          )}
          hideHeader={true} // Nascondi l'header predefinito perché lo gestiamo noi
          emptyStateComponent={renderEmptyState()}
          columnLayout="vertical" // Imposta layout verticale per le schede
        />
      ) : (
        renderEmptyState()
      )}
    </Box>
  );
};

export default MigrationProductList;