// src/features/user-management/user-management.tsx
import React, { useState } from 'react';
import {
  VaporThemeProvider,
  VaporPage,
  // Typography,
  // Button,
  CircularProgress,
  Alert,
  Box,
  // VaporIcon,
  Snackbar,
} from "@vapor/v3-components";
// import { faUserPlus } from "@fortawesome/pro-regular-svg-icons/faUserPlus";
import { useTranslation } from '@1f/react-sdk';
import { useRole } from '../../contexts/RoleContext';
// Import types corretti
import { SnackbarState } from '../../types';
import type { User, UserFilters, UserMutationData } from '../../types/user';
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
  
  // State per filtri e ricerca
  const [filters, setFilters] = useState<UserFilters>({
    status: 'All',
    role: 'All',
    searchTerm: ''
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
    isLoading,
    error,
    createItem: createUser,
    updateItem: updateUser,
    deleteItem: deleteUser,
    isCreating,
    isUpdating
  } = useUsersCRUD(filters);

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
        {/* Header Section con titolo, descrizione e bottone
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
                {t("features.userManagement.section.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("features.userManagement.section.description")}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<VaporIcon icon={faUserPlus} />}
              onClick={handleAdd}
              disabled={isCreating}
              size='small'
            >
              {t("features.userManagement.addUser")}
            </Button>
          </Box>
        </Box> */}

        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <GenericDataGrid
              items={users}
              config={getUserGridConfig(handleEdit, handleDelete, handleToggleStatus)}
              currentFilters={filters}
              onFiltersChange={setFilters}
              onAdd={handleAdd}
              isLoading={isLoading}
              error={error}
            />
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