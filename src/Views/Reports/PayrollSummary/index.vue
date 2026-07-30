<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Payroll Summary</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Payroll</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Payroll Summary</li>
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
            <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
              <h5 class="text-white font-semibold text-lg">Payroll Summary</h5>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <!-- Filter -->
              <div class="mb-4 flex items-center gap-3">
                <select 
                  v-model="selectedPayrollPeriod" 
                  @change="fetchPayrollData"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                >
                  <option value="0">-- Select Payroll Period --</option>
                  <option v-for="period in payrollPeriods" :key="period.id" :value="period.id">
                    {{ period.datePeriod }}
                  </option>
                </select>
                
                <!-- Submit Button - Only show when selected period is not complete -->
                <button
                  v-if="selectedPayrollPeriod && !isSelectedPeriodComplete"
                  @click="submitPayroll"
                  :disabled="submitting"
                  class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fa fa-check-circle"></i>
                  <span>{{ submitting ? 'Submitting...' : 'Submit Payroll' }}</span>
                </button>
                
                <div class="flex-1"></div>
                
                <div class="flex justify-end gap-2">
                  <a
                    target="_blank"
                    v-if="selectedPayrollPeriod"
                    :href="`${VUE_APP_API_URL}reports/payroll-summary-excel-download/${selectedPayrollPeriod}`"
                    class="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200"
                  >
                    <i class="fa fa-file-excel"></i>
                    <span>Generate as Excel</span>
                  </a>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-2 text-gray-600">Loading...</span>
              </div>

              <!-- Table -->
              <div v-else class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-sm ">
                  <!-- Group Headers -->
                  <thead v-if="payroll.group_headers && payroll.group_headers.length > 0">
                    <tr class="bg-gray-100">
                      <th
                        v-for="group in payroll.group_headers"
                        :key="group.label"
                        :colspan="group.colspan"
                        class="px-4 py-2 border text-center font-bold"
                        :class="{
                            'bg-gray-700 text-white': group.color === 'employee',
                            'bg-blue-700 text-white': group.color === 'mandatory',
                            'bg-green-700 text-white': group.color === 'nonmandatory',
                            'bg-red-700 text-white': group.color === 'net'
                        }"
                      >
                        {{ group.label }}
                      </th>
                    </tr>
                  </thead>
                  
                  <!-- Column Headers -->
                  <thead class="bg-gray-50">
                    <tr>
                      <th 
                        v-for="header in payroll.headers" 
                        :key="header"
                        class="px-4 py-2 border text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap"
                      >
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  
                  <!-- Table Body -->
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr 
                      v-for="(row, index) in payroll.data" 
                      :key="index" 
                      class="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td 
                        v-for="header in payroll.headers" 
                        :key="header"
                        class="px-4 py-2 border whitespace-nowrap"
                        :class="getCellClass(row[header])"
                      >
                        {{ formatValue(row[header]) }}
                      </td>
                    </tr>

                    <tr>
                      <td 
                        v-for="header in payroll.headers" 
                        :key="header"
                        class="px-4 py-2 border text-white bg-red-500 whitespace-nowrap"
                        :class="getCellClass(payroll.totals[header])"
                      >
                        {{ formatValue(payroll.totals[header]) }}
                      </td>
                    </tr>

                    <!-- No Data Message -->
                    <tr v-if="payroll.data.length === 0">
                      <td 
                        :colspan="payroll.headers.length" 
                        class="px-4 py-8 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import api from '@/Js/Services/axios'
import { handleApiError } from '@/Views/Utility/Helper'
import { VUE_APP_API_URL } from '@/Views/Utility/Global'
import Swal from 'sweetalert2'

// State
const selectedPayrollPeriod = ref('')
const payrollPeriods = ref([])
const payroll = ref({
  headers: [],
  data: [],
  group_headers: [],
  totals: []
})
const loading = ref(false)
const submitting = ref(false)

// Computed property to check if selected period is complete
const isSelectedPeriodComplete = computed(() => {
  if (!selectedPayrollPeriod.value) return false
  const selectedPeriod = payrollPeriods.value.find(p => p.id === selectedPayrollPeriod.value)
  return selectedPeriod ? selectedPeriod.isComplete === 1 : false
})

// Helper function to format values
const formatValue = (value) => {
  if (value === null || value === undefined) return '0.00'
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  return value
}

// Get cell class based on value (red for negative/zero)
const getCellClass = (value) => {
  const numValue = parseFloat(value)
  if (isNaN(numValue)) return ''
  if (numValue < 0) return 'text-red-600 font-semibold'
  if (numValue === 0) return 'text-gray-400'
  return 'text-gray-700'
}

// Fetch payroll periods
const fetchPayrollPeriods = async () => {
  try {
    const response = await api.get('/payroll/get-periods')
    if (response.data && !response.data.error) {
      payrollPeriods.value = response.data.periods || []
      selectedPayrollPeriod.value = payrollPeriods.value.length > 0 ? payrollPeriods.value[0].id : 0
      fetchPayrollData();
    }
  } catch (error) {
    handleApiError(error)
    console.error('Failed to fetch payroll periods:', error)
  }
}

// Fetch payroll data
const fetchPayrollData = async () => {
  if (!selectedPayrollPeriod.value) {
    payroll.value.headers = []
    payroll.value.data = []
    payroll.value.group_headers = []
    return
  }
  
  loading.value = true
  try {
    const response = await api.post('/reports/payroll-summary', {
      payroll_period_id: selectedPayrollPeriod.value
    })
    
    payroll.value.headers = response.data?.headers || []
    payroll.value.data = response.data?.data || []
    payroll.value.group_headers = response.data?.group_headers || []
    payroll.value.totals = response.data?.totals || []
  } catch (error) {
    handleApiError(error)
    console.error('Failed to fetch payroll summary:', error)
    payroll.value.headers = []
    payroll.value.data = []
    payroll.value.group_headers = []
  } finally {
    loading.value = false
  }
}

// Submit payroll
const submitPayroll = async () => {
  if (!selectedPayrollPeriod.value) return
  submitting.value = true
  try {
    const result = await Swal.fire({
        title: 'Draft Tasks Exist', 
        text: 'There are draft tasks that haven\'t been saved. Do you want to save them before submitting?',
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonText: 'Submit', 
      })
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })  
      const response = await api.post('/payroll/submit-all', {
        payroll_period_id: selectedPayrollPeriod.value
      })

      if (response.data && !response.data.error) {
        await fetchPayrollPeriods()
        Swal.close()
        alert('')
        await Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Payroll submitted successfully!',
              timer: 1500,
              showConfirmButton: false
            })
      } else {
        alert(response.data?.message || 'Failed to submit payroll')
      }
    }
  } catch (error) {
    handleApiError(error)
    console.error('Failed to submit payroll:', error)
    alert('An error occurred while submitting payroll')
  } finally {
    submitting.value = false
  }
}

// Initialize
onMounted(() => {
  fetchPayrollPeriods()
})
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>