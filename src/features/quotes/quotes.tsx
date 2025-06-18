import { fetch } from "@1f/react-sdk"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button, 
  VaporToolbar, 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent, 
  Tag, 
  Chip,
  Divider, 
  Grid, 
  Box,
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  SearchBar,
  DataGrid,
  ButtonGroup,
  Tooltip
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { faPen } from "@fortawesome/pro-regular-svg-icons/faPen";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faTableCells } from "@fortawesome/pro-regular-svg-icons/faTableCells";
import { faTableCellsLarge } from "@fortawesome/pro-regular-svg-icons/faTableCellsLarge";
import { QuoteCard } from '../../components/QuoteCard';
import { GridColDef } from "@mui/x-data-grid-pro";
import { useTranslation } from '@1f/react-sdk';
import { TagType, TagVariant } from '../../types';


// Definizione tipi
type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Migration';
type QuoteType = 'New' | 'Migration' | 'Upgrade';
type ViewMode = 'cards' | 'grid';

interface Customer {
  name: string;
  sector: string;
}

interface Product {
  name: string;
  quantity: number;
  price: number;
  customerPrice?: number;
}

interface Quote {
  _id: string;
  number: string;
  customer: Customer;
  status: QuoteStatus;
  type: QuoteType;
  createdAt: string;
  value?: number;
  products?: Product[];
  notes?: string;
}

interface StatusTranslations {
  [key: string]: string;
}

interface TypeTranslations {
  [key: string]: string;
}

/**
 * @component QuotesPage
 * @description Pagina che mostra la lista dei preventivi
 */
export const QuotesPage: React.FC = () => {
  const { t } = useTranslation();
  // State per filtri ricerca
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // State per la vista (cards o griglia)
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // Mappa per tradurre gli stati in italiano per l'interfaccia
  const statusTranslations: StatusTranslations = {
    'All': t("features.quotes.status.all"),
    'Draft': t("features.quotes.status.draft"),
    'Sent': t("features.quotes.status.sent"),
    'Accepted': t("features.quotes.status.accepted"),
    'Rejected': t("features.quotes.status.rejected"),
    'Migration': t("features.quotes.status.migration")
  };

  // Mappa per tradurre i tipi di preventivo in italiano
  const typeTranslations: TypeTranslations = {
    'New': t("features.quotes.type.new"),
    'Migration': t("features.quotes.type.migration"),
    'Upgrade': t("features.quotes.type.upgrade")
  };
  
  // State per gestione drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Funzione per calcolare il valore totale del preventivo dai prodotti
  const calculateQuoteValue = (products?: Product[]): number => {
    if (!products || products.length === 0) return 0;
    
    return products.reduce((total, product) => {
      // Usa il prezzo cliente se disponibile, altrimenti usa il prezzo standard
      const effectivePrice = product.customerPrice || product.price || 0;
      const quantity = product.quantity || 1;
      return total + (effectivePrice * quantity);
    }, 0);
  };

  // Query per ottenere le quotes
  const { 
    data: quotes = [], 
    isLoading, 
    error 
  } = useQuery<Quote[], Error>({ 
    queryKey: ['quotes', filterStatus, searchTerm], 
    queryFn: async () => {
      let url = `${import.meta.env.VITE_APP_BE}/quotes`;
      
      // Costruisci la query string in base ai filtri
      const params = new URLSearchParams();
      if (filterStatus !== 'All') {
        params.append('status', filterStatus);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Aggiungi i parametri all'URL se presenti
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });

  // Funzione per formattare la data
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Funzione per formattare il valore come valuta
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Funzione per determinare il colore del tag in base allo stato
  const getStatusTagType = (status: QuoteStatus): TagType => {
    switch(status) {
      case 'Draft': return 'info'; // blu
      case 'Sent': return 'success'; // verde
      case 'Accepted': return 'success'; // verde
      case 'Rejected': return 'error'; // rosso
      default: return 'tone8'; // viola
    }
  };

  // Funzione per determinare la variante del tag in base allo stato
  const getStatusTagVariant = (status: QuoteStatus): TagVariant => {
    switch(status) {
      case 'Draft': return 'duotone'; // blu
      case 'Sent': return 'duotone'; // verde
      case 'Accepted': return 'filled'; // verde
      case 'Rejected': return 'filled'; // rosso
      default: return 'duotone'; // viola
    }
  };

  // Funzione per determinare la variante del tag in base al type
  const getTypeTagVariant = (type: QuoteType): TagVariant => {
    switch(type) {
      case 'New': return 'filled';
      case 'Migration': return 'duotone';
      default: return 'filled';
    }
  };
  
  // Funzione per cambiare il filtro dello stato
  const handleFilterChange = (newStatus: string): void => {
    setFilterStatus(newStatus);
  };
  
  // Funzione per aprire il drawer con il preventivo selezionato
  const handleOpenDrawer = (quote: Quote): void => {
    setSelectedQuote(quote);
    setDrawerOpen(true);
  };
  
  // Funzione per chiudere il drawer
  const handleCloseDrawer = (): void => {
    setDrawerOpen(false);
  };

  // Configurazione delle colonne per DataGrid
  const columns: GridColDef<Quote>[] = [
    { 
      field: 'number', 
      headerName: t("features.quotes.grid.number"), 
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left'
            }}
          >
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'customer', 
      headerName: t("features.quotes.grid.customer"),  
      flex: 1.5,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left',
              display: 'block',
            }}
          >
            {params.value.name}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left',
              display: 'block',
            }}
          >
            {params.value.sector}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: t("features.quotes.grid.stato"), 
      flex: 0.8,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Tag 
            label={statusTranslations[params.value]} 
            type={getStatusTagType(params.value as QuoteStatus)}
            size="small"
            variant={getStatusTagVariant(params.value as QuoteStatus)}
          />
        </Box>
      )
    },
    { 
      field: 'type', 
      headerName: t("features.quotes.grid.type"),  
      flex: 0.8,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Tag 
            label={typeTranslations[params.value]} 
            type="warning"
            size="small"
            variant={getTypeTagVariant(params.value as QuoteType)}
          />
        </Box>
      )
    },
    { 
      field: 'createdAt', 
      headerName: t("features.quotes.grid.creationDate"), 
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2">
            {formatDate(params.value)}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'value', 
      headerName: t("features.quotes.grid.value"), 
      flex: 1,
      renderCell: (params: any) => {
        const calculatedValue = params.row.products && params.row.products.length > 0 
          ? calculateQuoteValue(params.row.products) 
          : params.value;
        
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {formatCurrency(calculatedValue)}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: t("features.quotes.grid.actions"), 
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <Box sx={{ py: 1, display: 'flex', gap: 1 }}>
          <Link to={`/quote/${params.row._id}`}>
            <Button 
              variant="contained" 
              color="primary"
              size="small"
              startIcon={<VaporIcon icon={faPen} />}
            >
              {t("features.quotes.actions.edit")}
            </Button>
          </Link>
          <IconButton 
            variant="outlined" 
            color="primary"
            size="small"
            onClick={() => handleOpenDrawer(params.row)}
          >
            <VaporIcon icon={faEllipsisVertical} />
          </IconButton>
        </Box>
      )
    }
  ];

  // Configurazione delle opzioni per DataGrid
  const gridOptions = {
    pageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    autoHeight: true,
    hideFooterSelectedRowCount: true,
    disableColumnMenu: true,
    disableSelectionOnClick: true,
    sx: {
      '& .MuiDataGrid-cell': {
        maxHeight: 'none !important',
        whiteSpace: 'normal'
      }
    }
  };

  return (
    <VaporThemeProvider>
      <VaporPage>
        <Title
          rightItems={[
            <Link to="/quote">
              <Button key="1" size="small" variant="contained" startIcon={<VaporIcon icon={faPlus} />}>{t("features.quotes.actions.new")}</Button>
            </Link>,
            <IconButton key="2" size="small">
              <VaporIcon icon={faEllipsisVertical} size="xl" />
            </IconButton>
          ]}
          size="small"
          title={t("features.quotes.title")}
        />
        <VaporPage.Section divider>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              component="div"
              gutterBottom
              variant="headingsPage"
            >
              {t("features.quotes.heading")}
            </Typography>
            <Typography
              component="div"
              gutterBottom
              variant="bodyLargeRegular"
            >
              {t("features.quotes.subtitle")}
            </Typography>
          </Box>
          
          {/* Form di ricerca preventivi */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
              <SearchBar
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                handleClear={() => setSearchTerm("")}
                placeholder={t("features.quotes.searchPlaceholder")}
                size='medium'
                sx={{ width: '100%' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip 
                label={t("features.quotes.filters.all")} 
                variant={filterStatus === 'All' ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('All')}
                color={filterStatus === 'All' ? 'primary' : 'default'}
              />
              
              {['Draft', 'Sent', 'Accepted', 'Rejected'].map(status => (
                <Chip 
                  key={status}
                  label={statusTranslations[status]}
                  variant={filterStatus === status ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange(status)}
                  color={filterStatus === status ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Box>
        </VaporPage.Section>

        <VaporPage.Section>
          {/* Intestazione con il toggle per cambiare vista */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              component="div"
              variant="bodyLargeHeavy"
            >
              {t("features.quotes.recentQuotes")}
            </Typography>
            
            {/* Toggle per cambiare vista */}
            <ButtonGroup variant="outlined" size="small">
              <Tooltip title={t("features.quotes.tooltips.cardView")}>
                <IconButton 
                  color={viewMode === 'cards' ? 'primary' : 'default'}
                  onClick={() => setViewMode('cards')}
                >
                  <VaporIcon icon={faTableCellsLarge} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("features.quotes.tooltips.tableView")}>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                >
                  <VaporIcon icon={faTableCells} />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>  
          
          {/* Visualizzazione delle quotes */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.quotes.errors.loading")} {error.message}
            </Alert>
          ) : quotes.length === 0 ? (
            <Alert severity="info">
              {t("features.quotes.alerts.noResults")}
            </Alert>
          ) : (
            <>
              {/* VISTA A SCHEDE (CARDS) - Utilizzando il nuovo componente QuoteCard */}
              {viewMode === 'cards' && (
                <Grid container spacing={3}>
                  {quotes.map((quote) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={quote._id}>
                      <QuoteCard
                        quote={quote}
                        onOpenDrawer={handleOpenDrawer}
                        calculateQuoteValue={calculateQuoteValue}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                        getStatusTagType={getStatusTagType}
                        getStatusTagVariant={getStatusTagVariant}
                        getTypeTagVariant={getTypeTagVariant}
                        statusTranslations={statusTranslations}
                        typeTranslations={typeTranslations}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {/* VISTA A GRIGLIA (DATAGRID) */}
              {viewMode === 'grid' && (
                <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1 }}>
                  <DataGrid 
                    rows={quotes} 
                    columns={columns} 
                    getRowId={(row: Quote) => row._id}
                    {...gridOptions}
                    sx={{
                      '.MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                        maxHeight: 'none !important',
                        whiteSpace: 'normal',
                        padding: '16px 8px'
                      },
                      '.MuiDataGrid-row': {
                        maxHeight: 'none !important'
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </VaporPage.Section>

        {/* Drawer con dettagli preventivo */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          width="30vw"
          hideBackdrop={false}
          sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
        >
          {selectedQuote && (
            <>
              <Title
                title={selectedQuote.customer.name}
                description={t("features.quotes.drawer.quoteNumber", { number: selectedQuote.number })}
                divider
                rightItems={[
                  <IconButton size="small" variant='outlined' onClick={handleCloseDrawer}>
                    <VaporIcon icon={faClose} size="xl" />
                  </IconButton>
                ]}
              />
              
              <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {t("features.quotes.drawer.sector", { sector: selectedQuote.customer.sector })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tag 
                      label={typeTranslations[selectedQuote.type]} 
                      type="warning"
                      size="medium"
                      variant={getTypeTagVariant(selectedQuote.type)}
                    />
                    <Tag 
                      label={statusTranslations[selectedQuote.status]} 
                      type={getStatusTagType(selectedQuote.status)}
                      size="medium"
                      variant={getStatusTagVariant(selectedQuote.status)}
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  {t("features.quotes.drawer.quoteDetails")}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{t("features.quotes.drawer.createdOn")}</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatDate(selectedQuote.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{t("features.quotes.drawer.totalValue")}</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(selectedQuote.products && selectedQuote.products.length > 0 ? calculateQuoteValue(selectedQuote.products) : selectedQuote.value || 0)}{t("features.quotes.drawer.perYear")}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  {t("features.quotes.drawer.includedProducts")}
                </Typography>
                
                {selectedQuote.products && selectedQuote.products.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    {selectedQuote.products.map((product, index) => (
                      <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="medium">{product.name}</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">
                              {t("features.quotes.drawer.quantity", { quantity: product.quantity })}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(product.price * product.quantity)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t("features.quotes.drawer.noProducts")}
                  </Typography>
                )}
                
                <Divider sx={{ my: 3 }} />
                
                {selectedQuote.notes && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {t("features.quotes.drawer.notes")}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedQuote.notes || t("features.quotes.drawer.noNotes")}
                    </Typography>
                  </>
                )}
              </Box>
              
              <VaporToolbar
                contentRight={[
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    onClick={handleCloseDrawer}
                  >
                    {t("features.quotes.actions.close")}
                  </Button>,
                  <Link to={`/quote/${selectedQuote._id}`}>
                    <Button 
                      variant="contained" 
                      color="primary"
                    >
                      {t("features.quotes.actions.editQuote")}
                    </Button>
                  </Link>
                ]}
                size="medium"
                variant="regular"
                withoutAppBar
              />
            </>
          )}
        </Drawer>
      </VaporPage>
    </VaporThemeProvider>
  );
}
