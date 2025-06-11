import { fetch } from "@1f/react-sdk"
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  VaporPage,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
  ExtendedTabs,
  ExtendedTab,
  Title,
  VaporIcon,
  Snackbar,
  Alert
} from "@vapor/v3-components";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faFloppyDisk } from "@fortawesome/pro-regular-svg-icons/faFloppyDisk";
import { faCloudArrowUp } from "@fortawesome/pro-regular-svg-icons/faCloudArrowUp";
import { faServer } from "@fortawesome/pro-regular-svg-icons/faServer";

// Importiamo i nuovi componenti
import MigrationProductList from '../../components/Migration/MigrationProductList';
import MigrationPathSelector from '../../components/Migration/MigrationPathSelector';

import { Product, TagType } from "../../types";

// Definizione delle interfacce
interface Customer {
  id: string;
  name: string;
  sector: string;
  email: string;
}

interface MigrationPath {
  title: string;
  description: string;
  totalValue: number;
  products: Product[];
}

interface MigrationData {
  customer: Customer;
  sourceProducts: Product[];
  nonMigrableProductIds: string[];
  nonMigrableReasons: Record<string, string>;
  migrationPaths: Record<string, MigrationPath>;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface MigrationProps {}

/**
* @component Migration
* @description Componente per la gestione della migrazione da una subscription esistente a un nuovo preventivo
* con supporto per diversi percorsi di migrazione (SaaS/IaaS)
*/
export const MigrationPage: React.FC<MigrationProps> = () => {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Stati per il componente
  const [activeTab, setActiveTab] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  
  // Stato per il percorso di migrazione selezionato
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  // Stato per i prodotti target attualmente selezionati
  const [targetProducts, setTargetProducts] = useState<Product[]>([]);

  // Query per recuperare i dati della migrazione
  const { isLoading, error, data: migrationData = {} as MigrationData } = useQuery({
    queryKey: ['migration', subscriptionId],
    queryFn: async () => {
      const response = await fetch(`migration/${subscriptionId}`);
      if (!response.ok) {
        throw new Error('Errore nel recupero dei dati di migrazione');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minuti
  });

  // Effect per aggiornare i prodotti target quando viene selezionato un percorso di migrazione
  useEffect(() => {
    if (selectedPath && migrationData.migrationPaths && migrationData.migrationPaths[selectedPath]) {
      setTargetProducts(migrationData.migrationPaths[selectedPath].products);
    } else {
      setTargetProducts([]);
    }
  }, [selectedPath, migrationData]);

  // Mutation per il salvataggio
  const saveMigrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`migration/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante il salvataggio della migrazione');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Migrazione completata con successo',
        severity: 'success'
      });
      
      // Reindirizzamento dopo il salvataggio
      setTimeout(() => {
        navigate('/quotes');
      }, 1500);
      
      // Invalidiamo la cache delle query relative alle migrazioni
      queryClient.invalidateQueries({ queryKey: ['migration'] });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        severity: 'error'
      });
    }
  });

  // Gestione cambio tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };

  // Funzione per selezionare un percorso di migrazione
  const handlePathSelect = (pathId: string): void => {
    setSelectedPath(pathId);
  };

  // Funzione per rimuovere un prodotto dalla migrazione
  const handleRemoveProduct = (product: Product): void => {
    setTargetProducts(prev => prev.filter(p => p.id !== product.id));
  };

  // Funzione per formattare i prezzi
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Funzione per calcolare il totale di listino dei prodotti sorgente
  const calculateCurrentTotal = (): number => {
    if (!migrationData.sourceProducts) return 0;
    return migrationData.sourceProducts.reduce((total: number, product: Product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  // Funzione per calcolare il totale cliente dei prodotti sorgente (con sconti)
  const calculateCurrentCustomerTotal = (): number => {
    if (!migrationData.sourceProducts) return 0;
    return migrationData.sourceProducts.reduce((total: number, product: Product) => {
      const effectivePrice = product.customerPrice || product.price || 0;
      const quantity = product.quantity || 1;
      return total + (effectivePrice * quantity);
    }, 0);
  };

  // Funzione per calcolare il totale di listino dei prodotti target
  const calculateNewTotal = (): number => {
    return targetProducts.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  // Funzione per calcolare il totale cliente dei prodotti target (con sconti)
  const calculateNewCustomerTotal = (): number => {
    return targetProducts.reduce((total, product) => {
      const effectivePrice = product.customerPrice || product.price || 0;
      const quantity = product.quantity || 1;
      return total + (effectivePrice * quantity);
    }, 0);
  };

  // Funzione per salvare la migrazione
  const handleSaveMigration = (): void => {
    saveMigrationMutation.mutate({
      customerId: migrationData.customer?.id,
      sourceProducts: migrationData.sourceProducts,
      targetProducts: targetProducts,
      migrationPath: selectedPath
    });
  };

  // Funzione per tornare alla pagina precedente
  const handleGoBack = (): void => {
    navigate('/customers');
  };

  // Funzione per tradurre le categorie
  const translateCategory = (category?: string): string => {
    const categories: Record<string, string> = {
      'enterprise': 'Enterprise',
      'professional': 'Professional',
      'hr': 'HR',
      'cross': 'Cross'
    };
    return categories[category || ''] || category || 'N/A';
  };
  
  // Funzione per determinare il tipo di tag in base alla categoria
  const getCategoryTagType = (category?: string): TagType => {
    const categoryMap: Record<string, TagType> = {
      'enterprise': 'tone1',
      'professional': 'tone3',
      'hr': 'tone5',
      'cross': 'tone7'
    };
    return categoryMap[category || ''] || 'tone1';
  };

  // Creiamo una mappa per identificare quali prodotti sostituiscono quali
  const createReplacementMap = (): Record<string, string> => {
    const replacementMap: Record<string, string> = {};
    
    if (selectedPath && migrationData.migrationPaths && migrationData.migrationPaths[selectedPath]) {
      migrationData.migrationPaths[selectedPath].products.forEach((product: Product) => {
        if (product.replacesProductId) {
          replacementMap[product.replacesProductId] = `${product.id}`;
        }
      });
    }
    
    return replacementMap;
  };

  // Visualizzazione durante il caricamento
  if (isLoading) {
    return (
      <VaporPage>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography>Caricamento dati migrazione in corso...</Typography>
        </Box>
      </VaporPage>
    );
  }

  // Visualizzazione in caso di errore
  if (error) {
    return (
      <VaporPage>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography color="error">
            Errore nel caricamento dei dati: {error instanceof Error ? error.message : 'Errore sconosciuto'}
          </Typography>
        </Box>
      </VaporPage>
    );
  }

  // Otteniamo la mappa dei prodotti sostitutivi
  const replacementMap = createReplacementMap();

  return (
    <VaporPage>
      <Title
        leftItems={[
          <IconButton key="back-button" color="primary" size="small" onClick={handleGoBack}>
            <VaporIcon icon={faArrowLeft} size="xl" />
          </IconButton>
        ]}
        rightItems={[
          <Button 
            key="add-article" 
            size="small" 
            variant="contained" 
            startIcon={<VaporIcon icon={faPlus} />}
            onClick={() => navigate(`/catalog?migrationId=${subscriptionId || 'mock'}`)}
            disabled={!selectedPath}
          >
            Aggiungi articolo
          </Button>,
          <Button 
            key="save-migration" 
            size="small" 
            variant="outlined" 
            startIcon={<VaporIcon icon={faFloppyDisk} />}
            onClick={handleSaveMigration}
            disabled={saveMigrationMutation.isPending || !selectedPath}
          >
            {saveMigrationMutation.isPending ? 'Salvataggio...' : 'Completa Migrazione'}
          </Button>,
          <IconButton key="options" size="small">
            <VaporIcon icon={faEllipsisVertical} size="xl" />
          </IconButton>
        ]}
        size="small"
        title={`Migrazione per ${migrationData.customer?.name || ''}`}
      />

      <VaporPage.Section>
        <ExtendedTabs value={activeTab} onChange={handleTabChange} size="small" variant="standard">
          <ExtendedTab label="Migrazione" />
          <ExtendedTab label="Cliente" />
          <ExtendedTab label="Documenti" />
        </ExtendedTabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            {/* Riepilogo migrazione (mostrato solo se un percorso è selezionato) */}
            <Box sx={{ 
              mb: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Riepilogo Migrazione
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Valore di listino attuale:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(calculateCurrentTotal())} / anno
                  </Typography>
                  {calculateCurrentCustomerTotal() < calculateCurrentTotal() && (
                    <Typography variant="body2" color="success.main">
                      {formatPrice(calculateCurrentCustomerTotal())} con sconti
                    </Typography>
                  )}
                </Grid>
                
                {selectedPath && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Nuovo valore di listino:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(calculateNewTotal())} / anno
                    </Typography>
                    {calculateNewCustomerTotal() < calculateNewTotal() && (
                      <Typography variant="body2" color="success.main">
                        {formatPrice(calculateNewCustomerTotal())} con sconti
                      </Typography>
                    )}
                  </Grid>
                )}
                
                {selectedPath && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Differenza (con sconti):
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={(calculateNewCustomerTotal() - calculateCurrentCustomerTotal()) >= 0 ? 'error.main' : 'success.main'}
                    >
                      {formatPrice(calculateNewCustomerTotal() - calculateCurrentCustomerTotal())} / anno
                      {' '}
                      ({((calculateNewCustomerTotal() - calculateCurrentCustomerTotal()) / calculateCurrentCustomerTotal() * 100).toFixed(1)}%)
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Struttura a due colonne per i prodotti */}
            <Grid container spacing={3}>
              {/* Colonna sinistra: prodotti originali */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  boxShadow: 1
                }}>
                  {/* Utilizziamo il nuovo componente MigrationProductList */}
                  <MigrationProductList 
                    products={migrationData.sourceProducts || []}
                    isMigrationSource={true}
                    nonMigrableProductIds={migrationData.nonMigrableProductIds || []}
                    nonMigrableReasons={migrationData.nonMigrableReasons || {}}
                    replacementMap={replacementMap}
                    translateCategory={translateCategory}
                    getCategoryTagType={getCategoryTagType}
                    title="Prodotti Attuali"
                  />
                </Box>
              </Grid>
              
              {/* Colonna destra: percorsi di migrazione o prodotti proposti */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  boxShadow: 1
                }}>
                  {!selectedPath ? (
                    <MigrationPathSelector 
                      paths={migrationData.migrationPaths || {}}
                      onSelectPath={handlePathSelect}
                      currentValue={calculateCurrentTotal()}
                    />
                  ) : (
                    <>
                      {/* Mostra l'intestazione del percorso selezionato */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2, 
                        backgroundColor: 'secondary.light',
                        borderRadius: 1,
                        mb: 3
                      }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          mr: 2
                        }}>
                          <VaporIcon 
                            icon={selectedPath === 'saas' ? faCloudArrowUp : faServer} 
                            size="s" 
                          />
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Percorso di migrazione: {migrationData.migrationPaths?.[selectedPath]?.title}
                          </Typography>
                          <Typography variant="body2">
                            {migrationData.migrationPaths?.[selectedPath]?.description}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ textAlign: 'right', mr: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Costo stimato:
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {formatPrice(migrationData.migrationPaths?.[selectedPath]?.totalValue || 0)}/anno
                            </Typography>
                          </Box>
                          
                          <Button 
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedPath(null)}
                          >
                            Cambia
                          </Button>
                        </Box>
                      </Box>
                      
                      {/* Utilizziamo il nuovo componente MigrationProductList per i prodotti target */}
                      <MigrationProductList 
                        products={targetProducts}
                        onRemoveProduct={handleRemoveProduct}
                        onAddProduct={() => navigate(`/catalog?migrationId=${subscriptionId || 'mock'}`)}
                        translateCategory={translateCategory}
                        getCategoryTagType={getCategoryTagType}
                        title="Nuovi Prodotti"
                      />
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Cliente */}
        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
              Informazioni cliente
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nome cliente
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {migrationData.customer?.name || ''}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Settore
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {migrationData.customer?.sector || ''}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {migrationData.customer?.email || ''}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        
        {/* Tab Documenti */}
        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
              Documenti associati
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Questa sezione conterrà i documenti associati alla migrazione, 
                come le specifiche tecniche, le condizioni contrattuali e altri allegati pertinenti.
              </Typography>
              
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                border: '1px dashed', 
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Nessun documento associato al momento.
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 1 }}
                  startIcon={<VaporIcon icon={faPlus} />}
                >
                  Aggiungi Documento
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </VaporPage.Section>

      {/* Snackbar per notifiche */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </VaporPage>
  );
};
