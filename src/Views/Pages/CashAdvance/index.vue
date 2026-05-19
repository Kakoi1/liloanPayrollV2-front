<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Supplier Cash Advance Dashboard</h1>
      <p class="text-gray-600 mt-1">Manage and track supplier cash advances</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Total Cash Advances</p>
            <p class="text-2xl font-bold">{{ stats.total }}</p>
          </div>
          <div class="bg-blue-100 p-2 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Total Amount</p>
            <p class="text-2xl font-bold">{{ formatCurrency(stats.totalAmount) }}</p>
          </div>
          <div class="bg-green-100 p-2 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Pending Approvals</p>
            <p class="text-2xl font-bold">{{ stats.pending }}</p>
          </div>
          <div class="bg-yellow-100 p-2 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Total Suppliers</p>
            <p class="text-2xl font-bold">{{ stats.suppliers }}</p>
          </div>
          <div class="bg-purple-100 p-2 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[180px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="released">Released</option>
            <option value="paid">Fully Paid</option>
          </select>
        </div>
        <div class="flex-1 min-w-[180px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input type="date" v-model="filters.dateFrom" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex-1 min-w-[180px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input type="date" v-model="filters.dateTo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Supplier</label>
          <input type="text" v-model="filters.search" placeholder="Search by name or code..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <button @click="fetchData" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Filter
          </button>
        </div>
        <div>
          <button @click="openAddModal" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            + New Cash Advance
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier Code</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Release Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Terms</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in cashAdvances" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ item.supplier_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ item.supplier_code }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-semibold">{{ formatCurrency(item.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(item.request_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(item.release_date) || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.payment_terms }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">{{ formatCurrency(item.balance) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span :class="getStatusClass(item.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ getStatusText(item.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <button @click="openViewModal(item)" class="text-blue-600 hover:text-blue-800" title="View">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button v-if="item.status === 'pending'" @click="approveRequest(item.id)" class="text-green-600 hover:text-green-800" title="Approve">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button v-if="item.status === 'approved'" @click="releaseCash(item.id)" class="text-blue-600 hover:text-blue-800" title="Release">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  <button @click="deleteRecord(item.id)" class="text-red-600 hover:text-red-800" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="cashAdvances.length === 0 && !loading">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500">No cash advance records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <ViewCashAdvance ref="viewModalRef" @approved="handleApproved" @released="handleReleased" />
    <AddCashAdvance ref="addModalRef" :suppliers="supplierList" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
// import ViewCashAdvance from './Actions/ViewCashAdvance.vue'
// import AddCashAdvance from './Actions/AddCashAdvance.vue'

// Refs for modals
const viewModalRef = ref(null)
const addModalRef = ref(null)

// State
const cashAdvances = ref([])
const supplierList = ref([])
const loading = ref(false)

const filters = reactive({
  status: '',
  dateFrom: '',
  dateTo: '',
  search: ''
})

// Stats
const stats = computed(() => {
  const total = cashAdvances.value.length
  const totalAmount = cashAdvances.value.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const pending = cashAdvances.value.filter(item => item.status === 'pending').length
  const suppliers = [...new Set(cashAdvances.value.map(item => item.supplier_id))].length
  return { total, totalAmount, pending, suppliers }
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount || 0)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-PH')
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    released: 'bg-purple-100 text-purple-800',
    paid: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    approved: 'Approved',
    released: 'Released',
    paid: 'Fully Paid'
  }
  return texts[status] || status
}

// API calls
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    cashAdvances.value = [
      { id: 1, supplier_name: 'ABC Trading', supplier_code: 'SUP001', contact_person: 'John Reyes', amount: 50000, request_date: '2024-01-15', release_date: '2024-01-20', payment_terms: '30 days', balance: 0, status: 'paid', remarks: 'Raw materials purchase' },
      { id: 2, supplier_name: 'XYZ Supply', supplier_code: 'SUP002', contact_person: 'Maria Santos', amount: 75000, request_date: '2024-02-10', release_date: null, payment_terms: '60 days', balance: 75000, status: 'pending', remarks: 'Equipment procurement' },
      { id: 3, supplier_name: 'Mega Distributors', supplier_code: 'SUP003', contact_person: 'Robert Cruz', amount: 120000, request_date: '2024-02-05', release_date: '2024-02-08', payment_terms: '90 days', balance: 80000, status: 'approved', remarks: 'Bulk order' }
    ]
    
    supplierList.value = [
      { id: 1, name: 'ABC Trading', supplier_code: 'SUP001', contact_person: 'John Reyes' },
      { id: 2, name: 'XYZ Supply', supplier_code: 'SUP002', contact_person: 'Maria Santos' },
      { id: 3, name: 'Mega Distributors', supplier_code: 'SUP003', contact_person: 'Robert Cruz' }
    ]
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

// Modal handlers
const openViewModal = (item) => {
  viewModalRef.value?.open(item)
}

const openAddModal = () => {
  addModalRef.value?.open()
}

const handleSaved = async (data) => {
  try {
    await Swal.fire({ icon: 'success', title: 'Success!', text: 'Cash advance request submitted', timer: 1500, showConfirmButton: false })
    await fetchData()
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save request', timer: 1500, showConfirmButton: false })
  }
}

const handleApproved = async (id) => {
  const item = cashAdvances.value.find(i => i.id === id)
  if (item) {
    item.status = 'approved'
    await Swal.fire({ icon: 'success', title: 'Approved!', timer: 1500, showConfirmButton: false })
    await fetchData()
  }
}

const handleReleased = async (id) => {
  const item = cashAdvances.value.find(i => i.id === id)
  if (item) {
    item.status = 'released'
    item.release_date = new Date().toISOString().split('T')[0]
    await Swal.fire({ icon: 'success', title: 'Released!', timer: 1500, showConfirmButton: false })
    await fetchData()
  }
}

const approveRequest = (id) => {
  const item = cashAdvances.value.find(i => i.id === id)
  if (item) {
    openViewModal(item)
  }
}

const releaseCash = (id) => {
  const item = cashAdvances.value.find(i => i.id === id)
  if (item) {
    openViewModal(item)
  }
}

const deleteRecord = async (id) => {
  const result = await Swal.fire({
    title: 'Delete Record?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Yes, delete'
  })
  if (result.isConfirmed) {
    cashAdvances.value = cashAdvances.value.filter(item => item.id !== id)
    await Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false })
  }
}

onMounted(() => {
  fetchData()
})
</script>