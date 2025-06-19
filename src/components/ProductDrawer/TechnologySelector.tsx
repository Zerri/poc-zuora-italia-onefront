import React from 'react';
import { Box, Button } from "@vapor/v3-components";
import { useTranslation } from '@1f/react-sdk';

interface TechnologySelectorProps {
  technologies: string[];
  selectedTech: string;
  onSelectTechnology: (tech: string) => void;
}

/**
 * @component TechnologySelector
 * @description Componente per selezionare la tecnologia dei rate plan
 */
export const TechnologySelector: React.FC<TechnologySelectorProps> = ({ 
  technologies, 
  selectedTech, 
  onSelectTechnology 
}) => {
  const { t } = useTranslation();
  
  const getTechnologyDisplayName = (tech: string): string => {
    const displayNames: Record<string, string> = {
      'IAAS': t('components.productDrawer.technologySelector.technologies.iaas'),
      'On Premise': t('components.productDrawer.technologySelector.technologies.onPremise'),
      'SAAS': t('components.productDrawer.technologySelector.technologies.saas'),
      'Other': t('components.productDrawer.technologySelector.technologies.other'),
    };
    return displayNames[tech] || tech;
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
      {technologies.map((tech) => (
        <Button
          key={tech}
          variant={selectedTech === tech ? 'contained' : 'outlined'}
          size="medium"
          onClick={() => onSelectTechnology(tech)}
          sx={{
            borderRadius: '24px',
            px: 2,
          }}
        >
          {getTechnologyDisplayName(tech)}
        </Button>
      ))}
    </Box>
  );
};

export default TechnologySelector;