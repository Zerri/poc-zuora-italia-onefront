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
import { useRole } from '../../contexts/RoleContext';
import type { AdminQuote, AdminQuoteFilters } from '../../types/adminQuote';
import { GenericDataGrid } from '../../components/GenericDataGrid';
import { useAdminQuotesCRUD } from '../../hooks/useAdminQuotesCRUD';
import { getAdminQuoteGridConfig } from '../../config/adminQuoteGridConfig';
import { useDataGridHandlers } from '../../hooks/useDataGridHandlers'; // ✨ HOOK COMUNE

interface AdminQuotesPageProps {}

export const AdminQuotesPage: React.FC<AdminQuotesPageProps> = () => {
  const { t } = useTranslation();
  const { role } = useRole();
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

  // ✨ HOOK CENTRALIZZATO per handlers comuni
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

  // Verifica permessi
  if (role !== 'admin') {
    return (
      <VaporThemeProvider>
        <VaporPage>
          <VaporPage.Section>
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.userManagement.errors.noPermission")}
            </Alert>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

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

  const gridConfig = getAdminQuoteGridConfig(handleView, handleChangeStatus, handleAssignAgent);

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
              config={gridConfig}
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

      {/* Dialog Cambio Stato */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, quote: null, newStatus: '' })}>
        <DialogTitle>Cambia Stato Preventivo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Preventivo: <strong>{statusDialog.quote?.number}</strong>
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Nuovo Stato</InputLabel>
              <Select
                value={statusDialog.newStatus}
                label="Nuovo Stato"
                onChange={(e) => setStatusDialog(prev => ({ ...prev, newStatus: e.target.value as string }))}
              >
                <MenuItem value="Draft">Bozza</MenuItem>
                <MenuItem value="Sent">Inviato</MenuItem>
                <MenuItem value="Accepted">Accettato</MenuItem>
                <MenuItem value="Rejected">Rifiutato</MenuItem>
                <MenuItem value="Migration">Migrazione</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, quote: null, newStatus: '' })}>
            Annulla
          </Button>
          <Button 
            onClick={handleConfirmStatusChange} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Salvando...' : 'Conferma'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Assegnazione Agent */}
      <Dialog open={agentDialog.open} onClose={() => setAgentDialog({ open: false, quote: null, newAgent: '' })}>
        <DialogTitle>Assegna Sales Agent</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Preventivo: <strong>{agentDialog.quote?.number}</strong>
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Sales Agent</InputLabel>
              <Select
                value={agentDialog.newAgent}
                label="Sales Agent"
                onChange={(e) => setAgentDialog(prev => ({ ...prev, newAgent: e.target.value as string }))}
              >
                <MenuItem value="Mario Rossi">Mario Rossi</MenuItem>
                <MenuItem value="Sara Bianchi">Sara Bianchi</MenuItem>
                <MenuItem value="Luca Verdi">Luca Verdi</MenuItem>
                <MenuItem value="Anna Neri">Anna Neri</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgentDialog({ open: false, quote: null, newAgent: '' })}>
            Annulla
          </Button>
          <Button 
            onClick={handleConfirmAgentAssign} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Salvando...' : 'Assegna'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✨ SNACKBAR CENTRALIZZATO */}
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