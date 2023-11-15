// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/admin",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/list-deltai",
        name: "Home",
        component: () => import("@/views/details/ListDetail.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/components/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
