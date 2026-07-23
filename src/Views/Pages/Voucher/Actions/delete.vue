<template>
  <div>
    <!-- Undo Button -->
    <button 
      @click="confirmUndo" 
      class="p-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-colors"
      title="Delete Vouvher"
    >
      <i class="fa-solid fa-trash"></i>
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
    title: 'Delete voucher?',
    text: 'Do you want to Delete this voucher?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/vouchers/delete', {
        v_id: props.voucherId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Voucher Deleted successfully',
          timer: 1500,
          showConfirmButton: false
        })
        emit('updated')
      }
    } catch (error) {
      console.error('Failed to Delete voucher:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to Delete voucher',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}
</script>