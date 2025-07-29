// src/features/user-management/components/UserDataGrid.tsx
import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  Box,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Tooltip,
  VaporIcon,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@vapor/v3-components";
import { faEdit } from "@fortawesome/pro-regular-svg-icons/faEdit";
import { faTrash } from "@fortawesome/pro-regular-svg-icons/faTrash";
import { faToggleOn } from "@fortawesome/pro-regular-svg-icons/faToggleOn";
import { faToggleOff } from "@fortawesome/pro-regular-svg-icons/faToggleOff";
import { GridColDef } from "@mui/x-data-grid-pro";
import { useTranslation } from '@1f/react-sdk';
import { User, UserFilters, UserActionEvent, UserStatus, UserRole, TagType } from '../../../types';

interface UserDataGridProps {
  users: User[];
  filters: UserFilters;
  onUserAction: (event: UserActionEvent) => void;
  onApplyFilters: (filters: { status: string; role: string; searchTerm: string }) => void;
  isLoading?: boolean;
}

/**
 * @component UserDataGrid
 * @description DataGrid per visualizzare e gestire gli utenti del sistema
 */
export const UserDataGrid: React.FC<UserDataGridProps> = ({
  users,
  filters,
  onUserAction,
  onApplyFilters,
  isLoading = false
}) => {
  const { t } = useTranslation();

  // State locale per i filtri temporanei (inclusa la ricerca)
  const [tempFilters, setTempFilters] = useState({
    searchTerm: filters.searchTerm,
    status: filters.status,
    role: filters.role
  });

  // Sincronizza i filtri temporanei quando cambiano i filtri esterni
  useEffect(() => {
    setTempFilters({
      searchTerm: filters.searchTerm,
      status: filters.status,
      role: filters.role
    });
  }, [filters]);

  // Gestione applicazione filtri
  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
  };

  // Gestione reset filtri
  const handleResetFilters = () => {
    const resetFilters = { searchTerm: '', status: 'All', role: 'All' };
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  // Verifica se ci sono filtri attivi
  const hasActiveFilters = tempFilters.searchTerm !== '' || tempFilters.status !== 'All' || tempFilters.role !== 'All';
  const filtersChanged = tempFilters.searchTerm !== filters.searchTerm || 
                        tempFilters.status !== filters.status || 
                        tempFilters.role !== filters.role;

  // Funzione per ottenere il colore del tag in base allo status
  const getStatusTagType = (status: UserStatus): TagType => {
    switch(status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'Pending': return 'warning';
      default: return 'tone8';
    }
  };

  // Funzione per ottenere il colore del tag in base al ruolo
  const getRoleTagType = (role: UserRole): TagType => {
    switch(role) {
      case 'Administrator': return 'tone1'; // blu
      case 'User': return 'tone3'; // verde
      case 'Moderator': return 'tone5'; // arancione
      default: return 'tone8'; // grigio
    }
  };

  // Funzione per formattare la data
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Configurazione colonne DataGrid
  const columns: GridColDef<User>[] = [
    {
      field: 'user',
      headerName: t("features.userManagement.grid.user"),
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Avatar
            sx={{ width: 32, height: 32, mr: 2 }}
            src={params.row.avatar}
          >
            {params.row.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              sx={{ lineHeight: 1.2 }}
            >
              {params.row.fullName}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ lineHeight: 1.2 }}
            >
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'role',
      headerName: t("features.userManagement.grid.role"),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Chip
            label={t(`features.userManagement.roles.${params.value.toLowerCase()}`)}
            variant="duotone"
            type={getRoleTagType(params.value)}
            size="small"
          />
        </Box>
      )
    },
    {
      field: 'status',
      headerName: t("features.userManagement.grid.status"),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Chip
            label={t(`features.userManagement.status.${params.value.toLowerCase()}`)}
            variant={params.value === 'Active' ? 'filled' : 'duotone'}
            type={getStatusTagType(params.value)}
            size="small"
          />
        </Box>
      )
    },
    {
      field: 'registrationDate',
      headerName: t("features.userManagement.grid.registrationDate"),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2">
            {formatDate(params.value)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'lastAccess',
      headerName: t("features.userManagement.grid.lastAccess"),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {params.value ? formatDate(params.value) : t("features.userManagement.grid.neverAccessed")}
          </Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: t("features.userManagement.grid.actions"),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, py: 1 }}>
          {/* Edit Button */}
          <Tooltip title={t("features.userManagement.grid.editUser")}>
            <IconButton
              size="small"
              variant="outlined"
              onClick={() => onUserAction({ action: 'edit', user: params.row })}
              disabled={isLoading}
            >
              <VaporIcon icon={faEdit} size="sm" />
            </IconButton>
          </Tooltip>

          {/* Toggle Status Button */}
          <Tooltip title={
            params.row.status === 'Active' 
              ? t("features.userManagement.grid.deactivateUser")
              : t("features.userManagement.grid.activateUser")
          }>
            <IconButton
              size="small"
              variant="outlined"
              onClick={() => onUserAction({ action: 'changeStatus', user: params.row })}
              disabled={isLoading || params.row.status === 'Pending'}
              color={params.row.status === 'Active' ? 'warning' : 'success'}
            >
              <VaporIcon 
                icon={params.row.status === 'Active' ? faToggleOn : faToggleOff} 
                size="sm" 
              />
            </IconButton>
          </Tooltip>

          {/* Delete Button */}
          <Tooltip title={t("features.userManagement.grid.deleteUser")}>
            <IconButton
              size="small"
              variant="outlined"
              onClick={() => onUserAction({ action: 'delete', user: params.row })}
              disabled={isLoading}
              color="error"
            >
              <VaporIcon icon={faTrash} size="sm" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Opzioni DataGrid
  const gridOptions = {
    pageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    autoHeight: true,
    hideFooterSelectedRowCount: true,
    disableColumnMenu: true,
    disableSelectionOnClick: true,
    loading: isLoading,
    sx: {
      '& .MuiDataGrid-cell': {
        maxHeight: 'none !important',
        whiteSpace: 'normal'
      }
    }
  };

  return (
    <Box>
      {/* Filtri */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Search Input */}
        <TextField
          size="small"
          label={t("features.userManagement.filters.search")}
          placeholder={t("features.userManagement.searchPlaceholder")}
          value={tempFilters.searchTerm}
          onChange={(e) => setTempFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          sx={{ minWidth: 250, maxWidth: 300 }}
        />

        {/* Filtro Status */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t("features.userManagement.filters.status")}</InputLabel>
          <Select
            value={tempFilters.status}
            label={t("features.userManagement.filters.status")}
            onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="All">{t("features.userManagement.filters.all")}</MenuItem>
            <MenuItem value="Active">{t("features.userManagement.status.active")}</MenuItem>
            <MenuItem value="Inactive">{t("features.userManagement.status.inactive")}</MenuItem>
            <MenuItem value="Pending">{t("features.userManagement.status.pending")}</MenuItem>
          </Select>
        </FormControl>

        {/* Filtro Role */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t("features.userManagement.filters.role")}</InputLabel>
          <Select
            value={tempFilters.role}
            label={t("features.userManagement.filters.role")}
            onChange={(e) => setTempFilters(prev => ({ ...prev, role: e.target.value }))}
          >
            <MenuItem value="All">{t("features.userManagement.filters.all")}</MenuItem>
            <MenuItem value="Administrator">{t("features.userManagement.roles.administrator")}</MenuItem>
            <MenuItem value="User">{t("features.userManagement.roles.user")}</MenuItem>
            <MenuItem value="Moderator">{t("features.userManagement.roles.moderator")}</MenuItem>
          </Select>
        </FormControl>

        {/* Bottoni per applicare/resettare filtri */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleApplyFilters}
            disabled={!filtersChanged || isLoading}
          >
            {t("features.userManagement.filters.search")}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFilters}
              disabled={isLoading}
            >
              {t("features.userManagement.filters.reset")}
            </Button>
          )}
        </Box>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={users}
        columns={columns}
        {...gridOptions}
        getRowId={(row) => row.id}
      />

      {/* Contatore risultati */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t("features.userManagement.grid.showing", { 
            count: users.length,
            total: users.length 
          })}
        </Typography>
      </Box>
    </Box>
  );
};