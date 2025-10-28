import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/pages/Login/LoginPage.vue";

const routes = [
  { path: '/', name: 'LoginPage', component: LoginPage },
  {
    path: '/cleaning-rosters',
    name: 'CleaningRosterPage',
    component: () => import('@/pages/Cleaning/CleaningPage.vue'),
  },
  {
    path: '/cleaning-rosters/generator',
    name: 'CleaningGeneratorPage',
    component: () => import('@/pages/Cleaning/components/CleaningPost.vue'),
  },
  {
    path: '/cleaning-rosters/delete',
    name: 'CleaningDeletePage',
    component: () => import('@/pages/Cleaning/components/CleaningDelete.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
