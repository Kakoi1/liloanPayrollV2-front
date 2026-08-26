<template>
    <div class="min-h-screen bg-gray-100 py-6">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">Employee Attendance</h1>
          <div class="text-sm text-gray-500">
            <a href="/dashboard" class="text-blue-600 hover:text-blue-800">Home</a>
            <span class="mx-2">/</span>
            <span class="text-gray-700">Daily Roll Call</span>
          </div>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          
          <!-- Card Header -->
          <div class="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h3 class="text-white font-medium text-lg">
              <FontAwesomeIcon :icon="faBullhorn" class="mr-2" />
              Daily Roll Call
            </h3>
            <div class="flex space-x-2">
              <button class="text-white hover:text-gray-200">
                <FontAwesomeIcon :icon="faExpand" />
              </button>
              <button class="text-white hover:text-gray-200">
                <FontAwesomeIcon :icon="faMinus" />
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6">
            
            <!-- Filters -->
            <div class="grid grid-cols- md:grid-cols-2 gap-4 mb-6">
              <div class="flex items-end gap-2">
                <div class="w-64">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Date:
                  </label>

                  <input
                    type="date"
                    v-model="date"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    :disabled="loading"
                  >
                </div>

                <button
                  @click="manualAdd"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                  :disabled="loading || updatingDayType"
                >
                  Manual Add
                </button>
              </div>
              <div>
                <!-- <div class="flex items-end gap-2">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Day Type:</label>
                    <select
                      v-model.number="workDayType"
                      @change="handleDayTypeChange"
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      :disabled="loading || updatingDayType"
                    >
                      <option v-for="option in dayTypeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div> -->
                <!-- <div class="flex items-center mt-1">
                  <FontAwesomeIcon :icon="faArrowRight" class="text-xs text-gray-500 mr-1" />
                  <p class="text-xs text-gray-500">
                    {{ updatingDayType ? 'Updating day type...' : 'Day type is automatically saved when changed' }}
                  </p>
                </div> -->
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- Attendance Grid with Drag and Drop - Updated to stretch -->
            <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" style="min-height: 500px;">
              
              <!-- Present Column -->
              <div 
                class="bg-white border rounded-lg shadow-sm border-green-200 flex flex-col"
                :class="{
                  'border-4 border-green-400': dragOverColumn === 'present'
                }"
                @dragover.prevent
                @drop.prevent="handleDrop('present')"
                @dragenter="dragOverColumn = 'present'"
                @dragleave="dragOverColumn = null"
              >
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-green-600 flex-shrink-0">
                  <h3 class="text-white font-medium">Present</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ present.length }}
                  </span>
                </div>
                <div class="p-3 flex-1 overflow-y-auto min-h-[200px]">
                  <div v-if="!present.length" class="text-center text-gray-400 py-8">
                    No present employees
                  </div>
                  <DraggableEmployeeCard 
                    v-for="emp in present" 
                    :key="emp.empId"
                    :employee="emp" 
                    :column="'present'"
                    @drag-start="handleDragStart"
                    @drag-end="handleDragEnd"
                  />
                </div>
              </div>

              <!-- Absent Column -->
              <div 
                class="bg-white border rounded-lg shadow-sm border-red-200 flex flex-col"
                :class="{
                  'border-4 border-red-400': dragOverColumn === 'absent'
                }"
                @dragover.prevent
                @drop.prevent="handleDrop('absent')"
                @dragenter="dragOverColumn = 'absent'"
                @dragleave="dragOverColumn = null"
              >
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-red-600 flex-shrink-0">
                  <h3 class="text-white font-medium">Absent</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ absent.length }}
                  </span>
                </div>
                <div class="p-3 flex-1 overflow-y-auto min-h-[200px]">
                  <div v-if="!absent.length" class="text-center text-gray-400 py-8">
                    No absent employees
                  </div>
                  <DraggableEmployeeCard 
                    v-for="emp in absent" 
                    :key="emp.empId"
                    :employee="emp" 
                    :column="'absent'"
                    @drag-start="handleDragStart"
                    @drag-end="handleDragEnd"
                  />
                </div>
              </div>

              <!-- Halfday Column -->
              <div 
                class="bg-white border rounded-lg shadow-sm border-yellow-200 flex flex-col"
                :class="{
                  'border-4 border-yellow-400': dragOverColumn === 'halfday'
                }"
                @dragover.prevent
                @drop.prevent="handleDrop('halfday')"
                @dragenter="dragOverColumn = 'halfday'"
                @dragleave="dragOverColumn = null"
              >
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-yellow-500 flex-shrink-0">
                  <h3 class="text-white font-medium">Halfday</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ halfday.length }}
                  </span>
                </div>
                <div class="p-3 flex-1 overflow-y-auto min-h-[200px]">
                  <div v-if="!halfday.length" class="text-center text-gray-400 py-8">
                    No halfday employees
                  </div>
                  <DraggableEmployeeCard 
                    v-for="emp in halfday" 
                    :key="emp.empId"
                    :employee="emp" 
                    :column="'halfday'"
                    @drag-start="handleDragStart"
                    @drag-end="handleDragEnd"
                  />
                </div>
              </div>

              <!-- Restday Column -->
              <div 
                class="bg-white border rounded-lg shadow-sm border-gray-200 flex flex-col"
                :class="{
                  'border-4 border-gray-400': dragOverColumn === 'restday'
                }"
                @dragover.prevent
                @drop.prevent="handleDrop('restday')"
                @dragenter="dragOverColumn = 'restday'"
                @dragleave="dragOverColumn = null"
              >
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-gray-600 flex-shrink-0">
                  <h3 class="text-white font-medium">Restday</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ restday.length }}
                  </span>
                </div>
                <div class="p-3 flex-1 overflow-y-auto min-h-[200px]">
                  <div v-if="!restday.length" class="text-center text-gray-400 py-8">
                    No restday employees
                  </div>
                  <DraggableEmployeeCard 
                    v-for="emp in restday" 
                    :key="emp.empId"
                    :employee="emp" 
                    :column="'restday'"
                    @drag-start="handleDragStart"
                    @drag-end="handleDragEnd"
                  />
                </div>
              </div>
            </div>

            <!-- Summary and End Day Button -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                Total Employees: {{ present.length + absent.length + halfday.length + restday.length }}
              </div>
              <!-- <button
                @click="endDay"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                :disabled="loading || updatingDayType"
              >
                <FontAwesomeIcon :icon="faArrowCircleRight" class="mr-2" />
                END DAY
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExpand, faMinus, faBullhorn, faArrowRight, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import DraggableEmployeeCard from './Actions/EmployeeCard.vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import { handleApiError } from '@/Views/Utility/Helper'

// State
const date = ref(new Date().toISOString().split('T')[0])
const workDayType = ref(1)
const loading = ref(false)
const updatingDayType = ref(false)

// Attendance data
const present = ref([])
const absent = ref([])
const halfday = ref([])
const restday = ref([])
const totals = ref({
  present: 0,
  absent: 0,
  halfday: 0,
  restday: 0
})

// Drag and drop state
const draggingEmployee = ref(null)
const dragOverColumn = ref(null)

// Day type options
const dayTypeOptions = [
  { value: 1, label: 'Regular' },
  { value: 2, label: 'Regular Holiday' },
  { value: 3, label: 'Special Holiday' },
  { value: 4, label: 'Sunday Duty' },
  { value: 5, label: 'Double Holiday' }
]

// Drag handlers
const handleDragStart = (event, employee) => {
  draggingEmployee.value = employee
  event.dataTransfer.effectAllowed = 'move'
  // Store employee data in the drag event
  event.dataTransfer.setData('text/plain', JSON.stringify(employee))
}

const handleDragEnd = () => {
  draggingEmployee.value = null
  dragOverColumn.value = null
}

const handleDrop = async (targetColumn) => {
  dragOverColumn.value = null
  
  if (!draggingEmployee.value) return
  
  const employee = draggingEmployee.value
  const sourceColumn = employee.currentColumn || getEmployeeColumn(employee.empId)
  
  // Don't do anything if dropping in the same column
  if (sourceColumn === targetColumn) {
    draggingEmployee.value = null
    return
  }
  
  // Update the employee's status in the database
  await updateStatus(employee.empAtt_id || employee.empId, targetColumn, employee.id)
  
  // Remove from source column and add to target column
  moveEmployee(employee.empId, sourceColumn, targetColumn)
  
  draggingEmployee.value = null
}

// Helper to find which column an employee belongs to
const getEmployeeColumn = (empId) => {
  if (present.value.some(emp => emp.empId === empId)) return 'present'
  if (absent.value.some(emp => emp.empId === empId)) return 'absent'
  if (halfday.value.some(emp => emp.empId === empId)) return 'halfday'
  if (restday.value.some(emp => emp.empId === empId)) return 'restday'
  return null
}

// Move employee between columns
const moveEmployee = (empId, sourceColumn, targetColumn) => {
  let employee = null
  
  // Remove from source column
  switch(sourceColumn) {
    case 'present':
      const presentIndex = present.value.findIndex(emp => emp.empId === empId)
      if (presentIndex !== -1) {
        employee = present.value.splice(presentIndex, 1)[0]
      }
      break
    case 'absent':
      const absentIndex = absent.value.findIndex(emp => emp.empId === empId)
      if (absentIndex !== -1) {
        employee = absent.value.splice(absentIndex, 1)[0]
      }
      break
    case 'halfday':
      const halfdayIndex = halfday.value.findIndex(emp => emp.empId === empId)
      if (halfdayIndex !== -1) {
        employee = halfday.value.splice(halfdayIndex, 1)[0]
      }
      break
    case 'restday':
      const restdayIndex = restday.value.findIndex(emp => emp.empId === empId)
      if (restdayIndex !== -1) {
        employee = restday.value.splice(restdayIndex, 1)[0]
      }
      break
  }
  
  // Add to target column if employee was found
  if (employee) {
    employee.currentColumn = targetColumn
    switch(targetColumn) {
      case 'present':
        present.value.push(employee)
        break
      case 'absent':
        absent.value.push(employee)
        break
      case 'halfday':
        halfday.value.push(employee)
        break
      case 'restday':
        restday.value.push(employee)
        break
    }
    
    // Update totals
    updateTotals()
  }
}

// Update totals
const updateTotals = () => {
  totals.value = {
    present: present.value.length,
    absent: absent.value.length,
    halfday: halfday.value.length,
    restday: restday.value.length
  }
}

// Fetch attendance data
const fetchAttendance = async () => {
  loading.value = true
  try {
    const response = await api.post('/attendance/list', {
      date: date.value,
      day_type: workDayType.value
    })

    if (response.data.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.message
      })
      clearData()
    } else {
      // Update workDayType with the value from response if it exists
      if (response.data.attendance) {
        workDayType.value = response.data.attendance
      }
      
      // Map the response data to our refs and add currentColumn property
      present.value = (response.data.data.present || []).map(emp => ({
        ...emp,
        currentColumn: 'present'
      }))
      absent.value = (response.data.data.absent || []).map(emp => ({
        ...emp,
        currentColumn: 'absent'
      }))
      halfday.value = (response.data.data.halfday || []).map(emp => ({
        ...emp,
        currentColumn: 'halfday'
      }))
      restday.value = (response.data.data.restday || []).map(emp => ({
        ...emp,
        currentColumn: 'restday'
      }))
      
      // Update totals
      updateTotals()
    }
    
  } catch (error) {
    console.error('Failed to load attendance:', error)
    handleApiError(error)
  } finally {
    loading.value = false
  }
}

// Update day type in backend
const updateDayType = async () => {
  if (!date.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first'
    })
    return
  }
  
  updatingDayType.value = true
  try {
    const response = await api.post('/attendance/update-date-type', {
      date: date.value,
      day_type: workDayType.value
    })
    
    if (response.data.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.message
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Day type updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      await fetchAttendance()
    }
  } catch (error) {
    console.error('Failed to update day type:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error updating day type: ' + (error.response?.data?.message || 'Unknown error')
    })
  } finally {
    updatingDayType.value = false
  }
}

// Handle day type change
const handleDayTypeChange = () => {
  updateDayType()
}

// Clear all data
const clearData = () => {
  present.value = []
  absent.value = []
  halfday.value = []
  restday.value = []
  totals.value = {
    present: 0,
    absent: 0,
    halfday: 0,
    restday: 0
  }
}

// Update attendance status
const updateStatus = async (employeeId, newStatus, att_id) => {
  // Map status to workStatus number
  const statusMap = {
    present: 1,
    absent: 2,
    halfday: 3,
    restday: 4
  }

  try {
  Swal.fire({
      title: "Processing...",
      text: "Updating...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false, // Disable click outside to dismiss
    });
    const response = await api.post('/attendance/update-employee', {
      empAtt_id: att_id,
      work_status: statusMap[newStatus],
      date: date.value,
      day_type: workDayType.value
    })

    if (response.data && !response.data.error) {
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: response.data.message,
        timer: 1000,
        showConfirmButton: false
      })
      await fetchAttendance()
    }
  } catch (error) {
    console.error('Failed to update status:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update employee status'
    })
  }
}

// End day
const endDay = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to end the day? This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, end day!'
  })
  
  if (!result.isConfirmed) return
  
  try {
    const response = await api.post('/attendance/end-day', { 
      date: date.value,
      day_type: workDayType.value
    })
    
    if (response.data && !response.data.error) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false
      })
      await fetchAttendance()
    }
  } catch (error) {
    console.error('Failed to end day:', error.response)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to end day'
    })
  }
}

const manualAdd = async () => {

  try {
     Swal.fire({
      title: "Processing...",
      text: "Adding...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false, // Disable click outside to dismiss
    });
    const response = await api.post('attendance/manual-add', { date: date.value, })

    if (response.data && !response.data.error) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        // timer: 1500,
        // showConfirmButton: false
      })
      await fetchAttendance()
    }

  } catch (error) {
    console.error('Failed to end day:', error.response)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to end day'
    })
  }
}

// Watch for date changes
watch(date, () => fetchAttendance())

// Initialize
onMounted(() => fetchAttendance())
</script>