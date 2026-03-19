<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">PRICELIST</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Pricelist</li>
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
              <h5 class="text-white font-semibold text-lg">Pricelist</h5>
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
                  <!-- Add Pricelist Button -->
                  <AddPricelistModal @saved="fetchPricelist" />

                  <!-- Search -->
                  <div class="w-full mb-4">
                    <div class="">
                      <input 
                        type="search" 
                        placeholder="Search..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        v-model="searchPricelist.search" 
                        @keyup="filter"
                      >
                      <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Pricelist Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm text-center border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 font-semibold text-gray-700">Name</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Normal Price</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Bronze Price</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Silver Price</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Gold Price</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Deduction %</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="data.length === 0">
                          <td colspan="7" class="px-4 py-8 text-red-500 text-center">No pricelist found!</td>
                        </tr>
                        <tr v-for="(p, pp) in data" :key="pp" class="hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-3">{{ p.name }}</td>
                          <td class="px-4 py-3">{{ formatCurrency(p.normal_price) }}</td>
                          <td class="px-4 py-3">{{ formatCurrency(p.bronze_price) }}</td>
                          <td class="px-4 py-3">{{ formatCurrency(p.silver_price) }}</td>
                          <td class="px-4 py-3">{{ formatCurrency(p.gold_price) }}</td>
                          <td class="px-4 py-3">{{ p.deduction }}%</td>
                          <td class="px-4 py-3">
                            <div class="flex justify-center space-x-2">
                              <!-- Edit Button Component -->
                              <EditPricelistModal 
                                :pricelistData="p" 
                                @saved="fetchPricelist" 
                              />
                              
                              <!-- Delete Button -->
                              <button 
                                @click="deletePricelist(p.id)" 
                                class="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center"
                                title="Delete Pricelist"
                              >
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
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
                      :page_number="searchPricelist.page_num"
                      :total_rows="totalRows"
                      :itemsperpage="searchPricelist.items_perpage"
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
import AddPricelistModal from './Actions/add.vue'
import EditPricelistModal from './Actions/edit.vue'
import { FormDx } from '@/Views/Utility/Helper'

// State
const data = ref([])
const totalRows = ref(0)

const searchPricelist = ref({
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

const formatCurrency = (value) => {
  if (!value) return '0.00'
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const handlePageNum = (page_num) => {
  searchPricelist.value.page_num = page_num
  fetchPricelist()
}

const filter = async () => {
  searchPricelist.value.page_num = 1
  await fetchPricelist()
}

const fetchPricelist = async () => {
  try {
    const formData = FormDx(searchPricelist.value)
    const response = await api.post('/prices/list', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.pricelist
      totalRows.value = response.data.totalrows
    }
  } catch (error) {
    console.error('Failed to fetch pricelist:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load pricelist',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const deletePricelist = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this pricelist?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/pricelist/delete', {
        price_id: id
      })
      
      if (response.data && !response.data.error) {
        await fetchPricelist()
        await Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Pricelist removed successfully',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to delete pricelist:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete pricelist',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

// Initialize
onMounted(() => {
  fetchPricelist()
})
</script>