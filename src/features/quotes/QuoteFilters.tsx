// features/quotes/components/QuoteFilters.tsx
import React from 'react';
import { Box, SearchBar, Chip } from "@vapor/v3-components";
import { StatusTranslations } from './types';
import { useTranslation } from '@1f/react-sdk';

interface QuoteFiltersProps {
  searchTerm: string;
  filterStatus: string;
  statusTranslations: StatusTranslations;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: string) => void;
}

export const QuoteFilters: React.FC<QuoteFiltersProps> = ({
  searchTerm,
  filterStatus,
  statusTranslations,
  onSearchChange,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          handleClear={() => onSearchChange("")}
          placeholder={t("features.quotes.searchPlaceholder")}
          size='medium'
          sx={{ width: '100%' }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip 
          label={t("features.quotes.filters.all")} 
          variant={filterStatus === 'All' ? 'filled' : 'outlined'}
          onClick={() => onFilterChange('All')}
          color={filterStatus === 'All' ? 'primary' : 'default'}
        />
        
        {['Draft', 'Sent', 'Accepted', 'Rejected'].map(status => (
          <Chip 
            key={status}
            label={statusTranslations[status]}
            variant={filterStatus === status ? 'filled' : 'outlined'}
            onClick={() => onFilterChange(status)}
            color={filterStatus === status ? 'primary' : 'default'}
          />
        ))}
      </Box>
    </Box>
  );
};