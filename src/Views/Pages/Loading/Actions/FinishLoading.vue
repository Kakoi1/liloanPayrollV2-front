<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="p-2.5 h-[55px] min-w-[60px] bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex flex-col items-center leading-[4px]"
      title="Finish Loading"
    >
      <svg class="w-8 h-8 px-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <br> Finish
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Finish Loading"
      color="bg-gradient-to-r from-green-600 to-green-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Information (read-only) -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p class="text-sm font-medium">{{ loading.vanNo ?? 'N/A' }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Seal No:</label>
              <p class="text-sm font-medium">{{ loading.sealNo ?? 'N/A' }}</p>
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
              <label class="text-xs text-gray-500">Container Weight:</label>
              <p class="text-sm font-medium">{{ formatNumber(loading.containerWeight) }} kg</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Gross Weight:</label>
              <p class="text-sm font-medium">{{ formatNumber(loading.grossWeight) }} kg</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">Net Weight:</label>
              <p class="text-sm font-medium font-bold text-green-600">{{ formatNumber(loading.netWeight) }} kg</p>
            </div>
          </div>
        </div>

        <!-- Payroll Date Field -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payroll Date:</label>
          <input 
            type="date" 
            v-model="payrollDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :min="minPayrollDate"
            :max="maxPayrollDate"
          />
          <p class="text-xs text-gray-500 mt-1">Select the date this loading will be included in payroll</p>
        </div> -->

        <!-- Team Selection -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Team:</label>
          <SelectComponent
            v-model="selectedTeam"
            :options="teamOptions"
            placeholder="-- Choose Team --"
            class="w-full"
          />
        </div> -->

        <!-- Team Members Preview -->
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

        <!-- Weight Summary -->
        <div class="bg-green-50 p-3 rounded-lg border border-green-200">
          <h5 class="text-sm font-medium text-green-700 mb-2 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
            Weight Summary
          </h5>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <p class="text-xs text-gray-500">Container Weight</p>
              <p class="text-sm font-semibold">{{ formatNumber(loading.containerWeight) }} kg</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Gross Weight</p>
              <p class="text-sm font-semibold">{{ formatNumber(loading.grossWeight) }} kg</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Net Weight</p>
              <p class="text-sm font-semibold text-green-600">{{ formatNumber(loading.netWeight) }} kg</p>
            </div>
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
            @click="finishLoading" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
            :disabled="!selectedTeam || !payrollDate"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Finish Loading
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
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
const payrollDate = ref(new Date().toISOString().split('T')[0])

// Computed
const minPayrollDate = computed(() => {
  // Allow payroll date up to 15 days after loading date
  if (props.loading.loadingDate) {
    return moment(props.loading.loadingDate).format('YYYY-MM-DD')
  }
  return moment().subtract(15, 'days').format('YYYY-MM-DD')
})

const maxPayrollDate = computed(() => {
  // Allow payroll date up to 15 days after loading date
  if (props.loading.loadingDate) {
    return moment(props.loading.loadingDate).add(15, 'days').format('YYYY-MM-DD')
  }
  return moment().add(15, 'days').format('YYYY-MM-DD')
})

// Methods
const openModal = () => {
  showModal.value = true
  fetchTeams()
  selectedTeam.value = props.loading.teamId ?? null
  selectedTeamDetails.value = null
  // Set default payroll date to loading date
  payrollDate.value = props.loading.loadingDate ? moment(props.loading.loadingDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('YYYY-MM-DD')
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value).toFixed(2)
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

const finishLoading = async () => {
  if (!selectedTeam.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a team to complete this loading',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!payrollDate.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a payroll date',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // Validate payroll date range
  if (payrollDate.value < minPayrollDate.value || payrollDate.value > maxPayrollDate.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: `Payroll date must be between ${formatDate(minPayrollDate.value)} and ${formatDate(maxPayrollDate.value)}`,
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // If team is different from current, assign first
  if (selectedTeam.value !== props.loading.teamId) {
    try {
      const assignResponse = await api.post('/loading/assign-team', {
        loading_id: props.loading.id,
        team_id: selectedTeam.value
      })
      if (assignResponse.data && !assignResponse.data.error) {
        // Team assigned successfully
      } else {
        throw new Error('Failed to assign team')
      }
    } catch (error) {
      console.error('Failed to assign team:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to assign team before finishing',
        timer: 1500,
        showConfirmButton: false
      })
      return
    }
  }

  // Confirm finish
  const result = await Swal.fire({
    title: 'Finish Loading?',
    text: `Do you want to mark this loading as completed with payroll date ${formatDate(payrollDate.value)}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, complete it',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/loading/finish', {
        loading_id: props.loading.id,
        team_id: selectedTeam.value,
        payroll_date: payrollDate.value
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Loading completed successfully',
          timer: 1500,
          showConfirmButton: false
        })
        
        emit('updated')
        closeModal()
      }
    } catch (error) {
      console.error('Failed to finish loading:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to complete loading',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const closeModal = () => {
  showModal.value = false
  selectedTeam.value = null
  selectedTeamDetails.value = null
  payrollDate.value = ''
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