<template>
  <div>
    <!-- Pay/Edit Button -->
    <button 
      @click="openEditModal" 
      class="p-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-colors"
      :title="voucherData?.status === 1 ? 'Edit and Pay Voucher' : 'Edit Voucher'"
    >
      <FontAwesomeIcon :icon="faMoneyBillWave" class="w-4 h-4" />
    </button>

    <!-- Edit Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      :title="'Edit Voucher #' + (voucherDetails?.id || '')"
      color="bg-gradient-to-r from-green-600 to-green-700"
      maxWidth="6xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>

        <!-- Content -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Transaction Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Time:</label>
              <SelectComponent
                v-model="editData.transactionTime"
                :options="transactionTimeOptions"
                placeholder="--Select Transaction Time--"
              />
            </div>
            <div></div>

            <!-- Supplier (Read-only with Tier Display) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Supplier: 
                <i v-if="voucherDetails?.supplierTier" :class="getMedalIconClass(voucherDetails?.supplierTier)" class="ml-1"></i>
                <small v-if="voucherDetails?.supplierTier" class="ml-1 text-gray-500">{{ getTierName(voucherDetails?.supplierTier) }} tier</small>
              </label>
              <input 
                type="text" 
                :value="editData.supplier_name" 
                readonly
                class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            <!-- Weigh Slip No -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Weigh Slip No:</label>
              <input 
                type="text" 
                v-model="editData.weightSlip" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Input Weigh Slip No."
              />
            </div>

            <!-- Driver -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Driver:</label>
              <input 
                type="text" 
                v-model="editData.driver" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Input Driver."
              />
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date:</label>
              <input 
                type="text" 
                v-model="editData.paymentDate" 
                class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                readonly
              />
            </div>

            <!-- Tier Display -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tier Pricing:</label>
              <div class="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Using {{ getTierName(voucherDetails?.supplierTier) }} tier prices
              </div>
            </div>

            <!-- Workers Selection -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Workers:</label>
              
              <!-- Dropdown for adding workers -->
              <div class="mb-3">
                <SearchDropdown
                  :apiEndpoint="'employee/active-list'"
                  :searchModel="searchEmp"
                  placeholder="Search and add worker..."
                  itemLabel="name"
                  itemId="id"
                  returnName="['name']"
                  dataKey="employees"
                  @item-selected="addWorker"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p class="text-xs text-gray-500 mt-1">Search and select workers to add them to the list</p>
              </div>

              <!-- Selected Workers with Remove Option -->
              <div class="space-y-2 mt-3">
                <div 
                  v-for="(worker, index) in voucherWorkers" 
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <div class="flex-1 relative">
                    <input 
                      type="text" 
                      :value="worker.fullName + ' (' + worker.employeeId + ')'" 
                      readonly
                      class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                    />
                  </div>
                  <button 
                    type="button"
                    @click="removeWorker(index)"
                    class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="Remove worker"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div v-if="voucherWorkers.length === 0" class="text-gray-500 text-sm italic">
                  No workers selected yet. Search and select workers above.
                </div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-medium text-gray-900">Items</h4>
              <button 
                type="button" 
                @click="addNewItem" 
                class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Item
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Item</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Backhoe</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Gross Weight (kg)</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Ded. Amt.</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Net Weight (kg)</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Supplier Rate (₱)</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Deduction Type</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Total Amount</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(item, index) in voucherItems" :key="item.id || 'new-'+index" class="hover:bg-gray-50">
                    <td class="px-3 py-2">
                      <SelectComponent
                        v-model="item.itemId"
                        :options="taskOptions"
                        :placeholder="'--Select Item--'"
                        @change="(val) => handleItemChange(val, index)"
                        class="w-32"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="checkbox" 
                        v-model="item.isBackhoe"
                        @change="recalculateItemTotal(index)"
                        class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="text" 
                        v-model="item.grossWeight" 
                        @input="recalculateItemTotal(index)"
                        class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                        placeholder="Gross"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <div class="space-y-1">
                        <input 
                          type="text" 
                          v-model="item.deductionAmount" 
                          readonly
                          class="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                          placeholder="Auto"
                        />
                        <div v-if="item.grossWeight" class="text-xs text-gray-500">
                          Base: {{ item.itemDeduction || 0 }}
                        </div>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="text" 
                        v-model="item.netWeight" 
                        readonly
                        class="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <div class="space-y-1">
                        <input 
                          type="text" 
                          :value="formatRateWithDeduction(item)" 
                          readonly
                          class="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-medium"
                          :class="{ 'text-purple-600': item.rateDeduction > 0 }"
                        />
                        <div v-if="item.originalRate > 0" class="text-xs text-gray-500">
                          Original: ₱{{ item.originalRate.toFixed(2) }}
                        </div>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <!-- Deduction Multi-select - Only show when gross weight is entered -->
                      <div v-if="item.grossWeight" class="space-y-1">
                        <!-- Dropdown for selecting deductions -->
                        <select
                          @change="(e) => addDeduction(e, index)"
                          class="w-32 border-gray-300 rounded-md px-1 py-1 shadow-sm focus:ring-green-500 focus:border-green-500 text-xs"
                        >
                          <option value="">--Add Deduction--</option>
                          <option
                            v-for="option in availableDeductions(index)"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }} ({{ option.type == 1 ? '% of weight' : '₱ off rate' }}: {{ option.type == 1 ? option.amount + '%' : '₱' + option.amount }})
                          </option>
                        </select>

                        <!-- Selected deductions as tags -->
                        <div class="flex flex-wrap gap-1 mt-1">
                          <span 
                            v-for="(ded, di) in getSelectedDeductions(index)" 
                            :key="di"
                            class="inline-flex items-center px-2 py-0.5 text-xs rounded-full"
                            :class="ded.type == 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                          >
                            {{ ded.label }} 
                            <span class="ml-1 text-xs opacity-75">
                              ({{ ded.type == 1 ? '%' : '₱' }} {{ ded.amount }})
                            </span>
                            <button 
                              type="button"
                              @click="removeDeduction(index, ded.value)"
                              class="ml-1 hover:opacity-75"
                            >
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </span>
                        </div>
                        
                        <!-- Show total rate deduction -->
                        <!-- <div v-if="item.rateDeduction > 0" class="text-xs text-purple-600 mt-1">
                          Total rate deduction: ₱{{ item.rateDeduction.toFixed(2) }}
                        </div> -->
                      </div>
                      <div v-else class="text-xs text-gray-400 italic">
                        Enter gross weight first
                      </div>
                    </td>
                    <td class="px-3 py-2 font-medium">{{ formatCurrency(item.totalAmount) }}</td>
                    <td class="px-3 py-2">
                      <button 
                        type="button" 
                        @click="removeItem(index)" 
                        class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Remove item"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="voucherItems.length === 0">
                    <td colspan="9" class="px-3 py-4 text-center text-gray-500">
                      No items added yet. Click "Add Item" to add one.
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="7" class="px-3 py-2 text-right font-medium">Add/Less:</td>
                    <td class="px-3 py-2" colspan="2">
                      <input 
                        type="number" 
                        v-model="editData.addLess" 
                        @input="updateVoucherTotal"
                        class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                      />
                    </td>
                  </tr>
                  <tr class="font-bold">
                    <td colspan="7" class="px-3 py-3 text-right text-red-600">Total:</td>
                    <td class="px-3 py-3 text-red-600" colspan="2">{{ formatCurrency(editData.totalAmount) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <!-- Save as Draft Button -->
            <button 
              @click="saveAsDraft" 
              class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save as Draft
            </button>

            <!-- Mark for Payment Button -->
            <button 
              @click="markForPayment" 
              class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Mark for Payment
            </button>

            <!-- Cancel Button -->
            <button 
              @click="closeModal" 
              class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SelectComponent from '@/Js/Components/SelectComponent.vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['updated'])

const props = defineProps({
  voucherId: {
    type: [String, Number],
    required: true
  },
  voucherData: {
    type: Object,
    default: null
  },
  taskOptions: {
    type: Array,
    default: () => []
  },
  deductionOptions: {
    type: Array,
    default: () => []
  }
})

// State
const showModal = ref(false)
const loading = ref(false)
const voucherDetails = ref(null)
const voucherItems = ref([])
const voucherWorkers = ref([])
const deletedWorkers = ref([])
const newWorkers = ref([])
const deletedItems = ref([])
const newItems = ref([])

const searchEmp = ref({
  search: '',
  itemsperpage: 10,
  page_num: 1
})

const editData = ref({
  id: null,
  transactionTime: 1,
  supplier_name: '',
  weightSlip: '',
  driver: '',
  paymentDate: '',
  addLess: 0,
  totalAmount: 0
})

// Options
const transactionTimeOptions = [
  { value: 1, label: 'Morning' },
  { value: 2, label: 'Afternoon' }
]

// Helper Functions for Tier
const getTierName = (tier) => {
  const tierNum = parseInt(tier)
  switch(tierNum) {
    case 4: return 'Gold'
    case 3: return 'Silver'
    case 2: return 'Bronze'
    case 1: return 'Normal'
    default: return 'Normal'
  }
}

const getMedalIconClass = (tier) => {
  const tierNum = parseInt(tier)
  switch(tierNum) {
    case 4: return 'fas fa-medal text-yellow-500'
    case 3: return 'fas fa-medal text-gray-400'
    case 2: return 'fas fa-medal text-amber-700'
    case 1: return 'fas fa-building text-gray-500'
    default: return 'fas fa-building text-gray-500'
  }
}

// Get price based on supplier tier
const getPriceByTier = (task, tier) => {
  if (!task) return 0
  const tierNum = parseInt(tier) || 1
  const priceKey = tierNum.toString()
  return task[priceKey] || task.normal_price || 0
}

// Helper function to get deduction details
const getDeductionDetails = (value) => {
  return props.deductionOptions.find(d => d.value == value)
}

// Get selected deductions for a task row
const getSelectedDeductions = (itemIndex) => {
  const item = voucherItems.value[itemIndex]
  if (!item || !item.deductionIds || !Array.isArray(item.deductionIds)) return []
  
  return item.deductionIds
    .map(value => getDeductionDetails(value))
    .filter(d => d)
}

// Get available deductions for a task row (not yet selected)
const availableDeductions = (itemIndex) => {
  const item = voucherItems.value[itemIndex]
  if (!item) return props.deductionOptions
  
  const selectedValues = item.deductionIds || []
  return props.deductionOptions.filter(opt => !selectedValues.includes(opt.value))
}

// Calculate rate deduction (type 2 deductions - off rate)
const calculateRateDeduction = (item) => {
  let totalRateDeduction = 0
  
  if (item.deductionIds && Array.isArray(item.deductionIds)) {
    item.deductionIds.forEach(value => {
      const deduction = getDeductionDetails(value)
      if (deduction && deduction.type == 2) {
        totalRateDeduction += parseFloat(deduction.amount) || 0
      }
    })
  }
  
  return totalRateDeduction
}

// Calculate weight deduction (type 1 deductions and base deduction)
const calculateWeightDeduction = (item) => {
  if (!item.grossWeight) return 0
  
  const gross = parseFloat(item.grossWeight) || 0
  let totalDeduction = 0
  
  // Add item base deduction if exists
  if (item.itemDeduction) {
    totalDeduction += parseFloat(item.itemDeduction) || 0
  }
  
  // Add selected deductions of type 1 (percentage of weight)
  if (item.deductionIds && Array.isArray(item.deductionIds)) {
    item.deductionIds.forEach(value => {
      const deduction = getDeductionDetails(value)
      if (deduction && deduction.type == 1) {
        totalDeduction += (gross * (parseFloat(deduction.amount) / 100))
      }
    })
  }
  
  return totalDeduction
}

// Get effective rate after rate deductions
const getEffectiveRate = (item) => {
  const baseRate = parseFloat(item.itemPrice) || 0
  const rateDeduction = item.rateDeduction || 0
  return Math.max(0, baseRate - rateDeduction)
}

// Format rate with deduction for display
const formatRateWithDeduction = (item) => {
  const effectiveRate = getEffectiveRate(item)
  return `₱${effectiveRate.toFixed(2)}`
}

// Add deduction to item
const addDeduction = (event, itemIndex) => {
  const value = event.target.value
  if (!value) return
  
  const item = voucherItems.value[itemIndex]
  if (!item.deductionIds) {
    item.deductionIds = []
    item.rateDeduction = 0
    item.originalRate = parseFloat(item.itemPrice) || 0
  }
  
  if (!item.deductionIds.includes(value)) {
    item.deductionIds.push(value)
    // Recalculate after adding deduction
    recalculateItemTotal(itemIndex)
  }
  
  // Reset the select
  event.target.value = ''
}

// Remove deduction from item
const removeDeduction = (itemIndex, value) => {
  const item = voucherItems.value[itemIndex]
  if (item && item.deductionIds && Array.isArray(item.deductionIds)) {
    const index = item.deductionIds.findIndex(id => String(id) === String(value))
    
    if (index > -1) {
      item.deductionIds.splice(index, 1)
      // Reset rate_deduction and recalculate
      item.rateDeduction = 0
      // Recalculate after removing deduction
      recalculateItemTotal(itemIndex)
    }
  }
}

// Methods
const openEditModal = async () => {
  showModal.value = true
  await fetchVoucherData()
}

const fetchVoucherData = async () => {
  loading.value = true
  
  try {
    const response = await api.post('/vouchers/show', {
      voucher_id: props.voucherId
    })
    
    if (response.data && !response.data.error) {
      const data = response.data
      
      // Set voucher details
      voucherDetails.value = data.voucher[0]
      
      // Process items with deduction IDs
      voucherItems.value = data.voucherItem.map(item => {
        item.isBackhoe = item.isBackhoe ? true : false
        
        // Extract deduction IDs from deductionType array
        let deductionIds = []
        if (item.deductionType && item.deductionType[0] && item.deductionType[0].length > 0) {
          deductionIds = item.deductionType[0].map(d => d.deductionId)
        }
        
        return {
          ...item,
          deductionIds: deductionIds,
          rateDeduction: 0,
          originalRate: parseFloat(item.itemPrice) || 0,
          isNew: false
        }
      })
      
      voucherWorkers.value = data.voucherWorker || []
      
      // Reset tracking arrays
      deletedWorkers.value = []
      newWorkers.value = []
      deletedItems.value = []
      newItems.value = []
      
      // Set edit data
      editData.value = {
        id: data.voucher[0].id,
        transactionTime: data.voucher[0].transactionTime,
        supplier_name: data.voucher[0].supplier_name,
        weightSlip: data.voucher[0].weightSlip,
        driver: data.voucher[0].driver,
        paymentDate: data.voucher[0].paymentDate,
        addLess: parseFloat(data.voucher[0].addLess) || 0,
        totalAmount: parseFloat(data.voucher[0].totalAmount) || 0
      }
      
      // Recalculate all items to ensure rate deductions are applied
      voucherItems.value.forEach((item, index) => {
        if (item.grossWeight) {
          recalculateItemTotal(index)
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch voucher data:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load voucher data',
      timer: 1500,
      showConfirmButton: false
    })
    closeModal()
  } finally {
    loading.value = false
  }
}

// Worker Management
const addWorker = (employee) => {
  const exists = voucherWorkers.value.some(w => w.empId === employee.id)
  
  if (!exists) {
    const newWorker = {
      id: null,
      empId: employee.id,
      voucherId: props.voucherId,
      fullName: employee.name,
      employeeId: employee.employeeId || `EMP-${employee.id}`,
      isNew: true
    }
    
    voucherWorkers.value.push(newWorker)
    newWorkers.value.push(newWorker)
    searchEmp.value.search = ''
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Worker already selected',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const removeWorker = (index) => {
  const worker = voucherWorkers.value[index]
  
  if (worker.id && !worker.isNew) {
    deletedWorkers.value.push(worker.id)
  }
  
  if (worker.isNew) {
    const newIndex = newWorkers.value.findIndex(w => w.empId === worker.empId)
    if (newIndex > -1) {
      newWorkers.value.splice(newIndex, 1)
    }
  }
  
  voucherWorkers.value.splice(index, 1)
}

// Item Management
const addNewItem = () => {
  const newItem = {
    id: null,
    voucherId: props.voucherId,
    itemId: '',
    itemName: '',
    isBackhoe: false,
    grossWeight: '',
    itemPrice: '',
    deductionAmount: '0.00',
    netWeight: '0.00',
    totalAmount: '0.00',
    itemDeduction: 0,
    deductionIds: [],
    rateDeduction: 0,
    originalRate: 0,
    isNew: true
  }
  
  voucherItems.value.push(newItem)
  newItems.value.push(newItem)
}

const handleItemChange = (value, index) => {
  const item = voucherItems.value[index]
  const selectedTask = props.taskOptions.find(t => t.value == value)
  
  if (selectedTask) {
    item.itemId = selectedTask.value
    item.itemName = selectedTask.label
    item.itemDeduction = selectedTask.deduc || 0
    
    const tier = voucherDetails.value?.supplierTier || 1
    const price = getPriceByTier(selectedTask, tier)
    item.itemPrice = price
    item.originalRate = price
    
    // Reset rate deduction when task changes
    item.rateDeduction = 0
  }
  
  if (item.grossWeight) {
    recalculateItemTotal(index)
  }
}

const removeItem = (index) => {
  const item = voucherItems.value[index]
  
  if (item.id && !item.isNew) {
    deletedItems.value.push(item.id)
  }
  
  if (item.isNew) {
    const newIndex = newItems.value.findIndex(i => i === item)
    if (newIndex > -1) {
      newItems.value.splice(newIndex, 1)
    }
  }
  
  voucherItems.value.splice(index, 1)
  updateVoucherTotal()
}

// Item Calculations
const recalculateItemTotal = (index) => {
  const item = voucherItems.value[index]
  if (!item.grossWeight) return
  
  const gross = parseFloat(item.grossWeight) || 0
  
  // Store original rate if not already stored
  if (!item.originalRate || item.originalRate === 0) {
    item.originalRate = parseFloat(item.itemPrice) || 0
  }
  
  // Calculate rate deduction (type 2 deductions)
  item.rateDeduction = calculateRateDeduction(item)
  
  // Calculate effective rate after rate deductions
  const effectiveRate = getEffectiveRate(item)
  
  // Calculate weight deduction (type 1 and base deduction)
  const weightDeduction = calculateWeightDeduction(item)
  item.deductionAmount = weightDeduction.toFixed(2)
  
  // Calculate net weight (gross - weight deduction)
  item.netWeight = (gross - weightDeduction).toFixed(2)
  
  // Calculate total amount (net weight * effective rate)
  item.totalAmount = (parseFloat(item.netWeight) * effectiveRate).toFixed(2)
  
  updateVoucherTotal()
}

const updateVoucherTotal = () => {
  const itemsTotal = voucherItems.value.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0)
  const addLess = parseFloat(editData.value.addLess) || 0
  editData.value.totalAmount = (itemsTotal + addLess).toFixed(2)
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '₱0.00'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Save Functions
const saveAsDraft = async () => {
  await saveVoucher(1)
}

const markForPayment = async () => {
  await saveVoucher(3)
}

const saveVoucher = async (status) => {
  try {
    const itemsToUpdate = voucherItems.value
      .filter(item => !item.isNew)
      .map(item => ({
        id: item.id,
        gross_weight: item.grossWeight,
        item_price: item.itemPrice,
        net_weight: item.netWeight,
        total_amount: item.totalAmount,
        deduction_amount: item.deductionAmount,
        is_backhoe: item.isBackhoe ? 1 : 0,
        deduction_ids: item.deductionIds || []
      }))

    const itemsToAdd = newItems.value.map(item => ({
      item_id: item.itemId,
      is_backhoe: item.isBackhoe ? 1 : 0,
      gross_weight: item.grossWeight,
      item_price: item.itemPrice,
      net_weight: item.netWeight,
      total_amount: item.totalAmount,
      deduction_amount: item.deductionAmount,
      deduction_ids: item.deductionIds || []
    }))

    const workersToAdd = newWorkers.value.map(w => ({
      empId: w.empId
    }))

    const response = await api.post('/vouchers/update', {
      voucher_id: props.voucherId,
      voucher_data: {
        weightSlip: editData.value.weightSlip,
        driver: editData.value.driver,
        transaction_time: editData.value.transactionTime,
        add_less: editData.value.addLess,
        total_amount: editData.value.totalAmount
      },
      items: {
        update: itemsToUpdate,
        add: itemsToAdd,
        delete: deletedItems.value
      },
      workers: {
        add: workersToAdd,
        delete: deletedWorkers.value
      },
      status: status
    })

    if (response.data && !response.data.error) {
      const statusText = status === 1 ? 'saved as draft' : 'marked for payment'
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Voucher ${statusText} successfully`,
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('updated')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to update voucher:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update voucher',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  voucherDetails.value = null
  voucherItems.value = []
  voucherWorkers.value = []
  deletedWorkers.value = []
  newWorkers.value = []
  deletedItems.value = []
  newItems.value = []
  searchEmp.value.search = ''
  editData.value = {
    id: null,
    transactionTime: 1,
    supplier_name: '',
    weightSlip: '',
    driver: '',
    paymentDate: '',
    addLess: 0,
    totalAmount: 0
  }
}
</script>