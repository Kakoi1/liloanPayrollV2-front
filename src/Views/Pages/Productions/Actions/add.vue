<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add Production Task
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Production Task"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="6xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Report Date Section -->
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Date:</label>
          <div class="flex space-x-2">
            <input 
              type="date" 
              v-model="production.date" 
              @change="listModal"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <button 
              @click="listModal" 
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>

        <hr class="border-gray-200">

        <!-- Add Rows Button -->
        <div class="flex justify-end">
          <button 
            @click="addRowTask" 
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Rows
          </button>
        </div>

        <!-- Tasks Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-gray-700 w-1/6">Class</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700 w-1/6">Task</th>
                <th class="px-4 py-3 text-right font-medium text-gray-700 w-1/12">Jumbo/Tarema</th>
                <th class="px-4 py-3 text-right font-medium text-gray-700 w-1/12">Weight</th>
                <th class="px-4 py-3 text-right font-medium text-gray-700 w-1/12">Waste</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700 w-1/4">Employee</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700 w-24">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- New Task Rows -->
              <tr v-for="(row, index) in item" :key="'new-'+index" class="hover:bg-gray-50">
                <td class="px-4 py-2">
                  <select 
                    v-model="row.class"
                    @change="listItem(row.class, index)"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Choose Class</option>
                    <option value="33">Crusher</option>
                    <option value="35">Presser</option>
                  </select>
                </td>
                <td class="px-4 py-2">
                  <select 
                    v-model="row.item"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Choose Task</option>
                    <option v-for="item in itemDropdown" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                  <input type="hidden" :value="row.date = production.date" />
                </td>
                <td class="px-4 py-2">
                  <input 
                    type="number" 
                    v-model="row.jumbo" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2">
                  <input 
                    type="number" 
                    v-model="row.weight" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2">
                  <input 
                    type="number" 
                    v-model="row.waste" 
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2">
                  <!-- SearchDropdown for multiple employee selection -->
                  <SearchDropdown
                    :apiEndpoint="'/employee/active-list'"
                    :searchModel="searchEmp"
                    placeholder="Search and select workers..."
                    itemLabel="fullName"
                    itemId="id"
                    returnName="['fullName']"
                    dataKey="listEmployee"
                    @item-selected="(employee) => addEmployeeToRow(employee, index)"
                    className="w-full"
                  />
                  
                  <!-- Selected employees as tags -->
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span 
                      v-for="(emp, empIndex) in row.employees" 
                      :key="empIndex"
                      class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {{ emp.fullName || emp.name }}
                      <button 
                        @click="removeEmployeeFromRow(index, empIndex)"
                        class="ml-1 text-blue-600 hover:text-blue-800"
                        type="button"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <button 
                    @click="removeRowTask(index)" 
                    class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Remove row"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>

              <!-- Existing Production Data -->
              <tr v-for="(record, index) in productionData" :key="'existing-'+index" class="bg-gray-50 hover:bg-gray-100">
                <td class="px-4 py-2 text-left">{{ record.taskName }}</td>
                <td class="px-4 py-2 text-left">{{ record.className }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(record.jumbo) }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(record.weight) }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(record.waste) }}</td>
                <td class="px-4 py-2 text-left">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {{ record.worker }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <button 
                    @click="removeTask(record)" 
                    class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Remove task"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>

              <!-- No Items Message -->
              <tr v-if="item.length === 0 && (!productionData || productionData.length === 0)">
                <td colspan="7" class="px-4 py-8 text-center text-red-500">
                  No items added yet. Click "Add Rows" to add production tasks.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->

        <div class="flex justify-end px-6 py-4 bg-gray-50 rounded-b-lg">
          <button 
            @click="saveTask" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
        </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'

const emit = defineEmits(['saved'])
const searchEmp = ref({
    search: '',
    itemsperpage: 10,
    page_num: 1
})
// State
const showModal = ref(false)
const production = ref({
  date: moment().format('YYYY-MM-DD')
})
const item = ref([])
const productionData = ref([])
const itemDropdown = ref([])
const empDrop = ref([])

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
  // Optionally load initial data for the current date
  listModal()
}

const resetForm = () => {
  item.value = []
  productionData.value = []
}

const listModal = async () => {
  if (!production.value.date) return

  try {
    const response = await api.post('/productions/list-by-date', {
      date: production.value.date
    })
    
    if (response.data && !response.data.error) {
      productionData.value = response.data.productions || []
    }
  } catch (error) {
    console.error('Failed to fetch production data:', error)
  }
}

const listItem = async (className, index) => {
  try {
    const response = await api.post('/productions/position', {
      task_id: className
    })
    
    if (response.data && !response.data.error) {
      itemDropdown.value = response.data.position || []
    }
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

const addRowTask = () => {
  item.value.push({
    class: '',
    item: '',
    jumbo: '',
    weight: '',
    waste: '',
    employees: [], // Array to store multiple employees
    employeeIds: [], // Array to store employee IDs
    date: production.value.date
  })
}

const addEmployeeToRow = (employee, rowIndex) => {
  const row = item.value[rowIndex]
  if (!row.employees) {
    row.employees = []
    row.employeeIds = []
  }
  
  // Check if employee already added
  const exists = row.employeeIds.includes(employee.id)
  if (!exists) {
    row.employees.push(employee)
    row.employeeIds.push(employee.id)
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Employee already added to this row',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const removeEmployeeFromRow = (rowIndex, empIndex) => {
  const row = item.value[rowIndex]
  row.employees.splice(empIndex, 1)
  row.employeeIds.splice(empIndex, 1)
}

const removeRowTask = (index) => {
  item.value.splice(index, 1)
}

const removeTask = async (record) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this production task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/productions/delete', {
        id: record.id
      })
      
      if (response.data && !response.data.error) {
        await listModal() // Refresh the list
        await Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Production task removed successfully',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to delete production task:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove production task',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value).toFixed(2)
}

const saveTask = async () => {
  // Validate required fields
  if (item.value.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please add at least one production task',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Validate each row
  for (const row of item.value) {
    if (!row.class) {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a class for all rows',
        timer: 1500,
        showConfirmButton: false
      })
      return
    }
    if (!row.item) {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a task for all rows',
        timer: 1500,
        showConfirmButton: false
      })
      return
    }
    if (!row.employees || row.employees.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select at least one employee for all rows',
        timer: 1500,
        showConfirmButton: false
      })
      return
    }
  }

  try {
    const response = await api.post('/productions/add', {
      date: production.value.date,
      tasks: item.value.map(row => ({
        class: row.class,
        item_id: row.item,
        jumbo: row.jumbo || 0,
        weight: row.weight || 0,
        waste: row.waste || 0,
        employee_ids: row.employeeIds || []
      }))
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Production tasks saved successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save production tasks:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save production tasks',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Initialize
onMounted(() => {
  // Any initialization code
})
</script>