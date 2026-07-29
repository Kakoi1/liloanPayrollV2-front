<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="p-2 h-[55px] min-w-[60px] bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex flex-col items-center leading-[4px]"
      title="Edit Loading"
    >
      <svg class="w-8 h-8 px-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      <br>
      Edit
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Edit Loading Schedule"
      color="bg-gradient-to-r from-yellow-500 to-yellow-600"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Information -->
        <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 class="font-medium text-yellow-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Edit Loading Details
          </h4>
        </div>

        <!-- Edit Form -->
        <div class="space-y-4">
          <!-- Loading Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loading Start Date:</label>
            <input 
              type="date" 
              v-model="formData.loadingDate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <!-- Van No -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Van No:</label>
            <input 
              type="text" 
              v-model="formData.vanNo" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter van number"
            />
          </div>

          <!-- Seal No -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Seal No:</label>
            <input 
              type="text" 
              v-model="formData.sealNo" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter seal number"
            />
          </div>

          <!-- Item Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Item:</label>
            <SelectComponent
              v-model="formData.itemId"
              :options="itemOptions"
              placeholder="-- Select Item --"
              class="w-full"
            />
          </div>

          <div v-if="formData.itemId == 21 || formData.itemId == 101 ">
            <label class="block text-sm font-medium text-gray-700 mb-1">Solid Ratio</label>
            <SelectComponent v-model="formData.solidRatio" :options="ratioOptions" placeholder="Select solid ratio" class="w-full border-gray-700" />
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Selected Employees:</label>
            <EmployeeSelector 
              ref="employeeSelectorRef"
              :employees="availableEmployees"
              :initial-employees="initialSelectedEmployees"
              @add-employee="handleAddEmployee"
              @remove-employee="handleRemoveEmployee"
              @employees-updated="handleEmployeesUpdated"
            />
          </div>

          <!-- Container Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Container Weight (kg):</label>
            <input 
              type="number" 
              step="any" 
              v-model="formData.containerWeight" 
              @input="calculateNetWeight"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter container weight"
            />
          </div>

          <!-- Gross Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gross Weight (kg):</label>
            <input 
              type="number" 
              step="any" 
              v-model="formData.grossWeight" 
              @input="calculateNetWeight"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter gross weight"
            />
          </div>

          <!-- Net Weight (Auto-calculated) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Net Weight (kg):</label>
            <input 
              type="text" 
              :value="calculatedNetWeight" 
              readonly
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium"
            />
            <p class="text-xs text-gray-500 mt-1">Net Weight = Gross Weight - Container Weight</p>
          </div>

          <!-- Loading End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loading End Date:</label>
            <input 
              type="date" 
              v-model="formData.endDate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
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
            @click="updateLoading" 
            class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Update Loading
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
const itemOptions = ref([])
const teamOptions = ref([])
const selectedTeam = ref(null)
const selectedTeamDetails = ref(null)
const selectedEmployeeIds = ref([])
const selectedEmployeeNames = ref([])
const initialSelectedEmployees = ref([])
const availableEmployees = ref([])
const employeeSelectorRef = ref(null)
const isModalOpening = ref(false) // Flag to track modal opening state

const formData = ref({
  loadingId: null,
  loadingDate: '',
  vanNo: '',
  sealNo: '',
  itemId: '',
  containerWeight: 0,
  grossWeight: 0,
  teamId: null,
  endDate: '',
  solidRatio: 0
})

const calculatedNetWeight = ref(0)

const ratioOptions = [
  { value: 1, label: '90% - 10%' },
  { value: 2, label: '80% - 20%' },
  { value: 3, label: '70% - 30%' },
]

// Methods
const openModal = () => {
  showModal.value = true
  isModalOpening.value = true // Set flag when opening
  fetchItems()
  fetchTeams()
  fetchAllEmployees()
  loadFormData()
  
  // Reset flag after a short delay to allow initial load to complete
  setTimeout(() => {
    isModalOpening.value = false
  }, 500)
}

const loadFormData = () => {
  // Load basic form data from props
  formData.value = {
    loadingId: props.loading.id,
    loadingDate: props.loading.loadingDate ? moment(props.loading.loadingDate).format('YYYY-MM-DD') : '',
    vanNo: props.loading.vanNo || '',
    sealNo: props.loading.sealNo || '',
    itemId: props.loading.itemId || '',
    containerWeight: parseFloat(props.loading.containerWeight) || 0,
    grossWeight: parseFloat(props.loading.grossWeight) || 0,
    teamId: props.loading.teamId || null,
    endDate: props.loading.endDate ? moment(props.loading.endDate).format('YYYY-MM-DD') : '',
    solidRatio: 0
  }
  
  // Set selected team
  selectedTeam.value = props.loading.teamId || null
  
  // Load employees from the employees array in props
  if (props.loading.employees && Array.isArray(props.loading.employees)) {
    const employeeList = props.loading.employees.map(emp => ({
      id: emp.empId || emp.id,
      name: emp.fullName || emp.name || '',
      email: emp.email || ''
    }))
    
    // Set initial employees for the selector
    initialSelectedEmployees.value = employeeList
    
    // Update selected IDs and names
    selectedEmployeeIds.value = employeeList.map(emp => emp.id)
    selectedEmployeeNames.value = employeeList.map(emp => emp.name)
    
    // If the employee selector component is mounted, update it
    if (employeeSelectorRef.value) {
      employeeSelectorRef.value.setInitialEmployees(employeeList)
    }
  }
  
  calculateNetWeight()
}

const calculateNetWeight = () => {
  const gross = parseFloat(formData.value.grossWeight) || 0
  const container = parseFloat(formData.value.containerWeight) || 0

  let total_weight = gross - container

  if (total_weight < 1) {
    total_weight = 0
  }

  calculatedNetWeight.value = total_weight.toFixed(2)
}

const fetchItems = async () => {
  try {
    const response = await api.get('/loading/items')
    if (response.data && !response.data.error) {
      itemOptions.value = (response.data.items || []).map(item => ({
        value: item.id,
        label: item.class || item.name
      }))
    }
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
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
  
  // Don't fetch team details if modal is opening (initial load)
  if (isModalOpening.value) {
    console.log('Skipping team details fetch - modal is opening');
    return;
  }
  
  try {
    const response = await api.post('/teams/details', {
      team_id: teamId
    })
    if (response.data && !response.data.error) {
      selectedTeamDetails.value = response.data.team
      
      // Extract team members and add them to selected employees
      if (response.data.team && response.data.team[0] && response.data.team[0].members) {
        const teamMembers = response.data.team[0].members
        console.log('Team members:', teamMembers);
        
        const employeeList = teamMembers.map(member => ({
          id: member.id,
          empId: member.empId,
          name: member.fullName || member.name,
          email: member.email || ''
        }))
        
        // Set initial employees for the selector
        initialSelectedEmployees.value = employeeList
        
        // Update selected IDs and names
        selectedEmployeeIds.value = employeeList.map(emp => emp.id)
        selectedEmployeeNames.value = employeeList.map(emp => emp.name)
        
        // If the employee selector component is mounted, update it
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

const updateLoading = async () => {
  // Validate required fields
  if (!formData.value.loadingDate) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select loading date',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!formData.value.vanNo.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter van number',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!formData.value.sealNo.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter seal number',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!formData.value.containerWeight) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter container weight',
      timer: 1500,
      showConfirmButton: false
    })
    return
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
      loading_id: formData.value.loadingId,
      loading_date: formData.value.loadingDate,
      van_no: formData.value.vanNo,
      seal_no: formData.value.sealNo,
      item_id: formData.value.itemId,
      container_weight: formData.value.containerWeight,
      gross_weight: formData.value.grossWeight ?? 0,
      net_weight: calculatedNetWeight.value,
      team_id: selectedTeam.value ?? 0,
      end_date: formData.value.endDate,
      solid_ratio: formData.value.solidRatio,
      employee_ids: selectedEmployeeIds.value,
      employee_names: selectedEmployeeNames.value
    }

    const response = await api.post('/loading/edit', payload)

    if (response.data && !response.data.error) {
      Swal.close()
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Loading schedule updated successfully',
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
        text: response.data?.message || 'Failed to update loading schedule',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to update loading:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update loading schedule',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  isModalOpening.value = false
  selectedTeamDetails.value = null
  selectedEmployeeIds.value = []
  selectedEmployeeNames.value = []
  initialSelectedEmployees.value = []
  
  if (employeeSelectorRef.value) {
    employeeSelectorRef.value.resetSelection()
  }
  
  formData.value = {
    loadingId: null,
    loadingDate: '',
    vanNo: '',
    sealNo: '',
    itemId: '',
    containerWeight: 0,
    grossWeight: 0,
    teamId: null,
    endDate: '',
    solidRatio: 0
  }
  calculatedNetWeight.value = 0
  selectedTeam.value = null
}

// Watchers
watch(selectedTeam, (newTeamId, oldTeamId) => {
  // Only fetch team details if:
  // 1. There's a valid team ID
  // 2. The modal is not in the opening state
  // 3. The team ID actually changed (not initial load)
  if (newTeamId && !isModalOpening.value && newTeamId !== oldTeamId) {
    fetchTeamDetails(newTeamId)
  } else if (!newTeamId) {
    selectedTeamDetails.value = null
    // Clear selected employees when team is deselected
    selectedEmployeeIds.value = []
    selectedEmployeeNames.value = []
    initialSelectedEmployees.value = []
    if (employeeSelectorRef.value) {
      employeeSelectorRef.value.resetSelection()
    }
  }
})
</script>