<template>
  <div>
    <!-- View Button -->
    <button 
      @click="openViewModal" 
      class="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
      :title="'View Voucher'"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      :title="'View Voucher #' + (vdata.voucher?.[0]?.id || '')"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="6xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Content -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Paid To -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paid To:</label>
              <p class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">{{ vdata.voucher?.[0]?.supplier_name || 'N/A' }}</p>
            </div>

            <!-- Weigh Slip No -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Weigh Slip No:</label>
              <p class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">{{ vdata.voucher?.[0]?.weightSlip || 'N/A' }}</p>
            </div>

            <!-- Driver -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Driver:</label>
              <p class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">{{ vdata.voucher?.[0]?.driver || 'N/A' }}</p>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date:</label>
              <p class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">{{ vdata.voucher?.[0]?.paymentDate || 'N/A' }}</p>
            </div>

            <!-- Workers -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Workers:</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                <div v-if="vdata.voucherWorker && vdata.voucherWorker.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="(worker, index) in vdata.voucherWorker" 
                    :key="index"
                    class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {{ worker.fullName }} ({{ worker.employeeId }})
                  </span>
                </div>
                <span v-else class="text-gray-500">No workers assigned</span>
              </div>
            </div>

            <!-- Transaction Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Time:</label>
              <p class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {{ vdata.voucher?.[0]?.transactionTime == 1 ? 'Morning' : 'Afternoon' }}
              </p>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <p class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                <span :class="getStatusClass(vdata.voucher?.[0]?.status)">
                  {{ getStatusText(vdata.voucher?.[0]?.status) }}
                </span>
              </p>
            </div>
          </div>

          <!-- Particulars Table -->
          <div class="mt-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Particulars</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th colspan="7" class="px-3 py-2 text-left font-medium text-gray-700">Particulars</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Amount</th>
                  </tr>
                  <tr class="bg-gray-50">
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">BackHoe?</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Item</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Gross Weight</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Ded. Amt.</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Net Weight</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Rate</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Deduction Type</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Total Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(item, index) in vdata.voucherItem" :key="index" class="hover:bg-gray-50">
                    <td class="px-3 py-2">
                      <span 
                        :class="item.isBackhoe == 1 ? 'inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full' : 'inline-flex items-center px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full'"
                      >
                        <i :class="item.isBackhoe == 1 ? 'fas fa-check mr-1' : 'fas fa-times mr-1'"></i>
                        {{ item.isBackhoe == 1 ? 'Yes' : 'No' }}
                      </span>
                    </td>
                    <td class="px-3 py-2">{{ item.itemName || 'N/A' }}</td>
                    <td class="px-3 py-2">{{ formatNumber(item.grossWeight) }}</td>
                    <td class="px-3 py-2">{{ formatNumber(item.deductionAmount) }}</td>
                    <td class="px-3 py-2">{{ formatNumber(item.netWeight) }}</td>
                    <td class="px-3 py-2">{{ formatCurrency(item.itemPrice) }}</td>
                    <td class="px-3 py-2">
                      <div class="flex flex-wrap gap-1">
                        <template v-if="item.deductionType && item.deductionType[0] && item.deductionType[0].length > 0">
                          <span 
                            v-for="(deduction, dIndex) in item.deductionType[0]" 
                            :key="dIndex"
                            class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                            :title="`Amount: ${deduction.amount}`"
                          >
                            {{ deduction.name }}
                            <span class="ml-1 text-xs opacity-75">({{ deduction.amount }})</span>
                          </span>
                        </template>
                        <span v-else class="text-gray-400 text-xs">None</span>
                      </div>
                    </td>
                    <td class="px-3 py-2 font-medium">{{ formatCurrency(item.totalAmount) }}</td>
                  </tr>
                  <tr v-if="!vdata.voucherItem || vdata.voucherItem.length === 0">
                    <td colspan="8" class="px-3 py-4 text-center text-gray-500">
                      No items found for this voucher.
                    </td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td colspan="6"></td>
                    <td class="px-3 py-2 text-right font-medium">Add/Less:</td>
                    <td class="px-3 py-2 text-center font-medium">
                      {{ formatCurrency(vdata.voucher?.[0]?.addLess) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-100 font-bold">
                  <tr>
                    <td colspan="6"></td>
                    <td class="px-3 py-3 text-right text-red-600">Total:</td>
                    <td class="px-3 py-3 text-center text-red-600">
                      {{ calculateTotalView }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Formula Information -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-xs font-medium text-gray-700 mb-1">Formula:</p>
            <p class="text-xs text-gray-600">Deduction Amount: Item deduction % + Accumulated Deduction type total</p>
            <p class="text-xs text-gray-600">Net Weight: Gross weight - Deduction Amount</p>
            <p class="text-xs text-gray-600">Total Amount: Net weight × Rate</p>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end mt-6">
            <button 
              @click="closeModal" 
              class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  voucherId: {
    type: [String, Number],
    required: true
  }
})

// State
const showModal = ref(false)
const loading = ref(false)
const vdata = ref({
  voucher: [],
  voucherItem: [],
  voucherWorker: []
})

// Computed
const calculateTotalView = computed(() => {
  if (!vdata.value.voucherItem || vdata.value.voucherItem.length === 0) return formatCurrency(0)
  
  const total = vdata.value.voucherItem.reduce((sum, item) => {
    return sum + (parseFloat(item.totalAmount) || 0)
  }, 0)
  
  const addLess = parseFloat(vdata.value.voucher?.[0]?.addLess) || 0
  
  return formatCurrency(total + addLess)
})

// Methods
const openViewModal = async () => {
  showModal.value = true
  await fetchVoucherData()
}

const fetchVoucherData = async () => {
  loading.value = true
  
  try {
    const response = await api.post('/vouchers/show', {
      voucher_id: props.voucherId
    })
    
    if (response.data && !response.data.error) {
      vdata.value = response.data
      console.log('Voucher data:', vdata.value)
    } else {
      throw new Error(response.data?.message || 'Failed to fetch voucher data')
    }
  } catch (error) {
    console.error('Failed to fetch voucher data:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load voucher details',
      timer: 1500,
      showConfirmButton: false
    })
    closeModal()
  } finally {
    loading.value = false
  }
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0.00'
  return parseFloat(value).toFixed(2)
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
      return 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'
    case 2:
      return 'px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'
    case 3:
      return 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'
    case 4:
      return 'px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'
    default:
      return 'px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full'
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 1:
      return 'Pending'
    case 2:
      return 'Processing'
    case 3:
      return 'Paid'
    case 4:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const closeModal = () => {
  showModal.value = false
  // Reset data when closing
  vdata.value = {
    voucher: [],
    voucherItem: [],
    voucherWorker: []
  }
}
</script>