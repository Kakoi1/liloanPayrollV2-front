<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">LOGS</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="container-fluid px-6 py-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Card Header -->
            <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg flex justify-between items-center">
              <h5 class="text-white font-semibold text-lg">ACTIVITY LOGS</h5>
              <div class="flex space-x-2" id="tools">
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="maximize">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </button>
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="collapse">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <div class="flex flex-wrap">
                <!-- Filters -->
                <div class="w-full flex flex-wrap items-center gap-3 mb-4">
                  <!-- Search -->
                  <div class="w-full md:w-64">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Search:</label>
                    <input 
                      type="search" 
                      placeholder="Search by username, task, or class..." 
                      v-model="search.search"
                      @input="searchInput()"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <!-- Type Filter -->
                  <div class="w-full md:w-48">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                    <select 
                      v-model="search.type"
                      @change="handleFilterChange"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">All Types</option>
                      <option value="1">Add</option>
                      <option value="2">Edit</option>
                      <option value="3">Delete</option>
                    </select>
                  </div>

                  <!-- Date Range -->
                  <div class="w-full md:w-56">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date From:</label>
                    <input 
                      type="date" 
                      v-model="search.date_from" 
                      @change="handleFilterChange"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div class="w-full md:w-56">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date To:</label>
                    <input 
                      type="date" 
                      v-model="search.date_to" 
                      @change="handleFilterChange"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-wrap gap-2 mt-6">
                    <button 
                      @click="clearFilters" 
                      class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear Filters
                    </button>
                    <button 
                      @click="refreshLogs" 
                      class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                <!-- Active Filters Display -->
                <div v-if="hasActiveFilters" class="w-full mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-4 flex-wrap">
                      <span class="font-semibold text-gray-700">Active Filters:</span>
                      <span v-if="search.search" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Search: "{{ search.search }}"
                      </span>
                      <span v-if="search.type" class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Type: {{ getTypeLabel(search.type) }}
                      </span>
                      <span v-if="search.date_from" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        From: {{ formatDate(search.date_from) }}
                      </span>
                      <span v-if="search.date_to" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        To: {{ formatDate(search.date_to) }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-500">
                      Total: {{ data.totalrows || 0 }} records
                    </span>
                  </div>
                </div>

                <!-- Logs Table -->
                <div class="w-full mt-4">
                  <div class="overflow-x-auto border border-gray-200 rounded-lg">
                    <table class="w-full text-sm border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 text-center">#</th>
                          <th class="px-4 py-3 text-left">Username</th>
                          <th class="px-4 py-3 text-left">Task</th>
                          <th class="px-4 py-3 text-left">Class</th>
                          <th class="px-4 py-3 text-center">Type</th>
                          <th class="px-4 py-3 text-left">Description</th>
                          <th class="px-4 py-3 text-center">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="loading">
                          <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                            <div class="flex justify-center items-center">
                              <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span class="ml-2">Loading logs...</span>
                            </div>
                          </td>
                        </tr>
                        <tr v-else-if="!data.logs || data.logs.length === 0">
                          <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                            <div class="flex flex-col items-center">
                              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span class="font-medium">No logs found</span>
                              <span class="text-sm text-gray-400">Try adjusting your filters</span>
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(log, index) in data.logs" :key="log.id" class="hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-3 text-center text-gray-500">{{ (search.page_num - 1) * search.itemsperpage + index + 1 }}</td>
                          <td class="px-4 py-3 text-left font-medium">{{ log.username || '-' }}</td>
                          <td class="px-4 py-3 text-left">{{ log.task_name || '-' }}</td>
                          <td class="px-4 py-3 text-left">{{ log.className || '-' }}</td>
                          <td class="px-4 py-3 text-center">
                            <span :class="getTypeBadgeClass(log.type)">
                              {{ getTypeLabel(log.type) }}
                            </span>
                          </td>
                          <td class="px-4 py-3 text-left text-sm">{{ log.description || '-' }}</td>
                          <td class="px-4 py-3 text-center text-sm text-gray-600">
                            {{ log.DateOnly && log.TimeOnly ? `${log.DateOnly} ${log.TimeOnly}` : formatDateTime(log.date) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="w-full mt-4">
                  <Pagination
                    v-if="data.totalrows"
                    :page_number="search.page_num"
                    :total_rows="data.totalrows ?? 0"
                    :itemsperpage="search.itemsperpage"
                    @page_num="handlePagination"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import moment from 'moment'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Pagination from "@/Js/Components/Paginate.vue"
import { FormDx, useDebounce } from "@/Views/Utility/Helper"

// State
const data = ref({ logs: [], totalrows: 0 })
const loading = ref(false)

const search = ref({
  search: "",
  type: "",
  date_from: "",
  date_to: "",
  page_num: 1,
  itemsperpage: 10,
})

// Computed
const hasActiveFilters = computed(() => {
  return search.value.search || 
         search.value.type || 
         search.value.date_from || 
         search.value.date_to
})

// Methods
const maximize = () => {}
const collapse = () => {}

const formatDateTime = (date) => {
  if (!date) return '-'
  return moment(date).format('MMM DD, YYYY')
}

const formatDate = (date) => {
  if (!date) return ''
  return moment(date).format('MMM DD, YYYY')
}

const getTypeLabel = (type) => {
  const labels = {
    1: 'Add',
    2: 'Edit',
    3: 'Delete'
  }
  return labels[type] || 'Unknown'
}

const getTypeBadgeClass = (type) => {
  const classes = {
    1: 'px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full',
    2: 'px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full',
    3: 'px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full'
  }
  return classes[type] || 'px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full'
}

const searchInput = useDebounce(async () => {
  search.value.page_num = 1
  await listLogs()
}, 500)

const handleFilterChange = async () => {
  search.value.page_num = 1
  await listLogs()
}

const clearFilters = async () => {
  search.value.search = ""
  search.value.type = ""
  search.value.date_from = ""
  search.value.date_to = ""
  search.value.page_num = 1
  await listLogs()
  
  await Swal.fire({
    icon: 'info',
    title: 'Filters Cleared',
    text: 'All filters have been reset',
    timer: 1000,
    showConfirmButton: false
  })
}

const refreshLogs = async () => {
  await listLogs()
  await Swal.fire({
    icon: 'success',
    title: 'Refreshed',
    text: 'Logs have been updated',
    timer: 1000,
    showConfirmButton: false
  })
}

const listLogs = async () => {
  try {
    loading.value = true
    const formData = FormDx(search.value)
    const response = await api.post('logs/list', formData)
    
    if (response && !response.error) {
        data.value = response.data
      console.log(data.value);
      
    } else {
      data.value = { logs: [], totalrows: 0 }
    }
  } catch (error) {
    console.error('Failed to fetch logs:', error)
    data.value = { logs: [], totalrows: 0 }
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load logs. Please try again.',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1
  listLogs()
}

// Lifecycle
onMounted(() => {
  listLogs()
})
</script>

<style scoped>
@media print {
  .content-header,
  .bg-gradient-to-r,
  button {
    display: none;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>