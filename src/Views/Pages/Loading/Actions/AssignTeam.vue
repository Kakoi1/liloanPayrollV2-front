<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="p-2.5 h-[55px] min-w-[60px] bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex flex-col items-center leading-[4px] "
      title="Assign Team"
    >
      <svg class="w-8 h-8 px-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <br> Assign
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Assign Team to Loading"
      color="bg-gradient-to-r from-purple-600 to-purple-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Information (read-only) -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Loading Details
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500">Loading Date:</label>
              <p class="text-sm font-medium">{{ formatDate(loading.loadingDate) }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Van No:</label>
              <p class="text-sm font-medium">{{ loading.vanNo ?? 'n/a' }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Seal No:</label>
              <p class="text-sm font-medium">{{ loading.sealNo ?? 'n/a' }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Item:</label>
              <p class="text-sm font-medium">{{ loading.itemName }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Current Team:</label>
              <p class="text-sm font-medium">
                <span v-if="loading.teamName" class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {{ loading.teamName }}
                </span>
                <span v-else class="text-red-500">Not Assigned</span>
              </p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Current Employees:</label>
              <p class="text-sm font-medium">
                <span v-if="loading.employees && loading.employees.length > 0">
                  {{ loading.employees.length }} employee(s)
                </span>
                <span v-else class="text-gray-400">None</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Select Team -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Team:</label>
          <SelectComponent
            v-model="selectedTeam"
            :options="teamOptions"
            placeholder="-- Choose Team --"
            class="w-full"
          />
        </div>

        <!-- Employee Selector Component -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <span v-if="selectedTeam && selectedTeam !== 0">Team Members:</span>
            <span v-else>Current Employees:</span>
          </label>
          
          <!-- Show current employees when no team is selected -->
          <div v-if="!selectedTeam || selectedTeam === 0">
            <div v-if="loading.employees && loading.employees.length > 0" class="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(emp, idx) in loading.employees" 
                  :key="idx"
                  class="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                >
                  {{ emp.fullName || emp.name }}
                </span>
              </div>
              <!-- <p class="text-xs text-gray-500 mt-2">These are the currently assigned employees. Select a team to replace them with team members.</p> -->
            </div>
            <div v-else class="text-sm text-gray-500 italic">
              No employees currently assigned
            </div>
          </div>

          <!-- Show EmployeeSelector when team is selected -->
          <div v-else>
            <EmployeeSelector 
              ref="employeeSelectorRef"
              :employees="availableEmployees"
              :initial-employees="initialSelectedEmployees"
              @add-employee="handleAddEmployee"
              @remove-employee="handleRemoveEmployee"
              @employees-updated="handleEmployeesUpdated"
            />
          </div>
        </div>

        <!-- Warning if no team selected -->
        <!-- <div v-if="!selectedTeam || selectedTeam === 0" class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span>Please select a team to assign. Current employees will be replaced with team members.</span>
          </div>
        </div> -->

        <!-- Info when team is selected -->
        <div v-if="selectedTeam && selectedTeam !== 0" class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Assigning this team will replace all current employees with the team members.</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            @click="assignTeam" 
            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
            :disabled="!selectedTeam || selectedTeam === 0"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Assign Team
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SelectComponent from '@/Js/Components/SelectComponent.vue'
import EmployeeSelector from './EmployeeSelector.vue'

const props = defineProps({
  loading: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated'])

// State
const showModal = ref(false)
const selectedTeam = ref(null)
const selectedTeamDetails = ref(null)
const teamOptions = ref([])
const availableEmployees = ref([])
const initialSelectedEmployees = ref([])
const selectedEmployeeIds = ref([])
const selectedEmployeeNames = ref([])
const employeeSelectorRef = ref(null)

// Methods
const openModal = () => {
  showModal.value = true
  fetchTeams()
  fetchAllEmployees()
  
  // Set selected team from props
  selectedTeam.value = props.loading.teamId ?? 0
  
  // Load existing employees from props
  if (props.loading.employees && Array.isArray(props.loading.employees)) {
    const employeeList = props.loading.employees.map(emp => ({
      id: emp.empId || emp.id,
      name: emp.fullName || emp.name || '',
      email: emp.email || ''
    }))
    
    initialSelectedEmployees.value = employeeList
    selectedEmployeeIds.value = employeeList.map(emp => emp.id)
    selectedEmployeeNames.value = employeeList.map(emp => emp.name)
    
    if (employeeSelectorRef.value) {
      employeeSelectorRef.value.setInitialEmployees(employeeList)
    }
  }
  
  // If team is selected (and not 0), fetch its details
  if (selectedTeam.value && selectedTeam.value !== 0) {
    fetchTeamDetails(selectedTeam.value)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('YYYY-MM-DD')
}

const fetchTeams = async () => {
  try {
    const response = await api.post('/teams/list', {
      status: 1 // Active teams only
    })
    if (response.data && !response.data.error) {
      teamOptions.value = (response.data.teams || []).map(team => ({
        value: team.id,
        label: team.name
      }))
    }
  } catch (error) {
    console.error('Failed to fetch teams:', error)
  }
}

const fetchAllEmployees = async () => {
  try {
    const response = await api.post('/employee/active-list-dropdown')
    if (response.data && !response.data.error) {
      availableEmployees.value = (response.data.employee || []).map(emp => ({
        id: emp.id,
        name: emp.fullName || emp.name,
        email: emp.email || ''
      }))
    }
  } catch (error) {
    console.error('Failed to fetch employees:', error)
  }
}

const fetchTeamDetails = async (teamId) => {
  // Only fetch if teamId is NOT 0, null, or undefined
  if (!teamId || teamId === 0) {
    console.log('Skipping team details fetch - invalid team ID:', teamId);
    return;
  }
  
  try {
    const response = await api.post('/teams/details', {
      team_id: teamId
    })
    if (response.data && !response.data.error) {
      selectedTeamDetails.value = response.data.team
      
      // Extract team members and replace current employees with team members
      if (response.data.team && response.data.team[0] && response.data.team[0].members) {
        const teamMembers = response.data.team[0].members
        console.log('Team members:', teamMembers);
        
        const employeeList = teamMembers.map(member => ({
          id: member.id,
          empId: member.empId,
          name: member.fullName || member.name,
          email: member.email || ''
        }))
        
        // Replace current employees with team members
        initialSelectedEmployees.value = employeeList
        selectedEmployeeIds.value = employeeList.map(emp => emp.id)
        selectedEmployeeNames.value = employeeList.map(emp => emp.name)
        
        // Update the employee selector
        if (employeeSelectorRef.value) {
          employeeSelectorRef.value.setInitialEmployees(employeeList)
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch team details:', error)
  }
}

// Handle employee selection
const handleAddEmployee = (employee) => {
  if (!selectedEmployeeIds.value.includes(employee.id)) {
    selectedEmployeeIds.value.push(employee.id)
    selectedEmployeeNames.value.push(employee.name)
  }
}

const handleRemoveEmployee = (employee) => {
  const index = selectedEmployeeIds.value.indexOf(employee.id)
  if (index !== -1) {
    selectedEmployeeIds.value.splice(index, 1)
    selectedEmployeeNames.value.splice(index, 1)
  }
}

const handleEmployeesUpdated = (employees) => {
  selectedEmployeeIds.value = employees.map(emp => emp.id)
  selectedEmployeeNames.value = employees.map(emp => emp.name)
}

const assignTeam = async () => {
  if (!selectedTeam.value || selectedTeam.value === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a team to assign',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Confirm with user if there are existing employees
  if (props.loading.employees && props.loading.employees.length > 0) {
    const result = await Swal.fire({
      title: 'Replace Existing Employees?',
      text: `This loading currently has ${props.loading.employees.length} employee(s) assigned. Assigning a new team will replace them with the team members. Do you want to continue?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Replace',
      cancelButtonText: 'Cancel'
    })
    
    if (!result.isConfirmed) {
      return
    }
  }

  try {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const payload = {
      loading_id: props.loading.id,
      team_id: selectedTeam.value,
      employee_ids: selectedEmployeeIds.value,
      employee_names: selectedEmployeeNames.value
    }

    const response = await api.post('/loading/assign-team', payload)

    if (response.data && !response.data.error) {
      Swal.close()
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Team assigned successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('updated')
      closeModal()
    } else {
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to assign team',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to assign team:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to assign team',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  selectedTeam.value = null
  selectedTeamDetails.value = null
  selectedEmployeeIds.value = []
  selectedEmployeeNames.value = []
  initialSelectedEmployees.value = []
  
  if (employeeSelectorRef.value) {
    employeeSelectorRef.value.resetSelection()
  }
}

// Watch for team selection changes
watch(selectedTeam, (newTeamId, oldTeamId) => {
  // Only fetch if teamId is NOT 0, null, or undefined and it's different from previous
  if (newTeamId && newTeamId !== 0 && newTeamId !== oldTeamId) {
    fetchTeamDetails(newTeamId)
  } else if (!newTeamId || newTeamId === 0) {
    selectedTeamDetails.value = null
    // When team is deselected, clear the employee selector
    selectedEmployeeIds.value = []
    selectedEmployeeNames.value = []
    initialSelectedEmployees.value = []
    if (employeeSelectorRef.value) {
      employeeSelectorRef.value.resetSelection()
    }
  }
})
</script>