// src/features/user-management/user-management.tsx
import React from 'react';
// import { useTranslation } from '@1f/react-sdk';

import type { User, UserFilters, UserMutationData } from '../../types/user';
import { EntityManagementPage, type EntityManagementConfig } from '../../components/EntityManagementPage';
import { getUserGridConfig } from '../../config/userGridConfig';
import { UserDrawer } from './components/UserDrawer';

interface UserManagementPageProps {}

export const UserManagementPage: React.FC<UserManagementPageProps> = () => {
  // const { t } = useTranslation();

  // Configurazione per il componente generico
  const entityConfig: EntityManagementConfig<User, UserFilters, UserMutationData> = {
    entityKey: 'users',
    crudConfig: {
      endpoints: {
        list: `${import.meta.env.VITE_APP_BE}/users`,
        create: `${import.meta.env.VITE_APP_BE}/users`,
        update: (id: string) => `${import.meta.env.VITE_APP_BE}/users/${id}`,
        delete: (id: string) => `${import.meta.env.VITE_APP_BE}/users/${id}`,
      },
      permissions: ['users.read', 'users.write'], // TODO: Implement permission-based access control
      searchFields: ['name', 'email'],
      defaultSort: {
        field: 'registrationDate',
        direction: 'desc'
      }
    },
    initialFilters: {
      status: 'all',
      role: 'all',
      searchTerm: '',
      page: 1,
      limit: 10,
      sortBy: 'registrationDate',
      sortOrder: 'desc'
    },
    getGridConfig: (handleEdit, handleDelete, handleBulkExport, handleBulkDeactivate, handleBulkDelete) => 
      getUserGridConfig(
        handleEdit, 
        handleDelete!,
        handleBulkExport!,
        handleBulkDeactivate!,
        handleBulkDelete!
      ),
    DrawerComponent: ({ open, onClose, item, isEditing, onSave, isSaving }) => (
      <UserDrawer
        open={open}
        onClose={onClose}
        user={item}
        isEditing={isEditing}
        onSave={onSave}
        isSaving={isSaving}
      />
    ),
    translationKey: "features.userManagement",
    customHandlers: {
      onBulkExport: (selectedUsers: User[]) => {
        const userInfo = selectedUsers.length > 0 
          ? `${selectedUsers.length} utenti selezionati:\n${selectedUsers.map(u => `- ${(u as any).fullName} (${u.email})`).join('\n')}`
          : 'Export di tutti gli utenti disponibili';
        
        alert(`🔄 BULK ACTION: Export\n\n${userInfo}\n\nIn futuro: sarà generato un file CSV/Excel`);
      },
      onBulkDeactivate: (selectedUsers: User[]) => {
        const userInfo = `${selectedUsers.length} utenti selezionati:\n${selectedUsers.map(u => `- ${(u as any).fullName} (${u.email}) - Stato: ${u.status}`).join('\n')}`;
        alert(`⚠️ BULK ACTION: Disattivazione\n\n${userInfo}\n\nIn futuro: API call per disattivare in batch`);
      },
      onBulkDelete: (selectedUsers: User[]) => {
        const userInfo = `${selectedUsers.length} utenti selezionati:\n${selectedUsers.map(u => `- ${(u as any).fullName} (${u.email}) - Ruolo: ${u.role}`).join('\n')}`;
        alert(`🗑️ BULK ACTION: Eliminazione\n\n${userInfo}\n\nIn futuro: API call per eliminare in batch`);
      },
      prepareMutationData: {
        create: (data: UserMutationData) => ({
          ...data,
          registrationDate: new Date().toISOString(),
          lastAccess: null
        }),
        update: (data: UserMutationData, user: User) => ({
          ...data,
          id: user._id
        })
      }
    }
  };

  return <EntityManagementPage config={entityConfig} />;
};