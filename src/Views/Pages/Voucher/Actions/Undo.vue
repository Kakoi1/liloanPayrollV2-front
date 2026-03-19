<template>
  <div>
    <!-- Undo Button -->
    <button 
      @click="confirmUndo" 
      class="p-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 transition-colors"
      title="Undo Payment"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'

const props = defineProps({
  voucherId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['updated'])

const confirmUndo = async () => {
  const result = await Swal.fire({
    title: 'Undo Payment?',
    text: 'Do you want to change this voucher back to unpaid?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, undo payment',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/vouchers/undo-payment', {
        voucher_id: props.voucherId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Payment undone successfully',
          timer: 1500,
          showConfirmButton: false
        })
        emit('updated')
      }
    } catch (error) {
      console.error('Failed to undo payment:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to undo payment',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}
</script>