import { useRequest } from "@1f/react-sdk";
import { Typography } from "@vapor/react-extended";
import { Box, Button } from "@vapor/react-material";

import { CodeBox } from "../code-box";

export const ProxyUrlRequest = () => {
  const { loading, data, error, fetch } = useRequest({
    method: "get",
    lazy: true,
    url: "loginApi://v1/.well-known/jwks"
  });

  return (
    <Box sx={{ mb: "20px" }}>
      <Typography variant="titleSmall">
        useRequest for an internal service
      </Typography>
      <CodeBox>
        {`
const { loading, data, error, fetch } = useRequest({
  lazy:   true,
  method: "get",
  url:    "loginApi://v1/.well-known/jwks"
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
        {loading && "Calling loginApi://v1/.well-known/jwks..."}
        {error && `ERROR: ${error.message}`}
      </Box>
      {data && (
        <CodeBox sx={{ fontSize: 11 }}>
          {JSON.stringify(
            // @ts-ignore
            data.keys.map(({ kty, kid }) => ({ kty, kid })),
            null,
            2
          )}
        </CodeBox>
      )}
    </Box>
  );
};
