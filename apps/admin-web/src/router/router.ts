import {
  createMemoryHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    redirect(to, from) {
      return "/login";
    },
    meta: {},
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
