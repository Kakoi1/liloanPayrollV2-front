<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 relative z-20 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 float-right flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      New Deduction
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="New Deduction"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Deduction Information -->
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Deduction Information
          </h4>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter deduction name"
            />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
            <select 
              v-model="form.type" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0">--Select Type--</option>
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
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :placeholder="form.type == 1 ? 'Enter percentage' : 'Enter amount'"
            />
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <button 
            @click="saveDeduction" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            Save Deduction
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const emit = defineEmits(['saved'])

// State
const showModal = ref(false)
const form = ref({
  name: '',
  type: 0,
  amount: 0
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    type: 0,
    amount: 0
  }
}

const saveDeduction = async () => {
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
    const response = await api.post('/deductions/add', {
      deduction: form.value
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Deduction created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save deduction:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create deduction',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}
</script>