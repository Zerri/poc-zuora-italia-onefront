// src/components/EntityDetailLayout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VaporThemeProvider,
  VaporPage,
  Typography,
  Button,
  IconButton,
  Title,
  VaporIcon,
  Breadcrumbs,
  Link
} from "@vapor/v3-components";
import { faArrowLeft, faFloppyDisk, faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons";

export interface BreadcrumbItem {
  label: string;
  path?: string; // Se undefined, non è cliccabile (breadcrumb finale)
}

export interface EntityDetailLayoutProps {
  /** Titolo principale (es. "Marco Rossi") */
  title: string;
  
  /** Descrizione sotto il titolo (es. "marco.rossi@example.com • ADMIN") */
  description?: string;
  
  /** Path per tornare indietro */
  backPath: string;
  
  /** Lista breadcrumbs */
  breadcrumbs: BreadcrumbItem[];
  
  /** Label del pulsante principale (es. "Salva") */
  primaryActionLabel?: string;
  
  /** Handler del pulsante principale */
  onPrimaryAction?: () => void;
  
  /** Indica se il pulsante principale è in loading */
  primaryActionLoading?: boolean;
  
  /** Contenuto custom della pagina */
  children: React.ReactNode;
}

export const EntityDetailLayout: React.FC<EntityDetailLayoutProps> = ({
  title,
  description,
  backPath,
  breadcrumbs,
  primaryActionLabel = "Salva",
  onPrimaryAction,
  primaryActionLoading = false,
  children
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <VaporThemeProvider>
      <VaporPage>
        <Title
          leftItems={[
            <IconButton key="back" color="primary" size="small" onClick={handleBack}>
              <VaporIcon icon={faArrowLeft} size="xl" />
            </IconButton>
          ]}
          rightItems={[
            ...(onPrimaryAction ? [
              <Button 
                key="primary-action" 
                size="small" 
                variant="contained" 
                startIcon={<VaporIcon icon={faFloppyDisk} />}
                onClick={onPrimaryAction}
                disabled={primaryActionLoading}
              >
                {primaryActionLoading ? `${primaryActionLabel}...` : primaryActionLabel}
              </Button>
            ] : []),
            <IconButton key="options" size="small">
              <VaporIcon icon={faEllipsisVertical} size="xl" />
            </IconButton>
          ].filter(Boolean)}
          size="small"
          title={title}
          description={description}
        />

        <VaporPage.Section>
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs sx={{ mb: -5 }}>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              if (isLast || !crumb.path) {
                return (
                  <Typography key={index} color="text.primary">
                    {crumb.label}
                  </Typography>
                );
              }
              
              return (
                <Link 
                  key={index}
                  color="inherit" 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    navigate(crumb.path!); 
                  }}
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </VaporPage.Section>

        <VaporPage.Section>
          {/* Contenuto custom della pagina */}
          {children}
        </VaporPage.Section>
      </VaporPage>
    </VaporThemeProvider>
  );
};