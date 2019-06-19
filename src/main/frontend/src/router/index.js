import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import PageWithNavBarAndFooterLayout from '@/layouts/PageWithNavBarAndFooterLayout'
import ListCardsPage from '@/pages/ListCardsPage'
import PageNotFoundPage from '@/pages/PageNotFoundPage'
import AdminUserSearchPage from '@/pages/AdminUserSearchPage'
import AdminViewUserCardsPage from '@/pages/AdminViewUserCardsPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/tecnico-card',
  routes: [
    {
      path: '',
      async beforeEnter (to, from, next) {
        await store.dispatch('fetchProfile')
        next()
      },
      component: PageWithNavBarAndFooterLayout,
      children: [
        {
          path: '/unauthorized',
          name: 'UnauthorizedPage',
          component: UnauthorizedPage
        },
        {
          path: '/',
          name: 'ListCardsPage',
          component: ListCardsPage,
          async beforeEnter (to, from, next) {
            await store.dispatch('changeCurrentUser', { username: store.state.profile.username })
            await store.dispatch('fetchCards')
            next()
          }
        },
        {
          path: '/admin',
          name: 'AdminUserSearchPage',
          component: AdminUserSearchPage,
          async beforeEnter (to, from, next) {
            if (!store.state.profile.admin) {
              next('/unauthorized')
            }
            next()
          }
        },
        {
          path: '/admin/:username',
          name: 'AdminViewUserCardsPage',
          component: AdminViewUserCardsPage,
          async beforeEnter (to, from, next) {
            if (!store.state.profile.admin) {
              next('/unauthorized')
            }
            await store.dispatch('changeCurrentUser', { username: to.params.username })
            await store.dispatch('fetchCards')
            next()
          }
        },
        {
          path: '*',
          name: 'PageNotFound',
          component: PageNotFoundPage
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
