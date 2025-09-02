// src/components/EntityManagementPage.tsx
import React, { useState } from 'react';
import {
  VaporThemeProvider,
  VaporPage,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
} from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';

import type { CRUDItem, CRUDConfig } from '../hooks/useGenericCRUD';
import type { BaseFilters } from '../types/generic';
import { useGenericCRUD } from '../hooks/useGenericCRUD';
import { GenericDataGrid } from './GenericDataGrid';
import { useDataGridHandlers } from '../hooks/useDataGridHandlers';
import type { DataGridConfig } from '../types/grid';

export interface EntityManagementConfig<TEntity extends CRUDItem, TFilters extends BaseFilters, TMutationData> {
  /** Chiave per identificare l'entità (es. 'users', 'quotes', 'customers') */
  entityKey: string;
  
  
  /** Configurazione CRUD (endpoints, permessi, ecc.) */
  crudConfig: CRUDConfig;
  
  /** Filtri iniziali */
  initialFilters: TFilters;
  
  /** Configurazione della griglia */
  getGridConfig: (
    handleEdit: (item: TEntity) => void,
    handleDelete?: (item: TEntity) => void,
    handleBulkExport?: (items: TEntity[]) => void,
    handleBulkDeactivate?: (items: TEntity[]) => void,
    handleBulkDelete?: (items: TEntity[]) => void
  ) => DataGridConfig<TEntity>;
  
  /** Componente drawer per creazione/modifica */
  DrawerComponent: React.ComponentType<{
    open: boolean;
    onClose: () => void;
    item: TEntity | null;
    isEditing: boolean;
    onSave: (data: TMutationData) => Promise<void>;
    isSaving: boolean;
  }>;
  
  /** Chiave principale per le traduzioni (es. "features.userManagement") */
  translationKey: string;
  
  /** Handlers personalizzati (opzionali) */
  customHandlers?: {
    onToggleStatus?: (item: TEntity, updateItem: any) => Promise<void>;
    onDelete?: (item: TEntity, deleteItem: any) => Promise<void>;
    onBulkExport?: (items: TEntity[]) => void;
    onBulkDeactivate?: (items: TEntity[]) => void;
    onBulkDelete?: (items: TEntity[]) => void;
    prepareMutationData?: {
      create: (data: TMutationData) => any;
      update: (data: TMutationData, item: TEntity) => any;
    };
  };
}

interface EntityManagementPageProps<TEntity extends CRUDItem, TFilters extends BaseFilters, TMutationData> {
  config: EntityManagementConfig<TEntity, TFilters, TMutationData>;
}

export function EntityManagementPage<
  TEntity extends CRUDItem, 
  TFilters extends BaseFilters, 
  TMutationData
>({ config }: EntityManagementPageProps<TEntity, TFilters, TMutationData>) {
  const { t } = useTranslation();
  
  // State per filtri
  const [filters, setFilters] = useState<TFilters>(config.initialFilters);
  
  // Hook centralizzato per handlers comuni
  const {
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    handlePaginationChange,
    handleFiltersChange,
    handleSortChange
  } = useDataGridHandlers(filters, setFilters);
  
  // State specifici per entity management
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TEntity | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Hook CRUD generico
  const {
    items,
    pagination,
    sorting,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    isCreating,
    isUpdating
  } = useGenericCRUD<TEntity>(config.entityKey, config.crudConfig, filters);

  console.log(`${config.entityKey} Management Page - Items:`, items);
  console.log(`${config.entityKey} Management Page - Pagination:`, pagination);
  console.log(`🔍 ${config.entityKey} Management Page - Sorting:`, sorting);

  // Handlers specifici per entity management
  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setDrawerOpen(true);
  };

  const handleEdit = (item: TEntity) => {
    setSelectedItem(item);
    setIsEditing(true);
    setDrawerOpen(true);
  };

  const handleDelete = async (item: TEntity) => {
    if (!window.confirm(t(`${config.translationKey}.confirmDelete`))) return;
    
    try {
      if (config.customHandlers?.onDelete) {
        await config.customHandlers.onDelete(item, deleteItem);
      } else {
        await deleteItem.mutateAsync(String(item._id));
      }
      showSnackbar(t(`${config.translationKey}.success.deleted`), 'success');
    } catch (error) {
      showSnackbar(t(`${config.translationKey}.errors.delete`), 'error');
    }
  };

  // Handlers per bulk actions
  const handleBulkExport = (selectedItems: TEntity[]) => {
    if (config.customHandlers?.onBulkExport) {
      config.customHandlers.onBulkExport(selectedItems);
    } else {
      const itemInfo = selectedItems.length > 0 
        ? `${selectedItems.length} elementi selezionati`
        : 'Export di tutti gli elementi disponibili';
      
      alert(`🔄 BULK ACTION: Export\n\n${itemInfo}\n\nIn futuro: sarà generato un file CSV/Excel`);
      showSnackbar('Export completato con successo', 'success');
    }
  };

  const handleBulkDeactivate = (selectedItems: TEntity[]) => {
    if (config.customHandlers?.onBulkDeactivate) {
      config.customHandlers.onBulkDeactivate(selectedItems);
    } else {
      alert(`⚠️ BULK ACTION: Disattivazione\n\n${selectedItems.length} elementi selezionati\n\nIn futuro: API call per disattivare in batch`);
      showSnackbar(`${selectedItems.length} elementi disattivati`, 'success');
    }
  };

  const handleBulkDelete = (selectedItems: TEntity[]) => {
    if (config.customHandlers?.onBulkDelete) {
      config.customHandlers.onBulkDelete(selectedItems);
    } else {
      alert(`🗑️ BULK ACTION: Eliminazione\n\n${selectedItems.length} elementi selezionati\n\nIn futuro: API call per eliminare in batch`);
      showSnackbar(`${selectedItems.length} elementi eliminati`, 'success');
    }
  };

  const handleSaveItem = async (itemData: TMutationData) => {
    try {
      if (isEditing && selectedItem) {
        const mutationData = config.customHandlers?.prepareMutationData?.update
          ? config.customHandlers.prepareMutationData.update(itemData, selectedItem)
          : { ...itemData, id: selectedItem._id };
        
        await updateItem.mutateAsync(mutationData);
        showSnackbar(t(`${config.translationKey}.success.updated`), 'success');
      } else {
        const mutationData = config.customHandlers?.prepareMutationData?.create
          ? config.customHandlers.prepareMutationData.create(itemData)
          : { ...itemData };
        
        await createItem.mutateAsync(mutationData);
        showSnackbar(t(`${config.translationKey}.success.created`), 'success');
      }
      setDrawerOpen(false);
      setSelectedItem(null);
      setIsEditing(false);
    } catch (error) {
      showSnackbar(
        isEditing 
          ? t(`${config.translationKey}.errors.update`)
          : t(`${config.translationKey}.errors.create`),
        'error'
      );
    }
  };

  return (
    <VaporThemeProvider>
      <VaporPage title={t(`${config.translationKey}.title`)}>
        <VaporPage.Section>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <GenericDataGrid
                items={items}
                config={config.getGridConfig(
                  handleEdit, 
                  handleDelete,
                  handleBulkExport,
                  handleBulkDeactivate,
                  handleBulkDelete
                )}
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
                onAdd={handleAdd}
                isLoading={isLoading}
                error={error}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onSortChange={handleSortChange}
              />

              {/* Debug info sorting (solo in development) */}
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'info.main', 
                  color: 'info.contrastText',
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}>
                  🔍 <strong>Debug Sorting ({config.entityKey}):</strong> 
                  <br />📄 <strong>Filtri:</strong> sortBy={filters.sortBy}, sortOrder={filters.sortOrder}
                  {sorting && (
                    <>
                      <br />🔙 <strong>Server Response:</strong> sortBy={sorting.sortBy}, sortOrder={sorting.sortOrder}
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}
        </VaporPage.Section>
      </VaporPage>

      {/* Entity Drawer */}
      <config.DrawerComponent
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
          setIsEditing(false);
        }}
        item={selectedItem}
        isEditing={isEditing}
        onSave={handleSaveItem}
        isSaving={isCreating || isUpdating}
      />

      {/* Snackbar centralizzato */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </VaporThemeProvider>
  );
}