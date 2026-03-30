<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Loading</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Loading</li>
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
            <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg flex justify-between items-center">
              <h5 class="text-white font-semibold text-lg">LOADING MANAGEMENT</h5>
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
              <div class="flex gap-6">
                <!-- Left Side: Teams Section -->
                <div class="w-full lg:w-1/3">
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div class="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
                      <h3 class="text-white font-semibold">Loading Teams</h3>
                    </div>
                    <div class="p-4">
                      <!-- Team Tabs -->
                      <div class="border-b border-gray-200 mb-4">
                        <ul class="flex flex-wrap -mb-px">
                          <li class="mr-2">
                            <a 
                              href="#" 
                              @click.prevent="teamTab = 'active'; fetchTeams()" 
                              :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                                teamTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                            >
                              Active
                            </a>
                          </li>
                          <li class="mr-2">
                            <a 
                              href="#" 
                              @click.prevent="teamTab = 'deactivated'; fetchDeactivatedTeams()" 
                              :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                                teamTab === 'deactivated' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                            >
                              Deactivated
                            </a>
                          </li>
                        </ul>
                      </div>

                      <!-- Teams Table -->
                      <div class="overflow-x-auto">

                         <div class="flex justify-end mb-4">
                            <AddTeam @saved="fetchTeams" />
                        </div>

                        <table class="w-full text-sm border-collapse">
                          <thead class="bg-gray-100">
                            <tr>
                              <th class="px-4 py-2 text-left font-medium text-gray-700">Team Name</th>
                              <th class="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                              <th class="px-4 py-2 text-left font-medium text-gray-700">Action</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            <tr v-if="teams.length === 0">
                              <td colspan="3" class="px-4 py-6 text-center text-red-500">No Teams Found...</td>
                            </tr>
                            <tr v-for="(team, index) in teams" :key="index" class="hover:bg-gray-50">
                              <td class="px-4 py-2">
                                <span class="text-blue-600 font-medium cursor-pointer"">
                                  {{ team.name }}
                                </span>
                              </td>
                              <td class="px-4 py-2">

                                <template v-if="team.assignedItem.length === 0">
                                  <span :class="getTeamStatusClass(team.status)"  class="px-2 py-1 text-xs font-medium rounded-full">
                                    {{ getTeamStatusText(team.status) }}                               
                                  </span>
                                </template>

                                <template v-else >
                                  <p>Loading: </p>
                                  <div v-for="item in team.assignedItem" class="leading-[30px]">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                      {{ item.itemName }}
                                    </span>
                                  </div>
                                </template>
                                
                              </td>
                              <td class="px-4 py-2">
                                <div class="flex flex-col space-y-1">
                                  <EditTeam 
                                    :team="team" 
                                    @updated="fetchTeams"
                                    />
                                  <button 
                                    v-if="team.status == 4"
                                    @click="markTeamAsWaiting(team)" 
                                    class="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors flex items-center justify-center"
                                  >
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Mark as waiting
                                  </button>
                                  <button 
                                    @click="viewLoadingHistory(team)" 
                                    class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                                  >
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Loading History
                                  </button>
                                  <!-- <button 
                                    @click="viewPassHistory(team)" 
                                    class="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center justify-center"
                                  >
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                    Pass History
                                  </button> -->
                                  <button 
                                    @click="toggleTeamStatus(team)" 
                                    class="px-2 py-1  text-white text-xs rounded  transition-colors flex items-center justify-center"
                                    :class="team.status == 2 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
                                  >
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                    </svg>
                                    {{ team.status == 2 ? 'Activate' : 'Deactivate' }}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Side: Loading Schedule -->
                <div class="w-full lg:w-2/3">
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div class="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
                      <h3 class="text-white font-semibold">Loading Schedule</h3>
                    </div>
                    <div class="p-4">
                      <!-- Loading Tabs -->
                      <div class="border-b border-gray-200 mb-4">
                        <ul class="flex flex-wrap -mb-px">
                          <li class="mr-2">
                            <a 
                              href="#" 
                              @click.prevent="loadingTab = 'ongoing'; fetchOngoingLoadings()" 
                              :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                                loadingTab === 'ongoing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                            >
                              Loading
                            </a>
                          </li>
                          <li class="mr-2">
                            <a 
                              href="#" 
                              @click.prevent="loadingTab = 'finished'; fetchFinishedLoadings()" 
                              :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                                loadingTab === 'finished' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                            >
                              Finished
                            </a>
                          </li>
                        </ul>
                      </div>

                      <!-- Search and Filter -->
                      <div class="flex flex-wrap gap-3 mb-4">
                        <div class="flex-1">
                          <div class="relative">
                            <input 
                              type="search" 
                              placeholder="Search..." 
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                              v-model="search.search" 
                              @keyup="filter"
                            >
                            <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="w-48">
                          <select 
                            v-model="filterItem" 
                            @change="filterByItem"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">All Items</option>
                            <option v-for="item in itemOptions" :key="item.id" :value="item.id">
                              {{ item.class }}
                            </option>
                          </select>
                        </div>
                      </div>
                       <div class="flex justify-end mb-4">
                            <AddLoading @saved="fetchOngoingLoadings" />
                        </div>

                      <!-- Loading Table -->
                      <div class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                          <thead class="bg-gray-100">
                            <tr class="text-nowrap">
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Loading Date</th>
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Van No.</th>
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Seal No.</th>
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Item</th>
                              <th class="px-4 py-3 text-right font-semibold text-gray-700">Container Weight</th>
                              <th class="px-4 py-3 text-right font-semibold text-gray-700">Gross Weight</th>
                              <th class="px-4 py-3 text-right font-semibold text-gray-700">Net Weight</th>
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Team</th>
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                              <th class="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            <tr v-if="loadings.length === 0">
                              <td colspan="10" class="px-4 py-8 text-center text-red-500">No data found...</td>
                            </tr>
                            <tr v-for="(loading, index) in loadings" :key="index" class="hover:bg-gray-50">
                              <td class="px-4 py-2">{{ loading.loadingDate }}</td>
                              <td class="px-4 py-2">{{ loading.vanNo }}</td>
                              <td class="px-4 py-2">{{ loading.sealNo }}</td>
                              <td class="px-4 py-2">{{ loading.itemName }}</td>
                              <td class="px-4 py-2 text-right">{{ formatNumber(loading.containerWeight) }}</td>
                              <td class="px-4 py-2 text-right">{{ formatNumber(loading.grossWeight) }}</td>
                              <td class="px-4 py-2 text-right font-medium">{{ loading.netWeight}}</td>
                              <td class="px-4 py-2">{{ loading.teamName }}</td>
                              <td class="px-4 py-2">
                                <span :class="getLoadingStatusClass(loading.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                                  {{ getLoadingStatusText(loading.status) }}
                                </span>
                              </td>
                              <td class="px-4 py-2">
                                <div v-if="loading.status != 4" class="flex space-x-1">
  
                                  <FinishLoading 
                                    v-if="loading.status == 3"
                                    :loading="loading" 
                                    @updated="fetchOngoingLoadings"
                                  />
                                  <button 
                                    v-if="loading.status == 0"
                                    @click="acceptLoading(loading)" 
                                    class="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    title="Accept"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                  </button>
                                  <EditLoading 
                                    :loading="loading" 
                                    @updated="fetchOngoingLoadings"
                                    />

                                  <AssignTeam 
                                    v-if="loading.status == 0 || loading.status == 1"
                                    :loading="loading" 
                                    @updated="fetchOngoingLoadings"
                                    />

                                  <button 
                                    v-if="loading.status == 0"
                                    @click="rejectLoading(loading)" 
                                    class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    title="Pass"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </div>
                                <div v-else>
                                  <button 
                                    @click="viewLoading(loading)" 
                                    class="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    title="View"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Pagination -->
                      <div v-if="totalRows > 0" class="mt-6">
                        <Pagination
                          :page_number="search.page_num"
                          :total_rows="totalRows"
                          :itemsperpage="search.items_perpage"
                          @page_num="handlePageNum"
                        />
                      </div>
                    </div>
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
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import Pagination from '@/Js/Components/Paginate.vue'
import AddTeam from './Actions/AddTeam.vue'
import AddLoading from './Actions/add.vue'
import EditTeam from './Actions/EditTeam.vue'
import AssignTeam from './Actions/AssignTeam.vue'
import EditLoading from './Actions/edit.vue'
import FinishLoading from './Actions/FinishLoading.vue'

// Props
const props = defineProps({
  userPosition: {
    type: String,
    default: ''
  }
})

// State
const teamTab = ref('active')
const loadingTab = ref('ongoing')
const teams = ref([])
const loadings = ref([])
const totalRows = ref(0)
const itemOptions = ref([])
const filterItem = ref('')

const search = ref({
  search: '',
  page_num: 1,
  items_perpage: 10
})

// Methods
const maximize = () => {}
const collapse = () => {}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value).toFixed(2)
}



// Team Status Helpers
const getTeamStatusClass = (status) => {
  switch(status) {
    case 0: return 'bg-gray-100 text-gray-800'
    case 1: return 'bg-blue-100 text-blue-800'
    case 2: return 'bg-green-100 text-green-800'
    case 3: return 'bg-yellow-100 text-yellow-800'
    case 4: return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTeamStatusText = (status) => {
  switch(status) {
    case 0: return 'Inactive'
    case 1: return 'Waiting'
    case 2: return 'Loading'
    case 3: return 'Finished'
    case 4: return 'Waiting'
    default: return 'Unknown'
  }
}

// Loading Status Helpers
const getLoadingStatusClass = (status) => {
  switch(status) {
    case 0: return 'bg-yellow-100 text-yellow-800'
    case 1: return 'bg-blue-100 text-blue-800'
    case 2: return 'bg-red-100 text-red-800'
    case 3: return 'bg-orange-100 text-orange-800'
    case 4: return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getLoadingStatusText = (status) => {
  switch(status) {
    case 0: return 'Pending'
    case 1: return 'Waiting'
    case 2: return 'Removed'
    case 3: return 'Ongoing'
    case 4: return 'Completed'
    default: return 'Unknown'
  }
}

// Fetch Teams
const fetchTeams = async () => {
  try {
    const response = await api.post('/teams/list', {
      status: 1 // Active
    })
    if (response.data && !response.data.error) {
      teams.value = response.data.teams || []
    }
  } catch (error) {
    console.error('Failed to fetch teams:', error)
  }
}

const fetchDeactivatedTeams = async () => {
  try {
    const response = await api.post('/teams/list', {
      status: 2 // Deactivated
    })
    if (response.data && !response.data.error) {
      teams.value = response.data.teams || []
    }
  } catch (error) {
    console.error('Failed to fetch deactivated teams:', error)
  }
}

// Fetch Loadings
const fetchOngoingLoadings = async () => {
  try {
    const formData = {
      ...search.value,
      status: 1,
      item_id: filterItem.value
    }
    const response = await api.post('/loading/list', formData)
    if (response.data && !response.data.error) {
      loadings.value = response.data.loadings || []
      totalRows.value = response.data.totalrows || 0
      fetchTeams();
    }
  } catch (error) {
    console.error('Failed to fetch ongoing loadings:', error)
  }
}

const fetchFinishedLoadings = async () => {
  try {
    const formData = {
      ...search.value,
      status: 4,
      item_id: filterItem.value
    }
    const response = await api.post('/loading/list', formData)
    if (response.data && !response.data.error) {
      loadings.value = response.data.loadings || []
      totalRows.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch finished loadings:', error)
  }
}

const fetchItemOptions = async () => {
  try {
    const response = await api.get('/loading/items')
    if (response.data && !response.data.error) {
      itemOptions.value = response.data.items || []
    }
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

const filter = () => {
  search.value.page_num = 1
  if (loadingTab.value === 'ongoing') {
    fetchOngoingLoadings()
  } else {
    fetchFinishedLoadings()
  }
}

const filterByItem = () => {
  search.value.page_num = 1
  if (loadingTab.value === 'ongoing') {
    fetchOngoingLoadings()
  } else {
    fetchFinishedLoadings()
  }
}

const handlePageNum = (page) => {
  search.value.page_num = page
  if (loadingTab.value === 'ongoing') {
    fetchOngoingLoadings()
  } else {
    fetchFinishedLoadings()
  }
}

const markTeamAsWaiting = (team) => {
  console.log('Mark team as waiting:', team)
  // Will be implemented later
}

const viewLoadingHistory = (team) => {
  console.log('View loading history:', team)
  // Will be implemented later
}


// Toggle Team Status (Activate/Deactivate)
const toggleTeamStatus = async (team) => {
  const isActive = team.status === 1
  const action = isActive ? 'deactivate' : 'activate'
  const confirmText = isActive ? 'deactivate' : 'activate'
  
  const result = await Swal.fire({
    title: `${confirmText.charAt(0).toUpperCase() + confirmText.slice(1)} Team?`,
    text: `Do you want to ${action} "${team.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: isActive ? '#ef4444' : '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/teams/toggle-status', {
        team_id: team.id,
        status: isActive ? 0 : 1
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Team ${action}d successfully`,
          timer: 1500,
          showConfirmButton: false
        })
        
        // Refresh the teams list based on current tab
        if (teamTab.value === 'active') {
          fetchTeams()
        } else {
          fetchDeactivatedTeams()
        }
      }
    } catch (error) {
      console.error('Failed to toggle team status:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update team status',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}


const acceptLoading = (loading) => {
  console.log('Accept loading:', loading)
  // Will be implemented later
}


const rejectLoading = (loading) => {
  console.log('Reject loading:', loading)
  // Will be implemented later
}

const viewLoading = (loading) => {
  console.log('View loading:', loading)
  // Will be implemented later
}

// Initialize
onMounted(() => {
  fetchTeams()
  fetchOngoingLoadings()
  fetchItemOptions()
})
</script>

<style scoped>
/* Add any additional custom styles here */
</style>