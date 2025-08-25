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
import type { User, UserFilters, UserMutationData } from '../../types/user';
import { GenericDataGrid } from '../../components/GenericDataGrid';
import { UserDrawer } from './components/UserDrawer';
import { useUsersCRUD } from '../../hooks/useUsersCRUD';
import { getUserGridConfig } from '../../config/userGridConfig';
import { useDataGridHandlers } from '../../hooks/useDataGridHandlers';

interface UserManagementPageProps {}

export const UserManagementPage: React.FC<UserManagementPageProps> = () => {
  const { t } = useTranslation();
  const { role } = useRole();
  
  // State per filtri
  const [filters, setFilters] = useState<UserFilters>({
    status: 'all',
    role: 'all',
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'registrationDate',
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
  
  // State specifici per user management
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Hook CRUD  
  const {
    items: users,
    pagination,
    sorting,
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
  console.log('🔍 User Management Page - Sorting:', sorting);

  // ✅ Controllo accesso admin
  if (role !== 'admin') {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.userManagement.title")}>
          <Alert severity="error">
            {t("common.errors.unauthorized")}
          </Alert>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  // Handlers specifici per user management
  const handleAdd = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setDrawerOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setDrawerOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(t("features.userManagement.confirmDelete"))) return;
    
    try {
      await deleteUser.mutateAsync(String(user.id));
      showSnackbar(t("features.userManagement.success.userDeleted"), 'success');
    } catch (error) {
      showSnackbar(t("features.userManagement.errors.deleteError"), 'error');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await updateUser.mutateAsync({
        id: String(user.id),
        status: newStatus
      });
      showSnackbar(t("features.userManagement.success.statusUpdated"), 'success');
    } catch (error) {
      showSnackbar(t("features.userManagement.errors.statusError"), 'error');
    }
  };

  // ✨ NUOVO: Handlers per bulk actions
  const handleBulkExport = (selectedUsers: User[]) => {
    const userInfo = selectedUsers.length > 0 
      ? `${selectedUsers.length} utenti selezionati:\n${selectedUsers.map(u => `- ${u.fullName} (${u.email})`).join('\n')}`
      : 'Export di tutti gli utenti disponibili';
    
    alert(`🔄 BULK ACTION: Export\n\n${userInfo}\n\nIn futuro: sarà generato un file CSV/Excel`);
    showSnackbar('Export completato con successo', 'success');
  };

  const handleBulkDeactivate = (selectedUsers: User[]) => {
    const userInfo = `${selectedUsers.length} utenti selezionati:\n${selectedUsers.map(u => `- ${u.fullName} (${u.email}) - Stato: ${u.status}`).join('\n')}`;
    
    alert(`⚠️ BULK ACTION: Disattivazione\n\n${userInfo}\n\nIn futuro: API call per disattivare in batch`);
    showSnackbar(`${selectedUsers.length} utenti disattivati`, 'success');
  };

  const handleBulkDelete = (selectedUsers: User[]) => {
    const userInfo = `${selectedUsers.length} utenti selezionati:\n${selectedUsers.map(u => `- ${u.fullName} (${u.email}) - Ruolo: ${u.role}`).join('\n')}`;
    
    alert(`🗑️ BULK ACTION: Eliminazione\n\n${userInfo}\n\nIn futuro: API call per eliminare in batch`);
    showSnackbar(`${selectedUsers.length} utenti eliminati`, 'success');
  };

  const handleSaveUser = async (userData: UserMutationData) => {
    try {
      if (isEditing && selectedUser) {
        await updateUser.mutateAsync({
          ...userData,
          id: selectedUser.id
        });
        showSnackbar(t("features.userManagement.success.userUpdated"), 'success');
      } else {
        await createUser.mutateAsync({
          ...userData,
          registrationDate: new Date().toISOString(),
          lastAccess: null
        });
        showSnackbar(t("features.userManagement.success.userCreated"), 'success');
      }
      setDrawerOpen(false);
      setSelectedUser(null);
      setIsEditing(false);
    } catch (error) {
      showSnackbar(
        isEditing 
          ? t("features.userManagement.errors.updateError")
          : t("features.userManagement.errors.createError"),
        'error'
      );
    }
  };

  // Verifica permessi
  if (role !== 'admin') {
    return (
      <VaporThemeProvider>
        <VaporPage title={t("features.userManagement.title")}>
          <VaporPage.Section>
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.userManagement.errors.noPermission")}
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
              <GenericDataGrid
                items={users}
                config={getUserGridConfig(
                  handleEdit, 
                  handleToggleStatus, 
                  handleDelete,
                  handleBulkExport,
                  handleBulkDeactivate,
                  handleBulkDelete
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