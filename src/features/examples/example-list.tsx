import { VaporPage } from "@vapor/react-custom";
import { Typography } from "@vapor/react-extended";

import { MockUrlRequest } from "./use-request/mock-url-request";
import { ProxyUrlRequest } from "./use-request/proxy-url-request";

export const ExampleList = () => {
  return (
    <VaporPage title={`@1f/react-sdk examples`}>
      <VaporPage.Section divider={true}>
        <ProxyUrlRequest />
        <MockUrlRequest />
      </VaporPage.Section>
      <VaporPage.Section>
        <Typography variant="titleSmall">
          Add other examples here
        </Typography>
      </VaporPage.Section>
    </VaporPage>
  );
};
