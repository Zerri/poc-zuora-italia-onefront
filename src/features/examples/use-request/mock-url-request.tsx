import { useRequest } from "@1f/react-sdk";
import { Box, Button, Typography } from "@vapor/v3-components";

import { CodeBox } from "../code-box";

export const MockUrlRequest = () => {
  const { loading, data, error, fetch } = useRequest({
    lazy: true,
    method: "get",
    url: "random://number"
  });

  return (
    <Box sx={{ mb: "20px" }}>
      <Typography variant="titleSmall">
        useRequest for an API mocked by Proxy
      </Typography>
      <CodeBox>
        {`
const { loading, data, error, fetch } = useRequest({
  lazy:   true,
  method: "get",
  url:    "random://number"
});
        `.trim()}
      </CodeBox>
      <Box
        sx={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}
      >
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={fetch}
          disabled={loading}
        >
          Click me
        </Button>
        {loading && "Loading random number..."}
        {error && `ERROR: ${error.message}`}
      </Box>
      {data && <CodeBox>{data.value}</CodeBox>}
    </Box>
  );
};
