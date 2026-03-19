<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Employee Contributions</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Contributions</li>
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
              <h5 class="text-white font-semibold text-lg">CONTRIBUTIONS TABLE</h5>
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
                <div class="w-full mt-4 mb-0 pb-0">
                  <!-- Search -->
                  <div class="w-full mb-4">
                    <div class="relative">
                      <input 
                        type="search" 
                        placeholder="Search employees..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        v-model="search.search" 
                        @keyup="filter"
                      >
                      <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Contributions Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 font-semibold text-gray-700">Employee ID</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Employee Name</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">SSS Premium</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Philhealth</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Pag-IBIG</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Maxicare</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="data.length === 0">
                          <td colspan="7" class="px-4 py-8 text-red-500 text-center">No records found!</td>
                        </tr>
                        <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-3">{{ item.empId }}</td>
                          <td class="px-4 py-3">{{ item.fullName }}</td>
                          <td class="px-4 py-3">
                            <input 
                              type="number" 
                              v-model="item.sssPremium" 
                              class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                          </td>
                          <td class="px-4 py-3">
                            <input 
                              type="number" 
                              v-model="item.philhealth" 
                              class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                          </td>
                          <td class="px-4 py-3">
                            <input 
                              type="number" 
                              v-model="item.pagibig" 
                              class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                          </td>
                          <td class="px-4 py-3">
                            <input 
                              type="number" 
                              v-model="item.maxicare" 
                              class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                          </td>
                          <td class="px-4 py-3">
                            <button 
                              @click="updateContribution(index)" 
                              class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                            >
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                              </svg>
                              Update
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination -->
                  <div v-if="totalUsers > 0" class="mt-6">
                    <Pagination
                        :page_number="search.page_num"
                        :total_rows="totalUsers"
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
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Pagination from '@/Js/Components/Paginate.vue'
import { FormDx } from '@/Views/Utility/Helper'

// State
const data = ref([])
const currentPage = ref(1)
const rowCountPage = ref(10)
const totalUsers = ref(0)
const pageRange = ref(5)

const search = ref({
  search: '',
  page_num: 1,
  items_perpage: 10
})

// Methods
const maximize = () => {
  // Implement maximize functionality
}

const collapse = () => {
  // Implement collapse functionality
}

const filter = async () => {
  search.value.page_num = 1
  await fetchContributions()
}

const handlePageNum = (page_num) => {
  search.value.page_num = page_num
  fetchContributions()
}

const fetchContributions = async () => {
  try {
    const formData = FormDx(search.value)
    const response = await api.post('/employee/list-contribution', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.contributions || []
      totalUsers.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch contributions:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load contributions',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const updateContribution = async (index) => {
  const item = data.value[index]
  
  try {
    const response = await api.post('/employee/update-contribution', {
      contri_id: item.id,
        sss_premium: item.sssPremium,
        philhealth: item.philhealth,
        pagibig: item.pagibig,
        maxicare: item.maxicare
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Contributions updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
       fetchContributions()
    }
  } catch (error) {
    console.error('Failed to update contributions:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update contributions',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// Initialize
onMounted(() => {
  fetchContributions()
})
</script>

<style scoped>
/* Add any additional custom styles here */
</style>