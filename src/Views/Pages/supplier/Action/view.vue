<template>
  <div>
    <!-- View Button -->
    <button 
      @click="openViewModal(supplierData)" 
      class="px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center"
      :title="'View ' + (supplierData?.supplier_name || 'Supplier')"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
      View
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      :title="'View Supplier: ' + (supplier.name || '')"
      color="bg-gradient-to-r from-gray-600 to-gray-700"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Supplier Information -->
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 class="font-medium text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
              </svg>
              Supplier Information
            </h4>
          </div>

          <!-- Supplier ID (hidden) -->
          <input type="hidden" v-model="supplier.id">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Name:</label>
              <div class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                {{ supplier.name || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tier:</label>
              <div class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 capitalize">
                <span v-if="supplier.tier">
                  <span v-if="supplier.tier == 1">Normal</span>
                  <span v-else-if="supplier.tier == 2">Bronze</span>
                  <span v-else-if="supplier.tier == 3">Silver</span>
                  <span v-else-if="supplier.tier == 4">Gold</span>
                  <span v-else>Unknown</span>
                </span>
                <span v-else>N/A</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Address:</label>
            <div class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 whitespace-pre-line">
              {{ supplier.address || 'N/A' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
            <div class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 whitespace-pre-line">
              {{ supplier.remarks || 'N/A' }}
            </div>
          </div>

          <!-- Banking Information -->
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
            <h4 class="font-medium text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              Banking Information
            </h4>
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
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <!-- Combined bank accounts (for display only) -->
                <tr v-for="(b, bb) in allBankAccounts" :key="'bank-'+bb">
                  <td class="px-3 py-2">
                    <span v-if="b.is_default" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Default
                    </span>
                    <span v-else class="text-gray-400 text-xs">No</span>
                  </td>
                  <td class="px-3 py-2 text-gray-700">{{ b.bank_name || 'N/A' }}</td>
                  <td class="px-3 py-2 text-gray-700">{{ b.bank_account || 'N/A' }}</td>
                  <td class="px-3 py-2 text-gray-700">{{ b.account_type || 'N/A' }}</td>
                  <td class="px-3 py-2 text-gray-700">{{ b.bank_address || 'N/A' }}</td>
                </tr>

                <!-- No bank accounts message -->
                <tr v-if="allBankAccounts.length === 0">
                  <td colspan="5" class="px-3 py-4 text-center text-gray-500">
                    No bank accounts found for this supplier.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end mt-6">
            <button 
              @click="closeModal" 
              class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// Combine all bank accounts for display
const allBankAccounts = computed(() => {
  return [...existingBankAccounts.value, ...newBankAccounts.value]
})

// Methods
const openViewModal = async (supplier) => {
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
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}
</script>