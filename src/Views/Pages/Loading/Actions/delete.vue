<template>
  <div>
    <!-- Undo Button -->
    <button 
      @click="confirmUndo" 
      class="p-2 h-[55px] min-w-[60px] bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex flex-col items-center leading-[4px]"
      title="Delete Loading"
    >
    <i class="fa-solid fa-trash"></i>
    <br>
    <br>
    Delete
    
    </button>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'

const props = defineProps({
  loadId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['updated'])

const confirmUndo = async () => {
  const result = await Swal.fire({
    title: 'Delete Loading?',
    text: 'Do you want to Delete this Loading?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/loading/delete', {
        load_id: props.loadId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Loading Deleted successfully',
          timer: 1500,
          showConfirmButton: false
        })
        emit('updated')
      }
    } catch (error) {
      console.error('Failed to Delete loading:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to Delete loading',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}
</script>