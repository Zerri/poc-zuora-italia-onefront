// client/src/components/CustomerCard.tsx
import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Tag,
  Box,
  Button
} from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';

// Definizione dell'interfaccia per il cliente
interface Customer {
  _id: string;
  nome: string;
  tipo: string;
  settore: string;
  email: string;
  ultimoContatto: string;
  valoreAnnuo?: string;
  migrabile?: boolean;
}

// Definizione delle props del componente
interface CustomerCardProps {
  customer: Customer;
  onNewQuote: (customer: Customer) => void;
  onMigration: (customer: Customer) => void;
  isCreatingQuote?: boolean;
}

/**
 * @component CustomerCard
 * @description Card che mostra i dettagli di un cliente con azioni disponibili (versione compatta)
 */
const CustomerCard: React.FC<CustomerCardProps> = ({ 
  customer, 
  onNewQuote, 
  onMigration, 
  isCreatingQuote = false 
}) => {
  const { t } = useTranslation();
  // Funzione per formattare la data
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ 
        p: 2, 
        '&:last-child': { pb: 2 },
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Header con nome e tag */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="subtitle1" component="h2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            {customer.nome}
          </Typography>
          <Tag 
            label={customer.tipo} 
            type={customer.tipo === 'Cliente' ? 'tone3' : 'tone7'}
            size="small"
            variant='duotone'
          />
        </Box>
        
        {/* Settore e email */}
        <Box sx={{ mb: 1.5, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {customer.settore}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {customer.email}
          </Typography>
        </Box>
        
        {/* Informazioni compatte */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1,
          px: 1.5,
          bgcolor: 'grey.50',
          borderRadius: 1,
          mb: 1.5
        }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {t('components.customerCard.lastContact')}
            </Typography>
            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
              {formatDate(customer.ultimoContatto)}
            </Typography>
          </Box>
          
          {customer.valoreAnnuo && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {t('components.customerCard.value')}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                {customer.valoreAnnuo}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Azioni */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            fullWidth
            onClick={() => onNewQuote(customer)}
            disabled={isCreatingQuote}
            sx={{ fontSize: '0.9rem', py: 0.75 }}
          >
            {isCreatingQuote ? t('components.customerCard.actions.creating') : t('components.customerCard.actions.newOffer')}
          </Button>
          
          {customer.tipo === 'Cliente' && customer.migrabile && (
            <Button 
              variant="outlined" 
              color="primary"
              size="small"
              fullWidth
              onClick={() => onMigration(customer)}
              disabled={isCreatingQuote}
              sx={{ fontSize: '0.9rem', py: 0.75, minWidth: 'auto', px: 1.5 }}
            >
              {t('components.customerCard.actions.migration')}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;