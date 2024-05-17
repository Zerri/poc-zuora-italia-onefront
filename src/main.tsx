import { OneFront } from "@1f/react-sdk";

import { dashboard } from "./features/dashboard";
import { examples } from "./features/examples";

const proxyBaseUrl = import.meta.env.VITE_APP_PROXY_BASE_URL || "/api";

const appId = import.meta.env.VITE_APP_ID || "demo";

OneFront.run({
  settings: {
    one: {
      appId,
      axios: {
        proxy: {
          baseUrl: proxyBaseUrl,
        },
      },
      layout: { title: "React Boilerplate" },
    },
  },
  features: [dashboard, examples],
  services: [],
}).catch(console.error);
