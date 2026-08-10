<template>
  <div>
    <!-- View Button -->
    <button 
        @click="openModal" 
        class="text-blue-600 hover:text-blue-800" title="View"
    >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Cash Advance Details"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="p-6" v-if="cashAdvanceData">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p class="text-sm text-gray-600">Total Amount</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(cashAdvanceData.amount) }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <p class="text-sm text-gray-600">Balance</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(cashAdvanceData.balance || cashAdvanceData.amount) }}</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p class="text-sm text-gray-600">Status</p>
            <p class="text-xl font-bold">
              <span :class="getStatusClass(cashAdvanceData.status)">
                {{getStatusText(cashAdvanceData.status) }}
              </span>
            </p>
          </div>
        </div>

        <!-- Supplier Info -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Supplier</p>
              <p class="font-semibold">{{ cashAdvanceData.supplier_name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Request Date</p>
              <p class="font-semibold">{{cashAdvanceData.date}}</p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-600">Remarks</p>
              <p class="font-semibold">{{ cashAdvanceData.remarks || 'No remarks' }}</p>
            </div>
          </div>
        </div>

        <!-- Transactions Table with Deduct Button -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-semibold text-gray-700">Transaction History</h4>
            <button 
              v-if="cashAdvanceData.status !== 2"
              @click="openDeductModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4M12 4v16"></path>
              </svg>
              Add Deduction
            </button>
          </div>
          <div class="overflow-x-auto border rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 ">
              <thead class="bg-gray-50 font-bold">
                <tr>
                  <th class="px-4 py-3 text-left text-md font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-3 text-center text-md font-medium text-gray-500 uppercase">Amount</th>
                  <th class="px-4 py-3 text-center text-md font-medium text-gray-500 uppercase">Remarks</th>
                  <th class="px-4 py-3 text-center text-md font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 font-semibold">
                <tr v-if="!transactions?.length">
                  <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
                <tr v-for="(transaction, index) in transactions" :key="index" class="hover:bg-gray-50" :class="transaction.refId == 0 ? 'bg-red-100' : 'bg-green-100'">
                  <td class="px-4 py-3 text-md">{{ formatDate(transaction.created_at || transaction.date) }}</td>
                  <td class="px-4 py-3 text-md text-center" :class="transaction.refId  == 0 ? 'text-red-600' : 'text-green-600'">
                    {{ formatCurrency(transaction.amount) }}
                  </td>
                  <td class="px-4 py-3 text-md text-center">
                    {{ transaction.remarks || 'N/A' }}
                  </td>
                  <td class="px-4 py-3 text-md text-center flex justify-center gap-2">
                    <EditTransaction :record="transaction" @updated="fetchCashAdvanceData"/>
                    <DeleteTransaction :transId="transaction.id" @updated="fetchCashAdvanceData" v-if="transaction.refId == 0"/>
                  </td>
                </tr>
              </tbody>
              <!-- <tfoot v-if="transactions?.length" class="bg-gray-50 font-bold">
                <tr>
                  <td class="px-4 py-3 text-right">Total</td>
                  <td class="px-4 py-3 text-right text-blue-600">{{ formatCurrency(cashAdvanceData.amount) }}</td>
                </tr>
              </tfoot> -->
            </table>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
          <button 
            @click="closeModal"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>

    <!-- Deduction Modal -->
    <Modal 
      :show="showDeductModal" 
      @close="closeDeductModal"
      title="Add Manual Deduction"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="md"
      :closeable="true"
    >
      <div class="p-6">
        <form @submit.prevent="submitDeduction">
          <!-- Current Balance Display -->
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">Current Balance</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(cashAdvanceData?.balance || cashAdvanceData?.amount) }}
            </p>
          </div>

          <!-- Deduction Amount -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Deduction Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500">₱</span>
              <input 
                type="number" 
                v-model="deductionForm.amount"
                step="0.01"
                min="0.01"
                :max="cashAdvanceData?.balance || cashAdvanceData?.amount"
                required
                class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <p v-if="deductionForm.amount > (cashAdvanceData?.balance || cashAdvanceData?.amount)" 
               class="text-red-500 text-sm mt-1">
              Amount cannot exceed the current balance
            </p>
          </div>

          <!-- Deduction Date -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Deduction Date <span class="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              v-model="deductionForm.date"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Remarks -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Remarks <span class="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea 
              v-model="deductionForm.remarks"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter deduction remarks..."
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              @click="closeDeductModal"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting || !isValidDeduction"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Processing...' : 'Add Deduction' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import Modal from '@/Js/Components/Modal.vue'
import { handleApiError } from '@/Views/Utility/Helper'
import api from '@/Js/Services/axios'
import EditTransaction from './EditTransaction.vue'
import DeleteTransaction from './DeleteTransaction.vue'

const props = defineProps({
  caId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['saved', 'close', 'deduction-added'])

// State
const showModal = ref(false)
const showDeductModal = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const cashAdvanceData = ref(null)
const transactions = ref([])
const deductionForm = ref({
  amount: '',
  date: '',
  remarks: ''
})

// Computed
const isValidDeduction = computed(() => {
  const amount = parseFloat(deductionForm.value.amount)
  const balance = cashAdvanceData.value?.balance || cashAdvanceData.value?.amount || 0
  return amount > 0 && amount <= balance && deductionForm.value.date
})

// Helper functions
const formatCurrency = (amount) => {
  if (!amount) return '₱0.00'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    1: 'bg-purple-100 text-purple-800',
    2: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    1: 'Released',
    2: 'Fully Paid'
  }
  return texts[status] || status
}

const formatDate = (date) => {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Fetch cash advance data
const fetchCashAdvanceData = async () => {
  if (!props.caId) return
  
  isLoading.value = true
  try {
    const response = await api.post(`/cash-advance/transactions`, {ca_id: props.caId})
    
    if (response.data && !response.data.error) {
        cashAdvanceData.value = response.data.data || response.data
        transactions.value = response.data.transactions || []
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to load cash advance data'
      })
      closeModal()
    }
  } catch (error) {
    console.error('Fetch error:', error)
    handleApiError(error)
    closeModal()
  } finally {
    isLoading.value = false
  }
}

const openModal = () => {
  if (props.caId > 0) {
    fetchCashAdvanceData()
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
  emit('close')
  cashAdvanceData.value = null
  transactions.value = []
}

// Deduction modal functions
const openDeductModal = () => {
  // Set default date to today
  const today = new Date().toISOString().split('T')[0]
  deductionForm.value = {
    amount: '',
    date: today,
    remarks: ''
  }
  showDeductModal.value = true
}

const closeDeductModal = () => {
  showDeductModal.value = false
  deductionForm.value = {
    amount: '',
    date: '',
    remarks: ''
  }
}

const submitDeduction = async () => {
  if (!isValidDeduction.value) return
  
  isSubmitting.value = true
  try {
    const payload = {
      ca_id: props.caId,
      amount: parseFloat(deductionForm.value.amount),
      date: deductionForm.value.date,
      remarks: deductionForm.value.remarks || 'Manual deduction'
    }
    
    const response = await api.post('/cash-advance/add-deduction', payload)
    
    if (response.data && !response.data.error) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Deduction added successfully'
      })
      
      // Refresh data
      await fetchCashAdvanceData()
      emit('deduction-added', response.data.data)
      closeDeductModal()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to add deduction'
      })
    }
  } catch (error) {
    console.error('Deduction error:', error)
    handleApiError(error)
  } finally {
    isSubmitting.value = false
  }
}

// Expose methods
defineExpose({ open: openModal })
</script>