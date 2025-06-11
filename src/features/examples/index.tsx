import { ExampleList } from "./example-list";
// import { NavContent } from "./nav-content";

const BASE_PATH = "/examples";

// @ts-ignore
export const examples = ({ getConfig }: any) => {

  return [
    // {
    //   target: "$ONE_LAYOUT_NAV_CONTENT",
    //   handler: {
    //     component: NavContent,
    //     props: {
    //       basePath: BASE_PATH
    //     }
    //   }
    // },
    {
      target: "$ONE_LAYOUT_ROUTE",
      handler: {
        exact: true,
        path: BASE_PATH,
        element: <ExampleList />
      }
    }
  ];
};
