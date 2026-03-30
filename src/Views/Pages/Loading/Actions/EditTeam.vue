<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-2 py-1 w-full bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
      Members
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      :title="teamForm.name || 'Edit Team'"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="2xl"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Team Name Edit -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Team Name:</label>
          <div class="flex space-x-2">
            <input 
              type="text" 
              v-model="teamForm.name" 
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              @click="updateTeamName" 
              class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-500 transition-all duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              Edit
            </button>
          </div>
        </div>

        <!-- Add Member -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Add Member:</label>
          <div class="flex space-x-2">
            <SearchDropdown
              :apiEndpoint="'/employee/active-list'"
              :searchModel="searchEmp"
              placeholder="Search and select workers..."
              itemLabel="fullName"
              itemId="id"
              returnName="['fullName', 'position']"
              dataKey="listEmployee"
              @item-selected="handleEmployeeSelected"
              className="flex-1"
            />
            <button 
              @click="addMember" 
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
              :disabled="!selectedEmployee"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add
            </button>
          </div>
        </div>

        <!-- Members List -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Remove Member:</label>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Position</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Action</th>
                </tr>
                </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="members.length === 0">
                  <td colspan="3" class="px-4 py-4 text-center text-gray-500">No members found</td>
                </tr>
                <tr v-for="(member, index) in members" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2">{{ member.fullName || member.name }}</td>
                  <td class="px-4 py-2 uppercase">{{ member.position || 'N/A' }}</td>
                  <td class="px-4 py-2">
                    <button 
                      @click="removeMember(member, index)" 
                      class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-6">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'

const props = defineProps({
  team: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated'])

// State
const showModal = ref(false)
const teamForm = ref({
  id: null,
  name: '',
  employee: []
})
const members = ref([])
const selectedEmployee = ref(null)
const searchEmp = ref({
  search: '',
  itemsperpage: 10,
  page_num: 1
})

// Methods
const openModal = () => {
  showModal.value = true
  loadTeamData()
}

const loadTeamData = () => {
  teamForm.value = {
    id: props.team.id,
    name: props.team.name || ''
  }
  members.value = props.team.members || []
}

const handleEmployeeSelected = (employee) => {
  selectedEmployee.value = employee
}

const updateTeamName = async () => {
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

  try {

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await api.post('/teams/update-team', {
      team_id: teamForm.value.id,
      name: teamForm.value.name
    })

    if (response.data && !response.data.error) {
        Swal.close()
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Team name updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      emit('updated')
    }
  } catch (error) {
    console.error('Failed to update team name:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response.data.message,
      showConfirmButton: true
    })
  }
}

const addMember = async () => {
  if (!selectedEmployee.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a member to add',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Check if member already exists
  const exists = members.value.some(m => (m.id === selectedEmployee.value.id) || (m.employee_id === selectedEmployee.value.id))
  if (exists) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Member already in this team',
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

    const response = await api.post('/teams/add-member', {
      team_id: teamForm.value.id,
      employee_id: selectedEmployee.value.id
    })

    if (response.data && !response.data.error) {
      // Add to local members list
      members.value.push({
        id: selectedEmployee.value.id,
        employee_id: selectedEmployee.value.id,
        full_name: selectedEmployee.value.fullName || selectedEmployee.value.name,
        position: selectedEmployee.value.position || 'N/A'
      })
      
      selectedEmployee.value = null
      searchEmp.value.search = '' // Clear search
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Member added successfully',
        timer: 1500,
        showConfirmButton: false
      })
      emit('updated')
    }
  } catch (error) {
    console.error('Failed to add member:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response.data.message,
      showConfirmButton: true
    })
  }
}

const removeMember = async (member, index) => {
  const result = await Swal.fire({
    title: 'Remove Member?',
    text: `Do you want to remove ${member.full_name || member.name} from this team?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

      const response = await api.post('/teams/remove-member', {
        team_id: teamForm.value.id,
        employee_id: member.id || member.employee_id
      })

      if (response.data && !response.data.error) {
        members.value.splice(index, 1)
        Swal.close()
        await Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Member removed successfully',
          timer: 1500,
          showConfirmButton: false
        })
        emit('updated')
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
        showConfirmButton: true
      })
    }
  }
}

const closeModal = () => {
  showModal.value = false
  teamForm.value = {
    id: null,
    name: '',
    employee: []
  }
  members.value = []
  selectedEmployee.value = null
  searchEmp.value.search = ''
}

// Watch for team prop changes
watch(() => props.team, () => {
  if (showModal.value) {
    loadTeamData()
  }
}, { deep: true })
</script>