// src/config/customersGridConfig.tsx
import { Box, Typography, Chip } from "@vapor/v3-components";
import { faEdit, faTrash, faEye, faFileExport, faArrowRight, faExchange } from "@fortawesome/pro-regular-svg-icons";
import type { Customer } from '../types/customers';
import type { DataGridConfig, ColumnConfig, ActionConfig, BulkActionConfig } from '../types/grid';

/**
 * Definizione delle colonne per la griglia Customers
 */
export const CUSTOMERS_COLUMNS: ColumnConfig<Customer>[] = [
  {
    field: 'nome',
    headerName: 'Nome Cliente',
   flex: 1.5,
    renderCell: (value, row) => (      
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
        <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ lineHeight: 1.2, textAlign: 'left' }}
          >
            {value}
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
    )
  },
  {
    field: 'tipo',
    headerName: 'Tipo',
    flex: 1,
    renderCell: (value) => {
      const colors = {
        'Cliente': 'success',
        'Prospect': 'warning', 
        'Lead': 'info'
      } as const;
      
      return (
        <Chip
          label={value}
          size="small"
          color={colors[value as keyof typeof colors] || 'default'}
        />
      );
    }
  },
  {
    field: 'settore',
    headerName: 'Settore',
    flex: 1,
    renderCell: (value) => value
  },
  {
    field: 'valore',
    headerName: 'Valore',
    flex: 1,
    renderCell: (value) => (
      <Typography fontWeight="medium" textAlign="right" sx={{ py: 1.5}}>
        €{value?.toLocaleString('it-IT') || '0'}
      </Typography>
    )
  },
  {
    field: 'ultimoContatto',
    headerName: 'Ultimo Contatto',
    flex: 1.5,
    renderCell: (value) => {
      if (!value) return <Typography variant="body2" sx={{ py: 1.5}}>-</Typography>;
      
      const date = new Date(value);
      const isRecent = (Date.now() - date.getTime()) < (30 * 24 * 60 * 60 * 1000); // 30 giorni
      
      return (
        <Typography 
          variant="body2" 
          color={isRecent ? 'success.main' : 'text.secondary'}
          sx={{ py: 1.7}}
        >
          {date.toLocaleDateString('it-IT')}
        </Typography>
      );
    }
  },
  {
    field: 'migrabile',
    headerName: 'Migrabile',
    flex: 1,
    renderCell: (value) => (
      <Box display="flex" justifyContent="center" sx={{ py: 1.5 }}>
        <Chip
          label={value ? 'Sì' : 'No'}
          size="small"
          color={value ? 'success' : 'default'}
        />
      </Box>
    )
  }
];

/**
 * Definizione dei filtri disponibili
 */
export const CUSTOMERS_FILTERS = [
  {
    field: 'searchTerm',
    label: 'Cerca clienti...',
    type: 'search' as const,
    placeholder: 'Cerca per nome, settore o email...',
    defaultValue: ''
  },
  {
    field: 'tipo',
    label: 'Tipo Cliente',
    type: 'select' as const,
    options: [
      { value: 'All', label: 'Tutti i tipi' },
      { value: 'Cliente', label: 'Cliente' },
      { value: 'Prospect', label: 'Prospect' },
      { value: 'Lead', label: 'Lead' }
    ],
    defaultValue: 'All'
  },
  {
    field: 'migrabile',
    label: 'Migrabilità',
    type: 'select' as const,
    options: [
      { value: 'All', label: 'Tutti' },
      { value: 'true', label: 'Migrabile' },
      { value: 'false', label: 'Non migrabile' }
    ],
    defaultValue: 'All'
  }
];

/**
 * Definizione delle azioni disponibili per ogni riga
 * ✨ AGGIORNATO: Ora parametrizzate invece di hardcoded
 */
export const getCustomersActions = (
  onView: (customer: Customer) => void,
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void
): ActionConfig<Customer>[] => [
  {
    key: 'view',
    label: 'Visualizza',
    icon: faEye,
    color: 'primary',
    onClick: onView
  },
  {
    key: 'edit',
    label: 'Modifica',
    icon: faEdit,
    color: 'primary',
    onClick: onEdit
  },
  {
    key: 'delete',
    label: 'Elimina',
    icon: faTrash,
    color: 'error',
    onClick: onDelete
  }
];

/**
 * ✨ NUOVO: Definizione delle bulk actions per operazioni su più customers
 */
export const getCustomersBulkActions = (
  onBulkExport: (customers: Customer[]) => void,
  onBulkMigration: (customers: Customer[]) => void,
  onBulkStatusChange: (customers: Customer[]) => void
): BulkActionConfig<Customer>[] => [
  {
    key: 'export',
    label: 'Esporta Selezionati',
    icon: faFileExport,
    color: 'primary',
    onClick: onBulkExport,
    requiresSelection: false, // Può funzionare anche senza selezione
  },
  {
    key: 'migration',
    label: 'Avvia Migrazione',
    icon: faArrowRight,
    color: 'success',
    onClick: onBulkMigration,
    requiresSelection: true,
    confirmMessage: 'Sei sicuro di voler avviare la migrazione per i clienti selezionati?'
  },
  {
    key: 'status-change',
    label: 'Cambia Tipo',
    icon: faExchange,
    color: 'warning',
    onClick: onBulkStatusChange,
    requiresSelection: true,
  }
];

/**
 * Configurazione completa della griglia per Customers
 * ✨ AGGIORNATO: Ora supporta azioni parametrizzate e bulk actions
 */
export const getCustomersGridConfig = (
  // Azioni singole
  onView: (customer: Customer) => void,
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void,
  // Bulk actions
  onBulkExport: (customers: Customer[]) => void,
  onBulkMigration: (customers: Customer[]) => void,
  onBulkStatusChange: (customers: Customer[]) => void
): DataGridConfig<Customer> => ({
  getRowId: (row: Customer) => row._id,
  columns: CUSTOMERS_COLUMNS,
  filters: CUSTOMERS_FILTERS,
  actions: getCustomersActions(onView, onEdit, onDelete),
  bulkActions: getCustomersBulkActions(onBulkExport, onBulkMigration, onBulkStatusChange),
  enableMultiSelect: true,
  title: 'features.customerManagement.dataGrid.title',
  description: 'features.customerManagement.dataGrid.description',
  addButtonLabel: 'features.customerManagement.dataGrid.addButtonLabel',
  emptyMessage: 'features.customerManagement.dataGrid.emptyMessage',
  pageSize: 10,
  showHeader: true, // Mostra header con filtri

  paginationMode: 'server',
  sortingMode: 'server',
  pageSizeOptions: [10, 25, 50, 100],
  
  // Configurazione ordinamento
  defaultSort: {
    field: 'ultimoContatto',
    direction: 'desc'
  },
  sortableFields: [
    'name', 
    'sector',
    'value',
    'lastContact',
  ]
});