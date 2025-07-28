import { Product, QuoteStatus, QuoteType } from './types';
import { TagType, TagVariant } from '../../types';

/**
 * Calcola il valore totale del preventivo dai prodotti
 */
export const calculateQuoteValue = (products?: Product[]): number => {
  if (!products || products.length === 0) return 0;
  
  return products.reduce((total, product) => {
    // Usa il prezzo cliente se disponibile, altrimenti usa il prezzo standard
    const effectivePrice = product.customerPrice || product.price || 0;
    const quantity = product.quantity || 1;
    return total + (effectivePrice * quantity);
  }, 0);
};

/**
 * Formatta una data in formato italiano
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatta un valore come valuta EUR
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Determina il tipo di tag in base allo stato del preventivo
 */
export const getStatusTagType = (status: QuoteStatus): TagType => {
  switch(status) {
    case 'Draft': return 'info'; // blu
    case 'Sent': return 'success'; // verde
    case 'Accepted': return 'success'; // verde
    case 'Rejected': return 'error'; // rosso
    default: return 'tone8'; // viola
  }
};

/**
 * Determina la variante del tag in base allo stato del preventivo
 */
export const getStatusTagVariant = (status: QuoteStatus): TagVariant => {
  switch(status) {
    case 'Draft': return 'duotone'; // blu
    case 'Sent': return 'duotone'; // verde
    case 'Accepted': return 'filled'; // verde
    case 'Rejected': return 'filled'; // rosso
    default: return 'duotone'; // viola
  }
};

/**
 * Determina la variante del tag in base al tipo di preventivo
 */
export const getTypeTagVariant = (type: QuoteType): TagVariant => {
  switch(type) {
    case 'New': return 'filled';
    case 'Migration': return 'duotone';
    default: return 'filled';
  }
};