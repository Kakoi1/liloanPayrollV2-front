<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="p-2.5 h-[55px] min-w-[60px] bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex flex-col items-center leading-[4px]"
      title="Finish Loading"
    >
      <svg class="w-8 h-8 px-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <br> Finish
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Finish Loading"
      color="bg-gradient-to-r from-green-600 to-green-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Information (read-only) -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Loading Details
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500">Loading Date:</label>
              <p class="text-sm font-medium">{{ formatDate(loading.loadingDate) }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Van No:</label>
              <p class="text-sm font-medium">{{ loading.vanNo ?? 'N/A' }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Seal No:</label>
              <p class="text-sm font-medium">{{ loading.sealNo ?? 'N/A' }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Item:</label>
              <p class="text-sm font-medium">{{ loading.itemName }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Current Team:</label>
              <p class="text-sm font-medium">
                <span v-if="loading.teamName" class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {{ loading.teamName }}
                </span>
                <span v-else class="text-red-500">Not Assigned</span>
              </p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Container Weight:</label>
              <p class="text-sm font-medium">{{ formatNumber(loading.containerWeight) }} kg</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Gross Weight:</label>
              <p class="text-sm font-medium">{{ formatNumber(loading.grossWeight) }} kg</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Net Weight:</label>
              <p class="text-sm font-medium font-bold text-green-600">{{ formatNumber(loading.netWeight) }} kg</p>
            </div>
          </div>
        </div>

        <!-- Current Employees Display -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Employees:</label>
          <div v-if="loading.employees && loading.employees.length > 0" class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(emp, idx) in loading.employees" 
                :key="idx"
                class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
              >
                {{ emp.fullName || emp.name }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-2">Total: {{ loading.employees.length }} employee(s)</p>
          </div>
          <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-200">
            No employees assigned to this loading
          </div>
        </div>

        <!-- Weight Summary -->
        <div class="bg-green-50 p-3 rounded-lg border border-green-200">
          <h5 class="text-sm font-medium text-green-700 mb-2 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
            Weight Summary
          </h5>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <p class="text-xs text-gray-500">Container Weight</p>
              <p class="text-sm font-semibold">{{ formatNumber(loading.containerWeight) }} kg</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Gross Weight</p>
              <p class="text-sm font-semibold">{{ formatNumber(loading.grossWeight) }} kg</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Net Weight</p>
              <p class="text-sm font-semibold text-green-600">{{ formatNumber(loading.netWeight) }} kg</p>
            </div>
          </div>
        </div>

        <!-- Loading End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Loading End Date:</label>
          <input 
            type="date" 
            v-model="end_date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
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
            @click="finishLoading" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
            :disabled="!end_date"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Finish Loading
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  loading: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated'])

// State
const showModal = ref(false)
const end_date = ref('')

// Methods
const openModal = () => {
  showModal.value = true
  // Set default end date to today
  end_date.value = moment().format('YYYY-MM-DD')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('YYYY-MM-DD')
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value).toFixed(2)
}

const finishLoading = async () => {
  // Validate end date
  if (!end_date.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select an end date',
      showConfirmButton: true
    })
    return
  }

  // Validate item
  if (!props.loading.itemId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select an item to finish Loading',
      showConfirmButton: true
    })
    return
  }

  // Validate weights
  if (props.loading.grossWeight <= 0 && props.loading.netWeight <= 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Gross and Net Weight must not be 0',
      showConfirmButton: true
    })
    return
  }

  // Confirm finish
  const result = await Swal.fire({
    title: 'Finish Loading?',
    text: `Do you want to mark this loading as completed with end date ${formatDate(end_date.value)}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, complete it',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait',
        allowOutsideClick: true,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const response = await api.post('/loading/finish', {
        loading_id: props.loading.id,
        team_id: props.loading.teamId,
        end_date: end_date.value
      })

      if (response.data && !response.data.error) {
        Swal.close()
        
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Loading completed successfully',
          timer: 1500,
          showConfirmButton: false
        })
        
        emit('updated')
        closeModal()
      } else {
        Swal.close()
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.message || 'Failed to complete loading',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to finish loading:', error)
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to complete loading',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const closeModal = () => {
  showModal.value = false
  end_date.value = ''
}
</script>