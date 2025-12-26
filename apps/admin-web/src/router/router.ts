import {
  createMemoryHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router