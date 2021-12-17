import { createRouter, createWebHistory } from 'vue-router'
import store from "../store"

const routes = [
  {
    path:'/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Réseau social interne par Groupomania ● Moments',
      breadcrumb: [{ name: 'Accueil', active: true }],
      guest: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Gestion des titres de pages
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next()
});

// Redirection des utilisateurs authentifiés pour les routes accessibles en tant qu'invité
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters.isLoggedIn) {
      next("/feed")
      return
    }
    next()
  } else {
    next()
  }
})

// Redirection des utilisateurs non authentifiés pour les routes accessibles en tant que membre
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next("/login")
  } else {
    next()
  }
})

export default router