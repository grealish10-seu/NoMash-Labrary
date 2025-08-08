import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPIView from '../views/CountBookAPI.vue'
import GetAllBookAPIView from '../views/GetAllBookAPI.vue'
import { isAuthenticated } from '../auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView
    },
    {
      path: '/FirebaseSignin',
      name: 'FirebaseSignin',
      component: FirebaseSigninView
    },
    {
      path: '/FireRegister',
      name: 'FireRegister',
      component: FirebaseRegisterView
    },
    {
      path: '/add-book',
      name: 'AddBook',
      component: AddBookView,
      meta: { requiresAuth: true }
    },
    {
      path: '/WeatherCheck',
      name: 'GetWeather',
      component: WeatherView
    },
    {
      path: '/CountBookAPI',
      name: 'CountBookAPI',
      component: CountBookAPIView
    },
    {
      path: '/GetAllBookAPI',
      name: 'GetAllBookAPI',
      component: GetAllBookAPIView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: '/access-denied',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 