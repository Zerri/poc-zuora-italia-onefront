// src/features/user-management/user-management.tsx
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
import { useRole } from '../../contexts/RoleContext';
import { SnackbarState } from '../../types';
import type { User, UserFilters, UserMutationData } from '../../types/user';
import type { SortInfo } from '../../types/generic'; // 🆕 Import SortInfo
import { GenericDataGrid } from '../../components/GenericDataGrid';
import { UserDrawer } from './components/UserDrawer';
import { useUsersCRUD } from '../../hooks/useUsersCRUD';
import { getUserGridConfig } from '../../config/userGridConfig';

interface UserManagementPageProps {}

/**
 * @component UserManagementPage
 * @description Pagina principale per la gestione utenti del sistema
 */
export const UserManagementPage: React.FC<UserManagementPageProps> = () => {
  const { t } = useTranslation();
  const { role } = useRole();
  
  // 🆕 State per filtri e ricerca con supporto sorting
  const [filters, setFilters] = useState<UserFilters>({
    status: 'all',
    role: 'all',
    searchTerm: '',
    page: 1,
    limit: 10,
    // 🆕 Ordinamento di default
    sortBy: 'registrationDate',
    sortOrder: 'desc'
  });
  
  // State per drawer management
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // State per messaggi
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Hook per gestire gli utenti
  const {
    items: users,
    pagination,
    sorting, // 🆕 Info sorting dal server (se disponibile)
    isLoading,
    error,
    createItem: createUser,
    updateItem: updateUser,
    deleteItem: deleteUser,
    isCreating,
    isUpdating
  } = useUsersCRUD(filters);

  console.log('User Management Page - Users:', users);
  console.log('User Management Page - Pagination:', pagination);
  console.log('🔍 User Management Page - Sorting:', sorting); // 🆕 Debug sorting

  // 🆕 Handler per cambio ordinamento
  const handleSortChange = (sortInfo: SortInfo) => {
    console.log('🔄 Sorting requested:', sortInfo);
    console.log('🔍 Current filters before change:', { sortBy: filters.sortBy, sortOrder: filters.sortOrder });
    
    // 🔧 FIX: Forza sempre l'aggiornamento, anche se sembra uguale
    const newFilters = {
      ...filters,
      sortBy: sortInfo.field,
      sortOrder: sortInfo.direction,
      page: 1 // Reset alla prima pagina quando si ordina
    };
    
    console.log('🔄 New filters after change:', { sortBy: newFilters.sortBy, sortOrder: newFilters.sortOrder });
    
    // Forza il re-render aggiornando sempre lo state
    setFilters(newFilters);
  };

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

  // Handler per il cambio di paginazione
  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    console.log('Pagination changed:', { page: newPage, pageSize: newPageSize });
    
    setFilters(prev => ({
      ...prev,
      page: newPage,
      limit: newPageSize
    }));
  };

  // Handler per il cambio filtri (supporta reset paginazione)
  const handleFiltersChange = (newFilters: UserFilters) => {
    console.log('Filters changed:', newFilters);
    
    // Quando cambiano i filtri, reset della paginazione alla prima pagina
    setFilters({
      ...newFilters,
      page: 1,
      limit: filters.limit
    });
  };

  // Handler per salvataggio utente (CORRETTO)
  const handleSaveUser = async (userData: UserMutationData) => {
    try {
      if (isEditing && selectedUser) {
        // Aggiornamento utente esistente
        await updateUser.mutateAsync({
          ...userData,
          id: selectedUser.id
        });
        setSnackbar({
          open: true,
          message: t("features.userManagement.success.userUpdated"),
          severity: 'success'
        });
      } else {
        // Creazione nuovo utente
        await createUser.mutateAsync({
          ...userData,
          registrationDate: new Date().toISOString(),
          lastAccess: null
        });
        setSnackbar({
          open: true,
          message: t("features.userManagement.success.userCreated"),
          severity: 'success'
        });
      }
      
      // Chiudi il drawer
      setDrawerOpen(false);
      setSelectedUser(null);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Save user failed:', error);
      setSnackbar({
        open: true,
        message: t("features.userManagement.errors.saveFailed"),
        severity: 'error'
      });
    }
  };

  // Handler per chiudere snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Handler per aprire drawer in modalità aggiungi
  const handleAdd = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setDrawerOpen(true);
  };

  // Handler per aprire drawer in modalità modifica
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setDrawerOpen(true);
  };

  // Handler per eliminare utente
  const handleDelete = async (user: User) => {
    if (window.confirm(t('features.userManagement.confirmDelete', { name: user.name }))) {
      try {
        await deleteUser.mutateAsync(user.id.toString());
        setSnackbar({
          open: true,
          message: t('features.userManagement.success.userDeleted'),
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: t('features.userManagement.errors.actionFailed'),
          severity: 'error'
        });
      }
    }
  };

  // Handler per cambiare stato utente
  const handleToggleStatus = async (user: User) => {
    const newStatus: 'active' | 'inactive' = user.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUser.mutateAsync({
        ...user,
        status: newStatus
      });
      setSnackbar({
        open: true,
        message: t('features.userManagement.success.statusChanged'),
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('features.userManagement.errors.actionFailed'),
        severity: 'error'
      });
    }
  };

  // Gestione errori di caricamento
  if (error) {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.userManagement.title")}>
          <VaporPage.Section>
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.userManagement.errors.loadFailed")}: {error.message}
            </Alert>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  return (
    <VaporThemeProvider>
      <VaporPage title={t("features.userManagement.title")}>
        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* 🆕 DataGrid con supporto sorting server-side */}
              <GenericDataGrid
                items={users}
                config={getUserGridConfig(handleEdit, handleDelete, handleToggleStatus)}
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
                onAdd={handleAdd}
                isLoading={isLoading}
                error={error}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onSortChange={handleSortChange} // ✨ AGGIUNTO SUPPORTO SORTING
              />

              {/* 🆕 Debug info sorting (solo in development) */}
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
                      <br />🔙 <strong>Server Response:</strong> sortBy={sorting.sortBy}, sortOrder={sorting.sortOrder}
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}
        </VaporPage.Section>
      </VaporPage>

      {/* User Drawer */}
      <UserDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
          setIsEditing(false);
        }}
        user={selectedUser}
        isEditing={isEditing}
        onSave={handleSaveUser}
        isSaving={isCreating || isUpdating}
      />

      {/* Snackbar per messaggi */}
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