<template>
  <div>
    <!-- Undo Button -->
    <button 
      @click="confirmUndo" 
        class="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 transition-all duration-200"
        title="Delete Record"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'

const props = defineProps({
  transId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['updated'])

const confirmUndo = async () => {
  const result = await Swal.fire({
    title: 'Delete transaction?',
    text: 'Do you want to Delete this transaction?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/cash-advance/delete-transaction', {
        t_id: props.transId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Transaction Deleted successfully',
          timer: 1500,
          showConfirmButton: false
        })
        emit('updated')
      }
    } catch (error) {
      console.error('Failed to Delete transaction:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to Delete transaction',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}
</script>