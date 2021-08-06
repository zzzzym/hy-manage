import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/index',
      // component: () => import('@/views/dashboard/index'),
      name: 'index',
      // meta: {
      //   title: '首页',
      //   icon: 'dashboard',
      //   affix: false
      // }
    }]
  }, {
    path: '/InsuranceServices',
    component: Layout,
    alwaysShow: true,
    name: "InsuranceServices",
    meta: {
      title: '保险服务',
      icon: 'el-icon-menu',
      affix: false
    },
    children: [{
      path: '/InsuranceServices/InsuranceAgent',
      component: () => import('@/views/InsuranceServices/InsuranceAgent'),
      name: 'InsuranceAgent',
      // hidden: false,
      meta: {
        title: '保险代理',
        icon: 'el-icon-s-cooperation',
        noCache: true
      }
    }, {
      path: '/InsuranceServices/productManagement',
      component: () => import('@/views/InsuranceServices/productManagement'),
      name: 'productManagement',
      // hidden: false,
      meta: {
        title: '产品管理',
        icon: 'el-icon-s-order',
        noCache: true
      }
    }, {
      path: '/InsuranceServices/paymentRecord',
      component: () => import('@/views/InsuranceServices/paymentRecord'),
      name: 'paymentRecord',
      // hidden: false,
      meta: {
        title: '交费记录',
        icon: 'el-icon-s-unfold',
        noCache: true
      }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

// let userinfo = localStorage.getItem('userInfo')
// userinfo = JSON.parse(userinfo)
let arr = [];
export const asyncRoutes = arr

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
