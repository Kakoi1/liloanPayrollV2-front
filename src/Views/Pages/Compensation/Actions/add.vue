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
      <div class="p-6 space-y-4">
        <!-- Form -->
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          <!-- Mandatory Checkbox -->
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="form.is_mandatory" 
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              id="mandatory"
            />
            <label for="mandatory" class="text-sm font-medium text-gray-700">
              Mandatory
            </label>
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
            @click="saveCompensation" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save
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
  is_mandatory: false
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    is_mandatory: false
  }
}

const saveCompensation = async () => {
  // Validate required fields
  if (!form.value.name.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter a name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/compensations/add', {
      name: form.value.name,
      is_mandatory: form.value.is_mandatory ? 1 : 0
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Item created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create item',
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