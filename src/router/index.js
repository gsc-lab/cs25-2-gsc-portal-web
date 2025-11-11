import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/pages/Login/LoginPage.vue";
import TimeTablePage from "@/pages/TimeTable/TimeTablePage.vue";

const routes = [
  { path: "/", name: "LoginPage", component: LoginPage },
  { path: "/timetable", name: "TimeTablePage", component: TimeTablePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
