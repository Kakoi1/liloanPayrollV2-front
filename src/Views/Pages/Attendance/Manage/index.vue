<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Content Header -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">Payroll</h1>
          <div class="text-sm text-gray-500">
            <a href="/dashboard" class="text-blue-600 hover:text-blue-800">Home</a>
            <span class="mx-2">/</span>
            <span class="text-gray-700">Payroll Management</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Card Header -->
        <div class="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h3 class="text-white font-medium text-lg flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
            </svg>
            Payroll Management
          </h3>
          <div class="flex space-x-2">
            <button @click="maximizeCard" class="text-white hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button @click="collapseCard" class="text-white hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6" v-show="!isCollapsed">
          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <input
                type="search"
                v-model="search.text"
                @keyup="filter"
                placeholder="Search employees..."
                class="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    ID #
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fullname
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(m, index) in data" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ m.employeeId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ m.fullName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ m.position }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                   <ManagePayroll
                   :employee="m"
                   />
                  </td>
                </tr>
                <tr v-if="emptyResult">
                  <td colspan="4" class="px-6 py-12 text-center">
                    <div class="text-gray-400">
                      <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 class="text-xl font-medium">No Record Found</h3>
                      <p class="mt-2">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-6">
            <!-- <Pagination
              :current_page="currentPage"
              :row_count_page="rowCountPage"
              @page-update="pageUpdate"
              :total_users="totalUsers"
              :page_range="pageRange"
            /> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Payroll Modal -->
    <!-- <PayrollModal 
      :show="showPayrollModal"
      :employee="selectedEmployee"
      @close="closePayrollModal"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import Pagination from '@/Components/Pagination.vue'
// import PayrollModal from '@/Components/PayrollModal.vue'
import api from '@/Js/Services/axios'
import ManagePayroll from './Actions/ManagePayroll.vue'

// State
const search = ref({ text: '' })
const data = ref([])
const emptyResult = ref(false)
const currentPage = ref(1)
const rowCountPage = ref(10)
const totalUsers = ref(0)
const pageRange = ref(5)
const isCollapsed = ref(false)
const showPayrollModal = ref(false)
const selectedEmployee = ref(null)
const pageNum = ref(1)
const itemsPerPage = ref(10)

// Methods
const filter = async () => {
  try {
    const response = await api.post('/payroll/list', {
        search: search.value.text,
        page_num: pageNum.value,
        items_perpage: itemsPerPage.value
    })
    
    if (response.data.error) {
      console.error(response.data.message)
    } else {
      data.value = response.data.listEmployee
      totalUsers.value = response.data.total
      emptyResult.value = data.value.length === 0
    }
  } catch (error) {
    console.error('Failed to search:', error)
  }
}

const pageUpdate = (page) => {
  currentPage.value = page
  filter()
}

const maximizeCard = () => {
  // Implement maximize functionality
  console.log('Maximize card')
}

const collapseCard = () => {
  isCollapsed.value = !isCollapsed.value
}

const openPayrollModal = (employee) => {
  selectedEmployee.value = employee
  showPayrollModal.value = true
}

const closePayrollModal = () => {
  showPayrollModal.value = false
  selectedEmployee.value = null
}

// Initialize
onMounted(() => {
  filter()
})
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>