// src/config/adminQuoteGridConfig.tsx
import { Box, Typography, Chip, Avatar } from "@vapor/v3-components";
import { faEye, faEdit, faUserCheck } from "@fortawesome/pro-regular-svg-icons";
import dayjs from 'dayjs';
import type { AdminQuote } from '../types/adminQuote';
import type { DataGridConfig, ColumnConfig, FilterConfig, ActionConfig } from '../types/grid';

/**
 * Helper per formattare valuta
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Helper per ottenere il colore del chip status
 */
const getStatusColor = (status: string) => {
  const colors = {
    'Draft': 'default',
    'Sent': 'info',
    'Accepted': 'success',
    'Rejected': 'error',
    'Migration': 'warning'
  } as const;
  return colors[status as keyof typeof colors] || 'default';
};

/**
 * Helper per tradurre gli status
 */
const translateStatus = (status: string): string => {
  const translations = {
    'Draft': 'Bozza',
    'Sent': 'Inviato',
    'Accepted': 'Accettato',
    'Rejected': 'Rifiutato',
    'Migration': 'Migrazione'
  };
  return translations[status as keyof typeof translations] || status;
};

/**
 * Helper per tradurre i tipi
 */
const translateType = (type: string): string => {
  const translations = {
    'New': 'Nuova Vendita',
    'Migration': 'Migrazione',
    'Upgrade': 'Upgrade'
  };
  return translations[type as keyof typeof translations] || type;
};

/**
 * Configurazione colonne per AdminQuotes
 */
export const ADMIN_QUOTE_COLUMNS: ColumnConfig<AdminQuote>[] = [
  {
    field: 'number',
    headerName: 'Numero',
    flex: 1,
    renderCell: (value) => value
  },
  {
    field: 'customer',
    headerName: 'Cliente',
    flex: 1.5,
    renderCell: (row) => (
      // <Box>
      //   <Typography variant="body2" fontWeight="medium">
      //     {value.name}
      //   </Typography>
      //   <Typography variant="caption" color="text.secondary">
      //     {value.sector}
      //   </Typography>
      // </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {row.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              sx={{ lineHeight: 1.2, textAlign: 'left' }}
            >
              {row.name}
            </Typography>
            <Typography 
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.2, textAlign: 'left' }}
            >
              {row.sector}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  },
  {
    field: 'salesAgent',
    headerName: 'Sales Agent',
    flex: 1,
    renderCell: (value) => (
      <Typography variant="body2">
        {value}
      </Typography>
    )
  },
  {
    field: 'status',
    headerName: 'Stato',
    flex: 1,
    renderCell: (value) => (
      <Chip
        label={translateStatus(value)}
        size="small"
        color={getStatusColor(value)}
      />
    )
  },
  {
    field: 'type',
    headerName: 'Tipo',
    flex: 1,
    renderCell: (value) => (
      <Chip
        label={translateType(value)}
        size="small"
        variant="outlined"
      />
    )
  },
  {
    field: 'value',
    headerName: 'Valore',
    flex: 1,
    renderCell: (value) => formatCurrency(value)
  },
  {
    field: 'createdAt',
    headerName: 'Data Creazione',
    flex: 1,
    renderCell: (value) => dayjs(value).format('DD/MM/YYYY')
  },
  {
    field: 'lastActivity',
    headerName: 'Ultima Attività',
    flex: 1,
    renderCell: (value) => dayjs(value).format('DD/MM/YYYY HH:mm')
  }
];

/**
 * Configurazione filtri per AdminQuotes
 */
export const ADMIN_QUOTE_FILTERS: FilterConfig[] = [
  {
    field: 'searchTerm',
    label: 'Cerca preventivi...',
    type: 'search',
    placeholder: 'Cerca per numero o cliente...',
    defaultValue: ''
  },
  {
    field: 'status',
    label: 'Stato',
    type: 'select',
    options: [
      { value: 'Draft', label: 'Bozza' },
      { value: 'Sent', label: 'Inviato' },
      { value: 'Accepted', label: 'Accettato' },
      { value: 'Rejected', label: 'Rifiutato' },
      { value: 'Migration', label: 'Migrazione' }
    ],
    defaultValue: 'All'
  },
  {
    field: 'salesAgent',
    label: 'Sales Agent',
    type: 'select',
    options: [
      { value: 'Mario Rossi', label: 'Mario Rossi' },
      { value: 'Sara Bianchi', label: 'Sara Bianchi' },
      { value: 'Luca Verdi', label: 'Luca Verdi' },
      { value: 'Anna Neri', label: 'Anna Neri' }
    ],
    defaultValue: 'All'
  },
  {
    field: 'period',
    label: 'Periodo',
    type: 'select',
    options: [
      { value: 'thisMonth', label: 'Questo Mese' },
      { value: 'lastMonth', label: 'Mese Scorso' },
      { value: 'thisYear', label: 'Quest\'Anno' }
    ],
    defaultValue: 'All'
  }
];

/**
 * Azioni per AdminQuotes
 */
export const getAdminQuoteActions = (
  onView: (quote: AdminQuote) => void,
  onChangeStatus: (quote: AdminQuote) => void,
  onAssignAgent: (quote: AdminQuote) => void
): ActionConfig<AdminQuote>[] => [
  {
    key: 'view',
    label: 'Visualizza Preventivo',
    icon: faEye,
    color: 'primary',
    onClick: onView
  },
  {
    key: 'changeStatus',
    label: 'Cambia Stato',
    icon: faEdit,
    color: 'primary',
    onClick: onChangeStatus
  },
  {
    key: 'assignAgent',
    label: 'Assegna Agent',
    icon: faUserCheck,
    color: 'primary',
    onClick: onAssignAgent
  }
];

/**
 * Configurazione completa DataGrid per AdminQuotes
 */
export const getAdminQuoteGridConfig = (
  onView: (quote: AdminQuote) => void,
  onChangeStatus: (quote: AdminQuote) => void,
  onAssignAgent: (quote: AdminQuote) => void
): DataGridConfig<AdminQuote> => ({
  getRowId: (quote) => quote._id,
  columns: ADMIN_QUOTE_COLUMNS,
  filters: ADMIN_QUOTE_FILTERS,
  actions: getAdminQuoteActions(onView, onChangeStatus, onAssignAgent),
  title: 'features.adminQuotes.dataGrid.title',
  description: 'features.adminQuotes.dataGrid.description',
  addButtonLabel: 'features.adminQuotes.dataGrid.addButtonLabel',
  emptyMessage: 'features.adminQuotes.dataGrid.emptyMessage',
  pageSize: 10,
  showHeader: false,
  paginationMode: 'server',
  pageSizeOptions: [10, 25, 50, 100]
});