<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      title="View"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    </button>

    <!-- Modal -->
    <Modal 
      :show="showModal" 
      @close="closeModal"
      title="View Loading Schedule"
      color="bg-gradient-to-r from-blue-500 to-blue-600"
      maxWidth="lg"
      :closeable="true"
    >
      <div class="p-6 space-y-4">
        <!-- Loading Information -->
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-700 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Loading Details
          </h4>
        </div>

        <!-- View Details -->
        <div class="space-y-4">
          <!-- Loading Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loading Start Date:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ formatDate(viewData.loadingDate) }}
            </div>
          </div>

          <!-- Van No -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Van No:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ viewData.vanNo || 'N/A' }}
            </div>
          </div>

          <!-- Seal No -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Seal No:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ viewData.sealNo || 'N/A' }}
            </div>
          </div>

          <!-- Item Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Item:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ getItemLabel(viewData.itemId) || 'N/A' }}
            </div>
          </div>

          <!-- Team -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Team:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ getTeamLabel(viewData.teamId) || 'N/A' }}
            </div>
          </div>

          <!-- Container Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Container Weight:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ formatNumber(viewData.containerWeight) }}
            </div>
          </div>

          <!-- Gross Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gross Weight:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ formatNumber(viewData.grossWeight) }}
            </div>
          </div>

          <!-- Net Weight (Auto-calculated) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Net Weight:</label>
            <div class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
              {{ calculatedNetWeight }}
            </div>
          </div>

          <!-- Loading End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loading End Date:</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ formatDate(viewData.endDate) }}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Modal from '@/Js/Components/Modal.vue'

const props = defineProps({
  loading: {
    type: Object,
    required: true
  }
})

// State
const showModal = ref(false)
const viewData = ref({
  loadingId: null,
  loadingDate: '',
  vanNo: '',
  sealNo: '',
  itemId: '',
  containerWeight: 0,
  grossWeight: 0,
  teamId: null,
  endDate: ''
})
const calculatedNetWeight = ref('0.00')
const itemOptions = ref([])
const teamOptions = ref([])

// Methods
const openModal = () => {
  showModal.value = true
  fetchItems()
  fetchTeams()
  loadViewData()
}

const loadViewData = () => {
  viewData.value = {
    loadingId: props.loading.id,
    loadingDate: props.loading.loadingDate || '',
    vanNo: props.loading.vanNo || '',
    sealNo: props.loading.sealNo || '',
    itemId: props.loading.itemId || '',
    containerWeight: parseFloat(props.loading.containerWeight) || 0,
    grossWeight: parseFloat(props.loading.grossWeight) || 0,
    teamId: props.loading.teamId || null,
    endDate: props.loading.endDate || ''
  }
  calculateNetWeight()
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0.00'
  return parseFloat(value).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('YYYY-MM-DD')
}

const calculateNetWeight = () => {
  const gross = parseFloat(viewData.value.grossWeight) || 0
  const container = parseFloat(viewData.value.containerWeight) || 0

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

const getItemLabel = (itemId) => {
  if (!itemId) return null
  const item = itemOptions.value.find(opt => opt.value === itemId)
  return item ? item.label : null
}

const getTeamLabel = (teamId) => {
  if (!teamId) return null
  const team = teamOptions.value.find(opt => opt.value === teamId)
  return team ? team.label : null
}

const closeModal = () => {
  showModal.value = false
  viewData.value = {
    loadingId: null,
    loadingDate: '',
    vanNo: '',
    sealNo: '',
    itemId: '',
    containerWeight: 0,
    grossWeight: 0,
    teamId: null,
    endDate: ''
  }
  calculatedNetWeight.value = '0.00'
}
</script>