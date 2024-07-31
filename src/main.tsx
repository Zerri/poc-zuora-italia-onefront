import { OneFront } from "@1f/react-sdk";

import { dashboard } from "./features/dashboard";
import { examples } from "./features/examples";

const proxyBaseUrl = import.meta.env.VITE_APP_PROXY_BASE_URL || "/api";

/*
  In production, the VITE_APP_ID should be set in the environment variables of the pipeline,
  The default to demo is needed to redirect to localhost:3000 in development
*/
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
