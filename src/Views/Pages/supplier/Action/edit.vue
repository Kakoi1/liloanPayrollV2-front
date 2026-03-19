<template>
  <div>
    <!-- Edit Button -->
    <button 
      @click="openEditModal(supplierData)" 
      class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
      :title="'Edit ' + (supplierData?.supplier_name || 'Supplier')"
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
      :title="'Edit Supplier: ' + (supplier.name || '')"
      color="bg-gradient-to-r from-green-600 to-green-700"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Supplier Information -->
          <div class="bg-green-50 p-3 rounded-lg border border-green-200">
            <h4 class="font-medium text-green-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Supplier Information
            </h4>
          </div>

          <!-- Supplier ID (hidden) -->
          <input type="hidden" v-model="supplier.id">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Name:</label>
              <input 
                v-model="supplier.name" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter supplier name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tier:</label>
              <select 
                v-model="supplier.tier" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter supplier address"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
            <textarea 
              v-model="supplier.remarks" 
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter remarks (optional)"
            ></textarea>
          </div>

          <!-- Banking Information -->
          <div class="bg-green-50 p-3 rounded-lg border border-green-200 mt-4">
            <h4 class="font-medium text-green-700 flex items-center">
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
              class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
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
                <!-- New bank accounts (to be added) -->
                <tr v-for="(b, bb) in newBankAccounts" :key="'new-'+bb">
                  <td class="px-3 py-2">
                    <input 
                      type="checkbox" 
                      v-model="b.is_default"
                      class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.bank_name" 
                      placeholder="Bank Name" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.bank_account" 
                      placeholder="Bank Account" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.account_type" 
                      placeholder="Account Type" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.bank_address" 
                      placeholder="Bank Address" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <button 
                      type="button" 
                      @click="removeNewBankRow(bb)" 
                      class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      title="Remove"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>

                <!-- Existing bank accounts -->
                <tr v-for="(b, bb) in existingBankAccounts" :key="'existing-'+bb">
                  <td class="px-3 py-2">
                    <input 
                      type="checkbox" 
                      v-model="b.is_default"
                      class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.bank_name" 
                      placeholder="Bank Name" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.bank_account" 
                      placeholder="Bank Account" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.account_type" 
                      placeholder="Account Type" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input 
                      type="text" 
                      v-model="b.bank_address" 
                      placeholder="Bank Address" 
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <button 
                      type="button" 
                      @click="markBankForDeletion(bb)" 
                      class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      title="Remove"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>

                <!-- No bank accounts message -->
                <tr v-if="newBankAccounts.length === 0 && existingBankAccounts.length === 0">
                  <td colspan="6" class="px-3 py-4 text-center text-gray-500">
                    No bank accounts found. Click "Add Bank Account" to add one.
                  </td>
                </tr>
              </tbody>
            </table>
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
              @click="updateSupplier" 
              class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              Update Supplier
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
  supplierData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved'])

// State
const showModal = ref(false)
const loading = ref(false)
const supplier = ref({
  id: null,
  name: '',
  tier: 0,
  address: '',
  remarks: ''
})

const newBankAccounts = ref([])
const existingBankAccounts = ref([])
const deletedBankAccounts = ref([])

// Methods
const openEditModal = async (supplier) => {
  if (!supplier || !supplier.id) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Invalid supplier data',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Reset state
  resetForm()
  
  // Open modal
  showModal.value = true
  
  // Fetch supplier and bank data in one call
  await fetchSupplierData(supplier.id)
}

const fetchSupplierData = async (supplierId) => {
  loading.value = true
  
  try {
    // Single API call to get both supplier and bank details
    const response = await api.post('/suppliers/with-banks', {
      sup_id: supplierId
    })
    
    if (response.data && !response.data.error) {
      const data = response.data
      
      // Set supplier data
      supplier.value = {
        id: data.supplier[0].id,
        name: data.supplier[0].supplier_name || '',
        tier: data.supplier[0].supplierTier || 0,
        address: data.supplier[0].supplier_address || '',
        remarks: data.supplier[0].remarks || ''
      }
      
      // Set bank accounts
      if (data.bank_accounts && data.bank_accounts.length > 0) {
        existingBankAccounts.value = data.bank_accounts.map(bank => ({
          id: bank.id,
          bank_name: bank.bank_name || '',
          bank_account: bank.bank_account || '',
          account_type: bank.account_type || '',
          bank_address: bank.bank_address || '',
          is_default: bank.is_default == 1 || bank.is_default == true
        }))
      }
    } else {
      throw new Error(response.data?.message || 'Failed to fetch supplier data')
    }
  } catch (error) {
    console.error('Failed to fetch supplier data:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load supplier data',
      timer: 1500,
      showConfirmButton: false
    })
    showModal.value = false
  } finally {
    loading.value = false
  }
}

const addBankRow = () => {
  newBankAccounts.value.push({
    is_default: false,
    bank_name: '',
    bank_account: '',
    account_type: '',
    bank_address: ''
  })
}

const removeNewBankRow = (index) => {
  newBankAccounts.value.splice(index, 1)
}

const markBankForDeletion = (index) => {
  const bank = existingBankAccounts.value[index]
  if (bank.id) {
    deletedBankAccounts.value.push({ id: bank.id })
  }
  existingBankAccounts.value.splice(index, 1)
}

const resetForm = () => {
  supplier.value = {
    id: null,
    name: '',
    tier: 0,
    address: '',
    remarks: ''
  }
  newBankAccounts.value = []
  existingBankAccounts.value = []
  deletedBankAccounts.value = []
}

const updateSupplier = async () => {
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

  loading.value = true

  try {
    const response = await api.post('/suppliers/edit', {
      supplier: supplier.value,
      new_bank_accounts: newBankAccounts.value,
      existing_bank_accounts: existingBankAccounts.value,
      deleted_bank_accounts: deletedBankAccounts.value.map(b => b.id)
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Supplier updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to update supplier:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update supplier',
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