<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">PAYABLES</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Payables</li>
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
              <h5 class="text-white font-semibold text-lg">PAYABLES</h5>
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
                <!-- Date Picker and Buttons -->
                <div class="w-full flex flex-wrap items-center gap-3 mb-4">
                  <div class="w-full md:w-64">
                    <input 
                      type="date" 
                      v-model="payables.date" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      @click="list" 
                      class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Generate
                    </button>
                    <button 
                      @click="excelPayables" 
                      class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Excel (All)
                    </button>
                    <button 
                      @click="excelPaid" 
                      class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Excel (Paid)
                    </button>
                    <button 
                      @click="printReport" 
                      class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </button>
                  </div>
                </div>

                <!-- Batch Actions (Admin only) -->
                <div v-if="userPosition === 'SuperAdmin'" class="w-full flex gap-2 mb-4">
                  <button 
                    @click="batchApprove(1)" 
                    class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark Selected as Paid
                  </button>
                  <button 
                    @click="batchApprove(2)" 
                    class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Unpaid Selected
                  </button>
                </div>

                <!-- Morning Section -->
                <div class="w-full mt-4">
                  <div class="bg-red-50 p-2 rounded-t-lg border border-red-200">
                    <h4 class="text-red-600 font-semibold">Morning</h4>
                  </div>
                  <div class="overflow-x-auto border border-t-0 border-gray-200 rounded-b-lg">
                    <table class="w-full text-sm border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th v-if="userPosition === 'SuperAdmin'" class="px-4 py-3 text-center w-12">Select</th>
                          <th class="px-4 py-3 text-center">No.</th>
                          <th class="px-4 py-3 text-left">Customer Name</th>
                          <th class="px-4 py-3 text-right">Amount</th>
                          <th class="px-4 py-3 text-left">Bank</th>
                          <th class="px-4 py-3 text-left">Account Number</th>
                          <th class="px-4 py-3 text-center">Proof</th>
                          <th class="px-4 py-3 text-center">Status</th>
                          <th class="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="!morningData || morningData.length === 0">
                          <td :colspan="userPosition === 'SuperAdmin' ? 9 : 8" class="px-4 py-8 text-red-500 text-center">
                            No vouchers available
                          </td>
                        </tr>
                        <tr v-for="(voucher, index) in morningData" :key="voucher.id" class="hover:bg-gray-50">
                          <td v-if="userPosition === 'SuperAdmin'" class="px-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              v-model="voucher.selected" 
                              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
                          <td class="px-4 py-3 text-left">{{ voucher.supplier_name }}</td>
                          <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(voucher.totalAmount) }}</td>
                          <td class="px-4 py-3 text-left">{{ voucher.bankName || '-' }}</td>
                          <td class="px-4 py-3 text-left">{{ voucher.bankAccount || '-' }}</td>
                          <td class="px-4 py-3 text-center">
                            <a 
                              v-if="voucher.proof"
                              :href="voucher.proof"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-800 underline"
                            >
                              Proof
                            </a>
                            <span v-else class="text-gray-400">No Proof</span>
                          </td>
                          <td class="px-4 py-3 text-center" v-html="getStatusLabel(voucher.status)"></td>
                          <td class="px-4 py-3 text-center">
                            <div class="flex justify-center space-x-1">
                              <button 
                                :disabled="voucher.status == 4"
                                @click="markAsPaid(voucher.id)"
                                class="p-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Mark Voucher as Paid"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <button 
                                v-if="voucher.status == 4"
                                @click="undoPayment(voucher.id)"
                                class="p-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                                title="Undo Payment"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Afternoon Section -->
                <div class="w-full mt-6">
                  <div class="bg-orange-50 p-2 rounded-t-lg border border-orange-200">
                    <h4 class="text-orange-600 font-semibold">Afternoon</h4>
                  </div>
                  <div class="overflow-x-auto border border-t-0 border-gray-200 rounded-b-lg">
                    <table class="w-full text-sm border-collapse">
                      <thead class="bg-gray-100">
                        <tr>
                          <th v-if="userPosition === 'SuperAdmin'" class="px-4 py-3 text-center w-12">Select</th>
                          <th class="px-4 py-3 text-center">No.</th>
                          <th class="px-4 py-3 text-left">Customer Name</th>
                          <th class="px-4 py-3 text-right">Amount</th>
                          <th class="px-4 py-3 text-left">Bank</th>
                          <th class="px-4 py-3 text-left">Account Number</th>
                          <th class="px-4 py-3 text-center">Proof</th>
                          <th class="px-4 py-3 text-center">Status</th>
                          <th class="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-if="!afternoonData || afternoonData.length === 0">
                          <td :colspan="userPosition === 'SuperAdmin' ? 9 : 8" class="px-4 py-8 text-red-500 text-center">
                            No vouchers available
                          </td>
                        </tr>
                        <tr v-for="(voucher, index) in afternoonData" :key="voucher.id" class="hover:bg-gray-50">
                          <td v-if="userPosition === 'SuperAdmin'" class="px-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              v-model="voucher.selected" 
                              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
                          <td class="px-4 py-3 text-left">{{ voucher.supplier_name }}</td>
                          <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(voucher.totalAmount) }}</td>
                          <td class="px-4 py-3 text-left">{{ voucher.bankName || '-' }}</td>
                          <td class="px-4 py-3 text-left">{{ voucher.bankAccount || '-' }}</td>
                          <td class="px-4 py-3 text-center">
                            <a 
                              v-if="voucher.proof"
                              :href="voucher.proof"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-800 underline"
                            >
                              Proof
                            </a>
                            <span v-else class="text-gray-400">No Proof</span>
                          </td>
                          <td class="px-4 py-3 text-center" v-html="getStatusLabel(voucher.status)"></td>
                          <td class="px-4 py-3 text-center">
                            <div class="flex justify-center space-x-1">
                              <button 
                                :disabled="voucher.status == 4"
                                @click="markAsPaid(voucher.id)"
                                class="p-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Mark Voucher as Paid"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <button 
                                v-if="voucher.status == 4"
                                @click="undoPayment(voucher.id)"
                                class="p-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                                title="Undo Payment"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
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

// Props
const props = defineProps({
  userPosition: {
    type: String,
    default: ''
  }
})

// State
const payables = ref({
  date: moment().format('YYYY-MM-DD')
})
const morningData = ref([])
const afternoonData = ref([])

// Methods
const maximize = () => {}
const collapse = () => {}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '₱0.00'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const getStatusLabel = (status) => {
  switch(status) {
    case 1:
      return '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Unpaid</span>'
    case 2:
      return '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Processing</span>'
    case 3:
      return '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">For Payment</span>'
    case 4:
      return '<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Paid</span>'
    default:
      return '<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>'
  }
}

const list = async () => {
  if (!payables.value.date) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/vouchers/payables-list', {
      date: payables.value.date
    })
    
    if (response.data && !response.data.error) {
      const data = response.data.data
      
      // Map morning data with selected property
      morningData.value = (data.morning || []).map(v => ({
        ...v,
        selected: false
      }))
      
      // Map afternoon data with selected property
      afternoonData.value = (data.afternoon || []).map(v => ({
        ...v,
        selected: false
      }))
    }
  } catch (error) {
    console.error('Failed to fetch payables:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load payables',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const markAsPaid = async (voucherId) => {
  const result = await Swal.fire({
    title: 'Mark as Paid?',
    text: 'Do you want to mark this voucher as paid?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, mark as paid',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/vouchers/mark-paid', {
        voucher_id: voucherId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Voucher marked as paid',
          timer: 1500,
          showConfirmButton: false
        })
        await list()
      }
    } catch (error) {
      console.error('Failed to mark as paid:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to mark voucher as paid',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const undoPayment = async (voucherId) => {
  const result = await Swal.fire({
    title: 'Undo Payment?',
    text: 'Do you want to undo this payment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, undo payment',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/vouchers/payable-list', {
        voucher_id: voucherId
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Payment undone successfully',
          timer: 1500,
          showConfirmButton: false
        })
        await list()
      }
    } catch (error) {
      console.error('Failed to undo payment:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to undo payment',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const batchApprove = async (type) => {
  // type 1 = mark as paid, type 2 = mark as unpaid
  const selectedMorning = morningData.value.filter(v => v.selected)
  const selectedAfternoon = afternoonData.value.filter(v => v.selected)
  const selected = [...selectedMorning, ...selectedAfternoon]
  
  if (selected.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select at least one voucher',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  const actionText = type === 1 ? 'mark as paid' : 'mark as unpaid'
  const confirmText = type === 1 ? 'Yes, mark as paid' : 'Yes, mark as unpaid'
  
  const result = await Swal.fire({
    title: `Batch ${actionText}?`,
    text: `Do you want to ${actionText} ${selected.length} selected voucher(s)?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: type === 1 ? '#10b981' : '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/vouchers/batch-update', {
        voucher_ids: selected.map(v => v.id),
        action: type // 1 = paid, 2 = unpaid
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${selected.length} voucher(s) ${actionText} successfully`,
          timer: 1500,
          showConfirmButton: false
        })
        await list()
      }
    } catch (error) {
      console.error('Failed to batch update:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update vouchers',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

const excelPayables = () => {
  if (!payables.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }
  window.open(`/payables/excel-all?date=${payables.value.date}`, '_blank')
}

const excelPaid = () => {
  if (!payables.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }
  window.open(`/payables/excel-paid?date=${payables.value.date}`, '_blank')
}

const printReport = () => {
  if (!payables.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }
  window.print()
}

// Initialize
onMounted(() => {
  list();
})
</script>

<style scoped>
@media print {
  .content-header,
  .bg-gradient-to-r,
  button {
    display: none;
  }
}
</style>