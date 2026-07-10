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
              <span :class="cashAdvanceData.status === 'active' ? 'text-green-600' : 'text-gray-600'">
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

        <!-- Transactions Table -->
        <div>
          <h4 class="font-semibold text-gray-700 mb-3">Transaction History</h4>
          <div class="overflow-x-auto border rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <!-- <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th> -->
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <!-- <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th> -->
                  <!-- <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th> -->
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="!transactions?.length">
                  <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
                <tr v-for="(transaction, index) in transactions" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">{{ formatDate(transaction.created_at || transaction.date) }}</td>
                  <!-- <td class="px-4 py-3 text-sm">
                    <span :class="transaction.type === 'payment' ? 'text-blue-600' : 'text-green-600'">
                      {{ transaction.type || 'Payment' }}
                    </span>
                  </td> -->
                  <td class="px-4 py-3 text-sm text-right" :class="transaction.amount < 0 ? 'text-red-600' : 'text-green-600'">
                    {{ formatCurrency(transaction.amount) }}
                  </td>
                  <!-- <td class="px-4 py-3 text-sm text-right">{{ formatCurrency(transaction.balance) }}</td> -->
                  <!-- <td class="px-4 py-3 text-sm text-gray-600">{{ transaction.reference || '—' }}</td> -->
                </tr>
              </tbody>
              <tfoot v-if="cashAdvanceData.transactions?.length" class="bg-gray-50 font-bold">
                <tr>
                  <td colspan="2" class="px-4 py-3 text-right">Total</td>
                  <td class="px-4 py-3 text-right text-blue-600">{{ formatCurrency(cashAdvanceData.amount) }}</td>
                  <td class="px-4 py-3 text-right text-green-600">{{ formatCurrency(cashAdvanceData.balance || cashAdvanceData.amount) }}</td>
                  <td></td>
                </tr>
              </tfoot>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import Modal from '@/Js/Components/Modal.vue'
import { handleApiError } from '@/Views/Utility/Helper'
import api from '@/Js/Services/axios'

const props = defineProps({
  caId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['saved', 'close'])

// State
const showModal = ref(false)
const isLoading = ref(false)
const cashAdvanceData = ref(null)
const transactions = ref([])

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
    // pending: 'bg-yellow-100 text-yellow-800',
    // approved: 'bg-blue-100 text-blue-800',
    1: 'bg-purple-100 text-purple-800',
    2: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    // pending: 'Pending',
    // approved: 'Approved',
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
}

// Expose methods
defineExpose({ open: openModal })
</script>