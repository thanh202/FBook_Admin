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
      {
        path: "/book-category",
        component: () => import("@/views/category/BookCategory.vue"),
      },
      {
        path: "/list-user",
        component: () => import("@/views/users/ListUser.vue"),
      },
      {
        path: "/list-admin",
        component: () => import("@/views/Adminss/admina.vue"),
      },
      {
        path: "/thongke",
        component: () => import("@/views/Thongke/Thongke.vue"),
      },
      {
        path: "/bill",
        component: () => import("@/views/invoice/Invoice_manager.vue"),
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
