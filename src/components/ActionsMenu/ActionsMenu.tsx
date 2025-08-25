// src/components/ActionsMenu/ActionsMenu.tsx
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  VaporIcon,
  Box,
} from '@vapor/v3-components';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons/faEllipsisH';
import type { ActionConfig } from '../../types/grid';

interface ActionsMenuProps<T = any> {
  item: T;
  actions: ActionConfig<T>[];
  buttonLabel?: string;
  buttonIcon?: any;
  size?: 'small' | 'medium' | 'large';
}

export const ActionsMenu = <T,>({
  item,
  actions,
  buttonLabel = 'Opzioni',
  buttonIcon = faEllipsisH,
  size = 'small'
}: ActionsMenuProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: ActionConfig<T>, event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
    action.onClick(item);
  };

  // Filtra le azioni visibili
  const visibleActions = actions.filter(action => 
    !action.visible || action.visible(item)
  );

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'left', py: 1 }}>
      <IconButton
        size={size}
        onClick={handleClick}
        title={buttonLabel}
        aria-controls={open ? 'actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <VaporIcon icon={buttonIcon} size="s" />
      </IconButton>
      
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 200,
              mt: 0.5,
            },
          },
        }}
      >
        {visibleActions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={(e) => handleMenuItemClick(action, e)}
            disabled={action.disabled ? action.disabled(item) : false}
            sx={{
              color: action.color === 'error' ? 'error.main' : 'inherit',
            }}
          >
            {action.icon && (
              <ListItemIcon>
                <VaporIcon 
                  icon={action.icon} 
                  size="s" 
                  color={action.color === 'error' ? 'error' : undefined}
                />
              </ListItemIcon>
            )}
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};