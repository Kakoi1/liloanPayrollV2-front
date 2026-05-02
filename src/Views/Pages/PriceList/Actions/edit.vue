<template>
  <div>
    <!-- Edit Button -->
    <button 
      @click="openEditModal(pricelistData)" 
      class="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-500 transition-all duration-200 flex items-center"
      :title="'Edit ' + (pricelistData?.name || 'Pricelist')"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      Edit
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      :title="'Edit Pricelist: ' + (pricelist.name || '')"
      color="bg-gradient-to-r from-yellow-500 to-yellow-600"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Pricelist Information -->
          <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h4 class="font-medium text-yellow-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Pricelist Information
            </h4>
          </div>

          <!-- Pricelist ID (hidden) -->
          <input type="hidden" v-model="pricelist.id">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pricelist Name:</label>
            <input 
              v-model="pricelist.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter pricelist name"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Normal Price:</label>
              <input 
                v-model="pricelist.normal_price" 
                type="number" 
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="0.00"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bronze Price:</label>
              <input 
                v-model="pricelist.bronze_price" 
                type="number" 
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="0.00"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Silver Price:</label>
              <input 
                v-model="pricelist.silver_price" 
                type="number" 
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="0.00"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gold Price:</label>
              <input 
                v-model="pricelist.gold_price" 
                type="number" 
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="0.00"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deduction Percentage:</label>
            <div class="relative">
              <input 
                v-model="pricelist.deduction" 
                type="number" 
                step="0.01"
                min="0"
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="0.00"
              >
              <span class="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>

          <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Worker Rate</label>
          <div class="relative">
            <input 
              v-model="pricelist.worker_rate" 
              type="number" 
              step="0.01"
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            >
            <!-- <span class="absolute right-3 top-2 text-gray-500">%</span> -->
          </div>
        </div>

          <!-- Save Button -->
          <div class="flex justify-end mt-6 space-x-3">
            <button 
              @click="closeModal" 
              class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              @click="updatePricelist" 
              class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              Update Pricelist
            </button>
          </div>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

// Props
const props = defineProps({
  pricelistData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved'])

// State
const showModal = ref(false)
const loading = ref(false)
const pricelist = ref({
  id: null,
  name: '',
  normal_price: '',
  bronze_price: '',
  silver_price: '',
  gold_price: '',
  deduction: '',
  worker_rate: ''
})

// Methods
const openEditModal = async (pricelistItem) => {
  if (!pricelistItem || !pricelistItem.id) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Invalid pricelist data',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Reset state
  resetForm()
  
  // Set pricelist data
  pricelist.value = {
    id: pricelistItem.id,
    name: pricelistItem.name || '',
    normal_price: pricelistItem.normal_price || '',
    bronze_price: pricelistItem.bronze_price || '',
    silver_price: pricelistItem.silver_price || '',
    gold_price: pricelistItem.gold_price || '',
    deduction: pricelistItem.deduction || '',
    worker_rate: pricelistItem.workerRate || ''
  }
  
  // Open modal
  showModal.value = true
}

const resetForm = () => {
  pricelist.value = {
    id: null,
    name: '',
    normal_price: '',
    bronze_price: '',
    silver_price: '',
    gold_price: '',
    deduction: '',
    worker_rate: ''
  }
}

const updatePricelist = async () => {
  if (!pricelist.value.name) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter pricelist name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  loading.value = true

  try {
    const response = await api.post('/prices/edit', {
      pricelist: pricelist.value
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Pricelist updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to update pricelist:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update pricelist',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}
</script>