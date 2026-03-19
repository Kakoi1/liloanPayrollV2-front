<template>
  <div>
    <!-- View Button -->
    <button 
      @click="openModal" 
      class="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      title="View Deduction"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="View Deduction"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Deduction Information -->
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Deduction Information
          </h4>
        </div>

        <!-- Deduction Details -->
        <div class="space-y-3">
          <!-- ID (hidden) -->
          <div class="hidden">
            <label class="block text-sm font-medium text-gray-700 mb-1">ID:</label>
            <p class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">{{ props.deduction?.id }}</p>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <p class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">{{ props.deduction?.name }}</p>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
            <p class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              Deduct By {{ props.deduction?.type == 1 ? 'Weight' : 'Rate/Price' }}
            </p>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ props.deduction?.type == 1 ? 'Net Weight %' : 'Amount' }}:
            </label>
            <p class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {{ props.deduction?.type == 1 ? props.deduction?.amount + '%' : '₱' + parseFloat(props.deduction?.amount).toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
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
import { ref } from 'vue'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  deduction: {
    type: Object,
    required: true
  }
})

// State
const showModal = ref(false)

// Methods
const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>