<script setup>
import { ref, onMounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExpand, faMinus, faBullhorn, faArrowRight, faTimes, faArrowCircleRight, faSave } from '@fortawesome/free-solid-svg-icons'
import EmployeeCard from './Actions/EmployeeCard.vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'

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

// UI state
const activeEmployee = ref(null)

// Day type options
const dayTypeOptions = [
  { value: 1, label: 'Regular' },
  { value: 2, label: 'Regular Holiday' },
  { value: 3, label: 'Special Holiday' },
  { value: 4, label: 'Sunday Duty' },
  { value: 5, label: 'Double Holiday' }
]

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
      
      // Map the response data to our refs
      present.value = response.data.data.present || []
      absent.value = response.data.data.absent || []
      halfday.value = response.data.data.halfday || []
      restday.value = response.data.data.restday || []
      
      // Update totals
      totals.value = {
        present: present.value.length,
        absent: absent.value.length,
        halfday: halfday.value.length,
        restday: restday.value.length
      }
    }
    
  } catch (error) {
    console.error('Failed to load attendance:', error)
    if (error.response?.status === 404) {
      clearData()
      Swal.fire({
        icon: 'info',
        title: 'No Data',
        text: 'No attendance data found for this date'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error loading attendance data'
      })
    }
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
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Day type updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      // Refresh attendance data to reflect any changes
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
  // Automatically update the day type when changed
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
const updateStatus = async (employeeId, newStatus) => {
  // Map status to workStatus number
  const statusMap = {
    present: 1,
    absent: 2,
    halfday: 3,
    restday: 4
  }

  try {
    const response = await api.post('/attendance/update-employee', {
      empAtt_id: employeeId,
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
    
    activeEmployee.value = null
  } catch (error) {
    console.error('Failed to update status:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response.data.message
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
      text: error.response.data.message
    })
  }
}

// Show action buttons for employee
const showActions = (employeeId, column) => {
  activeEmployee.value = { id: employeeId, column }
}

// Hide action buttons
const hideActions = () => {
  activeEmployee.value = null
}

// Check if actions are visible for an employee
const isActive = (employeeId, column) => {
  return activeEmployee.value?.id === employeeId && activeEmployee.value?.column === column
}

// Watch for date changes
watch(date, () => fetchAttendance())

// Initialize
onMounted(() => fetchAttendance())
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <input
                  type="date"
                  v-model="date"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  :disabled="loading"
                >
              </div>
              <div>
                <div class="flex items-end gap-2">
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
                  <!-- Optional: Manual save button if you don't want auto-save -->
                  <!-- <button
                    @click="updateDayType"
                    :disabled="loading || updatingDayType"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    <FontAwesomeIcon :icon="faSave" class="mr-2" />
                    {{ updatingDayType ? 'Saving...' : 'Save' }}
                  </button> -->
                </div>
                <div class="flex items-center mt-1">
                  <FontAwesomeIcon :icon="faArrowRight" class="text-xs text-gray-500 mr-1" />
                  <p class="text-xs text-gray-500">
                    {{ updatingDayType ? 'Updating day type...' : 'Day type is automatically saved when changed' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- Attendance Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              
              <!-- Present Column -->
              <div class="bg-white border rounded-lg shadow-sm border-green-200">
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-green-600">
                  <h3 class="text-white font-medium">Present</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ present.length }}
                  </span>
                </div>
                <div class="p-3 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <div v-if="!present.length" class="text-center text-gray-400 py-8">
                    No present employees
                  </div>
                  <div v-else v-for="emp in present" :key="emp.empId" class="mb-2">
                    <EmployeeCard 
                      :employee="emp" 
                      :column="'present'"
                      :is-active="isActive(emp.empId, 'present')"
                      @show-actions="showActions"
                      @hide-actions="hideActions"
                      @update-status="updateStatus"
                    />
                  </div>
                </div>
              </div>

              <!-- Absent Column -->
              <div class="bg-white border rounded-lg shadow-sm border-red-200">
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-red-600">
                  <h3 class="text-white font-medium">Absent</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ absent.length }}
                  </span>
                </div>
                <div class="p-3 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <div v-if="!absent.length" class="text-center text-gray-400 py-8">
                    No absent employees
                  </div>
                  <div v-else v-for="emp in absent" :key="emp.empId" class="mb-2">
                    <EmployeeCard 
                      :employee="emp" 
                      :column="'absent'"
                      :is-active="isActive(emp.empId, 'absent')"
                      @show-actions="showActions"
                      @hide-actions="hideActions"
                      @update-status="updateStatus"
                    />
                  </div>
                </div>
              </div>

              <!-- Halfday Column -->
              <div class="bg-white border rounded-lg shadow-sm border-yellow-200">
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-yellow-500">
                  <h3 class="text-white font-medium">Halfday</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ halfday.length }}
                  </span>
                </div>
                <div class="p-3 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <div v-if="!halfday.length" class="text-center text-gray-400 py-8">
                    No halfday employees
                  </div>
                  <div v-else v-for="emp in halfday" :key="emp.empId" class="mb-2">
                    <EmployeeCard 
                      :employee="emp" 
                      :column="'halfday'"
                      :is-active="isActive(emp.empId, 'halfday')"
                      @show-actions="showActions"
                      @hide-actions="hideActions"
                      @update-status="updateStatus"
                    />
                  </div>
                </div>
              </div>

              <!-- Restday Column -->
              <div class="bg-white border rounded-lg shadow-sm border-gray-200">
                <div class="px-4 py-2 rounded-t-lg flex justify-between items-center bg-gray-600">
                  <h3 class="text-white font-medium">Restday</h3>
                  <span class="bg-white bg-opacity-25 text-white px-2 py-1 rounded-full text-xs">
                    {{ restday.length }}
                  </span>
                </div>
                <div class="p-3 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <div v-if="!restday.length" class="text-center text-gray-400 py-8">
                    No restday employees
                  </div>
                  <div v-else v-for="emp in restday" :key="emp.empId" class="mb-2">
                    <EmployeeCard 
                      :employee="emp" 
                      :column="'restday'"
                      :is-active="isActive(emp.empId, 'restday')"
                      @show-actions="showActions"
                      @hide-actions="hideActions"
                      @update-status="updateStatus"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary and End Day Button -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                Total Employees: {{ present.length + absent.length + halfday.length + restday.length }}
              </div>
              <button
                @click="endDay"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                :disabled="loading || updatingDayType"
              >
                <FontAwesomeIcon :icon="faArrowCircleRight" class="mr-2" />
                END DAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>