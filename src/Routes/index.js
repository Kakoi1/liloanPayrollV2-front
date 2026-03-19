import { createRouter, createWebHistory } from 'vue-router'
import GuestLayout from '@/layouts/GuestLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import Login from '@/Views/Auth/Login.vue'
import Dashboard from '@/Views/Pages/Dashboard/index.vue'
import Employees from '@/Views/Pages/Employees/index.vue'
import EmployeeRegister from '@/Views/Pages/Employees/Add/EmployeeRegister.vue'
import Attendance from '@/Views/Pages/Attendance/index.vue'
import ManagePayroll from '@/Views/Pages/Attendance/Manage/index.vue'
import Suppliers from '@/Views/Pages/supplier/index.vue'
import PriceList from '@/Views/Pages/PriceList/index.vue'
import Vouchers from '@/Views/Pages/Voucher/index.vue'
import Rates from '@/Views/Pages/Rates/index.vue'
import Deductions from '@/Views/Pages/Deductions/index.vue'
import Productions from '@/Views/Pages/Productions/index.vue'
import Contributions from '@/Views/Pages/Contributions/index.vue'
import Compensation from '@/Views/Pages/Compensation/index.vue'
// Check auth status function (from localStorage, token, or API)
const isAuthenticated = () => {
  // Here, you can replace this with a proper API check
  return !!localStorage.getItem('auth') // example: set 'auth' after login
}

// Title helper
const titleFormat = (text) => {
  return text ? `${text} | Liloan Payroll` : 'Liloan Payroll';
}

const routes = [
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
        meta: { title: titleFormat('Login') }
      }
    ]
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: titleFormat('Dashboard'), requiresAuth: true }
      },
      {
        path: 'employees',
        name: 'Employees',
        component: Employees,
        meta: { title: titleFormat('Dashboard'), requiresAuth: true }
      },
      {
        path: 'employees/add',
        name: 'add-employee',
        component: EmployeeRegister,
        meta: { title: titleFormat('Register-Employee'), requiresAuth: true }
      },
      {
        path: 'attendance/',
        name: 'attendance',
        component: Attendance,
        meta: { title: titleFormat('Attendance'), requiresAuth: true }
      },
      {
        path: 'manage-payroll/',
        name: 'manage-payroll',
        component: ManagePayroll,
        meta: { title: titleFormat('Manage-Payroll'), requiresAuth: true }
      },
      {
        path: 'suppliers/',
        name: 'suppliers',
        component: Suppliers,
        meta: { title: titleFormat('Suppliers'), requiresAuth: true }
      },
      {
        path: 'prices/',
        name: 'prices',
        component: PriceList,
        meta: { title: titleFormat('Price-List'), requiresAuth: true }
      },
      {
        path: 'vouchers/',
        name: 'vouchers',
        component: Vouchers,
        meta: { title: titleFormat('Vouchers'), requiresAuth: true }
      },
      {
        path: 'rates/',
        name: 'rates',
        component: Rates,
        meta: { title: titleFormat('Rates'), requiresAuth: true }
      },
      {
        path: 'deduction/',
        name: 'deduction',
        component: Deductions,
        meta: { title: titleFormat('Deductions'), requiresAuth: true }
      },
      {
        path: 'production/',
        name: 'production',
        component: Productions,
        meta: { title: titleFormat('Productions'), requiresAuth: true }
      },
      {
        path: 'contribution/',
        name: 'contribution',
        component: Contributions,
        meta: { title: titleFormat('Contributions'), requiresAuth: true }
      },
      {
        path: 'compensation/',
        name: 'compensation',
        component: Compensation,
        meta: { title: titleFormat('Compensation'), requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Navigation guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'FIS Multi-Store'

  const loggedIn = isAuthenticated()

  if (to.meta.requiresAuth && !loggedIn) {
    // Trying to access protected route but not logged in
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    next({ name: 'login' })
  } 
  else if (to.name === 'login' && loggedIn) {
    // Already logged in, redirect from login to dashboard
    next({ name: 'dashboard' })
  } 
  else {
    // Allow navigation
    next()
  }
})

export default router
