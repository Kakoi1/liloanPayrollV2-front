<template>
  <Modal 
    :show="showModal" 
    @close="closeModal" 
    title="New Supplier Cash Advance"
    color="bg-gradient-to-r from-green-600 to-green-700"
    maxWidth="lg"
  >
    <div class="p-6">
      <form @submit.prevent="save">
        <div class="space-y-4">
          <!-- Supplier Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Supplier <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.supplier_id" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Supplier</option>
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.name }} - {{ supplier.supplier_code }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">₱</span>
              <input 
                type="number" 
                v-model="form.amount" 
                required
                min="1"
                step="0.01"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              >
            </div>
          </div>

          <!-- Request Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Request Date <span class="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              v-model="form.request_date" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>

          <!-- Payment Terms -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.payment_terms" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Payment Terms</option>
              <option value="30 days">30 days</option>
              <option value="60 days">60 days</option>
              <option value="90 days">90 days</option>
              <option value="Upon delivery">Upon delivery</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>

          <!-- Expected Delivery Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
            <input 
              type="date" 
              v-model="form.expected_delivery" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>

          <!-- Remarks -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Purpose / Remarks</label>
            <textarea 
              v-model="form.remarks" 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="State the purpose of cash advance..."
            ></textarea>
          </div>

          <!-- Summary Preview -->
          <div class="bg-gray-50 p-4 rounded-lg mt-2">
            <h4 class="font-semibold text-gray-700 mb-2">Summary</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Amount:</span>
                <span class="font-semibold">{{ formatCurrency(form.amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Payment Terms:</span>
                <span>{{ form.payment_terms || 'Not specified' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <button 
            type="button"
            @click="closeModal" 
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Submit Request
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  suppliers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['saved', 'close'])

const showModal = ref(false)
const form = ref({
  supplier_id: '',
  amount: '',
  request_date: new Date().toISOString().split('T')[0],
  payment_terms: '',
  expected_delivery: '',
  remarks: ''
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount || 0)
}

const resetForm = () => {
  form.value = {
    supplier_id: '',
    amount: '',
    request_date: new Date().toISOString().split('T')[0],
    payment_terms: '',
    expected_delivery: '',
    remarks: ''
  }
}

const open = () => {
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  emit('close')
  resetForm()
}

const save = async () => {
  // Validation
  if (!form.value.supplier_id) {
    Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select a supplier', timer: 1500, showConfirmButton: false })
    return
  }
  if (!form.value.amount || form.value.amount <= 0) {
    Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please enter a valid amount', timer: 1500, showConfirmButton: false })
    return
  }
  if (!form.value.payment_terms) {
    Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select payment terms', timer: 1500, showConfirmButton: false })
    return
  }

  try {
    emit('saved', { ...form.value })
    closeModal()
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save request', timer: 1500, showConfirmButton: false })
  }
}

defineExpose({ open })
</script>