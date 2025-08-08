// src/components/GenericDataGrid.tsx - VERSIONE SISTEMATA
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
import type { BaseEntity, BaseFilters, PaginationInfo } from '../types/generic';
import { CustomPagination } from './CustomPagination';

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
  
  // No rows
  noRowsLabel: t("components.dataGrid.noRows"),
  noResultsOverlayLabel: t("components.dataGrid.noResults"),
  
  // Error
  errorOverlayDefaultLabel: t("components.dataGrid.error"),
  
  // Loading
  loadingOverlayLabel: t("components.dataGrid.loading"),
});

// Props del componente con supporto paginazione
interface GenericDataGridProps<T extends BaseEntity, F extends BaseFilters> {
  items: T[];
  config: DataGridConfig<T>;
  currentFilters: F;
  onFiltersChange: (filters: F) => void;
  onAdd?: () => void;
  isLoading?: boolean;
  error?: Error | null;
  
  // Props per paginazione server-side
  pagination?: PaginationInfo;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

/**
 * DataGrid generico con supporto paginazione custom con pulsanti numerici
 */
export function GenericDataGrid<T extends BaseEntity, F extends BaseFilters>({
  items,
  config,
  currentFilters,
  onFiltersChange,
  onAdd,
  isLoading = false,
  error = null,
  pagination,
  onPaginationChange
}: GenericDataGridProps<T, F>) {
  const { t } = useTranslation();

  // State per i filtri temporanei
  const [tempFilters, setTempFilters] = useState<F>(currentFilters);
  const [hasPendingSearchFilters, setHasPendingSearchFilters] = useState<boolean>(false);

  // Sincronizza filtri temporanei quando cambiano quelli esterni
  useEffect(() => {
    setTempFilters(currentFilters);
    setHasPendingSearchFilters(false);
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

    const filterConfig = config.filters.find(f => f.field === field);
    if (filterConfig?.type === 'select') {
      // I filtri select si applicano immediatamente e resettano la paginazione
      const filtersWithResetPage = { ...newTempFilters, page: 1 } as F;
      onFiltersChange(filtersWithResetPage);
    } else {
      checkPendingSearchFilters(newTempFilters);
    }
  }, [tempFilters, config.filters, onFiltersChange, checkPendingSearchFilters]);

  // Applica filtri search/number
  const handleApplySearchFilters = () => {
    // Quando applico filtri di ricerca, reset della paginazione
    const filtersWithResetPage = { ...tempFilters, page: 1 } as F;
    onFiltersChange(filtersWithResetPage);
    setHasPendingSearchFilters(false);
  };

  // Reset filtri
  const handleResetFilters = () => {
    const resetFilters = {} as F;
    config.filters.forEach(filterConfig => {
      (resetFilters as any)[filterConfig.field] = filterConfig.defaultValue || '';
    });
    
    // Mantieni page e limit attuali durante il reset
    (resetFilters as any).page = 1;
    (resetFilters as any).limit = currentFilters.limit || 10;
    
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplySearchFilters();
                }
              }}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplySearchFilters();
                }
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
              }}
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
      flex: col.flex || 1,
      sortable: col.sortable !== false,
      renderCell: col.renderCell ? (params: any) => col.renderCell!(params.value, params.row) : undefined
    })),
    ...(config.actions.length > 0 ? [{
      field: 'actions',
      headerName: t('common.dataGrid.actions'),
      width: config.actions.length * 40 + 20,
      sortable: false,
      renderCell: (params: any) => renderActions(params.row)
    }] : [])
  ];

  // Determina se stiamo usando paginazione server-side
  const isServerPagination = config.paginationMode === 'server' && !!pagination;

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
      {/* Header */}
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

      {/* Container per DataGrid + Paginazione Custom */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}>
        {/* DataGrid - con o senza paginazione interna */}
        <DataGrid
          getRowId={config.getRowId}
          rows={items}
          columns={columns}
          loading={isLoading}
          
          // ✨ SE paginazione server-side, disabilitiamo quella del DataGrid
          hideFooter={isServerPagination}
          
          // ✨ SE paginazione client-side, usiamo quella del DataGrid standard
          {...(!isServerPagination && {
            initialState: {
              pagination: { 
                paginationModel: { 
                  pageSize: config.pageSize || 10 
                } 
              }
            },
            pageSizeOptions: config.pageSizeOptions || [10, 25, 50, 100]
          })}
          
          localeText={getDataGridLocaleText(t)}
          disableRowSelectionOnClick
          sx={{
            border: 'none', // Rimuoviamo il border del DataGrid
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
            // Assicuriamoci che il DataGrid occupi tutto lo spazio disponibile
            flex: 1,
            minHeight: isServerPagination ? 400 : 700
          }}
        />

        {/* ✨ CUSTOM PAGINATION per server-side con pulsanti numerici */}
        {isServerPagination && onPaginationChange && (
          <CustomPagination
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            pageSizeOptions={config.pageSizeOptions || [10, 25, 50, 100]}
            disabled={isLoading}
          />
        )}
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