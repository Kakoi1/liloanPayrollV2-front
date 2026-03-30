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
      New Van Loading
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Input Van Information"
      color="bg-gradient-to-r from-green-600 to-green-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Loading Date:</label>
          <input 
            type="date" 
            v-model="loadingForm.loading_date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Loading Date"
          />
        </div>

        <!-- Van No -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Van No:</label>
          <input 
            type="text" 
            v-model="loadingForm.van_no" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Van Number"
          />
        </div>

        <!-- Seal No -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Seal No:</label>
          <input 
            type="text" 
            v-model="loadingForm.seal_no" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Seal Number"
          />
        </div>

        <!-- Item -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Item:</label>
            <SelectComponent v-model="loadingForm.item" :options="itemOptions" placeholder="Select Work Type" class="w-full border-gray-700" />
        </div>

        <!-- Container Weight -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Container Weight:</label>
          <input 
            type="number" 
            step="any" 
            v-model="loadingForm.container_weight" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Container Weight"
          />
        </div>

        <!-- Gross Weight (hidden but kept for data) -->
        <div class="hidden">
          <label class="block text-sm font-medium text-gray-700 mb-1">Gross Weight:</label>
          <input 
            type="number" 
            step="any" 
            v-model="loadingForm.gross_weight" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Input Gross Weight"
          />
        </div>

        <!-- Net Weight (calculated) -->
        <div>
          <!-- <label class="block text-sm font-medium text-gray-700 mb-1">Net Weight:</label> -->
          <input 
            type="hidden" 
            :value="calculatedNetWeight" 
            readonly
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
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
            @click="saveLoading" 
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
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SelectComponent from '@/Js/Components/SelectComponent.vue'

const emit = defineEmits(['saved'])

// State
const showModal = ref(false)
const loadingForm = ref({
  loading_date: moment().format('YYYY-MM-DD'),
  van_no: '',
  seal_no: '',
  item: '',
  container_weight: '',
  gross_weight: 0,
  net_weight: 0
})

const itemOptions = ref([])

// Computed
const calculatedNetWeight = computed(() => {
  const gross = parseFloat(loadingForm.value.gross_weight) || 0
  const container = parseFloat(loadingForm.value.container_weight) || 0
  return (gross - container).toFixed(2)
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
  fetchItems()
}

const resetForm = () => {
  loadingForm.value = {
    loading_date: moment().format('YYYY-MM-DD'),
    van_no: '',
    seal_no: '',
    item: '',
    container_weight: '',
    gross_weight: 0,
    net_weight: 0
  }
}

const fetchItems = async () => {
  try {
    const response = await api.get('/loading/items')
    if (response.data && !response.data.error) {
      itemOptions.value = (response.data.items || []).map(item => ({
        value: item.id,
        label: item.class
      }))
    }
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

const saveLoading = async () => {
  // Validate required fields
  if (!loadingForm.value.loading_date) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select loading date',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!loadingForm.value.van_no.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter van number',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!loadingForm.value.seal_no.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter seal number',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!loadingForm.value.item) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select an item',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!loadingForm.value.container_weight) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter container weight',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    // Prepare data for API

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const payload = {
      ...loadingForm.value,
      net_weight: 0
    }

    const response = await api.post('/loading/add', payload)

    if (response.data && !response.data.error) {
        Swal.close()

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Van loading schedule created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save loading:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create loading schedule',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Initialize
onMounted(() => {
  fetchItems()
})
</script>