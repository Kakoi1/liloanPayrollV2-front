<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      NEW TASK
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="New Task"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="2xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Task Form -->
        <div class="space-y-4">
          <!-- Task Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input 
              type="text" 
              v-model="task.task_name" 
              placeholder="Task Name" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxlength="26"
            />
          </div>

          <!-- Classification -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Classification</label>
            <select 
              v-model="task.class" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">--Select Classification--</option>
              <option 
                v-for="(cd, cdd) in classifications" 
                :key="cdd" 
                :value="cd.id"
              >
                {{ cd.task_name }}
              </option>
            </select>
          </div>

          <!-- Rate Measurement -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rate Measurement</label>
            <select 
              v-model="task.measurement" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">--Select Measurement--</option>
              <option value="1">BY HOUR</option>
              <option value="2">BY HOUR (OVERTIME ONLY)</option>
              <option value="3">BY WEIGHT</option>
              <option value="4">PER CONTAINER</option>
              <option value="5">PANTAWID</option>
            </select>
          </div>

          <!-- Rate -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rate</label>
            <input 
              type="number" 
              v-model="task.rate" 
              placeholder="Rate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
            />
          </div>

          <!-- Tarima Multiplier -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tarima Multiplier 
              <span class="text-xs text-gray-500">(for weight measurement)</span>
            </label>
            <input 
              type="number" 
              v-model="task.multi" 
              placeholder="0" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
            />
          </div>

          <!-- Remarks -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <input 
              type="text" 
              v-model="task.remarks" 
              placeholder="Remarks" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxlength="26"
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
            @click="saveTask" 
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

// Props
const props = defineProps({
  classifications: {
    type: Array,
    default: () => []
  }
})

// State
const showModal = ref(false)
const task = ref({
  task_name: '',
  class: '',      // This will be the classification ID
  measurement: '', // 1-5 values
  rate: '',
  multi: 0,
  remarks: ''
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
}

const resetForm = () => {
  task.value = {
    task_name: '',
    class: '',
    measurement: '',
    rate: '',
    multi: 0,
    remarks: ''
  }
}

const saveTask = async () => {
  // Validate required fields
  if (!task.value.task_name) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter task name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

//   if (!task.value.class) {
//     await Swal.fire({
//       icon: 'warning',
//       title: 'Warning',
//       text: 'Please select a classification',
//       timer: 1500,
//       showConfirmButton: false
//     })
//     return
//   }

  if (!task.value.measurement) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select rate measurement',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!task.value.rate) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter rate',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    // Prepare data to match backend expectations
    const payload = {
      task_name: task.value.task_name,
      class: task.value.class,           // classification ID
      measurement: task.value.measurement, // 1-5
      rate: task.value.rate,
      multi: task.value.multi || 0,
      remarks: task.value.remarks || ''
    }

    console.log('Sending payload:', payload) // For debugging

    const response = await api.post('/rates/add', payload)

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'Task created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    } else {
      throw new Error(response.data?.message || 'Failed to create task')
    }
  } catch (error) {
    console.error('Failed to save task:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Failed to create task',
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