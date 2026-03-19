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
      Add Supplier
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="New Supplier"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Supplier Information -->
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
            </svg>
            Supplier Information
          </h4>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Name:</label>
            <input 
              v-model="supplier.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter supplier name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tier:</label>
            <select 
              v-model="supplier.tier" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0">--Select Tier--</option>
              <option value="1">Normal</option>
              <option value="2">Bronze</option>
              <option value="3">Silver</option>
              <option value="4">Gold</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Address:</label>
          <textarea 
            v-model="supplier.address" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter supplier address"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
          <textarea 
            v-model="supplier.remarks" 
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter remarks (optional)"
          ></textarea>
        </div>

        <!-- Banking Information -->
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
          <h4 class="font-medium text-blue-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Banking Information
          </h4>
        </div>

        <div class="flex justify-end">
          <button 
            type="button" 
            @click="addBankRow" 
            class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Bank Account
          </button>
        </div>

        <!-- Bank Accounts Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Default</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Bank Name</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Bank Account</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Account Type</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Branch Address</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(b, bb) in bank" :key="bb">
                <td class="px-3 py-2">
                  <input 
                    type="checkbox" 
                    v-model="b.is_default"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  >
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="b.bank_name" 
                    placeholder="Bank Name" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  >
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="b.bank_account" 
                    placeholder="Bank Account" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  >
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="b.account_type" 
                    placeholder="Account Type" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  >
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="b.bank_address" 
                    placeholder="Bank Address" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  >
                </td>
                <td class="px-3 py-2">
                  <button 
                    type="button" 
                    @click="removeBankRow(bb)" 
                    class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Remove"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="bank.length === 0">
                <td colspan="6" class="px-3 py-4 text-center text-gray-500">
                  No bank accounts added yet. Click "Add Bank Account" to add one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <button 
            @click="saveSupplier" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            Save Supplier
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
const supplier = ref({
  name: '',
  tier: 0,
  address: '',
  remarks: ''
})
const bank = ref([])

const openModal = () => {
  showModal.value = true
  resetForm()
}

const addBankRow = () => {
  bank.value.push({
    is_default: false,
    bank_name: '',
    bank_account: '',
    account_type: '',
    bank_address: ''
  })
}

const removeBankRow = (index) => {
  bank.value.splice(index, 1)
}

const resetForm = () => {
  supplier.value = {
    name: '',
    tier: 0,
    address: '',
    remarks: ''
  }
  bank.value = []
}

const saveSupplier = async () => {
  if (!supplier.value.name) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter supplier name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/suppliers/add', {
      supplier: supplier.value,
      bank_accounts: bank.value
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Supplier created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save supplier:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create supplier',
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