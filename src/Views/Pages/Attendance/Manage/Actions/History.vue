<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Payroll History
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Payroll History"
      color="bg-gradient-to-r from-purple-600 to-purple-700"
      maxWidth="8xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Filter Section -->
        <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 class="font-medium text-purple-700 flex items-center mb-3">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Payroll History
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">From Date</label>
              <input 
                type="date" 
                v-model="filters.date_from" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">To Date</label>
              <input 
                type="date" 
                v-model="filters.date_to" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
            </div>
            <div class="flex items-end">
              <button 
                @click="fetchHistory" 
                class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- No Data Message -->
          <div v-if="payrollHistory.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 text-lg">No payroll history found</p>
            <p class="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new payroll</p>
          </div>

          <!-- Payroll History List -->
          <div v-for="payroll in payrollHistory" :key="payroll.id" class="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <!-- Payroll Header -->
            <div class="bg-gray-100 p-4 flex flex-wrap justify-between items-center">
              <div>
                <h3 class="font-semibold text-gray-800">Payroll #{{ payroll.id }}</h3>
                <p class="text-sm text-gray-600">
                  Period: {{ formatDate(payroll.dateFrom) }} - {{ formatDate(payroll.dateTo) }}
                </p>
                <p class="text-sm text-gray-600">
                  Date of Payroll: {{ formatDateTime(payroll.dateOfPayroll) }}
                </p>
              </div>
              <div class="flex items-center space-x-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getStatusClass(payroll.status)">
                  {{ getStatusText(payroll.status) }}
                </span>
                <button 
                  @click="togglePayrollDetails(payroll.id)"
                  class="text-purple-600 hover:text-purple-800"
                >
                  <svg 
                    class="w-5 h-5 transition-transform duration-200" 
                    :class="{ 'transform rotate-180': expandedPayroll === payroll.id }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Expanded Details -->
            <div v-if="expandedPayroll === payroll.id" class="p-4 bg-white space-y-4">
              <!-- Tasks Section -->
              <div v-if="payroll.tasks && payroll.tasks.length > 0">
                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Tasks
                </h4>
                <a
                    :href="`${VUE_APP_API_URL}payroll/pdf-payroll/${payroll.id}`"
                    @click.prevnet="
                        console.log(
                        `${VUE_APP_API_URL}payroll/pdf-payroll`
                        )
                    "
                    target="_blank"
                    class="bg-purple-500 ml-2 text-white hover:opacity-70 focus:bg-purple-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
                    >
                    Generate PDF
                </a>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm border-collapse">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Task Type</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Task</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Rate</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Tarima</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Deduction</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Net/Kg</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Total</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Remarks</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="task in payroll.tasks" :key="task.id" class="hover:bg-gray-50">
                        <td class="px-3 py-2">{{ formatDate(task.date) }}</td>
                        <td class="px-3 py-2">{{ task.task_name }}</td>
                        <td class="px-3 py-2">{{ task.name }}</td>
                        <td class="px-3 py-2">{{ formatCurrency(task.rate) }}</td>
                        <td class="px-3 py-2">{{ formatCurrency(task.tarima) }}</td>
                        <td class="px-3 py-2">{{ formatCurrency(task.deduction) }}</td>
                        <td class="px-3 py-2">{{ task.netKgPerEmp }}</td>
                        <td class="px-3 py-2 font-medium">{{ formatCurrency(task.total) }}</td>
                        <td class="px-3 py-2">{{ task.remarks || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Compensations Section -->
              <div v-if="payroll.Compensation && payroll.Compensation.length > 0">
                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Compensations
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm border-collapse">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Compensation</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Remarks</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="comp in payroll.Compensation" :key="comp.id" class="hover:bg-gray-50">
                        <td class="px-3 py-2">{{ comp.name }}</td>
                        <td class="px-3 py-2 font-medium" :class="{ 'text-green-600': comp.amount > 0, 'text-red-600': comp.amount < 0 }">
                          {{ formatCurrency(comp.amount) }}
                        </td>
                        <td class="px-3 py-2">{{ comp.remarks || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Government Deductions Section -->
              <div v-if="payroll.govDeduction && payroll.govDeduction.length > 0">
                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                  Government Deductions
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm border-collapse">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Name</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Remarks</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="ded in payroll.govDeduction" :key="ded.id" class="hover:bg-gray-50">
                        <td class="px-3 py-2">{{ ded.name || 'Deduction' }}</td>
                        <td class="px-3 py-2 font-medium text-red-600">{{ formatCurrency(ded.amount) }}</td>
                        <td class="px-3 py-2">{{ ded.remarks || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Summary -->
              <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex justify-end">
                  <div class="w-64 space-y-1">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tasks Total:</span>
                      <span class="font-medium">{{ calculateTasksTotal(payroll.tasks) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Compensations:</span>
                      <span class="font-medium text-green-600">{{ calculateCompensationsTotal(payroll.Compensation) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Gov't Deductions:</span>
                      <span class="font-medium text-red-600">{{ calculateGovDeductionsTotal(payroll.govDeduction) }}</span>
                    </div>
                    <div class="flex justify-between font-semibold pt-2 border-t border-gray-200">
                      <span class="text-gray-700">Net Total:</span>
                      <span class="text-purple-600">{{ calculateNetTotal(payroll) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalRows > 0" class="mt-6">
            <Pagination
              :page_number="filters.page_num"
              :total_rows="totalRows"
              :itemsperpage="filters.items_perpage"
              @page_num="handlePageNum"
            />
          </div>
        </template>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import Pagination from '@/Js/Components/Paginate.vue'
import { VUE_APP_API_URL } from '@/Views/Utility/Global'

const props = defineProps({
  employeeId: {
    type: [String, Number],
    required: true
  }
})

// State
const showModal = ref(false)
const loading = ref(false)
const payrollHistory = ref([])
const totalRows = ref(0)
const expandedPayroll = ref(null)

const filters = ref({
  employee_id: props.employeeId,
  date_from: '',
  date_to: '',
  page_num: 1,
  items_perpage: 10
})

// Methods
const openModal = () => {
  showModal.value = true
  resetFilters()
  fetchHistory()
}

const resetFilters = () => {
  filters.value = {
    employee_id: props.employeeId,
    date_from: '',
    date_to: '',
    page_num: 1,
    items_perpage: 10
  }
}

const handlePageNum = (page_num) => {
  filters.value.page_num = page_num
  fetchHistory()
}

const fetchHistory = async () => {
  loading.value = true
  
  try {
    const response = await api.post('/payroll/history', filters.value)
    
    if (response.data && !response.data.error) {
      payrollHistory.value = response.data.payroll || []
      totalRows.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch payroll history:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load payroll history',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const togglePayrollDetails = (payrollId) => {
  if (expandedPayroll.value === payrollId) {
    expandedPayroll.value = null
  } else {
    expandedPayroll.value = payrollId
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('MMM D, YYYY')
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('MMM D, YYYY h:mm A')
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '₱0.00'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const getStatusClass = (status) => {
  switch(status) {
    case 1:
      return 'bg-yellow-100 text-yellow-800'
    case 2:
      return 'bg-green-100 text-green-800'
    case 3:
      return 'bg-blue-100 text-blue-800'
    case 4:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 1:
      return 'Draft'
    case 2:
      return 'Submitted'
    case 3:
      return 'Approved'
    case 4:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const calculateTasksTotal = (tasks) => {
  if (!tasks || tasks.length === 0) return formatCurrency(0)
  const total = tasks.reduce((sum, task) => sum + (parseFloat(task.total) || 0), 0)
  return formatCurrency(total)
}

const calculateCompensationsTotal = (compensations) => {
  if (!compensations || compensations.length === 0) return formatCurrency(0)
  const total = compensations.reduce((sum, comp) => sum + (parseFloat(comp.amount) || 0), 0)
  return formatCurrency(total)
}

const calculateGovDeductionsTotal = (deductions) => {
  if (!deductions || deductions.length === 0) return formatCurrency(0)
  const total = deductions.reduce((sum, ded) => sum + (parseFloat(ded.amount) || 0), 0)
  return formatCurrency(total)
}

const calculateNetTotal = (payroll) => {
  const tasksTotal = (payroll.tasks || []).reduce((sum, task) => sum + (parseFloat(task.total) || 0), 0)
  const compTotal = (payroll.Compensation || []).reduce((sum, comp) => sum + (parseFloat(comp.amount) || 0), 0)
  const govTotal = (payroll.govDeduction || []).reduce((sum, ded) => sum + (parseFloat(ded.amount) || 0), 0)
  
  const net = tasksTotal + compTotal - govTotal
  return formatCurrency(net)
}

const closeModal = () => {
  showModal.value = false
  expandedPayroll.value = null
}
</script>