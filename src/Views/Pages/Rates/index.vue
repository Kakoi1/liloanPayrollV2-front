<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">RATES</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">RATES</li>
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
              <h5 class="text-white font-semibold text-lg">RATES TABLE</h5>
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

                  <!-- Rates Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th colspan="8" class="px-4 py-3 text-left">
                            <div class="flex items-center justify-between">
                              <span class="text-sm text-gray-600">Task Count: {{ totalrows }}</span>
                              <div class="flex gap-2">
                                <NewClass 
                                    :classifications="cdrop" 
                                    @updated="fetchClassifications"
                                  />
                                  
                                  <!-- Task Modal Button -->
                                  <NewTask 
                                    :classifications="cdrop" 
                                    @saved="fetchRates"
                                  />
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <th class="px-4 py-3 font-semibold text-gray-700 text-center">NO.</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">CLASSIFICATION</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">TASK</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">RATES</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">TARIMA MULTIPLIER</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">MEASUREMENT</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">REMARKS</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">ACTION</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="data.length === 0">
                          <td colspan="8" class="px-4 py-8 text-red-500 text-center">No Record Found</td>
                        </tr>
                        <tr v-for="(t, tt) in data" :key="tt" class="hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-3 text-center">{{ tt + 1 }}</td>
                          <td class="px-4 py-3">
                            <select 
                              v-model="t.taskId" 
                              class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                              <option v-for="(cd, cdd) in cdrop" :key="cdd" :value="cd.id">{{ cd.task_name }}</option>
                            </select>
                          </td>
                          <td class="px-4 py-3">
                            <input 
                              type="text" 
                              v-model="t.class" 
                              disabled
                              class="w-full px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                            >
                          </td>
                          <td class="px-4 py-3">
                            <input 
                              type="text" 
                              v-model="t.rate" 
                              class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                          </td>
                          <td class="px-4 py-3">
                            <input 
                              type="number" 
                              v-model="t.multiplier" 
                              class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                          </td>
                          <td class="px-4 py-3">
                            <select 
                              v-model="t.rateMeasurement" 
                              class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                              <option value="">--SELECT--</option>
                              <option value="1">BY HOUR</option>
                              <option value="2">BY HOUR(OVERTIME ONLY)</option>
                              <option value="3">BY WEIGHT</option>
                              <option value="4">PER CONTAINER</option>
                              <option value="5">PANTAWID</option>
                            </select>
                          </td>
                          <td class="px-4 py-3">
                            <textarea 
                              v-model="t.remarks" 
                              rows="2"
                              class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            ></textarea>
                          </td>
                          <td class="px-4 py-3">
                            <button 
                              @click="updateRate(tt, t.id)" 
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
                  <div v-if="totalrows > 0" class="mt-6">
                    <Paginate
                      :page_number="search.page_num"
                      :total_rows="totalrows"
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

    <!-- Modals will be added here later -->
    <!-- <RatesModal v-if="clsModal" @close="clsModal = false" />
    <TaskModal v-if="tskModal" @close="tskModal = false" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import { FormDx } from '@/Views/Utility/Helper'
import Paginate from '@/Js/Components/Paginate.vue'
import NewClass from './Actions/NewClass.vue'
import NewTask from './Actions/NewTask.vue'

// Props
const props = defineProps({
  userPosition: {
    type: String,
    default: ''
  }
})

// State
const data = ref([])
const cdrop = ref([])
const tcnt = ref(0)
const currentPage = ref(1)
const rowCountPage = ref(10)
const totalrows = ref(0)
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
  await fetchRates()
}

const handlePageNum = (page_num) => {
  search.value.page_num = page_num
  fetchRates()
}

const fetchRates = async () => {
  try {
    const formData = FormDx(search.value)
    const response = await api.post('/rates/list', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.rates
      cdrop.value = response.data.tasks
      tcnt.value = response.data.total || 0
      totalrows.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch rates:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load rates',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// const fetchClassifications = async () => {
//   try {
//     const response = await api.post('/classifications/list')
    
//     if (response.data && !response.data.error) {
//       cdrop.value = response.data.classifications
//     }
//   } catch (error) {
//     console.error('Failed to fetch classifications:', error)
//   }
// }

const updateRate = async (index, classId) => {
  const rate = data.value[index]
  
  try {
    const response = await api.post('/rates/update', {
      class_id: classId,
      task: rate.taskId,
      rate: rate.rate,
      multiplier: rate.multiplier,
      rate_measurement: rate.rateMeasurement,
      remarks: rate.remarks
    })
    
    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Rate updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      await fetchRates()
    }
  } catch (error) {
    console.error('Failed to update rate:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update rate',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// Initialize
onMounted(() => {
//   fetchClassifications()
  fetchRates()
})
</script>