<template>
  <div>
    <!-- Add Button -->
    <button 
      @click="openModal" 
      class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add New
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Add Compensation/Deduction"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="lg"
      :closeable="true"
    >
      <form @submit.prevent="save" class="space-y-4 p-2">
        <!-- Supplier Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Supplier <span class="text-red-500">*</span>
          </label>
          <SearchDropdown
            :apiEndpoint="'suppliers/active-list'"
              :searchModel="searchSup"
              placeholder="Search for supplier..."
              itemLabel="supplier_name"
              itemId="supplier_id"
              returnName="['supplier_name']"
              dataKey="suppliers"
              @item-selected="handleSupplierSelected"
              :defaultValue="selectedSupplier?.supplier_name"
              formatLabel="none"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span v-if="selectedSupplier" class="inline-flex items-center rounded-md bg-red-400/10 p-2 mt-1 text-sm font-medium text-red-400 inset-ring inset-ring-red-400/20 border border-red-400/20">Supplier: {{ selectedSupplier.supplier_name }}</span>
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
              min="0.01"
              step="0.01"
              :class="[
                'w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500',
              ]"
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
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500',
            ]"
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
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-700 mb-2">Summary</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Supplier:</span>
              <span class="font-medium"> {{ selectedSupplier ? selectedSupplier.supplier_name : 'Not selected' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Amount:</span>
              <span class="font-semibold">{{ formatCurrency(form.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Request Date:</span>
              <span>{{ formatDate(form.request_date) }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            type="button"
            @click="closeModal" 
            :disabled="isLoading"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            type="submit"
            @click="save" 
            :disabled="isLoading"
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <!-- Loading Spinner -->
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <!-- Submit Icon -->
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            {{ isLoading ? 'Submitting...' : 'Submit Request' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import Modal from '@/Js/Components/Modal.vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'
import { handleApiError } from '@/Views/Utility/Helper'
import api from '@/Js/Services/axios'

const props = defineProps({
  suppliers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['saved', 'close'])

// State
const showModal = ref(false)
const isLoading = ref(false)
const searchSup = ref({
    search: '',
    itemsperpage: 10,
    page_num: 1
})
const selectedSupplier = ref(null)


// Form
const form = ref({
  supplier_id: '',
  amount: '',
  request_date: new Date().toISOString().split('T')[0],
  remarks: ''
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount || 0)
}

const formatDate = (date) => {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const resetForm = () => {
  form.value = {
    supplier_id: '',
    amount: '',
    request_date: new Date().toISOString().split('T')[0],
    remarks: ''
  }
}

const handleSupplierSelected = (supplier) => {
  form.value.supplier_id = supplier.id
  selectedSupplier.value = supplier
  // Clear validation error for supplier
}
const validate = () => {
  const errors = {}
  
  if (!form.value.supplier_id) {
    errors.supplier_id = 'Please select a supplier'
  }
  
  if (!form.value.amount || form.value.amount <= 0) {
    errors.amount = 'Please enter a valid amount'
  }
  
  if (!form.value.request_date) {
    errors.request_date = 'Please select a request date'
  }
  return Object.keys(errors).length === 0
}

const openModal = () => {
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  // emit('close')
  resetForm()
}

const save = async () => {

  isLoading.value = true
  try {
    // Prepare data for submission
    const submissionData = {
      supplier_id: form.value.supplier_id,
      amount: parseFloat(form.value.amount),
      request_date: form.value.request_date,
      remarks: form.value.remarks || ''
    }

    const response = await api.post('/cash-advance/add', submissionData)

    if (response.data && !response.data.error) {
      console.log('this work');
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Compensation/Deduction request has been submitted',
        timer: 2000,
        showConfirmButton: false
      })
      emit('saved')
      closeModal()
    }

  } catch (error) {
    console.error('Save error:', error)
    handleApiError(error)

  } finally {
    isLoading.value = false
  }
}

// Keyboard shortcuts
const handleKeydown = (e) => {
  if (e.key === 'Escape' && showModal.value && !isLoading.value) {
    closeModal()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Expose methods
defineExpose({ open: openModal })
</script>

<style scoped>
/* Add any custom styles here */
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