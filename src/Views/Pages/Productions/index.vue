<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Production</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Production</li>
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
              <h5 class="text-white font-semibold text-lg uppercase">Production Task Report</h5>
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
                <!-- Date Range and Action Buttons -->
                <div class="w-full flex flex-wrap items-end gap-3 mb-4">
                  <div class="w-full md:w-48">
                    <label class="block text-xs text-gray-500 mb-1">From Date</label>
                    <input 
                      type="date" 
                      v-on:change="list"
                      v-model="production.dateFrom" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div class="w-full md:w-48">
                    <label class="block text-xs text-gray-500 mb-1">To Date</label>
                    <input 
                      type="date" 
                      v-model="production.dateTo" 
                       v-on:change="list"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      @click="list" 
                      class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Generate Report
                    </button>
                    <button 
                      @click="excel" 
                      class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Excel
                    </button>
                    <button 
                      @click="printReport" 
                      class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Report
                    </button>
                  </div>
                  <!-- Add Production Task Button -->
                  <AddProductionTask @saved="list" />
                </div>

                <!-- Production Data -->
                <div class="w-full mt-4 overflow-x-auto">
                  <template v-for="(productions, date) in groupedData" :key="date">
                    <div class="mb-4">
                      <div class="bg-gray-100 p-3 rounded-t-lg border border-gray-200">
                        <strong class="text-gray-700">DATE {{ formatDate(date) }}</strong>
                      </div>
                      <table class="w-full text-sm border-collapse border border-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-4 py-3 text-left font-medium text-gray-700">Class</th>
                            <th class="px-4 py-3 text-left font-medium text-gray-700">Task</th>
                            <th class="px-4 py-3 text-right font-medium text-gray-700">Jumbo/Tarema</th>
                            <th class="px-4 py-3 text-right font-medium text-gray-700">Weight</th>
                            <th class="px-4 py-3 text-right font-medium text-gray-700">Waste</th>
                            <th class="px-4 py-3 text-left font-medium text-gray-700">Employee(s)</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          <tr v-for="(item, index) in productions" :key="index" class="hover:bg-gray-50">
                            <td class="px-4 py-2 text-left">{{ item.className || 'N/A' }}</td>
                            <td class="px-4 py-2 text-left">{{ item.taskName || 'N/A' }}</td>
                            <td class="px-4 py-2 text-right">{{ formatNumber(item.jumbo) }}</td>
                            <td class="px-4 py-2 text-right">{{ formatNumber(item.weight) }}</td>
                            <td class="px-4 py-2 text-right">{{ formatNumber(item.waste) }}</td>
                            <td class="px-4 py-2 text-left">
                              <div class="flex flex-wrap gap-1">
                                <span 
                                  v-for="(worker, idx) in item.worker.split(',')" 
                                  :key="idx"
                                  class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {{ worker.trim() }}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                  
                  <!-- No Data Message -->
                  <div v-if="Object.keys(groupedData).length === 0" class="text-center py-8">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p class="text-gray-500 text-lg">No production data found</p>
                    <p class="text-gray-400 text-sm mt-2">Select a date range and click "Generate Report"</p>
                  </div>
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
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import AddProductionTask from './Actions/add.vue'

// State
const productions = ref([])
const production = ref({
  dateFrom: moment().format('YYYY-MM-DD'),
  dateTo: moment().format('YYYY-MM-DD')
})

// Computed property to group productions by date
const groupedData = computed(() => {
  const grouped = {}
  productions.value.forEach(item => {
    if (!grouped[item.date]) {
      grouped[item.date] = []
    }
    grouped[item.date].push(item)
  })
  return grouped
})

// Methods
const maximize = () => {
  // Implement maximize functionality
}

const collapse = () => {
  // Implement collapse functionality
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('MMMM D, YYYY')
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value).toFixed(2)
}

const list = async () => {
  if (!production.value.dateFrom || !production.value.dateTo) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select from and to dates',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/productions/list', {
      date_from: production.value.dateFrom,
      date_to: production.value.dateTo
    })
    
    if (response.data && !response.data.error) {
      productions.value = response.data.productions || []
    }
  } catch (error) {
    console.error('Failed to fetch production data:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load production data',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const excel = async () => {
  if (!production.value.dateFrom || !production.value.dateTo) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select from and to dates first',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    // Implement Excel download
    window.open(`/productions/excel?date_from=${production.value.dateFrom}&date_to=${production.value.dateTo}`, '_blank')
  } catch (error) {
    console.error('Failed to generate Excel:', error)
  }
}

const printReport = async () => {
  if (!production.value.dateFrom || !production.value.dateTo) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select from and to dates first',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Implement print functionality
  window.print()
}

// Initialize
onMounted(() => {
  // Optionally load initial data
  list()
})
</script>

<style scoped>
/* Add any additional custom styles here */
@media print {
  .content-header,
  .bg-gradient-to-r,
  button {
    display: none;
  }
}
</style>