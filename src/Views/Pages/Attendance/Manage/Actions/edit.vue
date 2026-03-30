<template>
  <div>
    <!-- Edit Button -->
    <button 
      @click="openModal" 
      class="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
      title="Edit Deduction"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Edit Deduction"
      color="bg-gradient-to-r from-yellow-500 to-yellow-600"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Deduction Information -->
        <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 class="font-medium text-yellow-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Deduction Information
          </h4>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- ID -->
          <div>
            <input 
              readonly
              v-model="form.id" 
              type="hidden" 
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
            />
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter deduction name"
            />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
            <select 
              v-model="form.type" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">--Select Type--</option>
              <option value="1">Deduct By Weight</option>
              <option value="2">Deduct By Rate/Price</option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ form.type == 1 ? 'Net Weight %' : 'Amount' }}:
            </label>
            <input 
              v-model="form.amount" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              :placeholder="form.type == 1 ? 'Enter percentage' : 'Enter amount'"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            @click="updateDeduction" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Update
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  deduction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated'])

// State
const showModal = ref(false)
const form = ref({
  id: '',
  name: '',
  type: '',
  amount: ''
})

// Watch for deduction changes
watch(() => props.deduction, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id || newVal.deduction_id,
      name: newVal.name || '',
      type: newVal.type || '',
      amount: newVal.amount || ''
    }
  }
}, { immediate: true })

// Methods
const openModal = () => {
  showModal.value = true
}

const updateDeduction = async () => {
  // Validate required fields
  if (!form.value.name) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter deduction name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!form.value.type) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select deduction type',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!form.value.amount) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter amount/percentage',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/deductions/update', {
      deduction: form.value
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Deduction updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('updated')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to update deduction:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update deduction',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
}
</script>