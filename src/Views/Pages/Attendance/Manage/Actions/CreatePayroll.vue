<!-- CreatePayrollModal.vue -->
<template>
  <!-- Button to open modal -->
  <button 
    @click="openModal"
    class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
  >
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    Create Payroll
  </button>

  <!-- Modal -->
  <Modal
    :show="showModal"
    :title="`Create Payroll - ${employee?.full_name || 'Select Employee'}`"
    :color="'bg-gradient-to-r from-green-600 to-green-800'"
    :max-width="'md'"
    :closeable="true"
    @close="closeModal"
  >
    <div class="p-6 bg-gray-50">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 mx-auto text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-600">Processing...</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Employee Info Card -->
      <div v-if="employee" class="mb-6 bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
        <div class="flex items-center">
          <div class="bg-green-600 p-2 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ employee.full_name || employee.fullName || 'N/A' }}</p>
            <p class="text-xs text-gray-600">ID: {{ employee.employeeId || employee.id || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Date Range Selection -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input 
            type="date" 
            v-model="dateRange.from" 
            :max="dateRange.to || maxToDate"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            :class="{ 'border-red-300': errors.from }"
          >
          <p v-if="errors.from" class="mt-1 text-xs text-red-600">{{ errors.from }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input 
            type="date" 
            v-model="dateRange.to" 
            :min="dateRange.from"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            :class="{ 'border-red-300': errors.to }"
          >
          <p v-if="errors.to" class="mt-1 text-xs text-red-600">{{ errors.to }}</p>
        </div>

        <!-- Selected Range Summary -->
        <div v-if="dateRange.from && dateRange.to" class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p class="text-sm text-green-800">
            <span class="font-medium">Period:</span> {{ formatDate(dateRange.from) }} - {{ formatDate(dateRange.to) }}
          </p>
          <p class="text-xs text-green-600 mt-1">
            {{ calculateDays }} days
          </p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="closeModal"
          type="button"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button 
          @click="createPayroll"
          :disabled="!isValidDateRange || loading"
          class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Creating...' : 'Create Payroll' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['payroll-created', 'closed'])

// State
const showModal = ref(false)
const loading = ref(false)
const error = ref('')

const dateRange = ref({
  from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
  to: moment().format('YYYY-MM-DD')
})

const errors = ref({
  from: '',
  to: ''
})

// Computed properties
const maxToDate = computed(() => moment().format('YYYY-MM-DD'))

const isValidDateRange = computed(() => {
  return dateRange.value.from && dateRange.value.to && dateRange.value.from <= dateRange.value.to
})

const calculateDays = computed(() => {
  if (!dateRange.value.from || !dateRange.value.to) return 0
  const start = moment(dateRange.value.from)
  const end = moment(dateRange.value.to)
  return end.diff(start, 'days') + 1
})

// Methods
const openModal = () => {
  showModal.value = true
  error.value = ''
}

const closeModal = () => {
  showModal.value = false
  error.value = ''
  emit('closed')
}

const validateDates = () => {
  errors.value = { from: '', to: '' }
  let isValid = true
  
  if (!dateRange.value.from) {
    errors.value.from = 'From date is required'
    isValid = false
  }
  
  if (!dateRange.value.to) {
    errors.value.to = 'To date is required'
    isValid = false
  }
  
  if (dateRange.value.from && dateRange.value.to && dateRange.value.from > dateRange.value.to) {
    errors.value.to = 'To date must be after from date'
    isValid = false
  }
  
  return isValid
}

const createPayroll = async () => {
  if (!validateDates()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.post('/payroll/create', {
      employee_id: props.employee.id || props.employee.employeeId,
      from_date: dateRange.value.from,
      to_date: dateRange.value.to
    })
    
    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Payroll created for ${moment(dateRange.value.from).format('MMM D, YYYY')} - ${moment(dateRange.value.to).format('MMM D, YYYY')}`,
        timer: 2000,
        showConfirmButton: false
      })
      
      emit('payroll-created', response.data)
      closeModal()
    } else {
      throw new Error(response.data?.message || 'Failed to create payroll')
    }
  } catch (err) {
    console.error('Failed to create payroll:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to create payroll'
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.value,
      timer: 2000,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (date) => {
  return moment(date).format('MMM D, YYYY')
}
</script>