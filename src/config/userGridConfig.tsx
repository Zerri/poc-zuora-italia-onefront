// src/config/userGridConfig.tsx
import { Box, Typography, Chip, Avatar } from "@vapor/v3-components";
import { faEdit, faTrash, faToggleOn } from "@fortawesome/pro-regular-svg-icons";
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
    width: 250,
    renderCell: (_, row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {row.name?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
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
        label={value === 'active' ? 'Attivo' : value === 'inactive' ? 'Inattivo' : 'In Sospeso'}
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
    renderCell: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm') : 'Mai'
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
      { value: 'active', label: 'Attivo' },
      { value: 'inactive', label: 'Inattivo' },
      { value: 'pending', label: 'In Sospeso' }
    ],
    defaultValue: 'All'
  },
  {
    field: 'role',
    label: 'Ruolo',
    type: 'select',
    options: [
      { value: 'admin', label: 'Amministratore' },
      { value: 'user', label: 'Utente' },
      { value: 'moderator', label: 'Moderatore' }
    ],
    defaultValue: 'All'
  }
];

/**
 * Funzione per generare le azioni per Users
 */
export const getUserActions = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  onToggleStatus: (user: User) => void
): ActionConfig<User>[] => [
  {
    key: 'edit',
    label: 'Modifica Utente',
    icon: faEdit,
    color: 'primary',
    onClick: onEdit
  },
  {
    key: 'toggleStatus',
    label: 'Cambia Stato',
    icon: faToggleOn,
    color: 'secondary',
    onClick: onToggleStatus,
    visible: (user) => user.status !== 'pending'
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
  columns: USER_COLUMNS,
  filters: USER_FILTERS,
  actions: getUserActions(onEdit, onDelete, onToggleStatus),
  title: 'Utenti',
  description: 'Gestisci gli utenti esistenti (anagrafica, ruolo e stato) o creane di nuovi.',
  addButtonLabel: 'Aggiungi Nuovo Utente',
  emptyMessage: 'Nessun utente trovato. Aggiungi il primo utente per iniziare.',
  pageSize: 10,
  // Configurazione header
  showHeader: true,           // Mostra l'header
  headerLayout: 'simple'    // Usa il layout dettagliato
});