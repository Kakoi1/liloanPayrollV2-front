<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add Team
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Add New Team"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4 h-auto">
        <!-- Team Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Team Name:</label>
          <input 
            type="text" 
            v-model="teamForm.name" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter team name"
          />
        </div>

        <!-- Members Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Members:</label>
          <SearchDropdown
            :apiEndpoint="'/employee/active-list'"
            :searchModel="searchEmp"
            placeholder="Search and select workers..."
            itemLabel="fullName"
            itemId="id"
            returnName="['fullName']"
            dataKey="listEmployee"
            @item-selected="addEmployee"
            className="w-full"
          />
          <div class="flex flex-wrap gap-1 mt-2">
            <span 
              v-for="(emp, empIndex) in teamForm.employee" 
              :key="empIndex"
              class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {{ emp.fullName || emp.name || emp.full_name }}
              <button 
                @click="removeEmployee(empIndex)"
                class="ml-1 text-blue-600 hover:text-blue-800"
                type="button"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
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
            @click="saveTeam" 
            :disabled="isSaving"
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isSaving" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            <svg v-else class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'

const emit = defineEmits(['saved'])

// Search model for dropdown
const searchEmp = ref({
  search: '',
  itemsperpage: 10,
  page_num: 1
})

// State
const showModal = ref(false)
const isSaving = ref(false)
const teamForm = ref({
  name: '',
  employee: []
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
}

const resetForm = () => {
  teamForm.value = {
    name: '',
    employee: []
  }
}

const addEmployee = (employee) => {
  if (!employee) return
  
  // Check if employee already added
  const exists = teamForm.value.employee.some(emp => emp.id === employee.id)
  
  if (!exists) {
    teamForm.value.employee.push(employee)
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Employee already added to this team',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const removeEmployee = (empIndex) => {
  teamForm.value.employee.splice(empIndex, 1)
}

const saveTeam = async () => {
  // Validate required fields
  if (!teamForm.value.name.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter team name',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (teamForm.value.employee.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select at least one member',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  isSaving.value = true

  try {
    // Prepare data for API

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const payload = {
      name: teamForm.value.name.trim(),
      employee_ids: teamForm.value.employee.map(emp => emp.id)
    }

    const response = await api.post('/teams/add', payload)

    if (response.data && !response.data.error) {
      Swal.close()
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Team created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved', response.data)
      closeModal()
    } else {
      Swal.close()
      throw new Error(response.data?.message || 'Failed to create team')
    }
  } catch (error) {
    console.error('Failed to save team:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Failed to create team',
      timer: 2000,
      showConfirmButton: false
    })
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}
</script>