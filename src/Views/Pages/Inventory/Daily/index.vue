<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="w-full sm:w-auto">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Daily Item Inventory</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg px-4 py-3 flex justify-between items-center">
              <h5 class="text-white font-semibold text-uppercase m-0">Daily Item Inventory</h5>
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
                  <label class="block text-sm font-medium text-gray-700 mb-1">Select Month:</label>
                  <input 
                    type="month" 
                    v-model="selectedMonth" 
                    class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @change="list"
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

              <ManualItemInput 
                v-model="showManualModal"
                :items="itemList"
                @saved="list()"
              />

              <!-- Month Display -->
              <div v-if="selectedMonth && !loading && Object.keys(groupedData).length > 0" class="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-semibold text-gray-700">Report Month:</span>
                    <span class="ml-2 text-gray-600">{{ formatMonth(selectedMonth) }}</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">Total Dates:</span>
                    <span class="ml-2 text-gray-600">{{ Object.keys(groupedData).length }}</span>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-12">
                <div class="text-gray-600">Loading...</div>
              </div>

              <!-- Table View with Items Under Correct Headers -->
              <div v-else class="overflow-x-auto mt-4">
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-100">
                      <th 
                        v-for="(header, index) in dynamicHeaders" 
                        :key="index" 
                        class="text-center text-md p-2 border border-gray-300 bg-gray-100 min-w-[120px]"
                      >
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!groupedData || Object.keys(groupedData).length === 0">
                      <td :colspan="dynamicHeaders.length" class="text-center text-red-600 font-bold text-md p-4 border border-gray-300">
                        No items found.
                      </td>
                    </tr>
                    <!-- Each date becomes one row with values spread across headers -->
                    <tr v-for="(dateData, date) in groupedData" :key="date" class="hover:bg-gray-50">
                      <td 
                        v-for="(header, headerIndex) in dynamicHeaders" 
                        :key="headerIndex" 
                        class="text-md p-2 border border-gray-300 text-right"
                        :class="[dateData[header] ? 'text-green-600' : 'text-red-400']"
                        :title="getTooltipText(date, header, dateData[header])"
                      >
                        {{ formatNumber(dateData[header] || 0) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-100 font-bold">
                      <td 
                        v-for="(header, headerIndex) in dynamicHeaders" 
                        :key="headerIndex" 
                        class="text-md p-2 border border-gray-300 text-right text-red-600"
                      >
                        TOTAL: {{ formatNumber(getColumnTotal(header)) }}
                      </td>
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
import ManualItemInput from './Actions/add.vue';
import { handleApiError } from '@/Views/Utility/Helper.js';
import { VUE_APP_API_URL } from '@/Views/Utility/Global.js';
import Swal from 'sweetalert2';

// State
const loading = ref(false);
const isCollapsed = ref(false);
const isMaximized = ref(false);
const itemList = ref([]);
const showManualModal = ref(false);

// Set default to current month
const selectedMonth = ref(new Date().toISOString().slice(0, 7));

const inventoryResponse = ref({
  headers: [],
  data: []
});

// Computed
const dynamicHeaders = computed(() => inventoryResponse.value.headers || []);
const inventoryData = computed(() => inventoryResponse.value.data || []);

// Group data by date, with each header's value
const groupedData = computed(() => {
  const grouped = {};
  
  inventoryData.value.forEach(item => {
    // Skip items without title (like the first object with only date)
    if (!item.title) return;
    
    const date = item.date || 'Unknown';
    const header = item.title;
    const value = parseFloat(item.value) || 0;
    
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

// Get tooltip text showing the formatted date
const getTooltipText = (date, header, value) => {
  if (!value || value === 0) {
    return `${header}: No entries`;
  }
  
  // Find the formatted date from the original data
  const originalItem = inventoryData.value.find(item => 
    item.date === date && item.title === header
  );
  
  const formatedDate = originalItem?.formatedDate || date;
  
  return `${formatedDate}`;
};

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

const formatMonth = (monthString) => {
  if (!monthString) return '';
  const [year, month] = monthString.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const list = async () => {
  if (!selectedMonth.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a month',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  
  loading.value = true;
  try {
    const response = await api.post('/vouchers/daily-inventory', {
      month: selectedMonth.value // Send just the month
    });
    if (response.data.error === false) {
      itemList.value = response.data.items;
      inventoryResponse.value = {
        headers: response.data.headers || [],
        data: response.data.data || []
      };
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.message || 'Failed to load data'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const excel = async () => {  
  if (!selectedMonth.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a month first',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  
  window.open(`${VUE_APP_API_URL}vouchers/daily-inventory-excel-download/${selectedMonth.value}`, '_blank');
};

const printReport = async () => {
  if (!selectedMonth.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a month first',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  
  try {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    const response = await api.post('/vouchers/daily-inventory-pdf-download', {
      month: selectedMonth.value // Send just the month
    });

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
        showConfirmButton: true
      });

      const pdf = atob(response.data.pdf);
      const bytes = new Uint8Array(pdf.length);
      for (let i = 0; i < pdf.length; i++) {
        bytes[i] = pdf.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
    }
  } catch (error) {
    console.error('Failed to fetch team details:', error);
    handleApiError(error);
  }
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