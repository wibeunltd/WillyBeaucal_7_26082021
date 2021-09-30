import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:'/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Moments : réseau social interne par Groupomania'
    }
  },
  {
    path:'/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: 'Créer un compte Moments'
    }
  },
  {
    path:'/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Se connecter à votre compte Moments'
    }
  },
  {
    path:'/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: 'Votre profil'
    }
  },
  {
    path:'/:pathMatch(.*)',
    name: 'error404',
    component: () => import('../views/Error404.vue'),
    meta: {
      title: 'Oups ! Seriez-vous perdu ? | Moments'
    }

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next()
});

export default router
