<template>
  <div>
    <!-- Undo Button -->
    <button 
      @click="confirmUndo" 
      class="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center"
      title="Delete Supplier"
    >
    <i class="fa-solid fa-trash"></i>
    Delete
    
    </button>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'

const props = defineProps({
  supplierId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['updated'])

const confirmUndo = async () => {
  const result = await Swal.fire({
    title: 'Delete Supplier?',
    text: 'Do you want to Delete this Supplier?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/suppliers/delete', {
        sup_id: props.supplierId
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