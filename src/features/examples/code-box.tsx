import { Box } from "@vapor/v3-components";
import type { ReactNode } from "react";

export const CodeBox = ({ sx = {}, children }: { sx?: any, children: ReactNode }) => {
  return (
    <Box
      sx={{
        ...sx,
        background: "#eee",
        border: "1px solid #ddd",
        padding: "1px 10px",
        mt: 1,
        borderRadius: 1
      }}
    >
      <pre>{children}</pre>
    </Box>
  );
};
