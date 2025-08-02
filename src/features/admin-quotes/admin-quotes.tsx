// src/features/admin-quotes/admin-quotes.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  VaporIcon,
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
import { faFileInvoice } from "@fortawesome/pro-regular-svg-icons/faFileInvoice";
import { useTranslation } from '@1f/react-sdk';
import { useRole } from '../../contexts/RoleContext';
import { SnackbarState } from '../../types';
import type { AdminQuote, AdminQuoteFilters } from '../../types/adminQuote';
import { GenericDataGrid } from '../../components/GenericDataGrid';
import { useAdminQuotesCRUD } from '../../hooks/useAdminQuotesCRUD';
import { getAdminQuoteGridConfig } from '../../config/adminQuoteGridConfig';

interface AdminQuotesPageProps {}

/**
 * @component AdminQuotesPage
 * @description Pagina principale per la gestione amministrativa preventivi
 */
export const AdminQuotesPage: React.FC<AdminQuotesPageProps> = () => {
  const { t } = useTranslation();
  const { role } = useRole();
  const navigate = useNavigate();
  
  // State per filtri
  const [filters, setFilters] = useState<AdminQuoteFilters>({
    status: 'All',
    salesAgent: 'All',
    period: 'All',
    searchTerm: ''
  });
  
  // State per dialoghi
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
  
  // State per messaggi
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Hook per gestire i preventivi
  const {
    items: quotes,
    isLoading,
    error,
    updateItem: updateQuote,
    isUpdating
  } = useAdminQuotesCRUD(filters);

  // Verifica permessi - solo admin può accedere
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

  // Handler per visualizzare preventivo
  const handleView = (quote: AdminQuote) => {
    navigate(`/quote/${quote._id}`);
  };

  // Handler per aprire dialog cambio stato
  const handleChangeStatus = (quote: AdminQuote) => {
    setStatusDialog({
      open: true,
      quote,
      newStatus: quote.status
    });
  };

  // Handler per aprire dialog assegnazione agent
  const handleAssignAgent = (quote: AdminQuote) => {
    setAgentDialog({
      open: true,
      quote,
      newAgent: quote.salesAgent
    });
  };

  // Handler per confermare cambio stato
  const handleConfirmStatusChange = async () => {
    if (!statusDialog.quote) return;
    
    try {
      await updateQuote.mutateAsync({
        id: statusDialog.quote.id,
        status: statusDialog.newStatus as any,
        lastActivity: new Date().toISOString()
      });
      
      setSnackbar({
        open: true,
        message: t('features.adminQuotes.success.statusChanged'),
        severity: 'success'
      });
      
      setStatusDialog({ open: false, quote: null, newStatus: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('features.adminQuotes.errors.actionFailed'),
        severity: 'error'
      });
    }
  };

  // Handler per confermare assegnazione agent
  const handleConfirmAgentAssign = async () => {
    if (!agentDialog.quote) return;
    
    try {
      await updateQuote.mutateAsync({
        id: agentDialog.quote.id,
        salesAgent: agentDialog.newAgent,
        lastActivity: new Date().toISOString()
      });
      
      setSnackbar({
        open: true,
        message: t('features.adminQuotes.success.agentAssigned'),
        severity: 'success'
      });
      
      setAgentDialog({ open: false, quote: null, newAgent: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('features.adminQuotes.errors.actionFailed'),
        severity: 'error'
      });
    }
  };

  // Handler per chiudere snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Gestione errori di caricamento
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
        {/* Header Section personalizzato */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
                {t("features.adminQuotes.dataGrid.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("features.adminQuotes.dataGrid.description")}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<VaporIcon icon={faFileInvoice} />}
              onClick={() => navigate('/customers')}
              size='small'
            >
              {t("features.adminQuotes.dataGrid.addButtonLabel")}
            </Button>
          </Box>
        </Box>

        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <GenericDataGrid
              items={quotes}
              config={getAdminQuoteGridConfig(handleView, handleChangeStatus, handleAssignAgent)}
              currentFilters={filters}
              onFiltersChange={setFilters}
              isLoading={isLoading}
              error={error}
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

      {/* Snackbar per messaggi */}
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