// src/config/userGridConfig.tsx
import { Box, Typography, Chip, Avatar } from "@vapor/v3-components";
import { faEdit, faTrash, faEllipsisV } from "@fortawesome/pro-regular-svg-icons";
import dayjs from 'dayjs';
import type { User } from '../types/user';
import type { DataGridConfig, ColumnConfig, FilterConfig, ActionConfig } from '../types/grid';

/**
 * Configurazione colonne per Users
 */
export const USER_COLUMNS: ColumnConfig<User>[] = [
  {
    field: 'name',
    headerName: 'Utente',
    flex: 1.5,
    renderCell: (_, row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {row.fullName?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              sx={{ lineHeight: 1.2, textAlign: 'left' }}
            >
              {row.fullName}
            </Typography>
            <Typography 
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.2, textAlign: 'left' }}
            >
              {row.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  },
  {
    field: 'role',
    headerName: 'Ruolo',
    width: 130,
    renderCell: (value) => (
      <Chip 
        label={value} 
        size="small" 
        color={value === 'admin' ? 'primary' : 'default'}
      />
    )
  },
  {
    field: 'status',
    headerName: 'Stato',
    width: 120,
    renderCell: (value) => (
      <Chip
        label={value }
        size="small"
        color={value === 'active' ? 'success' : value === 'inactive' ? 'error' : 'warning'}
      />
    )
  },
  {
    field: 'registrationDate',
    headerName: 'Data Registrazione',
    width: 160,
    renderCell: (value) => value ? dayjs(value).format('DD/MM/YYYY') : '-'
  },
  {
    field: 'lastAccess',
    headerName: 'Ultimo Accesso',
    width: 160,
    renderCell: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'
  }
];

/**
 * Configurazione filtri per Users
 */
export const USER_FILTERS: FilterConfig[] = [
  {
    field: 'searchTerm',
    label: 'Cerca utenti...',
    type: 'search',
    placeholder: 'Cerca per nome, email o ID utente...',
    defaultValue: ''
  },
  {
    field: 'status',
    label: 'Stato',
    type: 'select',
    options: [
      { value: 'active', label: 'active' },
      { value: 'inactive', label: 'inactive' },
      { value: 'pending', label: 'pending' }
    ],
    defaultValue: 'all'
  },
  {
    field: 'role',
    label: 'Ruolo',
    type: 'select',
    options: [
      { value: 'admin', label: 'admin' },
      { value: 'user', label: 'user' },
      { value: 'moderator', label: 'moderator' }
    ],
    defaultValue: 'all'
  }
];

/**
 * Funzione per generare le azioni per Users
 */
export const getUserActions = (
  onOptions: (user: User) => void,
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
): ActionConfig<User>[] => [
  {
    key: 'options',
    label: 'Opzioni Utente',
    icon: faEllipsisV,
    color: 'primary',
    onClick: onOptions
  },
  {
    key: 'edit',
    label: 'Modifica Utente',
    icon: faEdit,
    color: 'primary',
    onClick: onEdit
  },
  {
    key: 'delete',
    label: 'Elimina Utente',
    icon: faTrash,
    color: 'error',
    onClick: onDelete,
    disabled: (user) => user.role === 'admin'
  }
];

/**
 * Configurazione completa DataGrid per Users
 */
export const getUserGridConfig = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  onToggleStatus: (user: User) => void
): DataGridConfig<User> => ({
  getRowId: (quote) => quote._id,
  columns: USER_COLUMNS,
  filters: USER_FILTERS,
  actions: getUserActions(onEdit, onDelete, onToggleStatus),
  title: 'features.userManagement.dataGrid.title',
  description: 'features.userManagement.dataGrid.description',
  addButtonLabel: 'features.userManagement.dataGrid.addButtonLabel',
  emptyMessage: 'Nessun utente trovato. Aggiungi il primo utente per iniziare.',
  pageSize: 10,
  // Configurazione header
  showHeader: true,           // Mostra l'header
});