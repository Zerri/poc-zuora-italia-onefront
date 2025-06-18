import { fetch } from "@1f/react-sdk"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Chip,
  VaporIcon,
  Tooltip
} from "@vapor/v3-components";
import { faDatabase } from "@fortawesome/pro-regular-svg-icons/faDatabase";
import { faCloud } from "@fortawesome/pro-regular-svg-icons/faCloud";
import { faServer } from "@fortawesome/pro-regular-svg-icons/faServer";
import { useTranslation } from '@1f/react-sdk';

// Tipizzazione della risposta dell'API
interface DatabaseInfo {
  database: string;
  host: string;
  environment: 'local' | 'azure' | 'mongodb';
  status?: string;
  [key: string]: any; // Per eventuali proprietà aggiuntive
}

// Tipizzazione delle informazioni del database derivate
interface DatabaseStatus {
  type: string;
  color: 'default' | 'success' | 'primary' | 'warning' | 'error';
  icon: any; // FontAwesome icon type
  description: string;
}

/**
 * @component DatabaseStatus
 * @description Mostra lo stato della connessione al database e informazioni sul tipo di ambiente
 */
export const DatabaseStatus: React.FC = () => {
  const { t } = useTranslation();
  const { data: dbInfo, isLoading, error } = useQuery<DatabaseInfo, Error>({
    queryKey: ['database-info'],
    queryFn: async (): Promise<DatabaseInfo> => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/health/database`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: 30000, // Aggiorna ogni 30 secondi
    staleTime: 10000, // Considera i dati freschi per 10 secondi
  });

  if (isLoading) {
    return (
      <Chip
        label={t('components.databaseStatus.checking')}
        color="default"
        size="small"
        variant="outlined"
        icon={<VaporIcon icon={faDatabase} size="s" />}
      />
    );
  }

  if (error) {
    return (
      <Tooltip title={t('components.databaseStatus.errorTooltip', { message: error.message})}>
        <Chip
          label={t('components.databaseStatus.error')}
          color="error"
          size="small"
          variant="filled"
          icon={<VaporIcon icon={faDatabase} size="s" />}
        />
      </Tooltip>
    );
  }

  // Determina il tipo di database e le relative proprietà
  const getDatabaseInfo = (): DatabaseStatus => {
    if (!dbInfo) return { 
      type: 'Unknown', 
      color: 'default', 
      icon: faDatabase,
      description: 'Database information not available'
    };

    // Usa l'informazione 'environment' che il backend ci fornisce già
    if (dbInfo.environment === 'local') {
      return {
        type: 'Docker Local',
        color: 'success',
        icon: faServer,
        description: `DB: ${dbInfo.database} | Host: ${dbInfo.host}`
      };
    } else if (dbInfo.environment === 'azure') {
      return {
        type: 'Azure Cosmos',
        color: 'primary',
        icon: faCloud,
        description: `DB: ${dbInfo.database} | Host: ${dbInfo.host}`
      };
    } else {
      return {
        type: 'MongoDB',
        color: 'warning',
        icon: faDatabase,
        description: `DB: ${dbInfo.database} | Host: ${dbInfo.host}`
      };
    }
  };

  const dbStatus: DatabaseStatus = getDatabaseInfo();

  return (
    <Tooltip title={dbStatus.description}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={dbStatus.type}
          color={dbStatus.color}
          size="small"
          variant="filled"
          icon={<VaporIcon icon={dbStatus.icon} size="s" />}
          sx={{
            fontWeight: 'medium',
            fontSize: '0.75rem'
          }}
        />
      </Box>
    </Tooltip>
  );
}
