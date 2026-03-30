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
          </div>
        </div>

        <!-- Team Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Team:</label>
          <SelectComponent
            v-model="selectedTeam"
            :options="teamOptions"
            placeholder="-- Choose Team --"
            class="w-full"
          />
        </div>

        <!-- Team Members Preview (Optional) -->
        <div v-if="selectedTeam && selectedTeamDetails" class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h5 class="text-sm font-medium text-blue-700 mb-2 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Team Members
          </h5>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="(member, idx) in selectedTeamDetails[0].members" 
              :key="idx"
              class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {{ member.fullName || member.name }}
            </span>
            <span v-if="!selectedTeamDetails[0].members || selectedTeamDetails[0].members.length === 0" class="text-xs text-gray-500">
              No members in this team
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
            @click="assignTeam" 
            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
            :disabled="!selectedTeam"
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

// Methods
const openModal = () => {
  showModal.value = true
  fetchTeams()
  selectedTeam.value = props.loading.teamId ?? 0
  selectedTeamDetails.value = null
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

const fetchTeamDetails = async (teamId) => {
  if (!teamId) return
  try {
    const response = await api.post('/teams/details', {
      team_id: teamId
    })
    if (response.data && !response.data.error) {
      selectedTeamDetails.value = response.data.team
    }
  } catch (error) {
    console.error('Failed to fetch team details:', error)
  }
}

const assignTeam = async () => {
  if (!selectedTeam.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a team to assign',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/loading/assign-team', {
      loading_id: props.loading.id,
      team_id: selectedTeam.value
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Team assigned successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('updated')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to assign team:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to assign team',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  selectedTeam.value = null
  selectedTeamDetails.value = null
}

// Watch for team selection changes
watch(selectedTeam, (newTeamId) => {
  if (newTeamId) {
    fetchTeamDetails(newTeamId)
  } else {
    selectedTeamDetails.value = null
  }
})
</script>