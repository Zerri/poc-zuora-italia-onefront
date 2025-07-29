// src/features/user-management/user-management.tsx
import React, { useState } from 'react';
import {
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button,
  VaporToolbar,
  CircularProgress,
  Alert,
  Box,
  VaporIcon,
  Snackbar,
} from "@vapor/v3-components";
import { faUserPlus } from "@fortawesome/pro-regular-svg-icons/faUserPlus";
import { useTranslation } from '@1f/react-sdk';
import { useRole } from '../../contexts/RoleContext';
// Import types
import { 
  User, 
  UserFilters, 
  UserActionEvent,
  SnackbarState,
  UserFormData
} from '../../types';
// Import components
import { UserDataGrid } from './components/UserDataGrid';
import { UserDrawer } from './components/UserDrawer';
// Import hooks
import { useUsers } from './hooks/useUsers';

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
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting
  } = useUsers(filters);

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

  // Handlers per i filtri - ora gestiscono tutto insieme
  const handleApplyFilters = (newFilters: { status: string; role: string; searchTerm: string }) => {
    setFilters(prev => ({ 
      ...prev, 
      status: newFilters.status,
      role: newFilters.role,
      searchTerm: newFilters.searchTerm
    }));
  };

  // Handlers per drawer
  const handleOpenDrawer = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setIsEditing(true);
    } else {
      setSelectedUser(null);
      setIsEditing(false);
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  // Handler per azioni utente
  const handleUserAction = async (event: UserActionEvent) => {
    const { action, user } = event;
    
    try {
      switch (action) {
        case 'edit':
          handleOpenDrawer(user);
          break;
        case 'delete':
          if (window.confirm(t("features.userManagement.confirmDelete", { name: user.fullName }))) {
            await deleteUser.mutateAsync(user.id);
            setSnackbar({
              open: true,
              message: t("features.userManagement.success.userDeleted"),
              severity: 'success'
            });
          }
          break;
        case 'changeStatus':
          const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
          await updateUser.mutateAsync({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: newStatus
          });
          setSnackbar({
            open: true,
            message: t("features.userManagement.success.statusChanged"),
            severity: 'success'
          });
          break;
      }
    } catch (error) {
      console.error('User action failed:', error);
      setSnackbar({
        open: true,
        message: t("features.userManagement.errors.actionFailed"),
        severity: 'error'
      });
    }
  };

  // Handler per salvataggio utente
  const handleSaveUser = async (userData: UserFormData) => {
    try {
      if (isEditing && selectedUser) {
        await updateUser.mutateAsync({ ...userData, id: selectedUser.id });
        setSnackbar({
          open: true,
          message: t("features.userManagement.success.userUpdated"),
          severity: 'success'
        });
      } else {
        await createUser.mutateAsync(userData);
        setSnackbar({
          open: true,
          message: t("features.userManagement.success.userCreated"),
          severity: 'success'
        });
      }
      handleCloseDrawer();
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
      <VaporPage
        title={t("features.userManagement.title")}
        description={t("features.userManagement.description")}
      >
        {/* Header Section con titolo, descrizione e bottone */}
        <Box 
          sx={{  
            p: 3, 
          }}
        >
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
              onClick={() => handleOpenDrawer()}
              disabled={isCreating}
              size='small'
            >
              {t("features.userManagement.addUser")}
            </Button>
          </Box>
        </Box>

        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UserDataGrid
              users={users || []}
              filters={filters}
              onUserAction={handleUserAction}
              onApplyFilters={handleApplyFilters}
              isLoading={isUpdating || isDeleting}
            />
          )}
        </VaporPage.Section>
      </VaporPage>

      {/* User Drawer */}
      <UserDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        user={selectedUser}
        isEditing={isEditing}
        onSave={handleSaveUser}
        isLoading={isCreating || isUpdating}
      />

      {/* Snackbar per messaggi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </VaporThemeProvider>
  );
};