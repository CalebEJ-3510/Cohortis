import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

// Hash history (/#/sponsor) works on GitHub Pages without server-side rewrites
const hashHistory = createHashHistory();

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    history: hashHistory,
    context: { queryClient },
    defaultPreloadStaleTime: 0,
  });

  return router;
};
