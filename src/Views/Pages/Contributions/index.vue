<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Employee Contributions</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Contributions</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="container-fluid px-6 py-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Card Header -->
            <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg flex justify-between items-center">
              <h5 class="text-white font-semibold text-lg">CONTRIBUTIONS TABLE</h5>
              <div class="flex space-x-2" id="tools">
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="maximize">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </button>
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="collapse">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <div class="flex flex-wrap">
                <div class="w-full mt-4 mb-0 pb-0">
                  <!-- Search -->
               <!--   <div class="p-3 flex justify-end">
                    <Add/>
                  </div> -->
                  <div class="w-full mb-4">
                    <div class="relative">
                      <input
                        type="search"
                        placeholder="Search employees..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        v-model="search.search"
                        @keyup="filter"
                      >
                      <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Contributions Cards -->
                  <div class="space-y-6">
                    <div v-for="(employee, empIndex) in data" :key="employee.id" class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <!-- Employee Header -->
                      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                          <div>
                            <h3 class="text-lg font-semibold text-gray-800">{{ employee.employeeName || employee.fullName || employee.name }}</h3>
                            <p class="text-sm text-gray-600">Employee ID: {{ employee.employeeIdNumber || employee.employee_id }}</p>
                            <p class="text-sm text-gray-600">Position: {{ employee.position }}</p>
                          </div>
                          <div class="flex space-x-2">
                            <button
                              @click="addMandatoryContribution(empIndex)"
                              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                              </svg>
                              <span>Add Mandatory</span>
                            </button>
                            <button
                              @click="addNonMandatoryContribution(empIndex)"
                              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                              </svg>
                              <span>Add Non-Mandatory</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Contributions List -->
                      <div class="p-6">
                        <!-- Mandatory Deductions Section -->
                        <div class="mb-6">
                          <h4 class="text-md font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Mandatory Deductions</h4>
                          <div v-if="employee.mandatoryContributions && employee.mandatoryContributions.length > 0" class="space-y-4">
                            <div v-for="(contribution, childIndex) in employee.mandatoryContributions" :key="contribution.id || childIndex" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Deduction Type Dropdown - Always editable -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-700 mb-1">Deduction Type</label>
                                  <select
                                    v-model="contribution.deductionId"
                                    @change="updateDeductionInfo(contribution)"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select Deduction</option>
                                    <option v-for="deduction in mandatoryDeductionOptions" :key="deduction.id" :value="deduction.id">
                                      {{ deduction.name }}
                                    </option>
                                  </select>
                                </div>

                                <!-- Amount - Always editable -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                                  <input
                                    type="number"
                                    v-model="contribution.amount"
                                    step="0.01"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                </div>

                                <!-- Actions -->
                                <div class="flex items-end space-x-2">
                                  <!-- Save button for new records -->
                                  <button
                                    v-if="contribution.isNew"
                                    @click="saveNewContribution(empIndex, childIndex, 'mandatory')"
                                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Save</span>
                                  </button>

                                  <!-- Update button for existing records -->
                                  <button
                                    v-if="!contribution.isNew"
                                    @click="updateContribution(empIndex, childIndex, 'mandatory')"
                                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    <span>Update</span>
                                  </button>

                                  <!-- Cancel button for new records -->
                                  <button
                                    v-if="contribution.isNew"
                                    @click="cancelNewContribution(empIndex, childIndex, 'mandatory')"
                                    class="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    <span>Cancel</span>
                                  </button>

                                  <!-- Delete button -->
                                  <button
                                    v-if="!contribution.isNew"
                                    @click="deleteContribution(empIndex, childIndex, 'mandatory')"
                                    class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                            <p class="text-sm">No mandatory contributions added yet.</p>
                          </div>
                        </div>

                        <!-- Non-Mandatory Deductions Section -->
                        <div class="mb-6">
                          <h4 class="text-md font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Non-Mandatory Deductions</h4>
                          <div v-if="employee.nonMandatoryContributions && employee.nonMandatoryContributions.length > 0" class="space-y-4">
                            <div v-for="(contribution, childIndex) in employee.nonMandatoryContributions" :key="contribution.id || childIndex" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Deduction Type Dropdown - Always editable -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-700 mb-1">Deduction Type</label>
                                  <select
                                    v-model="contribution.deductionId"
                                    @change="updateDeductionInfo(contribution)"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select Deduction</option>
                                    <option v-for="deduction in nonMandatoryDeductionOptions" :key="deduction.id" :value="deduction.id">
                                      {{ deduction.name }}
                                    </option>
                                  </select>
                                </div>

                                <!-- Amount - Always editable -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                                  <input
                                    type="number"
                                    v-model="contribution.amount"
                                    step="0.01"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                </div>

                                <!-- Actions -->
                                <div class="flex items-end space-x-2">
                                  <!-- Save button for new records -->
                                  <button
                                    v-if="contribution.isNew"
                                    @click="saveNewContribution(empIndex, childIndex, 'nonMandatory')"
                                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Save</span>
                                  </button>

                                  <!-- Update button for existing records -->
                                  <button
                                    v-if="!contribution.isNew"
                                    @click="updateContribution(empIndex, childIndex, 'nonMandatory')"
                                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    <span>Update</span>
                                  </button>

                                  <!-- Cancel button for new records -->
                                  <button
                                    v-if="contribution.isNew"
                                    @click="cancelNewContribution(empIndex, childIndex, 'nonMandatory')"
                                    class="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    <span>Cancel</span>
                                  </button>

                                  <!-- Delete button -->
                                  <button
                                    v-if="!contribution.isNew"
                                    @click="deleteContribution(empIndex, childIndex, 'nonMandatory')"
                                    class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                            <p class="text-sm">No non-mandatory contributions added yet.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Pagination -->
                  <div v-if="totalUsers > 0" class="mt-6">
                    <Pagination
                      :page_number="search.page_num"
                      :total_rows="totalUsers"
                      :itemsperpage="search.items_perpage"
                      @page_num="handlePageNum"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Pagination from '@/Js/Components/Paginate.vue'
import { FormDx, useDebounce } from '@/Views/Utility/Helper'
// import Add from './Actions/add.vue'

// State
const data = ref([])
const totalUsers = ref(0)
const mandatoryDeductionOptions = ref([])
const nonMandatoryDeductionOptions = ref([])

const search = ref({
  search: '',
  page_num: 1,
  items_perpage: 10
})

// Methods
const maximize = () => {
  // Implement maximize functionality
}

const collapse = () => {
  // Implement collapse functionality
}

const filter = async () => {
  search.value.page_num = 1
 fetchContributions()
}

const handlePageNum = (page_num) => {
  search.value.page_num = page_num
  fetchContributions()
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Fetch deduction options for dropdown
const fetchDeductions = useDebounce( async () => {
  try {
    // Fetch mandatory deductions
    const mandatoryResponse = await api.get('compensations/mandatory')
    if (mandatoryResponse.data && !mandatoryResponse.data.error) {
      mandatoryDeductionOptions.value = mandatoryResponse.data.compensations || []
    }

     await sleep(500)

    // Fetch non-mandatory deductions
    const nonMandatoryResponse = await api.get('compensations/non-mandatory')
    if (nonMandatoryResponse.data && !nonMandatoryResponse.data.error) {
      nonMandatoryDeductionOptions.value = nonMandatoryResponse.data.compensations || []
    }
  } catch (error) {
    console.error('Failed to fetch deductions:', error)
  }
}, 500)

// Fetch contributions using existing endpoint
const fetchContributions = useDebounce( async () => {
  try {
    const formData = FormDx(search.value)
    const response = await api.post('employee/list-contribution', formData)

    if (response.data && !response.data.error) {
      // Process the data to add UI-specific properties
      data.value = (response.data.contributions || []).map(employee => ({
        ...employee,
        mandatoryContributions: (employee.mandatoryContributions || []).map(contribution => ({
          id: contribution.id,
          amount: contribution.amount,
          deductionId: contribution.deductionId,
          deductionName: contribution.deductionName,
          isNew: false
        })),
        nonMandatoryContributions: (employee.nonMandatoryContributions || []).map(contribution => ({
          id: contribution.id,
          amount: contribution.amount,
          deductionId: contribution.deductionId,
          deductionName: contribution.deductionName,
          isNew: false
        }))
      }))
      totalUsers.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch contributions:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load contributions',
      timer: 1500,
      showConfirmButton: false
    })
  }
}, 500)

// Add new mandatory contribution
const addMandatoryContribution = (empIndex) => {
  if (!data.value[empIndex].mandatoryContributions) {
    data.value[empIndex].mandatoryContributions = []
  }

  data.value[empIndex].mandatoryContributions.push({
    id: null,
    amount: 0,
    deductionId: '',
    isNew: true
  })
}

// Add new non-mandatory contribution
const addNonMandatoryContribution = (empIndex) => {
  if (!data.value[empIndex].nonMandatoryContributions) {
    data.value[empIndex].nonMandatoryContributions = []
  }

  data.value[empIndex].nonMandatoryContributions.push({
    id: null,
    amount: 0,
    deductionId: '',
    isNew: true
  })
}

// Cancel new contribution
const cancelNewContribution = (empIndex, childIndex, type) => {
  if (type === 'mandatory') {
    data.value[empIndex].mandatoryContributions.splice(childIndex, 1)
  } else {
    data.value[empIndex].nonMandatoryContributions.splice(childIndex, 1)
  }
}

// Update deduction info when selected
const updateDeductionInfo = (contribution) => {
  const allOptions = [...mandatoryDeductionOptions.value, ...nonMandatoryDeductionOptions.value]
  const selectedDeduction = allOptions.find(d => d.id == contribution.deductionId)
  if (selectedDeduction) {
    contribution.deductionName = selectedDeduction.name
  }
}

// API function for saving new contribution
const saveNewContribution = async (empIndex, childIndex, type) => {
  const employee = data.value[empIndex]
  const contribution = type === 'mandatory'
    ? employee.mandatoryContributions[childIndex]
    : employee.nonMandatoryContributions[childIndex]

  // Validate required fields
  if (!contribution.deductionId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a deduction type',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!contribution.amount || contribution.amount == 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter a valid amount',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const payload = {
      contri_id: employee.id,
      employeeId: employee.employeeIdNumber || employee.employee_id,
      contribution_data: {
        amount: contribution.amount,
        deductionId: contribution.deductionId
      },
      is_new: true,
      type: type // 'mandatory' or 'nonMandatory'
    }

    const response = await api.post('employee/save-contribution', payload)

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Contribution added successfully',
        timer: 1500,
        showConfirmButton: false
      })

      // Refresh the data
      await fetchContributions()
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to save contribution',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to save contribution:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to save contribution',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// API function for updating existing contribution
const updateContribution = async (empIndex, childIndex, type) => {
  const employee = data.value[empIndex]
  const contribution = type === 'mandatory'
    ? employee.mandatoryContributions[childIndex]
    : employee.nonMandatoryContributions[childIndex]

  // Validate required fields
  if (!contribution.deductionId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a deduction type',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!contribution.amount || contribution.amount == 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter a valid amount',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const payload = {
      contri_id: employee.id,
      employeeId: employee.employeeIdNumber || employee.employee_id,
      contribution_data: {
        id: contribution.id,
        amount: contribution.amount,
        deductionId: contribution.deductionId
      },
      is_new: false,
      type: type // 'mandatory' or 'nonMandatory'
    }

    const response = await api.post('employee/update-contribution', payload)

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Contribution updated successfully',
        timer: 1500,
        showConfirmButton: false
      })

      // Refresh the data
      await fetchContributions()
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to update contribution',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to update contribution:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update contribution',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// Delete contribution
const deleteContribution = async (empIndex, childIndex, type) => {
  const employee = data.value[empIndex]
  const contribution = type === 'mandatory'
    ? employee.mandatoryContributions[childIndex]
    : employee.nonMandatoryContributions[childIndex]

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this contribution?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      if (!contribution.isNew && contribution.id) {
        const response = await api.post('/employee/delete-contribution', {
          contribution_id: contribution.id,
          employee_id: employee.id,
          employeeId: employee.employeeIdNumber || employee.employee_id,
          type: type
        })

        if (response.data && !response.data.error) {
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Contribution deleted successfully',
            timer: 1500,
            showConfirmButton: false
          })

          await fetchContributions()
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data?.message || 'Failed to delete contribution',
            timer: 1500,
            showConfirmButton: false
          })
        }
      } else {
        // Remove from local array if it's a new unsaved record
        if (type === 'mandatory') {
          employee.mandatoryContributions.splice(childIndex, 1)
        } else {
          employee.nonMandatoryContributions.splice(childIndex, 1)
        }
        await Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Contribution removed',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to delete contribution:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete contribution',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

// Initialize
onMounted(() => {
  fetchDeductions()
  fetchContributions()
})
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
