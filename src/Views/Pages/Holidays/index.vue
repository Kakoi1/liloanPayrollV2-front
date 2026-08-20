<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Holiday Calendar</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Holidays</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="container-fluid px-6 py-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Card Header -->
            <div class="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-lg flex justify-between items-center">
              <h5 class="text-white font-semibold text-lg uppercase flex items-center gap-2">
                <span>📅</span> Holiday Dates
              </h5>
              <div class="flex space-x-2" id="tools">
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="maximize">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </button>
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="collapse">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <div class="flex flex-wrap">
                <!-- Add Holiday Form -->
                <div class="w-full mb-6">
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h6 class="text-sm font-medium text-gray-700 mb-3"> Add New Holiday</h6>
                    <div class="flex flex-wrap gap-3">
                      <div class="flex-1 min-w-[200px]">
                        <input 
                          type="text" 
                          v-model="newHoliday.name" 
                          placeholder="Holiday name (e.g. Christmas)" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div class="w-48">
                        <input 
                          type="date" 
                          v-model="newHoliday.date" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div class="w-48">
                        <select 
                          v-model="newHoliday.type" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                          <option :value="3">Regular Holiday</option>
                          <option :value="11">Special Holiday</option>
                        </select>
                      </div>
                      <button 
                        @click="addHoliday" 
                        class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!newHoliday.name.trim() || !newHoliday.date"
                      >
                        Add Holiday
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Holiday List -->
                <div class="w-full">
                  <div class="flex justify-between items-center mb-4">
                    <h6 class="text-sm font-medium text-gray-700">All Holidays</h6>
                    <div class="flex items-center gap-3">
                      <!-- <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ holidays.length }} entries</span> -->
                      <button 
                        @click="fetchHolidays" 
                        class="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  <!-- Holiday Cards -->
                  <div v-if="holidays.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div 
                      v-for="(holiday, index) in holidays" 
                      :key="index"
                      class="bg-white border border-gray-200 rounded-lg p-4 card-hover relative group"
                    >
                      <div class="flex justify-between items-start">
                        <div>
                          <h6 class="font-medium text-gray-800">{{ holiday.name }}</h6>
                          <p class="text-sm text-gray-500 mt-1">{{ formatDate(holiday.date) }}</p>
                        </div>
                        <button 
                          @click="deleteHoliday(holiday)" 
                          class="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete holiday"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="mt-2 flex items-center gap-2">
                        <span 
                          class="text-xs px-2 py-1 rounded-full"
                          :class="holiday.type === 7 ? 'text-orange-600 bg-orange-50' : 'text-indigo-600 bg-indigo-50'"
                        >
                          {{ holiday.type === 7 ? ' Special' : ' Regular' }}
                        </span>
                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {{ getDayOfWeek(holiday.date) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- No Data Message -->
                  <div v-else class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-gray-500 text-lg">No holidays added yet</p>
                    <p class="text-gray-400 text-sm mt-2">Add your first holiday using the form above</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import api from '@/Js/Services/axios'
import moment from 'moment'
import Swal from 'sweetalert2'
import { ref, onMounted } from 'vue'

// State
const holidays = ref([])
const loading = ref(false)

const newHoliday = ref({
  name: '',
  date: '',
  type: 3
})

// API Methods
const fetchHolidays = async () => {
  loading.value = true
  try {
    const response = await api.post('/holidays/list')
    console.log('Holidays API Response:', response.data)

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false
      })

      holidays.value = response.data.holidays || []
    } else {
      // Fallback to sample data
      holidays.value = [
        { name: 'New Year\'s Day', date: '2026-01-01', type: 'regular' },
        { name: 'Christmas Day', date: '2026-12-25', type: 'regular' },
        { name: 'Special Non-Working Day', date: '2026-11-26', type: 'special' }
      ]
    }
  } catch (error) {
    console.error('Error fetching holidays:', error)
    // Fallback to sample data on error
    holidays.value = [
      { name: 'New Year\'s Day', date: '2026-01-01', type: 'regular' },
      { name: 'Christmas Day', date: '2026-12-25', type: 'regular' },
      { name: 'Special Non-Working Day', date: '2026-11-26', type: 'special' }
    ]
    await Swal.fire({
      icon: 'error',
      title: 'Failed to fetch holidays',
      text: error.message,
      timer: 3000,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const addHoliday = async () => {
  if (!newHoliday.value.name.trim() || !newHoliday.value.date) {
    return
  }

  Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    }) 

  const holidayData = {
    name: newHoliday.value.name.trim(),
    date: newHoliday.value.date,
    type: newHoliday.value.type
  }

  // Check for duplicate
  const exists = holidays.value.some(h => 
    h.date === holidayData.date
  )

  if (exists) {
    await Swal.fire({
      icon: 'warning',
      title: 'Duplicate Holiday',
      text: 'This holiday already exists on the selected date.',
      timer: 2000,
      showConfirmButton: false
    })
    return
  }

  loading.value = true
  try {
    const response = await api.post('/holidays/add', holidayData)
    console.log('Add Holiday Response:', response.data)

    if (response.data && !response.data.error) {
      // Add the new holiday to the local list
      holidays.value.push(holidayData)

      // Reset form
      newHoliday.value.name = ''
      newHoliday.value.date = ''
      newHoliday.value.type = 3

      await Swal.fire({
        icon: 'success',
        title: 'Holiday Added!',
        text: response.data.message || 'Holiday has been added successfully.',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Failed to add holiday',
        text: response.data.message || 'An error occurred while adding the holiday.',
        timer: 3000,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Error adding holiday:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Failed to add holiday',
      text: error.message || 'An error occurred while adding the holiday.',
      timer: 3000,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const deleteHoliday = async (index) => {
    const holiday = index

    console.log(index);
    
  
  const result = await Swal.fire({
    title: 'Delete Holiday?',
    text: `Are you sure you want to remove "${holiday.name}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it'
  })

  if (result.isConfirmed) {
      loading.value = true   
    try {
      const response = await api.post(`/holidays/delete`, { id: holiday.id  })
      console.log('Delete Holiday Response:', response.data)

      if (response.data && !response.data.error) {
        // Remove from local list
        holidays.value.splice(index, 1)

        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: response.data.message || 'Holiday has been deleted successfully.',
          timer: 1500,
          showConfirmButton: false
        })
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Failed to delete holiday',
          text: response.data.message || 'An error occurred while deleting the holiday.',
          timer: 3000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Error deleting holiday:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Failed to delete holiday',
        text: error.message || 'An error occurred while deleting the holiday.',
        timer: 3000,
        showConfirmButton: false
      })
    } finally {
      loading.value = false
    }
  }
}

// Helper Methods
const maximize = () => {
  console.log('Maximize clicked')
}

const collapse = () => {
  console.log('Collapse clicked')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('MMMM D, YYYY')
}

const getDayOfWeek = (date) => {
  if (!date) return ''
  return moment(date).format('dddd')
}

// Initialize
onMounted(() => {
  fetchHolidays()
})
</script>

<style scoped>
/* Card hover effect */
.card-hover {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

/* Loading state */
.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Print styles */
@media print {
  .content-header,
  .bg-gradient-to-r,
  button {
    display: none;
  }
}
</style>