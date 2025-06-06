import { fetch } from "@1f/react-sdk"
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  VaporPage,
  // Button, 
  // VaporToolbar, 
  CircularProgress, 
  Alert, 
  Chip,
  Grid, 
  Box,
  SearchBar,
  Typography,
  VaporThemeProvider
} from "@vapor/v3-components";
// import { Link } from 'react-router-dom';
import CustomerCard from '../../components/CustomerCard';

// Definizione interfaccia Customer
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

// Interfaccia per i dati del preventivo
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

// Risposta API dopo creazione preventivo
interface QuoteResponse {
  _id: string;
  [key: string]: any;
}

/**
 * @component CustomersPage
 * @description Pagina che mostra la lista dei clienti importati dal database
 */
export const CustomersPage: React.FC = () => {
  // URL base del backend (configurato per ambiente di sviluppo)
    
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('Tutti');
  
  // Hook per la navigazione
  const navigate = useNavigate();
  
  // QueryClient per interagire con la cache
  const queryClient = useQueryClient();

  // Query per ottenere i customers
  const { 
    data: customers = [], 
    isLoading, 
    error 
  } = useQuery<Customer[], Error>({ 
    queryKey: ['customers'], 
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/customers`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });
  
  // Mutazione per creare un nuovo preventivo
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
          throw new Error('Errore durante la creazione del preventivo');
        }
        return response.json();
      });
    },
    onSuccess: (data) => {
      // Invalidate la cache per i preventivi
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      // Reindirizza alla pagina di modifica del preventivo
      navigate(`/quote/${data._id}`);
    },
    onError: (error: Error) => {
      console.error('Errore:', error);
      alert('Impossibile creare il preventivo. Riprova più tardi.');
    }
  });
  
  // Funzione per cambiare il filtro
  const handleFilterChange = (newFilter: string): void => {
    setFilterType(newFilter);
  };
  
  // Funzione per iniziare una nuova offerta
  const handleNewQuote = (customer: Customer): void => {
    createQuoteMutation.mutate({
      customer: {
        name: customer.nome,
        sector: customer.settore,
        email: customer.email,
        id: customer._id
      },
      status: 'Draft',
      type: 'New',
      value: 0,
      products: [],
      notes: `Preventivo creato per ${customer.nome}`
    });
  };
  
  // Funzione per avviare una migrazione
  const handleMigration = (customer: Customer): void => {
    navigate(`/migration/${customer._id}`);
  };
  
  // Funzione per filtrare i clienti
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((customer: Customer) => {
      // Filtro per tipo (Cliente, Prospect, o Tutti)
      const matchesType = filterType === 'Tutti' || customer.tipo === filterType;
      
      // Filtro per testo di ricerca
      const matchesSearch = 
        searchTerm === '' || 
        customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.settore?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [customers, filterType, searchTerm]);

  return (
    <VaporThemeProvider>
      <VaporPage
        title="Clienti"
        // contentToolbar={
        //   <VaporToolbar
        //     variant="surface"
        //     size="large"
        //     // contentLeft={[
        //     //   <Link to="/">
        //     //     <Button 
        //     //       variant="contained" 
        //     //     >
        //     //       Torna alla Home
        //     //     </Button>
        //     //   </Link>
        //     // ]}
        //   />
        // }
      >
        <VaporPage.Section divider>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              component="div"
              gutterBottom
              variant="headingsPage"
            >
              Cerca e seleziona un cliente
            </Typography>
            <Typography
              component="div"
              gutterBottom
              variant="bodyLargeRegular"
            >
              Inizia una nuova offerta selezionando un Cliente o Prospect
            </Typography>
          </Box>
          
          {/* Form di ricerca clienti */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
              <SearchBar
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                handleClear={() => setSearchTerm("")}
                placeholder="Cerca per nome settore o email..."
                size='medium'
                sx={{ width: '100%' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Chip 
                label="Tutti" 
                variant={filterType === 'Tutti' ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('Tutti')}
                color={filterType === 'Tutti' ? 'primary' : 'default'}
              />
              <Chip 
                label="Cliente" 
                variant={filterType === 'Cliente' ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('Cliente')}
                color={filterType === 'Cliente' ? 'primary' : 'default'}
              />
              <Chip 
                label="Prospect" 
                variant={filterType === 'Prospect' ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('Prospect')}
                color={filterType === 'Prospect' ? 'primary' : 'default'}
              />
            </Box>
          </Box>
        </VaporPage.Section>

        <VaporPage.Section>
          <Typography
            component="div"
            gutterBottom
            variant="bodyLargeHeavy"
          >
            Recenti
          </Typography>
          
          {/* Visualizzazione dei clienti */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Errore durante il caricamento dei clienti: {error.message}
            </Alert>
          )}
          
          {customers.length === 0 && !isLoading ? (
            <Alert severity="info">
              Nessun cliente trovato nel database.
            </Alert>
          ) : filteredCustomers.length === 0 ? (
            <Alert severity="info">
              Nessun cliente corrisponde ai criteri di ricerca.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredCustomers.map((customer: Customer) => (
                <Grid item xs={12} md={6} lg={4} xl={3} key={customer._id}>
                  <CustomerCard
                    customer={customer}
                    onNewQuote={handleNewQuote}
                    onMigration={handleMigration}
                    isCreatingQuote={createQuoteMutation.isPending}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </VaporPage.Section>
      </VaporPage>
    </VaporThemeProvider>
  );
};