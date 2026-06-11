<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="w-full sm:w-auto">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Combined Item Inventory</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-md mb-6">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg px-4 py-3 flex justify-between items-center">
              <h5 class="text-white font-semibold text-uppercase m-0">Combined Item Inventory</h5>
              <div class="flex space-x-2">
                <button type="button" class="text-white hover:text-gray-200 transition" @click="maximizeCard">
                  <i class="fas fa-expand"></i>
                </button>
                <button type="button" class="text-white hover:text-gray-200 transition" @click="collapseCard">
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-4" :class="{ 'hidden': isCollapsed }">
              <div class="flex flex-wrap gap-4 mb-4 items-end">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
                  <input 
                    type="date" 
                    v-model="dateRange.from" 
                    class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
                  <input 
                    type="date" 
                    v-model="dateRange.to" 
                    class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="flex gap-2">
                  <button @click="list" class="inline-flex items-center px-4 py-2 bg-maroon hover:bg-maroon-dark text-white rounded-md transition">
                    <i class="fa fa-file-alt mr-2"></i> Generate Report
                  </button>
                  <button @click="excel" class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
                    <i class="fa fa-file-excel mr-2"></i> Generate Excel
                  </button>
                  <button @click="printReport" class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition">
                    <i class="fa fa-print mr-2"></i> Print Report
                  </button>
                </div>
              </div>
              
              <!-- Date Range Display -->
              <div v-if="dateRange.from && dateRange.to && !loading && dataHeaders.length > 0" class="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-semibold text-gray-700">Report Period:</span>
                    <span class="ml-2 text-gray-600">{{ formatDate(dateRange.from) }} - {{ formatDate(dateRange.to) }}</span>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-12">
                <div class="text-gray-600">Loading...</div>
              </div>

              <!-- Combined Inventory Table -->
              <div v-else class="overflow-x-auto mt-4">
                <h6 class="font-semibold text-gray-800 mb-2">Combined Inventory Summary</h6>
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="text-center text-md p-2 border border-gray-300 bg-gray-100 min-w-[120px]">
                        Date
                      </th>
                      <th 
                        v-for="(header, index) in dataHeaders" 
                        :key="index" 
                        class="text-center text-md p-2 border border-gray-300 bg-gray-100 min-w-[120px]"
                      >
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!groupedData || Object.keys(groupedData).length === 0">
                      <td :colspan="dataHeaders.length + 1" class="text-center text-red-600 font-bold text-md p-4 border border-gray-300">
                        No items found.
                      </td>
                    </tr>
                    <!-- Each date becomes one row with values spread across headers -->
                    <tr v-for="(dateData, date) in groupedData" :key="date" class="hover:bg-gray-50">
                      <td class="text-md p-2 border border-gray-300 font-semibold">
                        {{ date }}
                      </td>
                      <td 
                        v-for="(header, headerIndex) in dataHeaders" 
                        :key="headerIndex" 
                        class="text-md p-2 border border-gray-300 text-right"
                        :class="[dateData[header] && dateData[header] > 0 ? 'text-green-600' : 'text-red-400']"
                      >
                        {{ formatNumber(dateData[header] || 0) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-100 font-bold">
                      <td class="text-md p-2 border border-gray-300 text-center">
                        Total
                      </td>
                      <td 
                        v-for="(header, headerIndex) in dataHeaders" 
                        :key="headerIndex" 
                        class="text-md p-2 border border-gray-300 text-right text-red-600"
                      >
                        {{ formatNumber(getColumnTotal(header)) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- Item Transactions Table -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg px-4 py-3">
              <h5 class="text-white font-semibold text-uppercase m-0">Item Transactions</h5>
            </div>
            <div class="p-4">
              <div v-if="loading" class="text-center py-12">
                <div class="text-gray-600">Loading...</div>
              </div>
              <div v-else class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="text-center text-md p-2 border border-gray-300">ID</th>
                      <th class="text-center text-md p-2 border border-gray-300">Item Name</th>
                      <th class="text-center text-md p-2 border border-gray-300">Amount</th>
                      <th class="text-center text-md p-2 border border-gray-300">Date</th>
                      <th class="text-center text-md p-2 border border-gray-300">Reference ID</th>
                      <th class="text-center text-md p-2 border border-gray-300">Transaction Type</th>
                      <th class="text-center text-md p-2 border border-gray-300">Task ID</th>
                      <th class="text-center text-md p-2 border border-gray-300">Task Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="rawData.length === 0">
                      <td :colspan="8" class="text-center text-red-600 font-bold text-md p-4 border border-gray-300">
                        No transaction records found.
                      </td>
                    </tr>
                    <tr v-for="item in rawData" :key="item.id" class="hover:bg-gray-50">
                      <td class="text-md p-2 border border-gray-300 text-center">{{ item.id }}</td>
                      <td class="text-md p-2 border border-gray-300">{{ item.name }}</td>
                      <td class="text-md p-2 border border-gray-300 text-right">{{ formatNumber(item.amount) }}</td>
                      <td class="text-md p-2 border border-gray-300 text-center">{{ item.date }}</td>
                      <td class="text-md p-2 border border-gray-300 text-center">{{ item.referenceId }}</td>
                      <td class="text-md p-2 border border-gray-300 text-center">
                        <span :class="item.transactionType === 1 ? 'text-green-600' : 'text-red-600'">
                          {{ getTransactionTypeText(item.transactionType) }}
                        </span>
                      </td>
                      <td class="text-md p-2 border border-gray-300 text-center">{{ item.taskId }}</td>
                      <td class="text-md p-2 border border-gray-300">{{ item.task_name }}</td>
                    </tr>
                  </tbody>
                  <tfoot v-if="rawData.length > 0">
                    <tr class="bg-gray-100 font-bold">
                      <td colspan="2" class="text-md p-2 border border-gray-300 text-right">Total Amount:</td>
                      <td class="text-md p-2 border border-gray-300 text-right text-red-600">
                        {{ formatNumber(getTransactionsTotal()) }}
                      </td>
                      <td colspan="5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/Js/Services/axios';
import { handleApiError } from '@/Views/Utility/Helper.js';

// State
const loading = ref(false);
const isCollapsed = ref(false);
const isMaximized = ref(false);

const dateRange = ref({
  from: new Date().toISOString().slice(0, 10),
  to: new Date().toISOString().slice(0, 10)
});

// Store the response data
const dataHeaders = ref([]);
const rawData = ref([]);
const itemInventory = ref([]);

// Group data by date, with each header's value
const groupedData = computed(() => {
  const grouped = {};
  
  rawData.value.forEach(item => {
    const date = item.date || 'Unknown';
    const header = item.name;
    const value = parseFloat(item.amount) || 0;
    
    if (!grouped[date]) {
      grouped[date] = {};
    }
    
    // SUM the values instead of overwriting
    if (grouped[date][header]) {
      grouped[date][header] += value;
    } else {
      grouped[date][header] = value;
    }
  });
  
  return grouped;
});

// Get column total for a specific header across all dates
const getColumnTotal = (header) => {
  let total = 0;
  Object.values(groupedData.value).forEach(dateData => {
    if (dateData[header]) {
      total += dateData[header];
    }
  });
  return total;
};

// Get total of all transactions
const getTransactionsTotal = () => {
  let total = 0;
  rawData.value.forEach(item => {
    total += parseFloat(item.amount) || 0;
  });
  return total;
};

// Get transaction type text
const getTransactionTypeText = (type) => {
  switch(type) {
    case 1:
      return 'In';
    case 2:
      return 'Out';
    case 3:
      return 'Return';
    default:
      return 'Unknown';
  }
};

// Methods
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00';
  return parseFloat(value).toFixed(2);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const list = async () => {
  if (!dateRange.value.from || !dateRange.value.to) {
    alert('Please select both from and to dates');
    return;
  }
  
  loading.value = true;
  try {
    const response = await api.post('/vouchers/combined-inventory', {
      dateFrom: dateRange.value.from,
      dateTo: dateRange.value.to
    });
    
    if (response.data.error === false) {
      // Update with new response structure
      dataHeaders.value = response.data.data_headers || [];
      rawData.value = response.data.data || [];
      itemInventory.value = response.data.item_inventory || [];
    } else {
      alert(response.data.message || 'Failed to load data');
    }
  } catch (error) {
    console.error('Error:', error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const excel = async () => {
  if (!dateRange.value.from || !dateRange.value.to) {
    alert('Please select both from and to dates');
    return;
  }
  
  try {
    const response = await api.post('/inventory/daily-excel', {
      dateFrom: dateRange.value.from,
      dateTo: dateRange.value.to
    }, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `combined_inventory_${dateRange.value.from}_to_${dateRange.value.to}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate Excel');
  }
};

const printReport = () => {
  const printContent = document.querySelector('.bg-white.rounded-lg.shadow-md').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Combined Item Inventory - ${dateRange.value.from} to ${dateRange.value.to}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; text-align: right; border: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .text-red { color: #dc3545; }
          .text-green { color: #28a745; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .mb-4 { margin-bottom: 1rem; }
          .p-3 { padding: 0.75rem; }
          .bg-gray-50 { background-color: #f9fafb; }
          .border { border: 1px solid #e5e7eb; }
          .rounded-md { border-radius: 0.375rem; }
          .mb-6 { margin-bottom: 1.5rem; }
        </style>
      </head>
      <body>
        <h2>Combined Item Inventory Report</h2>
        <p>Period: ${formatDate(dateRange.value.from)} - ${formatDate(dateRange.value.to)}</p>
        ${printContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
};

const maximizeCard = () => {
  const card = document.querySelector('.bg-white.rounded-lg.shadow-md');
  if (isMaximized.value) {
    card.classList.remove('fixed', 'inset-0', 'z-50', 'm-0', 'rounded-none');
    card.classList.add('m-4');
    isMaximized.value = false;
  } else {
    card.classList.add('fixed', 'inset-0', 'z-50', 'm-0', 'rounded-none');
    card.classList.remove('m-4');
    isMaximized.value = true;
  }
};

const collapseCard = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Lifecycle
onMounted(() => {
  list();
});
</script>

<style scoped>
.content-wrapper {
  @apply bg-gray-100 min-h-screen;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '/';
  @apply mx-2 text-gray-400;
}

.text-uppercase {
  text-transform: uppercase;
}

.bg-maroon {
  background-color: #c0392b;
}

.bg-maroon:hover {
  background-color: #a93226;
}

@media print {
  .content-wrapper {
    @apply bg-white;
  }
  
  button {
    display: none;
  }
  
  .bg-gradient-to-r {
    background: #2563eb !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>