// src/components/BulkActionsMenu.tsx
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Badge
} from "@vapor/v3-components";
import { VaporIcon } from "@vapor/v3-components";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import type { BulkActionConfig } from '../../types/grid';
import type { BaseEntity } from '../../types/generic';

interface BulkActionsMenuProps<T extends BaseEntity> {
  selectedItems: T[];
  bulkActions: BulkActionConfig<T>[];
}

/**
 * Menu dropdown per azioni bulk con bottone tre puntini verticali
 */
export function BulkActionsMenu<T extends BaseEntity>({ 
  selectedItems, 
  bulkActions 
}: BulkActionsMenuProps<T>) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: BulkActionConfig<T>) => {
    // Conferma opzionale
    if (action.confirmMessage) {
      if (!window.confirm(action.confirmMessage)) {
        handleClose();
        return;
      }
    }

    // Esegui azione
    action.onClick(selectedItems);
    handleClose();
  };

  // Separa azioni sempre attive da quelle che richiedono selezione
  const alwaysActiveActions = bulkActions.filter(action => !action.requiresSelection);
  const selectionRequiredActions = bulkActions.filter(action => action.requiresSelection);
  
  const selectedCount = selectedItems.length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-label="Bulk actions"
        variant="outlined"
      >
        <Badge 
          badgeContent={selectedCount > 0 ? selectedCount : undefined}
          color="primary"
          max={99}
        >
          <VaporIcon icon={faEllipsisVertical} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            minWidth: 200,
            mt: 1
          }
        }}
      >
        {/* Header con conteggio selezioni */}
        {selectedCount > 0 && (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {selectedCount} elemento{selectedCount !== 1 ? 'i' : ''} selezionat{selectedCount !== 1 ? 'i' : 'o'}
              </Typography>
            </Box>
            <Divider />
          </>
        )}

        {/* Azioni sempre attive */}
        {alwaysActiveActions.map((action) => {
          const isDisabled = action.disabled ? action.disabled(selectedItems) : false;
          
          return (
            <MenuItem
              key={action.key}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled}
            >
              {action.icon && (
                <ListItemIcon>
                  <VaporIcon 
                    icon={action.icon}
                  />
                </ListItemIcon>
              )}
              <ListItemText primary={action.label} />
            </MenuItem>
          );
        })}

        {/* Divider tra azioni sempre attive e condizionali */}
        {alwaysActiveActions.length > 0 && selectionRequiredActions.length > 0 && (
          <Divider />
        )}

        {/* Azioni che richiedono selezione */}
        {selectionRequiredActions.map((action) => {
          const isDisabled = selectedCount === 0 || 
            (action.disabled ? action.disabled(selectedItems) : false);
          
          return (
            <MenuItem
              key={action.key}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled}
            >
              {action.icon && (
                <ListItemIcon>
                  <VaporIcon 
                    icon={action.icon}
                  />
                </ListItemIcon>
              )}
              <ListItemText 
                primary={action.label}
                secondary={isDisabled && selectedCount === 0 ? 'Seleziona almeno un elemento' : undefined}
              />
            </MenuItem>
          );
        })}

        {/* Messaggio se nessuna azione disponibile */}
        {bulkActions.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="Nessuna azione disponibile" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}