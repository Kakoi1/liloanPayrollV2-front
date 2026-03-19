<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">DEDUCTIONS</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Deductions</li>
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
              <h5 class="text-white font-semibold text-lg">DEDUCTIONS TABLE</h5>
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
                  <!-- Add Deduction Button Component -->
                  <AddDeduction @saved="fetchDeductions" />

                  <!-- Search -->
                  <div class="w-full mb-4">
                    <div class="relative">
                      <input 
                        type="search" 
                        placeholder="Search deductions..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        v-model="search.search" 
                        @keyup="filter"
                      >
                      <!-- <svg class="w-5 h-5  text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg> -->
                    </div>
                  </div>

                  <!-- Deductions Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 font-semibold text-gray-700 text-center">NO.</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">NAME</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">TYPE</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">AMOUNT</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">ACTION</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="data.length === 0">
                          <td colspan="5" class="px-4 py-8 text-red-500 text-center">No deductions found!</td>
                        </tr>
                        <tr v-for="(d, dd) in data" :key="dd" class="hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-3 text-center">{{ dd + 1 }}</td>
                          <td class="px-4 py-3">{{ d.name }}</td>
                          <td class="px-4 py-3">
                            <span class="px-2 py-1 text-xs rounded-full" :class="d.type == 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                              {{ d.type == 1 ? 'Deduct By Weight' : 'Deduct By Rate/Price' }}
                            </span>
                          </td>
                          <td class="px-4 py-3">
                            {{ d.type == 1 ? d.amount + '%' : '₱' + parseFloat(d.amount).toFixed(2) }}
                          </td>
                          <td class="px-4 py-3">
                            <div class="flex justify-center space-x-2">
                              <!-- View Button Component -->
                              <ViewDeduction 
                                :deduction="d" 
                              />
                              
                              <!-- Edit Button Component -->
                              <EditDeduction 
                                :deduction="d" 
                                @updated="fetchDeductions"
                              />
                              
                              <!-- Delete Button Component -->
                              <button 
                                @click="deleteDeduction(d.id)" 
                                class="p-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                                title="Delete Deduction"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
                    <Paginate
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
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Paginate from '@/Js/Components/Paginate.vue'
import AddDeduction from './Actions/add.vue'
import ViewDeduction from './Actions/view.vue'
import EditDeduction from './Actions/edit.vue'
import { FormDx } from '@/Views/Utility/Helper'

// State
const data = ref([])
const totalRows = ref(0)
const currentPage = ref(1)
const rowCountPage = ref(10)
const pageRange = ref(5)

const search = ref({
  search: '',
  page_num: 1,
  items_perpage: 10
})

// Methods
const maximize = () => {}
const collapse = () => {}

const filter = async () => {
  search.value.page_num = 1
  await fetchDeductions()
}

const pageUpdate = (page) => {
  currentPage.value = page
  search.value.page_num = page
  fetchDeductions()
}

const fetchDeductions = async () => {
  try {
    const formData = FormDx(search.value)
    const response = await api.post('/deductions/list', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.deductions
      totalRows.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch deductions:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load deductions',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const deleteDeduction = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this deduction?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/deductions/delete', {
        deduction_id: id
      })
      
      if (response.data && !response.data.error) {
        await fetchDeductions()
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Deduction deleted successfully',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to delete deduction:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete deduction',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const handlePageNum = (page_num) => {
  search.value.page_num = page_num
  fetchDeductions()
}

// Initialize
onMounted(() => {
  fetchDeductions()
})
</script>