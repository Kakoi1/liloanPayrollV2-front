<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">VOUCHER</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Voucher</li>
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
              <h5 class="text-white font-semibold text-lg">VOUCHER LIST</h5>
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
                  <!-- Add Voucher Button Component -->
                  <Add 
                    @saved="fetchVouchers"
                    :taskOptions="taskOptions"
                    :deductionOptions="deductionOptions"
                  />
                  
                  <!-- Tabs -->
                  <div class="border-b border-gray-200 mb-4">
                    <ul class="flex flex-wrap -mb-px">
                      <li class="mr-2">
                        <a 
                          href="#" 
                          @click.prevent="activeTab = 1; list(1)" 
                          :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                            activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                        >
                          Daily
                        </a>
                      </li>
                      <li class="mr-2">
                        <a 
                          href="#" 
                          @click.prevent="activeTab = 2; list(2)" 
                          :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                            activeTab === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                        >
                          Morning
                        </a>
                      </li>
                      <li class="mr-2">
                        <a 
                          href="#" 
                          @click.prevent="activeTab = 3; list(3)" 
                          :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                            activeTab === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                        >
                          Afternoon
                        </a>
                      </li>
                      <li class="mr-2">
                        <a 
                          href="#" 
                          @click.prevent="activeTab = 4; list(4)" 
                          :class="['inline-block py-2 px-4 text-sm font-medium rounded-t-lg transition-colors', 
                            activeTab === 4 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                        >
                          All
                        </a>
                      </li>
                    </ul>
                  </div>

                  <!-- Search Section -->
                  <div class="bg-gray-50 p-4 rounded-lg mb-4">
                    <div class="flex flex-wrap gap-3">
                      <div class="flex-1">
                        <input 
                          type="search" 
                          placeholder="Search..." 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          v-model="searchVoucher.search" 
                          @keyup.enter="filter"
                        >
                      </div>
                      <div v-if="searchVoucher.all == 4" class="w-64">
                        <input 
                          type="date" 
                          v-model="searchVoucher.range" 
                          placeholder="Select Range" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                      </div>
                      <div>
                        <button 
                          @click="filter" 
                          class="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                        >
                          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                          Search
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Batch Actions -->
                  <div class="flex justify-between items-center mb-4">
                    <div class="flex space-x-2">
                      <button 
                        @click="batchPrint" 
                        class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-500 transition-all duration-200 flex items-center"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        Print Selected
                      </button>
                      <button 
                        v-if="userPosition === 'SuperAdmin'"
                        @click="batchDeleteVoucher" 
                        class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Selected
                      </button>
                    </div>
                  </div>

                  <!-- Vouchers Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm text-center border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 font-semibold text-gray-700 w-16">
                            <span class="sr-only">Select</span>
                          </th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Date</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Supplier</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Weigh Slip No.</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Total Amount</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Transaction Time</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Status</th>
                          <th class="px-4 py-3 font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="data.length === 0">
                          <td colspan="8" class="px-4 py-8 text-red-500 text-center">No records found!</td>
                        </tr>
                        <tr v-for="(v, vv) in data" :key="vv" class="hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-3">
                            <input 
                              type="checkbox" 
                              v-model="v.check" 
                              :disabled="v.status != 3"
                              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            >
                          </td>
                          <td class="px-4 py-3">{{ formatDate(v.paymentDate) }}</td>
                          <td class="px-4 py-3">{{ v.supplier_name }}</td>
                          <td class="px-4 py-3">{{ v.weightSlip }}</td>
                          <td class="px-4 py-3 font-medium">{{ formatCurrency(v.totalAmount) }}</td>
                          <td class="px-4 py-3">
                            <span :class="v.transactionTime == 1 ? 'text-blue-600' : 'text-orange-600'">
                              {{ v.transactionTime == 1 ? 'Morning' : 'Afternoon' }}
                            </span>
                          </td>
                          <td class="px-4 py-3" v-html="getStatusLabel(v.status)"></td>
                          <td class="px-4 py-3">
                            <div class="flex justify-center space-x-1">
                                <View
                                :voucherId="v.id"
                                />
                                 <Pay
                                    v-if="v.status === 1"
                                    :taskOptions="taskOptions"
                                    :deductionOptions="deductionOptions"
                                    :voucherId="v.id"
                                    @updated="fetchVouchers"
                                  />
                                  
                                  <!-- Undo Button (show for vouchers marked for payment) -->
                                  <Undo
                                    v-if="v.status === 3"
                                    :voucherId="v.id"
                                    @updated="fetchVouchers"
                                  />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination -->
                  <div v-if="totalRows > 0" class="mt-6">
                    <Paginate
                      :page_number="searchVoucher.page_num"
                      :total_rows="totalRows"
                      :itemsperpage="searchVoucher.items_perpage"
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
import Add from './Actions/add.vue'
import { FormDx } from '@/Views/Utility/Helper'
import View from './Actions/view.vue'
import Undo from './Actions/Undo.vue'
import Pay from './Actions/Pay.vue'

// Props
const props = defineProps({
  userPosition: {
    type: String,
    default: ''
  }
})

// State
const data = ref([])
const totalRows = ref(0)
const activeTab = ref(1)
const loading = ref({
  tasks: false,
  deductions: false
})

// Dropdown Options

const taskOptions = ref([])
const deductionOptions = ref([])

const searchVoucher = ref({
  search: '',
  range: '',
  all: 1,
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
  if (!value) return '₱0.00'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusLabel = (status) => {
  switch(status) {
    case 1:
      return '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Unpaid</span>'
    case 2:
      return '<span class="px-2 py-1 bg-blue-100 text-gray-800 text-xs font-medium rounded-full">Removed</span>'
    case 3:
      return '<span class="px-2 py-1 bg-green-100 text-blue-800 text-xs font-medium rounded-full">For Payment</span>'
    case 4:
      return '<span class="px-2 py-1 bg-red-100 text-green-800 text-xs font-medium rounded-full">Paid</span>'
    default:
      return '<span class="px-2 py-1 bg-gray-100 text-red-800 text-xs font-medium rounded-full">Unknown</span>'
  }
}

const list = (tab) => {
  searchVoucher.value.all = tab
  searchVoucher.value.page_num = 1
  fetchVouchers()
}

const handlePageNum = (page_num) => {
  searchVoucher.value.page_num = page_num
  fetchVouchers()
}

const filter = async () => {
  searchVoucher.value.page_num = 1
  await fetchVouchers()
}

// Fetch Functions




const fetchTasks = async () => {
  loading.value.tasks = true
  try {
    const response = await api.post('/vouchers/task-list')
    if (response.data && !response.data.error) {
      taskOptions.value = response.data.tasks.map(t => ({
        value: t.id,
        label: t.name,
        deduc: t.deduction,
        1: t.normal_price,
        2: t.bronze_price,
        3: t.silver_price,
        4: t.gold_price,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  } finally {
    loading.value.tasks = false
  }
}

const fetchDeductions = async () => {
  loading.value.deductions = true
  try {
    const response = await api.post('/vouchers/deduction-list')
    if (response.data && !response.data.error) {
      deductionOptions.value = response.data.deductions.map(d => ({
        value: d.id,
        label: d.name,
        type: d.type,
        amount: d.amount
      }))
    }
  } catch (error) {
    console.error('Failed to fetch deductions:', error)
  } finally {
    loading.value.deductions = false
  }
}

const fetchAllDropdownData = async () => {
  await Promise.all([
    fetchTasks(),
    fetchDeductions()
  ])
}

const fetchVouchers = async () => {
  try {
    const formData = FormDx(searchVoucher.value)
    const response = await api.post('/vouchers/list', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.vouchers.map(v => ({
        ...v,
        check: false
      }))
      totalRows.value = response.data.totalrows
    }
  } catch (error) {
    console.error('Failed to fetch vouchers:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load vouchers',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const batchPrint = () => {
  const selected = data.value.filter(v => v.check)
  if (selected.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select at least one voucher to print',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }
  
  // Implement batch print functionality
  const ids = selected.map(v => v.voucher_id).join(',')
  window.open(`../voucher/batch-print?ids=${ids}`, '_blank')
}

const batchDeleteVoucher = async () => {
  const selected = data.value.filter(v => v.check)
  if (selected.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select at least one voucher to delete',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete ${selected.length} selected voucher(s)?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete them!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const ids = selected.map(v => v.voucher_id)
      const response = await api.post('/voucher/batch-delete', {
        voucher_ids: ids
      })
      
      if (response.data && !response.data.error) {
        await fetchVouchers()
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Selected vouchers deleted successfully',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to batch delete vouchers:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete vouchers',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

// Initialize
onMounted(() => {
  fetchAllDropdownData()
  fetchVouchers()
})
</script>