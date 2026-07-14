<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      New Van Loading
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="Input Van Information"
      color="bg-gradient-to-r from-green-600-to-green-700"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Loading Date:</label>
          <input 
            type="date" 
            v-model="loadingForm.loading_date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Loading Date"
          />
        </div>

        <!-- Van No -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Van No:</label>
          <input 
            type="text" 
            v-model="loadingForm.van_no" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Van Number"
          />
        </div>

        <!-- Seal No -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Seal No:</label>
          <input 
            type="text" 
            v-model="loadingForm.seal_no" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Seal Number"
          />
        </div>

        <!-- Item -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Item:</label>
          <SelectComponent v-model="loadingForm.item" :options="itemOptions" placeholder="Select Item to Load" class="w-full border-gray-700" />
          {{ console.log(loadingForm.item) }}

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

        </div>

        <div v-if="loadingForm.item == 21 || loadingForm.item == 101 ">
          <label class="block text-sm font-medium text-gray-700 mb-1">Solid Ratio</label>
          <SelectComponent v-model="loadingForm.solidRatio" :options="ratioOptions" placeholder="Select solid ratio" class="w-full border-gray-700" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Team:</label>
          <SelectComponent
            v-model="selectedTeam"
            :options="teamOptions"
            placeholder="-- Choose Team --"
            class="w-full"
          />
        </div>

        <!-- Container Weight -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Container Weight (kg):</label>
          <input 
            type="number" 
            step="any" 
            v-model="loadingForm.container_weight" 
            @input="calculateNetWeight"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Container Weight"
          />
        </div>

        <!-- Gross Weight -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gross Weight (kg):</label>
          <input 
            type="number" 
            step="any" 
            v-model="loadingForm.gross_weight" 
            @input="calculateNetWeight"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Input Gross Weight"
          />
        </div>

        <!-- Net Weight (calculated) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Net Weight (kg):</label>
          <input 
            type="text" 
            :value="calculatedNetWeight" 
            readonly
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold"
          />
          <p class="text-xs text-gray-500 mt-1">Net Weight = Gross Weight - Container Weight</p>
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
            @click="saveLoading" 
            class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save
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

const emit = defineEmits(['saved'])

// State
const showModal = ref(false)
const selectedTeam = ref(null)
const selectedTeamDetails = ref(null)
const teamOptions = ref([])
const loadingForm = ref({
  loading_date: moment().format('YYYY-MM-DD'),
  van_no: '',
  seal_no: '',
  item: 0,
  container_weight: '',
  gross_weight: '',
  net_weight: 0,
  solidRatio: 0,
})

const itemOptions = ref([])

const ratioOptions = [
  { value: 1, label: '90% - 10%' },
  { value: 2, label: '80% - 20%' },
  { value: 3, label: '70% - 30%' },

]

// Computed
const calculatedNetWeight = computed(() => {
  const gross = parseFloat(loadingForm.value.gross_weight) || 0
  const container = parseFloat(loadingForm.value.container_weight) || 0
  const net = gross - container
  return net.toFixed(2)
})

// Methods
const openModal = () => {
  showModal.value = true
  resetForm()
  fetchItems()
}

const resetForm = () => {
  loadingForm.value = {
    loading_date: moment().format('YYYY-MM-DD'),
    van_no: 0,
    seal_no: '',
    item: '',
    container_weight: '',
    gross_weight: '',
    net_weight: 0,
    solidRatio: 0,
  }
  selectedTeam.value = null
}

const calculateNetWeight = () => {
  const gross = parseFloat(loadingForm.value.gross_weight) || 0
  const container = parseFloat(loadingForm.value.container_weight) || 0

  let total_weight = gross - container

  if (total_weight < 1) {
    total_weight = 0
  }

  loadingForm.value.net_weight = total_weight.toFixed(2)
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

const fetchItems = async () => {
  try {
    const response = await api.get('/loading/items')
    if (response.data && !response.data.error) {
      itemOptions.value = (response.data.items || []).map(item => ({
        value: item.id,
        label: item.class
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



const saveLoading = async () => {
  // Validate required fields
  if (!loadingForm.value.loading_date) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select loading date',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!loadingForm.value.van_no.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter van number',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!loadingForm.value.seal_no.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter seal number',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // if (!loadingForm.value.item) {
  //   await Swal.fire({
  //     icon: 'warning',
  //     title: 'Warning',
  //     text: 'Please select an item',
  //     timer: 1500,
  //     showConfirmButton: false
  //   })
  //   return
  // }

  if (!loadingForm.value.container_weight) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter container weight',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  // if (!loadingForm.value.gross_weight) {
  //   await Swal.fire({
  //     icon: 'warning',
  //     title: 'Warning',
  //     text: 'Please enter gross weight',
  //     timer: 1500,
  //     showConfirmButton: false
  //   })
  //   return
  // }

  // Calculate net weight before saving
  calculateNetWeight()

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
      loading_date: loadingForm.value.loading_date,
      van_no: loadingForm.value.van_no,
      seal_no: loadingForm.value.seal_no,
      item: loadingForm.value.item,
      container_weight: loadingForm.value.container_weight,
      gross_weight: loadingForm.value.gross_weight,
      net_weight: loadingForm.value.net_weight,
      solid_ratio: loadingForm.value.solidRatio,
      team_id: selectedTeam.value ?? 0  
    }

    const response = await api.post('/loading/add', payload)

    if (response.data && !response.data.error) {
      Swal.close()

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Van loading schedule created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('saved')
      closeModal()
    } else {
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to create loading schedule',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to save loading:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to create loading schedule',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  selectedTeamDetails.value = null
  resetForm()
}

// Initialize
onMounted(() => {
  fetchItems()
  fetchTeams()
})

watch(selectedTeam, (newTeamId) => {
  if (newTeamId) {
    fetchTeamDetails(newTeamId)
  } else {
    selectedTeamDetails.value = null
  }
})
</script>