import { ReactNode } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Button, 
  VaporIcon,
  Chip
} from "@vapor/v3-components";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import ConfiguredProductCard from './ConfiguredProductCard';
import { TagType } from "../types";

// Define product interface
interface Product {
  id: string | number;
  name: string;
  category?: string;
  description?: string;
  price: number;
  customerPrice?: number;
  quantity?: number;
  // Add other product properties as needed
  [key: string]: any;
}

interface ConfiguredProductListProps {
  products?: Product[];
  onRemoveProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  translateCategory?: (category: string) => string;
  getCategoryTagType?: (category: string) => TagType;
  customProductCard?: (product: Product) => ReactNode;
  hideHeader?: boolean;
  emptyStateComponent?: ReactNode;
  columnLayout?: 'grid' | 'vertical';
}

/**
 * @component ConfiguredProductList
 * @description Componente che visualizza una lista di prodotti configurati in un preventivo
 * con un riepilogo del totale e funzionalità di aggiunta/rimozione
 */
function ConfiguredProductList({ 
  products = [], 
  onRemoveProduct, 
  onAddProduct,
  translateCategory, 
  getCategoryTagType,
  customProductCard,
  hideHeader = false,
  emptyStateComponent = null,
  columnLayout = "grid" // Parametro per controllare il layout: "grid" o "vertical"
}: ConfiguredProductListProps) {
  // Funzione per calcolare il totale di listino
  const calculateListTotal = (): number => {
    return products.reduce((total, product) => {
      return total + (product.price * (product.quantity || 1));
    }, 0);
  };

  // Funzione per calcolare il totale cliente
  const calculateTotal = (): number => {
    return products.reduce((total, product) => {
      // Utilizza prezzo cliente se disponibile, altrimenti usa prezzo di listino
      const effectivePrice = product.customerPrice || product.price;
      return total + (effectivePrice * (product.quantity || 1));
    }, 0);
  };

  // Calcolo dello sconto totale
  const listTotal = calculateListTotal();
  const customerTotal = calculateTotal();
  const totalDiscount = listTotal > 0 ? ((listTotal - customerTotal) / listTotal * 100).toFixed(2) : '0';
  const hasDiscount = listTotal > customerTotal && parseFloat(totalDiscount) > 0;

  // Funzione per formattare i prezzi
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Renderizzazione del componente in caso di lista vuota
  if (products.length === 0) {
    return emptyStateComponent || (
      <Box sx={{ 
        textAlign: 'center', 
        p: 4, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 2,
        border: '1px dashed #ccc'
      }}>
        <Typography variant="body1" color="text.secondary">
          Non ci sono articoli selezionati. Aggiungi articoli dal catalogo per creare il preventivo.
        </Typography>
        <Button 
          size="small" 
          variant="contained" 
          startIcon={<VaporIcon icon={faPlus} />}
          onClick={onAddProduct}
          sx={{ mt: 2 }}
        >
          Aggiungi articolo
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {!hideHeader && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Articoli selezionati
          </Typography>
          
          {products.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.paper',
              boxShadow: 1
            }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Totale di listino:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatPrice(listTotal)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="bold">
                  Totale cliente:
                </Typography>
                {hasDiscount && (
                  <Chip 
                    label={`-${totalDiscount}%`}
                    color="success"
                    size="small"
                    sx={{ mx: 1 }}
                  />
                )}
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(customerTotal)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={columnLayout === "vertical" ? 12 : 6} lg={columnLayout === "vertical" ? 12 : 3} key={product.id}>
            {customProductCard ? (
              customProductCard(product)
            ) : (
              <ConfiguredProductCard
                product={product}
                onRemove={onRemoveProduct}
                translateCategory={translateCategory}
                getCategoryTagType={getCategoryTagType}
                formatPrice={formatPrice}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ConfiguredProductList;