// src/components/GenericDataGrid.tsx
import { useState, useEffect, useCallback } from 'react';
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

// Custom hook per debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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
  
  // Separazione dei filtri search dagli altri per debounce
  const [searchFilters, setSearchFilters] = useState<Partial<F>>({});
  const [otherFilters, setOtherFilters] = useState<Partial<F>>({});

  // Debounce per i filtri di ricerca (300ms)
  const debouncedSearchFilters = useDebounce(searchFilters, 300);

  // Sincronizza filtri temporanei quando cambiano quelli esterni
  useEffect(() => {
    setTempFilters(currentFilters);
    
    // Separa i filtri search dagli altri
    const searchFields = config.filters.filter(f => f.type === 'search').map(f => f.field);
    const newSearchFilters: Partial<F> = {};
    const newOtherFilters: Partial<F> = {};
    
    Object.keys(currentFilters).forEach(key => {
      if (searchFields.includes(key)) {
        (newSearchFilters as any)[key] = currentFilters[key as keyof F];
      } else {
        (newOtherFilters as any)[key] = currentFilters[key as keyof F];
      }
    });
    
    setSearchFilters(newSearchFilters);
    setOtherFilters(newOtherFilters);
  }, [currentFilters, config.filters]);

  // Applicazione automatica dei filtri di ricerca (debounced)
  useEffect(() => {
    // Combina filtri search debounced con altri filtri per l'applicazione
    const combinedFilters = { ...otherFilters, ...debouncedSearchFilters } as F;
    
    // Controlla se i filtri sono effettivamente cambiati per evitare cicli infiniti
    const filtersChanged = Object.keys(combinedFilters).some(key => 
      combinedFilters[key as keyof F] !== currentFilters[key as keyof F]
    );
    
    if (filtersChanged) {
      onFiltersChange(combinedFilters);
    }
  }, [debouncedSearchFilters, otherFilters]);

  // Handler per filtri di ricerca
  const handleSearchFilterChange = useCallback((field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    } as Partial<F>));
    
    // Aggiorna anche tempFilters per la UI
    setTempFilters(prev => ({
      ...prev,
      [field]: value
    } as F));
  }, []);

  // Handler per filtri select/number (applicazione immediata)
  const handleOtherFilterChange = useCallback((field: string, value: string) => {
    const newOtherFilters = {
      ...otherFilters,
      [field]: value
    } as Partial<F>;
    
    setOtherFilters(newOtherFilters);
    
    // Aggiorna tempFilters per la UI
    setTempFilters(prev => ({
      ...prev,
      [field]: value
    } as F));
    
    // Applica immediatamente combinando con search filters attuali (solo se diverso)
    const combinedFilters = { ...newOtherFilters, ...searchFilters } as F;
    if (combinedFilters[field as keyof F] !== currentFilters[field as keyof F]) {
      onFiltersChange(combinedFilters);
    }
  }, [otherFilters, searchFilters, currentFilters]);

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
              onChange={(e) => handleSearchFilterChange(key, e.target.value)}
              size="small"
              sx={{ width: 'auto', minWidth: 300 }}
            />
          );
        
        case 'select':
          return (
            <FormControl key={key} size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{filterConfig.label}</InputLabel>
              <Select
                value={currentValue}
                label={filterConfig.label}
                onChange={(e: SelectChangeEvent<unknown>) => 
                  handleOtherFilterChange(key, e.target.value as string)
                }
              >
                <MenuItem value="all">{t('common.dataGrid.all')}</MenuItem>
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
              onChange={(e) => handleOtherFilterChange(key, e.target.value)}
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
      <Box sx={{ display: 'flex', gap: 0.5, py: 1 }}>
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
      // width: col.width || 150,
      flex: col.flex || 1,
      sortable: col.sortable !== false,
      renderCell: col.renderCell ? (params: any) => col.renderCell!(params.value, params.row) : undefined
    })),
    // Colonna azioni sempre presente se ci sono azioni
    ...(config.actions.length > 0 ? [{
      field: 'actions',
      headerName: t('common.dataGrid.actions'),
      width: config.actions.length * 40 + 20,
      sortable: false,
      renderCell: (params: any) => renderActions(params.row)
    }] : [])
  ];

  // Gestione reset filtri
  const handleResetFilters = () => {
    const resetFilters = {} as F;
    config.filters.forEach(filterConfig => {
      (resetFilters as any)[filterConfig.field] = filterConfig.defaultValue || '';
    });
    
    // Reset di tutti gli stati
    setTempFilters(resetFilters);
    setSearchFilters({});
    setOtherFilters({});
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
      {/* Header semplice opzionale */}
      {config.showHeader && (
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h1">
              {t(config.title)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(config.description)}
            </Typography>
          </Box>
          {onAdd && (
            <Button
              disabled={isLoading}
              variant="contained"
              startIcon={<VaporIcon icon={faPlus} />}
              onClick={onAdd}
              size='small'
            >
              {t(config.addButtonLabel || 'common.dataGrid.addButtonLabel')}
            </Button>
          )}
        </Box>
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
          alignItems: 'flex-end', 
          flexWrap: 'wrap'
        }}>
          {renderFilters()}
          <Box sx={{ display: 'flex', gap: 1, borderLeft: '1px solid', borderColor: 'divider', pl: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleResetFilters}
            >
              {t('common.dataGrid.resetFilters')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* DataGrid */}
      <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '700px',
          // maxHeight: '80vh' // Limit height to 80% of viewport
          }}>
        <DataGrid
          getRowId={config.getRowId}
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
            },
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