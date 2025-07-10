import { fetch } from "@1f/react-sdk"
import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  VaporPage,
  CircularProgress,
  Alert,
  Box,
  Typography,
  VaporThemeProvider
} from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';

// Interfacce (riutilizziamo quelle esistenti)
interface Customer {
  _id: string;
  nome: string;
  tipo: string;
  settore: string;
  email: string;
  ultimoContatto: string;
  valoreAnnuo?: string;
  migrabile?: boolean;
  subscriptionId?: string;
}

interface QuoteData {
  customer: {
    name: string;
    sector: string;
    email: string;
    id: string;
  };
  status: string;
  type: string;
  value: number;
  products: any[];
  notes: string;
}

interface QuoteResponse {
  _id: string;
  [key: string]: any;
}

/**
 * @component CRMIntegrationPage
 * @description Componente che gestisce l'integrazione con il CRM
 * URL: /crm-quote?customerId=123
 */
export const CRMIntegrationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const customerId = searchParams.get('customerId');

  // Query per recuperare i dati del cliente specifico
  const { 
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError
  } = useQuery<Customer, Error>({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) {
        throw new Error(t("features.crm.errors.missingCustomerId"));
      }
      
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/customers/${customerId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(t("features.crm.errors.customerNotFound"));
        }
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!customerId, // Esegui query solo se customerId è presente
    retry: 1, // Riprova solo una volta in caso di errore
  });

  // Mutazione per creare il preventivo
  const createQuoteMutation = useMutation<QuoteResponse, Error, QuoteData>({
    mutationFn: (quoteData: QuoteData) => {
      return fetch(`${import.meta.env.VITE_APP_BE}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData)
      }).then(response => {
        if (!response.ok) {
          throw new Error(t("features.crm.errors.createQuote"));
        }
        return response.json();
      });
    },
    onSuccess: (data) => {
      // Reindirizza direttamente alla pagina del preventivo
      navigate(`/quote/${data._id}`, { replace: true });
    },
    onError: (error: Error) => {
      console.error('Errore creazione preventivo:', error);
    }
  });

  // Effect per creare automaticamente il preventivo quando il cliente è caricato
  useEffect(() => {
    if (customer && !createQuoteMutation.isPending && !createQuoteMutation.isSuccess) {
      createQuoteMutation.mutate({
        customer: {
          name: customer.nome,
          sector: customer.settore,
          email: customer.email,
          id: customer._id
        },
        status: "Draft",
        type: "New",
        value: 0,
        products: [],
        notes: t("features.crm.quote.createdFromCRM", { name: customer.nome })
      });
    }
  }, [customer, createQuoteMutation]);

  // Gestione errori
  if (!customerId) {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.crm.title")}>
          <VaporPage.Section>
            <Alert severity="error">
              {t("features.crm.errors.missingCustomerId")}
            </Alert>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  if (customerError) {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.crm.title")}>
          <VaporPage.Section>
            <Alert severity="error">
              {customerError.message}
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Typography variant="bodySmallRegular">
                {t("features.crm.errors.contactSupport")}
              </Typography>
            </Box>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  if (createQuoteMutation.error) {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.crm.title")}>
          <VaporPage.Section>
            <Alert severity="error">
              {t("features.crm.errors.createQuote")}
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Typography variant="bodySmallRegular">
                {t("features.crm.errors.tryAgain")}
              </Typography>
            </Box>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  // Loading state
  return (
    <VaporThemeProvider>
      <VaporPage title={t("features.crm.title")}>
        <VaporPage.Section>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            
            {isLoadingCustomer && (
              <Typography variant="headingsSection" gutterBottom>
                {t("features.crm.loading.customer")}
              </Typography>
            )}
            
            {customer && createQuoteMutation.isPending && (
              <>
                <Typography variant="headingsSection" gutterBottom>
                  {t("features.crm.loading.creatingQuote")}
                </Typography>
                <Typography variant="bodySmallRegular" color="text.secondary">
                  {t("features.crm.loading.customerFound", { name: customer.nome })}
                </Typography>
              </>
            )}
            
            <Typography variant="bodySmallRegular" color="text.secondary" sx={{ mt: 2 }}>
              {t("features.crm.loading.pleaseWait")}
            </Typography>
          </Box>
        </VaporPage.Section>
      </VaporPage>
    </VaporThemeProvider>
  );
};