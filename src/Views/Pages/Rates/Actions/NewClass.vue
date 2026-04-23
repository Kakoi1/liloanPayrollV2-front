<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      NEW CLASS
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="New Classification"
      color="bg-gradient-to-r from-green-600 to-green-700"
      maxWidth="2xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Add Classification Form -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">Classification:</label>
          <div class="flex space-x-2">
            <input 
              type="text" 
              v-model="newClass.name" 
              placeholder="Input class name" 
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              @keyup.enter="saveClass"
            >
            <button 
              @click="saveClass" 
              class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              Save
            </button>
          </div>
        </div>

        <!-- Classifications List -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">Existing Classifications</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left font-medium text-gray-700 w-20">No.</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Class Name</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700 w-24">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(c, index) in classifications" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2">{{ index + 1 }}</td>
                  <td class="px-4 py-2">{{ c.task_name }}</td>
                  <td class="px-4 py-2">
                    <button 
                      @click="confirmDelete(c.cls)" 
                      class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      title="Remove"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="classifications.length === 0">
                  <td colspan="3" class="px-4 py-4 text-center text-gray-500">
                    No classifications found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-4">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const emit = defineEmits(['updated'])

// Props
const props = defineProps({
  classifications: {
    type: Array,
    default: () => []
  }
})

// State
const showModal = ref(false)
const newClass = ref({
  name: ''
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
}

const resetForm = () => {
  newClass.value = {
    name: ''
  }
}

const saveClass = async () => {
  if (!newClass.value.name) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter a classification name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/rates/add-class', {
      name: newClass.value.name
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Classification created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('updated')
      resetForm()
      // Don't close modal - let user continue adding
    }
  } catch (error) {
    console.error('Failed to save classification:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create classification',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const confirmDelete = async (className) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to remove "${className}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/classifications/delete', {
        name: className
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Classification removed successfully',
          timer: 1500,
          showConfirmButton: false
        })
        
        emit('updated')
      }
    } catch (error) {
      console.error('Failed to delete classification:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete classification',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}
</script>