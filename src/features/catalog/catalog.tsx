import { fetch } from "@1f/react-sdk"
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button, 
  VaporToolbar, 
  CircularProgress, 
  Alert, 
  Chip,
  Grid, 
  Box,
  VaporIcon,
  Snackbar,
  DataGrid,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@vapor/v3-components";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons/faInfoCircle";
import { faTableCells } from "@fortawesome/pro-regular-svg-icons/faTableCells";
import { faTableCellsLarge } from "@fortawesome/pro-regular-svg-icons/faTableCellsLarge";
import { faCirclePlus } from "@fortawesome/pro-regular-svg-icons/faCirclePlus";
import SearchBar from "@vapor/v3-components/SearchBar";
import { Link } from 'react-router-dom';
import ProductDrawer from '../../components/ProductDrawer/ProductDrawer';
import ProductCard from '../../components/ProductCard';
import { useRole } from '../../contexts/RoleContext';
// Import shared type definitions
import { 
  Product, 
  RatePlan, 
  ProductToAdd, 
  Quote, 
  DrawerData, 
  SnackbarState, 
  ViewMode, 
  CategoryFilter,
  TagType
} from '../../types';
import { GridColDef } from "@mui/x-data-grid-pro";
import { useTranslation } from '@1f/react-sdk';

// Define Props interface for the component
interface CatalogPageProps {}

/**
 * @component CatalogPage
 * @description Page that shows the TeamSystem product catalog filtered by user permissions
 */
export const CatalogPage: React.FC<CatalogPageProps> = () => {
  const { t } = useTranslation();

  // For query management
  const queryClient = useQueryClient();
  
  // State for search filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>('tutti');
  
  // State for view mode (cards or grid)
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // State for drawer management
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for message management
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // For retrieving quoteId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteId = searchParams.get('quoteId');

  // Get user role from context
  const { role } = useRole();

  // Query to get products, using role from context
  const { data: products = [], isLoading, error } = useQuery<Product[], Error>({ 
    queryKey: ['products', role], // Solo questo
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/products1?userId=${role}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    }
  });

  // Query to get categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useQuery<string[], Error>({ 
    queryKey: ['product-categories'], 
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/products/categories/all`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });
  
  // Query to get current quote (if in quote mode)
  const {
    data: quoteData,
    isLoading: isLoadingQuote,
    error: quoteError
  } = useQuery<Quote, Error>({
    queryKey: ['quote', quoteId],
    queryFn: async () => {
      if (!quoteId) return null as unknown as Quote;
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/quotes/${quoteId}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!quoteId, // Execute query only if there's a quoteId
  });
  
  // Mutation to add a product to the quote
  const addToQuoteMutation = useMutation<Quote, Error, ProductToAdd>({
    mutationFn: async (productData) => {
      // Prepare products to send, considering existing ones
      const existingProducts = quoteData?.products || [];
      const updatedProducts = [...existingProducts, productData];
      
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: updatedProducts
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate query to force a refresh of quote data
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Show success message
      setSnackbar({
        open: true,
        message: t("features.catalog.success.addProduct"),
        severity: 'success'
      });
      
      // Redirect after a short delay to allow user to see the message
      setTimeout(() => {
        navigate(`/quote/${quoteId}`);
      }, 1500);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Errore: ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Function to change category filter
  const handleFilterChange = (newFilter: CategoryFilter): void => {
    setFilterCategory(newFilter);
  };
  
  // Function to filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // Filter by category
      const matchesCategory = filterCategory === 'tutti' || product.categoria === filterCategory;
      
      // Filter by search text
      const matchesSearch = 
        searchTerm === '' || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, filterCategory, searchTerm]);

  // Function to determine category tag color
  const getCategoryTagType = (category?: string): TagType => {
    switch(category) {
      case 'enterprise':
        return 'tone1'; // blue
      case 'professional':
        return 'tone3'; // green
      case 'hr':
        return 'tone5'; // orange
      case 'cross':
        return 'tone7'; // purple
      default:
        return 'tone8'; // gray
    }
  };
  
  // Function to open drawer with selected product
  const handleOpenDrawer = (product: Product): void => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };
  
  // Function to close drawer
  const handleCloseDrawer = (): void => {
    setDrawerOpen(false);
  };

  // Handle adding to offer/quote
  const handleAddToOffer = (data: DrawerData): void => {
    if (quoteId) {
      // FIX: Access data correctly based on changes in ProductDrawer.jsx
      console.log('Data received for adding to quote:', data);
      
      // Prepare product to add to quote with all details
      const productToAdd: ProductToAdd = {
        id: data.product.id,
        name: data.product.name,
        price: data.totalPrice || 0, // Total list price
        customerPrice: data.customerPrice || data.totalPrice || 0, // Custom customer price
        quantity: 1,
        category: data.product.categoria,
        description: data.product.description,
        // Information on selected rate plan
        ratePlan: {
          id: data.selectedRatePlan.id,
          name: data.selectedRatePlan.name,
          description: data.selectedRatePlan.description || ''
        },
        // Information on charges configured by user
        charges: data.selectedRatePlan.productRatePlanCharges.map(charge => ({
          id: charge.id,
          name: charge.name,
          type: charge.type,
          model: charge.model,
          value: charge.value !== undefined ? parseFloat(String(charge.value)) || 0 : 0,
          calculatedPrice: charge.calculatedPrice !== undefined ? charge.calculatedPrice : 0
        }))
      };
      
      // Debug log
      console.log('Product prepared for adding to quote:', productToAdd);
      
      // Use mutation to add product
      addToQuoteMutation.mutate(productToAdd);
    } else {
      // Existing behavior when there's no quoteId
      console.log('Product added to offer:', data);
      
      // Close drawer
      handleCloseDrawer();
    }
  };

  // Function to return to quote without adding anything
  const handleReturnToQuote = (): void => {
    if (quoteId) {
      navigate(`/quote/${quoteId}`);
    }
  };

  // Function to translate category name
  const translateCategory = (category?: string): string => {
    const translations: Record<string, string> = {
      'enterprise': t("features.catalog.categories.enterprise"),
      'professional': t("features.catalog.categories.professional"),
      'hr': t("features.catalog.categories.hr"),
      'cross': t("features.catalog.categories.cross"),
    };
    return translations[category || ''] || category || 'N/A';
  };
  
  // Error handling for quote
  if (quoteError && quoteId) {
    return (
      <VaporThemeProvider>
        <VaporPage>
          <VaporPage.Section>
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.catalog.error.quote")}: {quoteError.message}
            </Alert>
            <Button 
              variant="contained"
              onClick={() => navigate('/quotes')}
              startIcon={<VaporIcon icon={faArrowLeft} />}
            >
              {t("features.catalog.navigation.backToQuotesList")}
            </Button>
          </VaporPage.Section>
        </VaporPage>
      </VaporThemeProvider>
    );
  }

  // DataGrid column configuration
  const columns: GridColDef<Product>[] = [
    { 
      field: 'name', 
      headerName: t("features.catalog.grid.name"), 
      flex: 1.5,
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
      field: 'description', 
      headerName: t("features.catalog.grid.description"),  
      flex: 2,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'left'
            }}
          >
            {params.value || t("features.catalog.grid.noDescription")}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'productRatePlans', 
      headerName: t("features.catalog.grid.ratePlans"),
      flex: 1.5,
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          {params.value && params.value.length > 0 ? (
            <Typography 
              variant="body2"
              sx={{ 
                whiteSpace: 'normal',
                lineHeight: 1.3,
                textAlign: 'left'
              }}
            >
              {params.value.slice(0, 3).map((plan: RatePlan) => plan.name).join(', ')}
              {params.value.length > 3 && `${t("features.catalog.grid.otherPlans", { count: params.value.length - 3 })}`}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("features.catalog.grid.noPlans")}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: t("features.catalog.grid.actions"), 
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <Box sx={{ py: 1 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            onClick={() => handleOpenDrawer(params.row)}
            startIcon={<VaporIcon icon={faCirclePlus} />}
          >
            {t("features.catalog.grid.addButton")}
          </Button>
        </Box>
      )
    }
  ];

  // DataGrid configuration options
  const gridOptions = {
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

  return (
    <VaporThemeProvider>
      <VaporPage
        title={t("features.catalog.title")}
        contentToolbar={
          <VaporToolbar
            variant="surface"
            size="large"
            contentLeft={[
              // Back button
              quoteId ? (
                <Button 
                  variant="contained" 
                  onClick={handleReturnToQuote}
                  startIcon={<VaporIcon icon={faArrowLeft} />}
                >
                  {t("features.catalog.backToQuote")}
                </Button>
              ) : (
                <Link to="/">
                  <Button 
                    variant="contained"
                  >
                    {t("features.catalog.backToHome")}
                  </Button>
                </Link>
              )
            ]}
          />
        }
      >
        <VaporPage.Section divider>
          
          {/* Info banner if in "add to quote" mode */}
          {quoteId && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>            
              {/* Information on role filtering */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'background.paper',
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                width: '100%',
              }}>
                <VaporIcon icon={faInfoCircle} color="primary" size="l" />
                <Typography variant="body2" color="text.secondary">
                  {isLoadingQuote ? <span>{t("features.catalog.loading.quote")}</span> : <span>{t("features.catalog.info.quoteAdd")}:</span>} <strong>{quoteData?.number || quoteId}</strong> | {t("features.catalog.info.role")}: <strong>{role}</strong> | {t("features.catalog.info.availableProducts")}: <strong>{products.length}</strong> | {t("features.catalog.info.visibleProducts")}: <strong>{filteredProducts.length}</strong>
                </Typography>
              </Box>
            </Box>
          )}
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              component="div"
              gutterBottom
              variant="headingsPage"
            >
              {t("features.catalog.searchTitle")}
            </Typography>
            <Typography
              component="div"
              gutterBottom
              variant="bodyLargeRegular"
            >
              {quoteId ? t("features.catalog.quoteSubtitle") : t("features.catalog.offerSubtitle")}
            </Typography>
          </Box>
          
          {/* Product search form */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '500px', mb: 3 }}>
              <SearchBar
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                handleClear={() => setSearchTerm("")}
                placeholder={t("features.catalog.searchPlaceholder")}
                size='medium'
                sx={{ width: '100%' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip 
                label={t("features.catalog.categories.all")}
                variant={filterCategory === 'tutti' ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('tutti')}
                color={filterCategory === 'tutti' ? 'primary' : 'default'}
              />
              
              {isLoadingCategories ? (
                <CircularProgress size={32} />
              ) : (
                categories.map(category => (
                  <Chip 
                    key={category}
                    label={translateCategory(category)}
                    variant={filterCategory === category ? 'filled' : 'outlined'}
                    onClick={() => handleFilterChange(category)}
                    color={filterCategory === category ? 'primary' : 'default'}
                  />
                ))
              )}
            </Box>
          </Box>
        </VaporPage.Section>

        <VaporPage.Section>
          {/* Toggle to change view */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ButtonGroup variant="outlined" size="small">
              <Tooltip title={t("features.catalog.view.cards")}>
                <IconButton 
                  color={viewMode === 'cards' ? 'primary' : 'default'}
                  onClick={() => setViewMode('cards')}
                >
                  <VaporIcon icon={faTableCellsLarge} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("features.catalog.view.table")}>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                >
                  <VaporIcon icon={faTableCells} />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>  

          {/* Product display */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("features.catalog.error.products")}: {error.message}
            </Alert>
          ) : filteredProducts.length === 0 ? (
            <Alert severity="info">
              {t("features.catalog.alert.noProducts")}
            </Alert>
          ) : (
            <>
              {/* CARD VIEW - Using the new ProductCard component */}
              {viewMode === 'cards' && (
                <Grid container spacing={3}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={product.id}>
                      <ProductCard
                        product={product}
                        onAddProduct={handleOpenDrawer}
                        translateCategory={translateCategory}
                        getCategoryTagType={getCategoryTagType}
                        isAddingToQuote={!!quoteId}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* GRID VIEW (DATAGRID) */}
              {viewMode === 'grid' && (
                <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1 }}>
                  <DataGrid 
                    rows={filteredProducts} 
                    columns={columns} 
                    getRowId={(row) => row.id}
                    {...gridOptions}
                    sx={{
                      '.MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                        maxHeight: 'none !important',
                        whiteSpace: 'normal',
                        padding: '16px 8px'
                      },
                      '.MuiDataGrid-row': {
                        maxHeight: 'none !important'
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </VaporPage.Section>

        {/* External Drawer component */}
        <ProductDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          product={selectedProduct}
          translateCategory={translateCategory}
          onAddToOffer={handleAddToOffer}
          isAddingToQuote={!!quoteId}  // Pass this prop to drawer
        />
        
        {/* Snackbar Component */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({...snackbar, open: false})}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </VaporPage>
    </VaporThemeProvider>
  );
};

