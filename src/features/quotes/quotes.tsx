import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button,
  CircularProgress, 
  Alert, 
  Grid, 
  Box,
  Title,
  IconButton,
  VaporIcon,
  DataGrid,
  ButtonGroup,
  Tooltip
} from "@vapor/v3-components";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faTableCells } from "@fortawesome/pro-regular-svg-icons/faTableCells";
import { faTableCellsLarge } from "@fortawesome/pro-regular-svg-icons/faTableCellsLarge";
import { QuoteCard } from '../../components/QuoteCard';
import { useTranslation } from '@1f/react-sdk';
import { ViewMode, Quote, StatusTranslations, TypeTranslations } from './types';
import { calculateQuoteValue, formatDate, formatCurrency, getStatusTagType, getStatusTagVariant, getTypeTagVariant } from './utils';
import { useQuotes } from './hooks';
import { createGridColumns, gridOptions } from './gridConfig';
import { QuoteFilters } from './QuoteFilters';
import { QuoteDrawer } from './QuoteDrawer';

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

  // Query per ottenere le quotes
  const { data: quotes = [], isLoading, error } = useQuotes(filterStatus, searchTerm);

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

  const columns = createGridColumns(t, statusTranslations, typeTranslations, handleOpenDrawer);

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
          
          <QuoteFilters
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            statusTranslations={statusTranslations}
            onSearchChange={setSearchTerm}
            onFilterChange={handleFilterChange}
          />
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

        <QuoteDrawer
          open={drawerOpen}
          quote={selectedQuote}
          onClose={handleCloseDrawer}
          statusTranslations={statusTranslations}
          typeTranslations={typeTranslations}
        />
      </VaporPage>
    </VaporThemeProvider>
  );
}
