import { Link } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from "@vapor/v3-components";
import { VaporIcon, Tag } from "@vapor/v3-components";
import { faPen, faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Quote, QuoteStatus, QuoteType, StatusTranslations, TypeTranslations } from './types';
import { 
  formatDate, 
  formatCurrency, 
  calculateQuoteValue,
  getStatusTagType,
  getStatusTagVariant,
  getTypeTagVariant
} from './utils';

export const createGridColumns = (
  t: (key: string) => string,
  statusTranslations: StatusTranslations,
  typeTranslations: TypeTranslations,
  handleOpenDrawer: (quote: Quote) => void
): GridColDef<Quote>[] => [
  { 
    field: 'number', 
    headerName: t("features.quotes.grid.number"), 
    flex: 1,
    renderCell: (params: any) => (
      <Box sx={{ py: 1 }}>
        <Typography 
          variant="body2" 
          fontWeight="medium"
          sx={{ 
            whiteSpace: 'normal',
            lineHeight: 1.3,
            textAlign: 'left'
          }}
        >
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'customer', 
    headerName: t("features.quotes.grid.customer"),  
    flex: 1.5,
    renderCell: (params: any) => (
      <Box sx={{ py: 1 }}>
        <Typography 
          variant="body2" 
          fontWeight="medium"
          sx={{ 
            whiteSpace: 'normal',
            lineHeight: 1.3,
            textAlign: 'left',
            display: 'block',
          }}
        >
          {params.value.name}
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            whiteSpace: 'normal',
            lineHeight: 1.3,
            textAlign: 'left',
            display: 'block',
          }}
        >
          {params.value.sector}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'status', 
    headerName: t("features.quotes.grid.stato"), 
    flex: 0.8,
    renderCell: (params: any) => (
      <Box sx={{ py: 1 }}>
        <Tag 
          label={statusTranslations[params.value]} 
          type={getStatusTagType(params.value as QuoteStatus)}
          size="small"
          variant={getStatusTagVariant(params.value as QuoteStatus)}
        />
      </Box>
    )
  },
  { 
    field: 'type', 
    headerName: t("features.quotes.grid.type"),  
    flex: 0.8,
    renderCell: (params: any) => (
      <Box sx={{ py: 1 }}>
        <Tag 
          label={typeTranslations[params.value]} 
          type="warning"
          size="small"
          variant={getTypeTagVariant(params.value as QuoteType)}
        />
      </Box>
    )
  },
  { 
    field: 'createdAt', 
    headerName: t("features.quotes.grid.creationDate"), 
    flex: 1,
    renderCell: (params: any) => (
      <Box sx={{ py: 1 }}>
        <Typography variant="body2">
          {formatDate(params.value)}
        </Typography>
      </Box>
    )
  },
  { 
    field: 'value', 
    headerName: t("features.quotes.grid.value"), 
    flex: 1,
    renderCell: (params: any) => {
      const calculatedValue = params.row.products && params.row.products.length > 0 
        ? calculateQuoteValue(params.row.products) 
        : params.value;
      
      return (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(calculatedValue)}
          </Typography>
        </Box>
      );
    }
  },
  {
    field: 'actions',
    headerName: t("features.quotes.grid.actions"), 
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: any) => (
      <Box sx={{ py: 1, display: 'flex', gap: 1 }}>
        <Link to={`/quote/${params.row._id}`}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            startIcon={<VaporIcon icon={faPen} />}
          >
            {t("features.quotes.actions.edit")}
          </Button>
        </Link>
        <IconButton 
          variant="outlined" 
          color="primary"
          size="small"
          onClick={() => handleOpenDrawer(params.row)}
        >
          <VaporIcon icon={faEllipsisVertical} />
        </IconButton>
      </Box>
    )
  }
];

export const gridOptions = {
  pageSize: 10,
  rowsPerPageOptions: [5, 10, 25, 50],
  autoHeight: true,
  hideFooterSelectedRowCount: true,
  disableColumnMenu: true,
  disableSelectionOnClick: true,
  sx: {
    '& .MuiDataGrid-cell': {
      maxHeight: 'none !important',
      whiteSpace: 'normal'
    }
  }
};