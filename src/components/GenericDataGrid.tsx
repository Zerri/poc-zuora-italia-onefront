// src/components/GenericDataGrid.tsx - VERSIONE SEMPLIFICATA
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
import { faSearch } from "@fortawesome/pro-regular-svg-icons/faSearch";
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
 * DataGrid generico riutilizzabile per qualsiasi entità - VERSIONE SEMPLIFICATA
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

  // State per i filtri temporanei (unico state necessario!)
  const [tempFilters, setTempFilters] = useState<F>(currentFilters);

  // Flag per sapere se ci sono filtri search/number da applicare
  const [hasPendingSearchFilters, setHasPendingSearchFilters] = useState<boolean>(false);

  // Sincronizza filtri temporanei quando cambiano quelli esterni
  useEffect(() => {
    setTempFilters(currentFilters);
    setHasPendingSearchFilters(false); // Reset del flag quando i filtri vengono applicati
  }, [currentFilters]);

  // Controlla se ci sono differenze nei filtri search/number
  const checkPendingSearchFilters = useCallback((newTempFilters: F) => {
    const searchFields = config.filters
      .filter(f => f.type === 'search' || f.type === 'number')
      .map(f => f.field);
    
    const hasDifferences = searchFields.some(field => 
      newTempFilters[field as keyof F] !== currentFilters[field as keyof F]
    );
    
    setHasPendingSearchFilters(hasDifferences);
    return hasDifferences;
  }, [config.filters, currentFilters]);

  // Handler unificato per tutti i filtri
  const handleFilterChange = useCallback((field: string, value: string) => {
    const newTempFilters = {
      ...tempFilters,
      [field]: value
    } as F;
    
    setTempFilters(newTempFilters);

    // Per filtri select: applicazione immediata
    const filterConfig = config.filters.find(f => f.field === field);
    if (filterConfig?.type === 'select') {
      onFiltersChange(newTempFilters);
    } else {
      // Per search/number: solo aggiorna il flag
      checkPendingSearchFilters(newTempFilters);
    }
  }, [tempFilters, config.filters, onFiltersChange, checkPendingSearchFilters]);

  // Applica filtri search/number
  const handleApplySearchFilters = () => {
    onFiltersChange(tempFilters);
    setHasPendingSearchFilters(false);
  };

  // Reset filtri (semplificato!)
  const handleResetFilters = () => {
    const resetFilters = {} as F;
    config.filters.forEach(filterConfig => {
      (resetFilters as any)[filterConfig.field] = filterConfig.defaultValue || '';
    });
    
    setTempFilters(resetFilters);
    setHasPendingSearchFilters(false);
    onFiltersChange(resetFilters);
  };

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
              onChange={(e) => handleFilterChange(key, e.target.value)}
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
                  handleFilterChange(key, e.target.value as string)
                }
              >
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
              onChange={(e) => handleFilterChange(key, e.target.value)}
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

      {/* Sezione filtri con bottoni di controllo */}
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
          
          {/* Bottoni di controllo */}
          <Box sx={{ display: 'flex', gap: 1, borderLeft: '1px solid', borderColor: 'divider', pl: 2 }}>
            {/* Bottone Applica (appare solo se ci sono filtri search/number pending) */}
            {hasPendingSearchFilters && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<VaporIcon icon={faSearch} />}
                onClick={handleApplySearchFilters}
              >
                {t('common.dataGrid.applyFilters')}
              </Button>
            )}
            
            {/* Bottone Reset */}
            <Button
              variant="outlined"
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