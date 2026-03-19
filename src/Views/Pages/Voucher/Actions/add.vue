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
      New Voucher
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Create a Voucher"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="6xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Transaction Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Time:</label>
            <SelectComponent
              v-model="voucher.transaction_time"
              :options="transactionTimeOptions"
              placeholder="--Select Transaction Time--"
            />
          </div>
          <div></div>

          <!-- Paid To / Supplier (using Dropdown Component) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Paid To: 
              <i v-if="selectedSupplier?.supplierTier" :class="getMedalIconClass(selectedSupplier?.supplierTier)" class="ml-1"></i>
              <small v-if="selectedSupplier?.supplierTier" class="ml-1 text-gray-500">{{ getTierName(selectedSupplier?.supplierTier) }} tier</small>
            </label>
            <SearchDropdown
              :apiEndpoint="'suppliers/active-list'"
              :searchModel="searchSup"
              placeholder="Search for supplier..."
              itemLabel="supplier_name"
              itemId="supplier_id"
              returnName="['supplier_name']"
              dataKey="suppliers"
              @item-selected="handleSupplierSelected"
              :defaultValue="selectedSupplier?.supplier_name"
              formatLabel="none"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Weigh Slip No -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Weigh Slip No:</label>
            <input 
              type="text" 
              v-model="voucher.weigh_slip" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Input Weigh Slip No."
            />
          </div>

          <!-- Driver -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver:</label>
            <input 
              type="text" 
              v-model="voucher.driver" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Input Driver."
            />
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input 
              type="date" 
              v-model="voucher.date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <!-- Workers Selection (using Dropdown Component for adding workers) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Workers:</label>
            
            <!-- Dropdown for selecting workers -->
            <div class="mb-3">
              <SearchDropdown
                :apiEndpoint="'employee/active-list'"
                :searchModel="searchEmp"
                placeholder="Search and select worker..."
                itemLabel="name"
                itemId="id"
                returnName="['name']"
                dataKey="employees"
                @item-selected="addWorker"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">Search and select workers to add them to the list</p>
            </div>

            <!-- Selected Workers as Input Fields -->
            <div class="space-y-2 mt-3">
              <div 
                v-for="(worker, index) in selectedWorkers" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <div class="flex-1 relative">
                  <input 
                    type="text" 
                    :value="worker.label" 
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
              
              <div v-if="selectedWorkers.length === 0" class="text-gray-500 text-sm italic">
                No workers selected yet. Search and select workers above.
              </div>
            </div>
          </div>
        </div>

        <!-- Add Row Button -->
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="addRowTask" 
            class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Field
          </button>
        </div>

        <!-- Particulars Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th colspan="7" class="px-3 py-2 text-left font-medium text-gray-700">Particulars</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">Amount</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700" rowspan="2">Action</th>
              </tr>
              <tr class="bg-gray-50">
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">BackHoe?</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Item</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Gross Weight (kg)</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Ded. Amt.</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Net Weight (kg)</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Supplier Rate (₱)</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Deduction Type</th>
                <th class="px-3 py-2 text-left font-medium text-gray-600 text-xs">Total Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Show message only when there are no tasks -->
              <tr v-if="task.length === 0">
                <td colspan="10" class="px-3 py-4 text-center text-gray-500">
                  No tasks added yet. Click "New Field" to add a task.
                </td>
              </tr>
              <!-- Show tasks when available, regardless of supplier selection -->
              <tr v-for="(t, tt) in task" :key="tt" class="hover:bg-gray-50">
                <td class="px-3 py-2">
                  <input 
                    type="checkbox" 
                    v-model="t.is_backhoe"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    title="Check if task used backhoe"
                  />
                </td>
                <td class="px-3 py-2">
                  <SelectComponent
                    v-model="t.task"
                    :options="taskOptions"
                    :placeholder="'--Choose task--'"
                    @change="(val) => handleTaskChange(val, tt)"
                  />
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="t.gross_weight" 
                    @input="getComputation(t, tt)"
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Gross"
                  />
                </td>
                <td class="px-3 py-2">
                  <div class="space-y-1">
                    <input 
                      type="text" 
                      v-model="t.deduction_amount" 
                      readonly
                      class="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                      placeholder="Auto"
                    />
                    <div v-if="t.gross_weight" class="text-xs text-gray-500">
                      Base: {{ t.task_deduction || 0 }}
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="t.net_weight" 
                    readonly
                    class="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td class="px-3 py-2">
                  <div class="space-y-1">
                    <input 
                      type="text" 
                      v-model="t.item_price" 
                      @input="getCustomComputation(tt)"
                      class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      placeholder="Rate"
                    />
                    <div v-if="t.rate_deduction > 0" class="text-xs text-purple-600">
                      Effective: ₱{{ (parseFloat(t.item_price) - t.rate_deduction).toFixed(2) }}
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2">
                  <!-- Deduction Multi-select - Only show when gross weight is entered -->
                  <div v-if="t.gross_weight" class="space-y-1">
                    <!-- Dropdown for selecting deductions -->
                    <select
                      @change="(e) => addDeduction(e, tt)"
                      class="w-32 border-gray-300 rounded-md px-1 py-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs"
                    >
                      <option value="">--Add Deduction--</option>
                      <option
                        v-for="option in availableDeductions(tt)"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }} ({{ option.type == 1 ? '% of weight' : '₱ off rate' }}: {{ option.type == 1 ? option.amount + '%' : '₱' + option.amount }})
                      </option>
                    </select>

                    <!-- Selected deductions as tags -->
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span 
                        v-for="(ded, di) in getSelectedDeductions(tt)" 
                        :key="di"
                        class="inline-flex items-center px-2 py-0.5 text-xs rounded-full"
                        :class="ded.type == 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                      >
                        {{ ded.label }} 
                        <span class="ml-1 text-xs opacity-75">
                          ({{ ded.type == 1 ? '%' : '₱' }})
                        </span>
                        <button 
                          type="button"
                          @click="removeDeduction(tt, ded.value)"
                          class="ml-1 hover:opacity-75"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-400 italic">
                    Enter gross weight first
                  </div>
                </td>
                <td class="px-3 py-2">
                  <input 
                    type="text" 
                    v-model="t.total_amount" 
                    readonly
                    class="w-24 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td class="px-3 py-2">
                  <button 
                    type="button" 
                    @click="removeRowTask(tt)" 
                    class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Remove row!"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="7" class="px-3 py-2 text-right font-medium">Add/Less</td>
                <td colspan="2" class="px-3 py-2">
                  <input 
                    type="number" 
                    v-model="voucher.add_less" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Input Add/Less Amount."
                  />
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-100 font-bold">
              <tr>
                <td colspan="7" class="px-3 py-3 text-right text-red-600">Total</td>
                <td colspan="2" class="px-3 py-3">
                  <input 
                    type="text" 
                    :value="calculateTotal" 
                    readonly
                    class="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm font-bold"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <button 
            @click="saveVoucher" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SelectComponent from '@/Js/Components/SelectComponent.vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'

const emit = defineEmits(['saved'])

// Props
const props = defineProps({
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
const fileInput = ref(null)
const selectedSupplier = ref(null)
const selectedWorkers = ref([])

const searchEmp = ref({
    search: '',
    itemsperpage: 10,
    page_num: 1
})

const searchSup = ref({
    search: '',
    itemsperpage: 10,
    page_num: 1
})

const voucher = ref({
  transaction_time: 0,
  payee: '',
  tier: 0,
  weigh_slip: '',
  driver: '',
  date: new Date().toISOString().split('T')[0],
  worker: [],
  add_less: 0,
  total_amount: 0
})

const task = ref([])

// Options
const transactionTimeOptions = [
  { value: '1', label: 'Morning' },
  { value: '2', label: 'Afternoon' }
]

// Computed
const calculateTotal = computed(() => {
  const taskTotal = task.value.reduce((sum, t) => sum + (parseFloat(t.total_amount) || 0), 0)
  const addLess = parseFloat(voucher.value.add_less) || 0
  return (taskTotal + addLess).toFixed(2)
})

// Watch selectedWorkers to update voucher.worker
watch(selectedWorkers, (newWorkers) => {
  voucher.value.worker = newWorkers.map(w => w.value)
}, { deep: true })

// Helper function to get deduction details
const getDeductionDetails = (value) => {
  return props.deductionOptions.find(d => d.value == value)
}

// Calculate rate deduction (type 2 deductions - off rate)
const calculateRateDeduction = (taskItem) => {
  let totalRateDeduction = 0
  
  if (taskItem.deduction_type && Array.isArray(taskItem.deduction_type)) {
    taskItem.deduction_type.forEach(value => {
      const deduction = getDeductionDetails(value)
      if (deduction && deduction.type == 2) {
        totalRateDeduction += parseFloat(deduction.amount) || 0
      }
    })
  }
  
  return totalRateDeduction
}

// Calculate weight deduction (type 1 deductions and base deduction)
const calculateWeightDeduction = (taskItem) => {
  if (!taskItem.gross_weight) return 0
  
  const gross = parseFloat(taskItem.gross_weight) || 0
  let totalDeduction = 0
  
  // Add task base deduction if exists (deduction from gross weight)
  if (taskItem.task_deduction) {
    totalDeduction += parseFloat(taskItem.task_deduction) || 0
  }
  
  // Add selected deductions of type 1 (percentage of weight)
  if (taskItem.deduction_type && Array.isArray(taskItem.deduction_type)) {
    taskItem.deduction_type.forEach(value => {
      const deduction = getDeductionDetails(value)
      if (deduction && deduction.type == 1) {
        totalDeduction += (gross * (parseFloat(deduction.amount) / 100))
      }
    })
  }
  
  return totalDeduction
}

// Get selected deductions for a task row with type information
const getSelectedDeductions = (taskIndex) => {
  const taskItem = task.value[taskIndex]
  if (!taskItem || !taskItem.deduction_type || !Array.isArray(taskItem.deduction_type)) return []
  
  return taskItem.deduction_type
    .map(value => getDeductionDetails(value))
    .filter(d => d)
}

// Get available deductions for a task row (not yet selected)
const availableDeductions = (taskIndex) => {
  const taskItem = task.value[taskIndex]
  if (!taskItem) return props.deductionOptions
  
  const selectedValues = taskItem.deduction_type || []
  return props.deductionOptions.filter(opt => !selectedValues.includes(opt.value))
}

// Add deduction to task row
const addDeduction = (event, taskIndex) => {
  const value = event.target.value
  if (!value) return
  
  const taskItem = task.value[taskIndex]
  if (!taskItem.deduction_type) {
    taskItem.deduction_type = []
    taskItem.rate_deduction = 0
  }
  
  if (!taskItem.deduction_type.includes(value)) {
    taskItem.deduction_type.push(value)
    // Recalculate after adding deduction
    getComputation(taskItem, taskIndex)
  }
  
  // Reset the select
  event.target.value = ''
}

// Remove deduction from task row
const removeDeduction = (taskIndex, value) => {
  const taskItem = task.value[taskIndex]
  if (taskItem && taskItem.deduction_type && Array.isArray(taskItem.deduction_type)) {
    const index = taskItem.deduction_type.findIndex(item => String(item) === String(value))
    
    if (index > -1) {
      taskItem.deduction_type.splice(index, 1)
      // Reset rate_deduction and recalculate
      taskItem.rate_deduction = 0
      // Recalculate after removing deduction
      getComputation(taskItem, taskIndex)
      // Force reactivity
      task.value = [...task.value]
    }
  }
}

// Get effective rate after rate deductions
const getEffectiveRate = (taskItem) => {
  const baseRate = parseFloat(taskItem.item_price) || 0
  const rateDeduction = taskItem.rate_deduction || 0
  return Math.max(0, baseRate - rateDeduction)
}

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
}

const handleSupplierSelected = (supplier) => {
  selectedSupplier.value = supplier
  voucher.value.payee = supplier.id
  voucher.value.tier = supplier.supplierTier
}

const getTierName = (tier) => {
  const tierNum = parseInt(tier)
  switch(tierNum) {
    case 4:
      return 'Gold'
    case 3:
      return 'Silver'
    case 2:
      return 'Bronze'
    case 1:
      return 'Normal'
    default:
      return 'Unknown'
  }
}

const getMedalIconClass = (tier) => {
  const tierNum = parseInt(tier)
  switch(tierNum) {
    case 4:
      return 'fas fa-medal text-yellow-500'
    case 3:
      return 'fas fa-medal text-gray-400'
    case 2:
      return 'fas fa-medal text-amber-700'
    case 1:
      return 'fas fa-building text-gray-500'
    default:
      return 'fas fa-building text-gray-500'
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  console.log('File selected:', file)
}

const addWorker = (employee) => {
  // Check if worker is already selected
  const exists = selectedWorkers.value.some(w => w.value === employee.id)
  
  if (!exists) {
    const fullName = employee.name
    selectedWorkers.value.push({
      value: employee.id,
      label: fullName || employee.name || 'Unknown'
    })
    // Clear the search input after selection
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
  selectedWorkers.value.splice(index, 1)
}

const addRowTask = () => {
  task.value.push({
    is_backhoe: false,
    task: 0,
    task_deduction: 0,
    gross_weight: '',
    deduction_amount: '',
    net_weight: '',
    item_price: '',
    deduction_type: [],
    rate_deduction: 0,
    total_amount: 0
  })
}

const removeRowTask = (index) => {
  task.value.splice(index, 1)
}

const handleTaskChange = (value, index) => {
  const taskItem = task.value[index]
  const selectedTask = props.taskOptions.find(t => t.value == value)
  
  if (selectedTask) {
    // Get the price based on supplier tier
    const tier = voucher.value.tier || 1
    const priceKey = tier.toString()
    taskItem.item_price = selectedTask[priceKey] || 0
    
    // Set task base deduction
    taskItem.task_deduction = selectedTask.deduc || 0
    
    // Reset rate deduction when task changes
    taskItem.rate_deduction = 0
  }
  
  // Recalculate if gross weight exists
  if (taskItem.gross_weight) {
    getComputation(taskItem, index)
  }
}

const getComputation = (taskItem, index) => {
  // Only calculate if gross weight is entered
  if (!taskItem.gross_weight) return
  
  const gross = parseFloat(taskItem.gross_weight) || 0
  
  // Calculate rate deduction (type 2 deductions)
  taskItem.rate_deduction = calculateRateDeduction(taskItem)
  
  // Calculate effective rate after rate deductions
  const effectiveRate = getEffectiveRate(taskItem)
  
  // Calculate weight deduction (type 1 and base deduction)
  const weightDeduction = calculateWeightDeduction(taskItem)
  taskItem.deduction_amount = weightDeduction.toFixed(2)
  
  // Calculate net weight (gross - weight deduction)
  taskItem.net_weight = (gross - weightDeduction).toFixed(2)
  
  // Calculate total amount (net weight * effective rate)
  taskItem.total_amount = (parseFloat(taskItem.net_weight) * effectiveRate).toFixed(2)
  
  // Update voucher total after task calculation
  updateVoucherTotal()
}

const updateVoucherTotal = () => {
  const taskTotal = task.value.reduce((sum, t) => sum + (parseFloat(t.total_amount) || 0), 0)
  const addLess = parseFloat(voucher.value.add_less) || 0
  voucher.value.total_amount = (taskTotal + addLess).toFixed(2)
}

const getCustomComputation = (index) => {
  const taskItem = task.value[index]
  getComputation(taskItem, index)
}

const saveVoucher = async () => {
  // Validate required fields
  if (!voucher.value.payee) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a supplier',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (task.value.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please add at least one task',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    // Prepare form data for file upload
    const formData = new FormData()
    formData.append('voucher', JSON.stringify(voucher.value))
    formData.append('tasks', JSON.stringify(task.value))
    
    if (fileInput.value?.files[0]) {
      formData.append('proof', fileInput.value.files[0])
    }

    const response = await api.post('/vouchers/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save voucher:', error.response)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to create voucher',
      showConfirmButton: true
    })
  }
}

const resetForm = () => {
  voucher.value = {
    transaction_time: 0,
    payee: '',
    tier: 0,
    weigh_slip: '',
    driver: '',
    date: new Date().toISOString().split('T')[0],
    worker: [],
    add_less: 0,
    total_amount: 0
  }
  task.value = []
  selectedSupplier.value = null
  selectedWorkers.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}
</script>