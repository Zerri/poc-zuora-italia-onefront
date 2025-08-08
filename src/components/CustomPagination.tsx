// src/components/CustomPagination.tsx
import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery
} from '@vapor/v3-components';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from '@1f/react-sdk';
import type { PaginationInfo } from '../types/generic';

interface CustomPaginationProps {
  pagination?: PaginationInfo;
  onPaginationChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

/**
 * Componente di paginazione custom che combina:
 * - MUI Pagination per i pulsanti numerici (1, 2, 3...)
 * - Select per il controllo "rows per page"
 * - Informazioni sul totale degli elementi
 */
export const CustomPagination: React.FC<CustomPaginationProps> = ({
  pagination,
  onPaginationChange,
  pageSizeOptions = [10, 25, 50, 100],
  disabled = false
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Se non abbiamo info di paginazione, non mostriamo nulla
  if (!pagination || pagination.total === 0) {
    return null;
  }

  // Handler per cambio pagina (MUI Pagination usa 1-based)
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPaginationChange(page, pagination.limit);
  };

  // Handler per cambio page size
  const handlePageSizeChange = (event: SelectChangeEvent<unknown>) => {
    const newPageSize = Number(event.target.value);
    // Quando cambia page size, torna alla prima pagina
    onPaginationChange(1, newPageSize);
  };

  // Calcolo elementi visualizzati
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        py: 2,
        px: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      {/* Informazioni elementi visualizzati */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        order: isMobile ? 2 : 1
      }}>
        {/* Controllo rows per page */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('components.pagination.rowsPerPage')}:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={pagination.limit}
              onChange={handlePageSizeChange}
              disabled={disabled}
              sx={{ 
                '& .MuiSelect-select': { 
                  py: 0.5,
                  fontSize: '0.875rem'
                }
              }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('components.pagination.displayedRows', {
            from: startItem,
            to: endItem,
            count: pagination.total
          })}
        </Typography>
      </Box>

      {/* Paginazione numerica */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: isMobile ? 'center' : 'flex-end',
        order: isMobile ? 1 : 2
      }}>
        <Pagination
          count={pagination.pages}
          page={pagination.page}
          onChange={handlePageChange}
          disabled={disabled}
          
          // Configurazione pulsanti numerici
          showFirstButton
          showLastButton
          siblingCount={isMobile ? 0 : 1}  // Su mobile mostra meno pulsanti
          boundaryCount={1}
          
          // Styling
          color="primary"
          shape="rounded"
          size={isMobile ? "small" : "medium"}
          
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};