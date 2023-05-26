import { createRouter, createWebHistory } from 'vue-router'
import InvestmentView from '../views/InvestmentView.vue'
import EarningsView from '../views/EarningsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/investments',
      name: 'investments',
      component: InvestmentView
    },
    {
      path: '/earnings',
      name: 'earnings',
      component: EarningsView
    },
  ]
})

export default router
