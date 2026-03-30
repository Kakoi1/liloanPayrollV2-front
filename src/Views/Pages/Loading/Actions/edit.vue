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
            <label class="block text-sm font-medium text-gray-700 mb-1">Loading Date:</label>
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

          <!-- Container Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Container Weight:</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Gross Weight:</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Net Weight:</label>
            <input 
              type="text" 
              :value="calculatedNetWeight" 
              readonly
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium"
            />
            <!-- <p class="text-xs text-gray-500 mt-1">Net Weight = Gross Weight - Container Weight</p> -->
          </div>

          <!-- Team Assignment -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Assign Team:</label>
            <SelectComponent
              v-model="formData.teamId"
              :options="teamOptions"
              placeholder="-- Select Team --"
              class="w-full"
            />
          </div> -->
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
            :disabled="!isFormValid"
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
import { ref, computed, onMounted } from 'vue'
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
const itemOptions = ref([])
const teamOptions = ref([])
const formData = ref({
  loadingId: null,
  loadingDate: '',
  vanNo: '',
  sealNo: '',
  itemId: '',
  containerWeight: 0,
  grossWeight: 0,
})
const calculatedNetWeight = ref(0)

// Computed
const isFormValid = computed(() => {
  return formData.value.vanNo && 
         formData.value.sealNo && 
         formData.value.itemId && 
         formData.value.containerWeight !== '' &&
         formData.value.grossWeight !== ''
})

// Methods
const openModal = () => {
  showModal.value = true
  fetchItems()
  fetchTeams()
  loadFormData()
}

const loadFormData = () => {
  formData.value = {
    loadingId: props.loading.id,
    loadingDate: props.loading.loadingDate ? moment(props.loading.loadingDate).format('YYYY-MM-DD') : '',
    vanNo: props.loading.vanNo || '',
    sealNo: props.loading.sealNo || '',
    itemId: props.loading.itemId || '',
    containerWeight: parseFloat(props.loading.containerWeight) || 0,
    grossWeight: parseFloat(props.loading.grossWeight) || 0,
  }
  calculateNetWeight()
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value).toFixed(2)
}

const calculateNetWeight = () => {
  const gross = parseFloat(formData.value.grossWeight) || 0
  const container = parseFloat(formData.value.containerWeight) || 0
  calculatedNetWeight.value = (gross - container).toFixed(2)
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

const updateLoading = async () => {
  if (!isFormValid.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please fill in all required fields',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/loading/edit', {
      loading_id: formData.value.loadingId,
      loading_date: formData.value.loadingDate,
      van_no: formData.value.vanNo,
      seal_no: formData.value.sealNo,
      item_id: formData.value.itemId,
      container_weight: formData.value.containerWeight,
      gross_weight: formData.value.grossWeight,
      net_weight: calculatedNetWeight.value,
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Loading schedule updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('updated')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to update loading:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update loading schedule',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    loadingId: null,
    loadingDate: '',
    vanNo: '',
    sealNo: '',
    itemId: '',
    containerWeight: 0,
    grossWeight: 0,
  }
  calculatedNetWeight.value = 0
}
</script>