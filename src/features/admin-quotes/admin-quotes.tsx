// src/features/admin-quotes/admin-quotes.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';
import type { AdminQuote, AdminQuoteFilters } from '../../types/adminQuote';
import { GenericDataGrid } from '../../components/GenericDataGrid';
import { useAdminQuotesCRUD } from '../../hooks/useAdminQuotesCRUD';
import { getAdminQuoteGridConfig } from '../../config/adminQuoteGridConfig';
import { useDataGridHandlers } from '../../hooks/useDataGridHandlers';

interface AdminQuotesPageProps {}

export const AdminQuotesPage: React.FC<AdminQuotesPageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State per filtri
  const [filters, setFilters] = useState<AdminQuoteFilters>({
    status: 'All',
    salesAgent: 'All',
    period: 'All',
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Hook centralizzato per handlers comuni
  const {
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    handlePaginationChange,
    handleFiltersChange,
    handleSortChange
  } = useDataGridHandlers(filters, setFilters);

  useEffect(() => {
    console.log('📊 === ADMIN QUOTES FILTERS CHANGED ===');
    console.log('🔄 Filtri aggiornati:', filters);
  }, [filters]);
  
  // State per dialoghi (logica specifica mantenuta)
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    quote: AdminQuote | null;
    newStatus: string;
  }>({
    open: false,
    quote: null,
    newStatus: ''
  });
  
  const [agentDialog, setAgentDialog] = useState<{
    open: boolean;
    quote: AdminQuote | null;
    newAgent: string;
  }>({
    open: false,
    quote: null,
    newAgent: ''
  });

  // Hook CRUD
  const {
    items: quotes,
    pagination,
    sorting,
    isLoading,
    error,
    updateItem: updateQuote,
    isUpdating
  } = useAdminQuotesCRUD(filters);

  console.log('Admin Quotes Page - Quotes:', quotes);
  console.log('Admin Quotes Page - Pagination:', pagination);
  console.log('🔍 Admin Quotes Page - Sorting:', sorting);

  // Handlers specifici per quote management
  const handleView = (quote: AdminQuote) => {
    navigate(`/quote/${quote._id}`);
  };

  const handleChangeStatus = (quote: AdminQuote) => {
    setStatusDialog({
      open: true,
      quote,
      newStatus: quote.status
    });
  };

  const handleAssignAgent = (quote: AdminQuote) => {
    setAgentDialog({
      open: true,
      quote,
      newAgent: quote.salesAgent
    });
  };

  // ✨ NUOVO: Handlers per bulk actions
  const handleBulkExport = (selectedQuotes: AdminQuote[]) => {
    const quoteInfo = selectedQuotes.length > 0 
      ? `${selectedQuotes.length} preventivi selezionati:\n${selectedQuotes.map(q => `- ${q.number} - ${q.customer?.name} (${q.status})`).join('\n')}`
      : 'Export di tutti i preventivi visibili';
    
    alert(`📊 BULK ACTION: Export Preventivi\n\n${quoteInfo}\n\nIn futuro: sarà generato un file Excel con dettagli`);
    showSnackbar('Export completato con successo', 'success');
  };

  const handleBulkArchive = (selectedQuotes: AdminQuote[]) => {
    const quoteInfo = `${selectedQuotes.length} preventivi selezionati:\n${selectedQuotes.map(q => `- ${q.number} - ${q.customer?.name} - Stato: ${q.status}`).join('\n')}`;
    
    alert(`📁 BULK ACTION: Archiviazione\n\n${quoteInfo}\n\nIn futuro: API call per archiviare in batch`);
    showSnackbar(`${selectedQuotes.length} preventivi archiviati`, 'success');
  };

  const handleBulkAssignAgent = (selectedQuotes: AdminQuote[]) => {
    const quoteInfo = `${selectedQuotes.length} preventivi selezionati:\n${selectedQuotes.map(q => `- ${q.number} - ${q.customer?.name} - Agent attuale: ${q.salesAgent || 'Non assegnato'}`).join('\n')}`;
    
    alert(`👤 BULK ACTION: Assegnazione Agent\n\n${quoteInfo}\n\nIn futuro: Dialog per scegliere agent e assegnare in batch`);
    showSnackbar(`Agent assegnato a ${selectedQuotes.length} preventivi`, 'success');
  };

  const handleConfirmStatusChange = async () => {
    if (!statusDialog.quote) return;
    
    try {
      await updateQuote.mutateAsync({
        id: statusDialog.quote.id,
        status: statusDialog.newStatus as any,
        lastActivity: new Date().toISOString()
      });
      
      showSnackbar(t('features.adminQuotes.success.statusChanged'), 'success');
      setStatusDialog({ open: false, quote: null, newStatus: '' });
    } catch (error) {
      showSnackbar(t('features.adminQuotes.errors.actionFailed'), 'error');
    }
  };

  const handleConfirmAgentAssign = async () => {
    if (!agentDialog.quote) return;
    
    try {
      await updateQuote.mutateAsync({
        id: agentDialog.quote.id,
        salesAgent: agentDialog.newAgent,
        lastActivity: new Date().toISOString()
      });
      
      showSnackbar(t('features.adminQuotes.success.agentAssigned'), 'success');
      setAgentDialog({ open: false, quote: null, newAgent: '' });
    } catch (error) {
      showSnackbar(t('features.adminQuotes.errors.actionFailed'), 'error');
    }
  };

  // Gestione errori
  if (error) {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.adminQuotes.title")}>
          <VaporPage.Section>
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.adminQuotes.errors.loadFailed")}: {error.message}
            </Alert>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  return (
    <VaporThemeProvider>
      <VaporPage title={t("features.adminQuotes.title")}>
        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <GenericDataGrid
              items={quotes}
              config={getAdminQuoteGridConfig(
                handleView, 
                handleChangeStatus, 
                handleAssignAgent,
                handleBulkExport,
                handleBulkArchive,
                handleBulkAssignAgent
              )}
              currentFilters={filters}
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
              error={error}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              onSortChange={handleSortChange}
            />
          )}
        </VaporPage.Section>
      </VaporPage>

      {/* Dialog cambio stato */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, quote: null, newStatus: '' })}>
        <DialogTitle>Cambia Stato Preventivo</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Preventivo: {statusDialog.quote?.number}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Nuovo Stato</InputLabel>
            <Select
              value={statusDialog.newStatus}
              onChange={(e) => setStatusDialog(prev => ({ ...prev, newStatus: e.target.value as string }))}
            >
              <MenuItem value="Draft">Bozza</MenuItem>
              <MenuItem value="Sent">Inviato</MenuItem>
              <MenuItem value="Accepted">Accettato</MenuItem>
              <MenuItem value="Rejected">Rifiutato</MenuItem>
              <MenuItem value="Migration">Migrazione</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, quote: null, newStatus: '' })}>
            Annulla
          </Button>
          <Button onClick={handleConfirmStatusChange} variant="contained" disabled={isUpdating}>
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog assegnazione agent */}
      <Dialog open={agentDialog.open} onClose={() => setAgentDialog({ open: false, quote: null, newAgent: '' })}>
        <DialogTitle>Assegna Sales Agent</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Preventivo: {agentDialog.quote?.number}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Sales Agent</InputLabel>
            <Select
              value={agentDialog.newAgent}
              onChange={(e) => setAgentDialog(prev => ({ ...prev, newAgent: e.target.value as string }))}
            >
              <MenuItem value="Mario Rossi">Mario Rossi</MenuItem>
              <MenuItem value="Sara Bianchi">Sara Bianchi</MenuItem>
              <MenuItem value="Luca Verdi">Luca Verdi</MenuItem>
              <MenuItem value="Anna Neri">Anna Neri</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgentDialog({ open: false, quote: null, newAgent: '' })}>
            Annulla
          </Button>
          <Button onClick={handleConfirmAgentAssign} variant="contained" disabled={isUpdating}>
            Assegna
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </VaporThemeProvider>
  );
};