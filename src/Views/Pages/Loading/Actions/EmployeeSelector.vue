<template>
  <div class="space-y-3">
    <!-- Selected Employees Display -->
    <div v-if="selectedEmployees.length > 0" class="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="employee in selectedEmployees" 
          :key="employee.id"
          class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
        >
          {{ employee.name }}
          <button 
            @click="removeEmployee(employee.id)"
            class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 italic">
      No employees selected
    </div>

    <!-- Add Employee Button & Search -->
    <div class="flex gap-2">
      <button 
        @click="toggleEmployeeDropdown"
        class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
        type="button"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
        Add Employee
      </button>
    </div>

    <!-- Employee Dropdown -->
    <div v-if="showDropdown" class="relative">
      <div class="absolute z-10 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1">
        <!-- Search Input -->
        <div class="p-3 border-b border-gray-200">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search employees..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            @input="filterEmployees"
          />
        </div>

        <!-- Employee List -->
        <div class="max-h-60 overflow-y-auto p-2">
          <div v-if="filteredEmployees.length === 0" class="text-center text-gray-500 py-4 text-sm">
            No employees available
          </div>
          <button
            v-for="employee in filteredEmployees" 
            :key="employee.id || employee.empId"
            @click="addEmployee(employee)"
            :disabled="isEmployeeSelected(employee)"
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span class="text-blue-600 text-sm font-medium">
                  {{ getInitials(employee.name) }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ employee.name }}</p>
                <p v-if="employee.email" class="text-xs text-gray-500">{{ employee.email }}</p>
              </div>
            </div>
            <span v-if="isEmployeeSelected(employee)" class="text-green-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
          </button>
        </div>

        <!-- Close Dropdown Button -->
        <div class="p-2 border-t border-gray-200">
          <button 
            @click="closeDropdown"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-150"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  employees: {
    type: Array,
    required: true,
    default: () => []
  },
  initialEmployees: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-employee', 'remove-employee', 'employees-updated'])

// State
const showDropdown = ref(false)
const searchQuery = ref('')
const selectedEmployees = ref([])

// Helper function to get employee ID
const getEmployeeId = (employee) => {
  return employee.empId || employee.id
}

// Helper function to check if employee is selected
const isEmployeeSelected = (employee) => {
  const employeeId = getEmployeeId(employee)
  return selectedEmployees.value.some(selected => selected.id === employeeId)
}

// Computed
const filteredEmployees = computed(() => {
  if (!props.employees || props.employees.length === 0) return []
  
  // Filter out already selected employees using the helper function
  const availableEmployees = props.employees.filter(emp => {
    const empId = getEmployeeId(emp)
    return !selectedEmployees.value.some(selected => selected.id === empId)
  })

  if (!searchQuery.value.trim()) {
    return availableEmployees
  }

  const query = searchQuery.value.toLowerCase().trim()
  return availableEmployees.filter(emp => 
    emp.name.toLowerCase().includes(query) ||
    (emp.email && emp.email.toLowerCase().includes(query))
  )
})

// Methods
const toggleEmployeeDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    searchQuery.value = ''
  }
}

const closeDropdown = () => {
  showDropdown.value = false
  searchQuery.value = ''
}

const filterEmployees = () => {
  // No additional filtering needed as computed handles it
}

const addEmployee = (employee) => {
  const employeeId = getEmployeeId(employee)
  if (isEmployeeSelected(employee)) return
  
  selectedEmployees.value.push({ 
    id: employeeId, 
    name: employee.name, 
    email: employee.email || '' 
  })
  
  emit('add-employee', { id: employeeId, name: employee.name, email: employee.email || '' })
  emit('employees-updated', selectedEmployees.value)
  
  // Clear search after adding
  searchQuery.value = ''
}

const removeEmployee = (employeeId) => {
  const index = selectedEmployees.value.findIndex(emp => emp.id === employeeId)
  if (index !== -1) {
    const removed = selectedEmployees.value[index]
    selectedEmployees.value.splice(index, 1)
    emit('remove-employee', { id: removed.id, name: removed.name })
    emit('employees-updated', selectedEmployees.value)
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const setInitialEmployees = (employees) => {
  if (!employees || employees.length === 0) {
    selectedEmployees.value = []
    emit('employees-updated', selectedEmployees.value)
    return
  }
  
  selectedEmployees.value = employees.map(emp => ({
    id: emp.empId || emp.id,
    name: emp.name || emp.fullName || '',
    email: emp.email || ''
  }))
  emit('employees-updated', selectedEmployees.value)
}

const resetSelection = () => {
  selectedEmployees.value = []
  emit('employees-updated', selectedEmployees.value)
}

// Expose methods for parent component
defineExpose({
  getSelectedEmployees: () => selectedEmployees.value,
  resetSelection,
  setInitialEmployees
})

// Watch for initial employees prop changes
watch(() => props.initialEmployees, (newEmployees) => {
  if (newEmployees && newEmployees.length > 0) {
    setInitialEmployees(newEmployees)
  }
}, { immediate: true, deep: true })

// Initialize with initial employees if provided
onMounted(() => {
  if (props.initialEmployees && props.initialEmployees.length > 0) {
    setInitialEmployees(props.initialEmployees)
  }
})
</script>

<style scoped>
/* Optional custom styles */
</style>