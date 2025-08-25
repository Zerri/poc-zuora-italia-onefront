// src/components/GenericDataGrid.tsx - CON SUPPORTO SELEZIONE MULTIPLA
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
} from "@vapor/v3-components";
import { DataGrid, GridColDef, GridSortModel, GridRowSelectionModel } from '@mui/x-data-grid';
import type { SelectChangeEvent } from '@mui/material/Select';
import { VaporIcon } from "@vapor/v3-components";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faSearch } from "@fortawesome/pro-regular-svg-icons/faSearch";
import { useTranslation } from '@1f/react-sdk';
import type { DataGridConfig } from '../types/grid';
import type { BaseEntity, BaseFilters, PaginationInfo, SortInfo } from '../types/generic';
import { CustomPagination } from './CustomPagination';
import { ActionsMenu } from './ActionsMenu';
import { BulkActionsMenu } from './BulkActionsMenu';

// Helper per localizzazione DataGrid
const getDataGridLocaleText = (t: any) => ({
  toolbarDensity: t("components.dataGrid.toolbar.density"),
  toolbarDensityLabel: t("components.dataGrid.toolbar.densityLabel"),
  toolbarDensityCompact: t("components.dataGrid.toolbar.densityCompact"),
  toolbarDensityStandard: t("components.dataGrid.toolbar.densityStandard"),
  toolbarDensityComfortable: t("components.dataGrid.toolbar.densityComfortable"),
  columnMenuLabel: t("components.dataGrid.columnMenu.label"),
  columnMenuShowColumns: t("components.dataGrid.columnMenu.showColumns"),
  columnMenuFilter: t("components.dataGrid.columnMenu.filter"),
  columnMenuHideColumn: t("components.dataGrid.columnMenu.hideColumn"),
  columnMenuUnsort: t("components.dataGrid.columnMenu.unsort"),
  columnMenuSortAsc: t("components.dataGrid.columnMenu.sortAsc"),
  columnMenuSortDesc: t("components.dataGrid.columnMenu.sortDesc"),
  footerRowSelected: (count: number) =>
    count !== 1
      ? t("components.dataGrid.footer.rowCounterText", { count })
      : t("components.dataGrid.footer.rowCounterTextSingular", { count }),
  footerTotalRows: t("components.dataGrid.footer.totalRows"),
  noRowsLabel: t("components.dataGrid.noRows"),
  noResultsOverlayLabel: t("components.dataGrid.noResults"),
  errorOverlayDefaultLabel: t("components.dataGrid.error"),
  loadingOverlayLabel: t("components.dataGrid.loading"),
});

// Props aggiornate con supporto selezione multipla
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
  
  // Props per sorting server-side
  onSortChange?: (sortInfo: SortInfo) => void;
}

/**
 * DataGrid generico con supporto sorting server-side e selezione multipla
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
  onPaginationChange,
  onSortChange
}: GenericDataGridProps<T, F>) {
  const { t } = useTranslation();

  // State per i filtri temporanei
  const [tempFilters, setTempFilters] = useState<F>(currentFilters);
  const [hasPendingSearchFilters, setHasPendingSearchFilters] = useState<boolean>(false);
  
  // ✨ NUOVO: State per selezione multipla
  const [selectedItems, setSelectedItems] = useState<GridRowSelectionModel>([]);
  const [selectedItemsData, setSelectedItemsData] = useState<T[]>([]);

  // Sincronizza filtri temporanei quando cambiano quelli esterni
  useEffect(() => {
    setTempFilters(currentFilters);
    setHasPendingSearchFilters(false);
  }, [currentFilters]);

  // ✨ NUOVO: Reset selezioni quando cambiano filtri o paginazione
  useEffect(() => {
    setSelectedItems([]);
    setSelectedItemsData([]);
  }, [currentFilters.page, currentFilters.searchTerm, currentFilters.sortBy, currentFilters.sortOrder]);

  // ✨ NUOVO: Aggiorna selectedItemsData quando cambia selectedItems o items
  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectedItemsData([]);
      return;
    }

    const getRowId = config.getRowId || ((row: T) => row.id);
    const selectedData = items.filter(item => 
      selectedItems.includes(getRowId(item))
    );
    setSelectedItemsData(selectedData);
  }, [selectedItems, items, config.getRowId]);

  // Determina modalità sorting
  const isServerSorting = config.sortingMode === 'server' && !!onSortChange;
  const isServerPagination = config.paginationMode === 'server' && !!pagination;
  
  // ✨ NUOVO: Determina se la selezione multipla è abilitata
  const isMultiSelectEnabled = config.enableMultiSelect === true;

  // Costruisci sortModel corrente per MUI DataGrid
  const currentSortModel: GridSortModel = (() => {
    if (currentFilters.sortBy) {
      return [{
        field: currentFilters.sortBy,
        sort: currentFilters.sortOrder === 'desc' ? 'desc' : 'asc'
      }];
    }
    return [];
  })();

  // Handler per eventi di sorting dal DataGrid
  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (!isServerSorting || !onSortChange) return;

    if (sortModel.length === 0) {
      onSortChange({
        field: '',
        direction: 'asc'
      });
      return;
    }

    const sort = sortModel[0];
    const sortInfo: SortInfo = {
      field: sort.field,
      direction: sort.sort === 'desc' ? 'desc' : 'asc'
    };

    onSortChange(sortInfo);
  }, [isServerSorting, onSortChange]);

  // ✨ NUOVO: Handler per cambio selezione
  const handleSelectionModelChange = useCallback((newSelection: GridRowSelectionModel) => {
    setSelectedItems(newSelection);
  }, []);

  // Handler per modifiche filtri
  const handleFilterChange = (field: string, value: any) => {
    const updatedFilters = { ...tempFilters, [field]: value } as F;
    setTempFilters(updatedFilters);

    // Se non è un filtro di ricerca, applica subito
    const filterConfig = config.filters.find(f => f.field === field);
    if (!filterConfig || filterConfig.type !== 'search') {
      onFiltersChange(updatedFilters);
      setHasPendingSearchFilters(false);
    } else {
      setHasPendingSearchFilters(true);
    }
  };

  // Applica filtri di ricerca
  const handleApplySearchFilters = () => {
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

  // Costruzione colonne con azioni
  const columns: GridColDef[] = [
    ...config.columns.map(col => ({
      field: col.field as string,
      headerName: col.headerName,
      flex: col.flex,
      width: col.width,
      sortable: col.sortable !== false,
      renderCell: col.renderCell ? (params: any) => col.renderCell!(params.value, params.row) : undefined
    })),
    ...(config.actions.length > 0 ? [{
      field: 'actions',
      headerName: 'Opzioni',
      width: 100,
      sortable: false,
      renderCell: (params: any) => (
        <ActionsMenu
          item={params.row}
          actions={config.actions}
        />
      )
    }] : [])
  ];

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
          
          {/* Bottoni azioni */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            
            {/* Bottone Aggiungi */}
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

            {isMultiSelectEnabled && config.bulkActions && config.bulkActions.length > 0 && (
              <BulkActionsMenu
                selectedItems={selectedItemsData}
                bulkActions={config.bulkActions}
              />
            )}
          </Box>
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
        {/* DataGrid */}
        <DataGrid
          getRowId={config.getRowId}
          rows={items}
          columns={columns}
          loading={isLoading}
          
          // ✨ NUOVO: Configurazione selezione multipla
          checkboxSelection={isMultiSelectEnabled}
          rowSelectionModel={selectedItems}
          onRowSelectionModelChange={handleSelectionModelChange}
          disableRowSelectionOnClick={isMultiSelectEnabled}
          
          hideFooter={isServerPagination}
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
          
          sortingMode={isServerSorting ? 'server' : 'client'}
          sortModel={currentSortModel}
          onSortModelChange={handleSortModelChange}
          
          disableColumnSelector={false}
          
          localeText={getDataGridLocaleText(t)}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
            flex: 1,
            minHeight: isServerPagination ? 400 : 'auto',
            '& .MuiDataGrid-columnHeader': {
              cursor: isServerSorting ? 'pointer' : 'default',
            },
          }}
        />
        
        {/* Paginazione Custom per Server-side */}
        {isServerPagination && pagination && onPaginationChange && (
          <CustomPagination
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            pageSizeOptions={config.pageSizeOptions || [10, 25, 50, 100]}
            disabled={isLoading}
          />
        )}
      </Box>
    </Box>
  );
}