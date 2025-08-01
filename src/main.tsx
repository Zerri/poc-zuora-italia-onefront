import { OneFront } from "@1f/react-sdk";

import { foobar } from "./features/foobar";
import { shellNav } from "./features/shellNav";
import { dashboard } from "./features/dashboard";
import { examples } from "./features/examples";
import { customers } from "./features/customers";
import { crm_quote } from "./features/crm-quote";
import { quote } from "./features/quote";
import { quotes } from "./features/quotes";
import { catalog } from "./features/catalog";
import { report } from "./features/report";
import { settings } from "./features/settings";
import { migration } from "./features/migration";
import { react_root_wrapper } from "./features/reactRootWrapper";
import { userManagement } from "./features/user-management";
import { adminQuotes } from "./features/admin-quotes";

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
      i18n: {
        options: {
          // Load all known namespaces
          // (more namespaces will be loaded on demand)
          defaultNS: "cpq",
        }
      },
      box: {
        module: {
          name: "zuora-poc", // <--- Set to your bu/island name, for example if the URN of your app is "PORTAL://homepage" this value should be "PORTAL"
        },
        powerboard: {
          show: true, // <--- Set to true to show the powerboard instead of the example feature
        },
      },
      layout: { 
        title: "IT Solutions CPQ - Zuora PoC",
      },
    },
  },
  features: [react_root_wrapper, foobar, shellNav, dashboard, examples, customers, crm_quote, quote, quotes, catalog, report, settings, migration, userManagement, adminQuotes],
  services: [],
}).catch(console.error);
