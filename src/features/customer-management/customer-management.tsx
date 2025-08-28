// src/features/customer-management/customer-management.tsx
import React, { useState } from 'react';
import {
  VaporThemeProvider,
  VaporPage,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
} from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';
import type { Customer, CustomerFilters } from '../../types/customers';
import { GenericDataGrid } from '../../components/GenericDataGrid';
import { useCustomersAdminCRUD } from '../../hooks/useCustomersAdminCRUD';
import { getCustomersGridConfig } from '../../config/customersGridConfig';
import { useDataGridHandlers } from '../../hooks/useDataGridHandlers';

interface CustomerManagementPageProps {}

export const CustomerManagementPage: React.FC<CustomerManagementPageProps> = () => {
  const { t } = useTranslation();
  
  // State per filtri - configurazione iniziale coerente con il tuo hook
  const [filters, setFilters] = useState<CustomerFilters>({
    tipo: 'All',
    migrabile: 'All',
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'ultimoContatto',
    sortOrder: 'desc'
  });
  
  // Hook centralizzato per handlers comuni (come in user-management)
  const {
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    handlePaginationChange,
    handleFiltersChange,
    handleSortChange
  } = useDataGridHandlers(filters, setFilters);

  // Hook CRUD per customers
  const {
    items: customers,
    pagination,
    sorting,
    isLoading,
    error,
    // createItem: createCustomer,
    // updateItem: updateCustomer,
    deleteItem: deleteCustomer,
    // isCreating,
    // isUpdating
  } = useCustomersAdminCRUD(filters);

  console.log('Customer Management Page - Customers:', customers);
  console.log('Customer Management Page - Pagination:', pagination);
  console.log('🔍 Customer Management Page - Sorting:', sorting);

  // Handlers specifici per customer management
  const handleAdd = () => {
    // TODO: Implementare apertura drawer/modal per aggiunta
    console.log('📝 Add customer - Da implementare');
    showSnackbar('Funzionalità "Aggiungi Cliente" in sviluppo', 'info');
  };

  const handleEdit = (customer: Customer) => {
    // TODO: Implementare apertura drawer/modal per modifica
    console.log('✏️ Edit customer:', customer);
    showSnackbar(`Modifica cliente: ${customer.nome} (in sviluppo)`, 'info');
  };

  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il cliente "${customer.nome}"?`)) return;
    
    try {
      await deleteCustomer.mutateAsync(customer._id);
      showSnackbar(`Cliente "${customer.nome}" eliminato con successo`, 'success');
    } catch (error) {
      showSnackbar('Errore durante l\'eliminazione del cliente', 'error');
    }
  };

  const handleView = (customer: Customer) => {
    console.log('👁️ View customer:', customer);
    showSnackbar(`Visualizza dettagli: ${customer.nome} (in sviluppo)`, 'info');
  };

  // ✨ Handlers per bulk actions (futuri)
  const handleBulkExport = (selectedCustomers: Customer[]) => {
    const customerInfo = selectedCustomers.length > 0 
      ? `${selectedCustomers.length} clienti selezionati:\n${selectedCustomers.map(c => `- ${c.nome} (${c.email})`).join('\n')}`
      : 'Export di tutti i clienti disponibili';
    
    alert(`📄 BULK ACTION: Export\n\n${customerInfo}\n\nIn futuro: sarà generato un file CSV/Excel`);
    showSnackbar('Export completato con successo', 'success');
  };

  const handleBulkMigration = (selectedCustomers: Customer[]) => {
    const migrabiliCustomers = selectedCustomers.filter(c => c.migrabile);
    const customerInfo = `${migrabiliCustomers.length} clienti migrabili selezionati:\n${migrabiliCustomers.map(c => `- ${c.nome} (${c.settore})`).join('\n')}`;
    
    alert(`🚀 BULK ACTION: Migrazione\n\n${customerInfo}\n\nIn futuro: API call per migrazione in batch`);
    showSnackbar(`${migrabiliCustomers.length} clienti avviati alla migrazione`, 'success');
  };

  const handleBulkStatusChange = (selectedCustomers: Customer[]) => {
    const customerInfo = `${selectedCustomers.length} clienti selezionati:\n${selectedCustomers.map(c => `- ${c.nome} (${c.tipo})`).join('\n')}`;
    
    alert(`🔄 BULK ACTION: Cambio Tipo\n\n${customerInfo}\n\nIn futuro: Dialog per selezione nuovo tipo`);
    showSnackbar(`${selectedCustomers.length} clienti aggiornati`, 'success');
  };

  return (
    <VaporThemeProvider>
      <VaporPage title={t("features.customerManagement.title", "Gestione Clienti")}>
        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <GenericDataGrid
                items={customers}
                config={getCustomersGridConfig(
                  handleView,
                  handleEdit, 
                  handleDelete,
                  handleBulkExport,
                  handleBulkMigration,
                  handleBulkStatusChange
                )}
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
                onAdd={handleAdd}
                isLoading={isLoading}
                error={error}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onSortChange={handleSortChange}
              />

              {/* Debug info sorting (solo in development) */}
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'info.main', 
                  color: 'info.contrastText',
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}>
                  🔍 <strong>Debug Sorting:</strong> 
                  <br />📄 <strong>Filtri:</strong> sortBy={filters.sortBy}, sortOrder={filters.sortOrder}
                  {sorting && (
                    <>
                      <br />📙 <strong>Server Response:</strong> sortBy={sorting.sortBy}, sortOrder={sorting.sortOrder}
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}
        </VaporPage.Section>
      </VaporPage>

      {/* ✨ SNACKBAR CENTRALIZZATO */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </VaporThemeProvider>
  );
};