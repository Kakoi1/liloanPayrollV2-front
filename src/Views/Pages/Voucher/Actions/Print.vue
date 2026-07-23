<template>
  <div>
    <!-- Undo Button -->
    <button 
      @click="confirmUndo" 
      class="p-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 focus:ring-2 focus:ring-yellow-500 transition-colors"
      title="Undo Payment"
    >
      <i class="fa-solid fa-print"></i>
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
    title: 'Print This Voucher?',
    text: 'Do you want to print this voucher?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/vouchers/print-voucher', {
        v_id: props.voucherId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Voucher Printed successfully',
          timer: 1500,
          showConfirmButton: false
        })

        const pdf = atob(response.data.pdf);

        const bytes = new Uint8Array(pdf.length);
        for (let i = 0; i < pdf.length; i++) {
            bytes[i] = pdf.charCodeAt(i);
          }

        const blob = new Blob([bytes], { type: 'application/pdf' });
        window.open(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Failed to Print Voucher:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to Print voucher',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}
</script>