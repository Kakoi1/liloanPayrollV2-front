<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 float-right flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add Pricing
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Add Pricelist"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Pricelist Information -->
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Pricelist Information
          </h4>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pricelist Name:</label>
          <input 
            v-model="pricelist.name" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bronze Price:</label>
            <input 
              v-model="pricelist.bronze_price" 
              type="number" 
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gold Price:</label>
            <input 
              v-model="pricelist.gold_price" 
              type="number" 
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            >
            <span class="absolute right-3 top-2 text-gray-500">%</span>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <button 
            @click="savePricelist" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            Save Pricelist
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

const showModal = ref(false)
const pricelist = ref({
  name: '',
  normal_price: '',
  bronze_price: '',
  silver_price: '',
  gold_price: '',
  deduction: ''
})

const openModal = () => {
  showModal.value = true
  resetForm()
}

const resetForm = () => {
  pricelist.value = {
    name: '',
    normal_price: '',
    bronze_price: '',
    silver_price: '',
    gold_price: '',
    deduction: ''
  }
}

const savePricelist = async () => {
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

  try {
    const response = await api.post('/prices/add', {
      pricelist: pricelist.value
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Pricelist created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save pricelist:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create pricelist',
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