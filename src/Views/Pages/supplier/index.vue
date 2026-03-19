<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">SUPPLIER</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Supplier</li>
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
              <h5 class="text-white font-semibold text-lg">SUPPLIER</h5>
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
                  <!-- Add Supplier Button -->
                  <newSupplierModal @saved="fetchSuppliers" />

                  <!-- Search Table -->
                  <table class="w-full mb-4">
                    <tr>
                      <td>
                        <div class="relative">
                          <input 
                            type="search" 
                            placeholder="Search..." 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            v-model="searchSupplier.search" 
                            @keyup="filter"
                          >
                          <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Suppliers Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm text-center border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 font-semibold text-gray-700">Tier</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Name</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="data.length === 0">
                          <td colspan="3" class="px-4 py-8 text-red-500 text-center">No supplier found!</td>
                        </tr>
                        <tr v-for="(d, dd) in data" :key="dd" class="hover:bg-gray-50 transition-colors capitalize">
                            <td class="px-4 py-3">
                                <svg 
                                  class="w-5 h-5 inline-block mr-1" 
                                  :class="getTierIconClass(d.supplierTier)"
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                {{ getTierName(d.supplierTier) }} Tier
                            </td>
                            <td class="px-4 py-3">{{ d.supplier_name }}</td>

                            <td>
                              <div class="flex gap-1">
                                <EditSupplierModal 
                                  :supplierData="d" 
                                  @saved="fetchSuppliers" 
                                />
                                <ViewSupplierModal 
                                  :supplierData="d" 
                                  @saved="fetchSuppliers" 
                                />
                              </div>
                            </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-if="totalRows > 0" class="mt-6">
                        <Paginate
                            :page_number="searchSupplier.page_num"
                            :total_rows="totalRows"
                            :itemsperpage="searchSupplier.items_perpage"
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
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Paginate from '@/Js/Components/Paginate.vue'
import newSupplierModal from './Action/add.vue'
import { FormDx } from '@/Views/Utility/Helper'
import EditSupplierModal from './Action/edit.vue'
import ViewSupplierModal from './Action/view.vue'
// State
const data = ref([])
const currentPage = ref(1)
const rowCountPage = ref(10)
const totalRows = ref(0)
const bankingInfo = ref([])

// Methods
const maximize = () => {
  // Implement maximize functionality
}

const collapse = () => {
  // Implement collapse functionality
}

const getTierIconClass = (tier) => {
  switch(tier) {
    case 4: // Gold
      return 'text-yellow-500'
    case 3: // Silver
      return 'text-gray-400'
    case 2: // Bronze
      return 'text-amber-700'
    default: // Normal (1) or any other
      return 'text-gray-500'
  }
}

const getTierName = (tier) => {
  switch(tier) {
    case 4:
      return 'Gold'
    case 3:
      return 'Silver'
    case 2:
      return 'Bronze'
    default:
      return 'Normal'
  }
}

const searchSupplier = ref({
  search: '',
  page_num: 1,
  items_perpage: 10
})

const handlePageNum = (page_num) => {
    searchSupplier.value.page_num = page_num
    fetchSuppliers()
}

const filter = async () => {
  await fetchSuppliers()
}

const fetchSuppliers = async () => {
  try {
    const formData = FormDx(searchSupplier.value);
    const response = await api.post('/suppliers/list', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.suppliers
      totalRows.value = response.data.totalrows
    }
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load suppliers',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const banking_info = async (supplierId) => {
  try {
    const response = await api.post('/suppliers/banking-info', {
      supplier_id: supplierId
    })
    
    if (response.data && !response.data.error) {
      bankingInfo.value = response.data.banking_info
    }
  } catch (error) {
    console.error('Failed to fetch banking info:', error)
  }
}

const pageUpdate = (page) => {
  currentPage.value = page
  fetchSuppliers()
}

const reset = () => {
  // Reset form fields when opening new supplier modal
}

// Initialize
onMounted(() => {
  fetchSuppliers()
})
</script>

<style scoped>
/* Add any additional custom styles here */
.fas.fa-medal {
  display: inline-block;
  width: 1em;
  height: 1em;
}
</style>