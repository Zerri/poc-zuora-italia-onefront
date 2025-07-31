// src/components/GenericDataGrid.tsx
import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@vapor/v3-components";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { SelectChangeEvent } from '@mui/material/Select';
import { VaporIcon } from "@vapor/v3-components";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { useTranslation } from '@1f/react-sdk';
import type { DataGridConfig } from '../types/grid';
import type { BaseEntity, BaseFilters } from '../types/generic';

// Helper per localizzazione DataGrid
const getDataGridLocaleText = (t: any) => ({
  // Toolbar
  toolbarDensity: t("components.dataGrid.toolbar.density"),
  toolbarDensityLabel: t("components.dataGrid.toolbar.densityLabel"),
  toolbarDensityCompact: t("components.dataGrid.toolbar.densityCompact"),
  toolbarDensityStandard: t("components.dataGrid.toolbar.densityStandard"),
  toolbarDensityComfortable: t("components.dataGrid.toolbar.densityComfortable"),
  
  // Column menu
  columnMenuLabel: t("components.dataGrid.columnMenu.label"),
  columnMenuShowColumns: t("components.dataGrid.columnMenu.showColumns"),
  columnMenuFilter: t("components.dataGrid.columnMenu.filter"),
  columnMenuHideColumn: t("components.dataGrid.columnMenu.hideColumn"),
  columnMenuUnsort: t("components.dataGrid.columnMenu.unsort"),
  columnMenuSortAsc: t("components.dataGrid.columnMenu.sortAsc"),
  columnMenuSortDesc: t("components.dataGrid.columnMenu.sortDesc"),
  
  // Footer
  footerRowSelected: (count: number) =>
    count !== 1
      ? t("components.dataGrid.footer.rowCounterText", { count })
      : t("components.dataGrid.footer.rowCounterTextSingular", { count }),
  footerTotalRows: t("components.dataGrid.footer.totalRows"),
  
  // Pagination
  MuiTablePagination: {
    labelRowsPerPage: t("components.dataGrid.pagination.rowsPerPage"),
    labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
      t("components.dataGrid.pagination.displayedRows", { from, to, count }),
  },
  
  // No rows
  noRowsLabel: t("components.dataGrid.noRows"),
  noResultsOverlayLabel: t("components.dataGrid.noResults"),
  
  // Error
  errorOverlayDefaultLabel: t("components.dataGrid.error"),
  
  // Loading
  loadingOverlayLabel: t("components.dataGrid.loading"),
});

// Interfaccia per i componenti header
interface HeaderProps {
  config: DataGridConfig<any>;
  onAdd?: () => void;
  t: any;
}

// Componente per l'header semplice
const SimpleHeader: React.FC<HeaderProps> = ({ config, onAdd, t }) => (
  <Box sx={{ 
    mb: 3, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2
  }}>
    <Typography variant="h5" component="h1">
      {config.title}
    </Typography>
    {onAdd && (
      <Button
        variant="contained"
        startIcon={<VaporIcon icon={faPlus} />}
        onClick={onAdd}
      >
        {config.addButtonLabel || t('common.add')}
      </Button>
    )}
  </Box>
);

// Componente per l'header dettagliato
const DetailedHeader: React.FC<HeaderProps> = ({ config, onAdd, t }) => (
  <Box sx={{ p: 3, mb: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
          {config.title}
        </Typography>
        {config.description && (
          <Typography variant="body2" color="text.secondary">
            {config.description}
          </Typography>
        )}
      </Box>
      
      {onAdd && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<VaporIcon icon={faPlus} />}
          onClick={onAdd}
          size="small"
        >
          {config.addButtonLabel || t('common.add')}
        </Button>
      )}
    </Box>
  </Box>
);

interface GenericDataGridProps<T extends BaseEntity, F extends BaseFilters> {
  items: T[];
  config: DataGridConfig<T>;
  currentFilters: F;
  onFiltersChange: (filters: F) => void;
  onAdd?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * DataGrid generico riutilizzabile per qualsiasi entità
 */
export function GenericDataGrid<T extends BaseEntity, F extends BaseFilters>({
  items,
  config,
  currentFilters,
  onFiltersChange,
  onAdd,
  isLoading = false,
  error = null
}: GenericDataGridProps<T, F>) {
  const { t } = useTranslation();

  // State per i filtri temporanei
  const [tempFilters, setTempFilters] = useState<F>(currentFilters);

  // Sincronizza filtri temporanei quando cambiano quelli esterni
  useEffect(() => {
    setTempFilters(currentFilters);
  }, [currentFilters]);

  // Rendering dei filtri
  const renderFilters = () => {
    return config.filters.map((filterConfig) => {
      const key = filterConfig.field;
      const currentValue = tempFilters[key as keyof F] || filterConfig.defaultValue || '';

      switch (filterConfig.type) {
        case 'search':
          return (
            <TextField
              key={key}
              label={filterConfig.label}
              placeholder={filterConfig.placeholder}
              value={currentValue}
              onChange={(e) => setTempFilters(prev => ({
                ...prev,
                [key]: e.target.value
              } as F))}
              size="small"
              sx={{ minWidth: 200 }}
            />
          );
        
        case 'select':
          return (
            <FormControl key={key} size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{filterConfig.label}</InputLabel>
              <Select
                value={currentValue}
                label={filterConfig.label}
                onChange={(e: SelectChangeEvent<unknown>) => setTempFilters(prev => ({
                  ...prev,
                  [key]: e.target.value as string
                } as F))}
              >
                <MenuItem value="All">{t('common.all')}</MenuItem>
                {filterConfig.options?.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        
        case 'number':
          return (
            <TextField
              key={key}
              label={filterConfig.label}
              type="number"
              value={currentValue}
              onChange={(e) => setTempFilters(prev => ({
                ...prev,
                [key]: e.target.value
              } as F))}
              size="small"
              sx={{ minWidth: 150 }}
            />
          );
        
        default:
          return null;
      }
    });
  };

  // Rendering delle azioni per ogni riga
  const renderActions = (item: T) => {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {config.actions
          .filter(action => !action.visible || action.visible(item))
          .map(action => (
            <IconButton
              key={action.key}
              size="small"
              color={action.color || 'primary'}
              onClick={() => action.onClick(item)}
              disabled={action.disabled ? action.disabled(item) : false}
              title={action.label}
            >
              {action.icon && <VaporIcon icon={action.icon} size="s" />}
            </IconButton>
          ))
        }
      </Box>
    );
  };

  // Converti configurazione colonne in formato DataGrid
  const columns: GridColDef[] = [
    ...config.columns.map(col => ({
      field: col.field as string,
      headerName: col.headerName,
      width: col.width || 150,
      sortable: col.sortable !== false,
      renderCell: col.renderCell ? (params: any) => col.renderCell!(params.value, params.row) : undefined
    })),
    // Colonna azioni sempre presente se ci sono azioni
    ...(config.actions.length > 0 ? [{
      field: 'actions',
      headerName: t('common.actions'),
      width: config.actions.length * 40 + 20,
      sortable: false,
      renderCell: (params: any) => renderActions(params.row)
    }] : [])
  ];

  // Gestione applicazione filtri
  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
  };

  // Gestione reset filtri
  const handleResetFilters = () => {
    const resetFilters = {} as F;
    config.filters.forEach(filterConfig => {
      (resetFilters as any)[filterConfig.field] = filterConfig.defaultValue || '';
    });
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // Rendering errore
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header configurabile */}
      {config.showHeader && config.headerLayout === 'detailed' && (
        <DetailedHeader config={config} onAdd={onAdd} t={t} />
      )}
      
      {config.showHeader && config.headerLayout === 'simple' && (
        <SimpleHeader config={config} onAdd={onAdd} t={t} />
      )}

      {/* Sezione filtri */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          mb: 2
        }}>
          {renderFilters()}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleApplyFilters}
          >
            {t('common.apply')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleResetFilters}
          >
            {t('common.reset')}
          </Button>
        </Box>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { 
              paginationModel: { 
                pageSize: config.pageSize || 10 
              } 
            }
          }}
          localeText={getDataGridLocaleText(t)}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        />
      </Box>

      {/* Messaggio quando vuoto */}
      {!isLoading && items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {config.emptyMessage || t('common.noData')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}