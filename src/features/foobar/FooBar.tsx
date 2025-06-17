import { DatabaseStatus } from "../../components/DatabaseStatus";
import { RoleSelector } from "../../components/RoleSelector";
import { VaporThemeProvider, Box } from "@vapor/v3-components";

export const FooBar = () => {
  return (
    <VaporThemeProvider>
      <RoleSelector />
      <Box sx={{ mr: 2 }}>
        <DatabaseStatus />
      </Box>
    </VaporThemeProvider>
  );
}