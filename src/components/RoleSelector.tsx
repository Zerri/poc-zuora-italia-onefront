import { Box, FormControl, Select, MenuItem  } from "@vapor/v3-components";
import { useRole } from '../contexts/RoleContext';
import { Role } from "../types";
import { useTranslation } from "@1f/react-sdk";

interface RoleSelectorProps {}

export const RoleSelector: React.FC<RoleSelectorProps> = () => {
  const { t } = useTranslation();
  const { role, setRole } = useRole();
  
  const handleRoleChange = (event: any) => {
    const value = event.target.value as string;
    setRole(value as Role);
    console.log("Role changed to:", value);
  };

  return (
    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
      <FormControl
        size="small"
        variant="outlined"
        sx={{ 
          minWidth: 120,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 1,
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiSelect-select': { 
            display: 'flex',
            alignItems: 'center',
            py: 1,
            pl: 1
          }
        }}
      >
        <Select
          id="role-selector"
          onChange={handleRoleChange}
          value={role}
        >
          <MenuItem value="admin">{t("components.roleSelector.roles.admin")}</MenuItem>
          <MenuItem value="sales">{t("components.roleSelector.roles.sales")}</MenuItem>
          <MenuItem value="touchpoint">{t("components.roleSelector.roles.touchpoint")}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};