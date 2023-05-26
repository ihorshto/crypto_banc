import { createRouter, createWebHistory } from 'vue-router'
import InvestmentView from '../views/InvestmentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/investments',
      name: 'investments',
      component: InvestmentView
    },
  ]
})

export default router
