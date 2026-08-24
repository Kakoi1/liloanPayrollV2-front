<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="w-full sm:w-auto">
            <!-- <h1 class="text-2xl font-bold text-gray-800 m-0">Daily Item Inventory</h1> -->
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
                <div class="flex gap-2 flex-wrap">
                  <select
                    v-model="dateType"
                    class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded"
                    @change="handleTypeChange"
                  >
                    <option :value="2">Daily</option>
                    <option :value="4">Monthly</option>
                  </select>

                  <input
                    v-if="dateType == 2"
                    type="date"
                    v-model="search.date"
                    class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded"
                    @change="handleDateChange"
                  />

                  <input
                    v-if="dateType == 4"
                    type="month"
                    v-model="search.date"
                    class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded"
                    @change="handleDateChange"
                  />
                  
                  <!-- <button @click="list" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <i class="fa-solid fa-magnifying-glass mr-2"></i> Search
                  </button> -->
                  <button @click="excel" class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
                    <i class="fa fa-file-excel mr-2"></i> Generate Excel
                  </button>
                  <button @click="excel2" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <i class="fa fa-file-excel mr-2"></i> Generate Excel V2
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
                  <!-- <div>
                    <span class="font-semibold text-gray-700">Report Month:</span>
                    <span class="ml-2 text-gray-600">{{ formatMonth(selectedMonth) }}</span>
                  </div> -->  
                  <!-- <div>
                    <span class="font-semibold text-gray-700">Total Dates:</span>
                    <span class="ml-2 text-gray-600">{{ Object.keys(groupedData).length }}</span>
                  </div> -->
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
                    <tr v-for="(dateData, date) in sortedGroupedData" :key="date" class="hover:bg-gray-50">
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
const dateType = ref(2); // Default to Daily

// Search object
const search = ref({
  date: '',
  type: 2
});

// Set default to current month
const selectedMonth = ref('');

const inventoryResponse = ref({
  headers: [],
  data: []
});

// Computed
const dynamicHeaders = computed(() => inventoryResponse.value.headers || []);
const inventoryData = computed(() => inventoryResponse.value.data || []);

// Sort dates in ascending order
const sortedGroupedData = computed(() => {
  const grouped = groupedData.value;
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    return new Date(a) - new Date(b);
  });
  
  const sorted = {};
  sortedKeys.forEach(key => {
    sorted[key] = grouped[key];
  });
  return sorted;
});

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

const list = async () => {
  // Validate date based on type
  if (!search.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: dateType.value === 2 ? 'Please select a date' : 'Please select a month',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  
  // Extract month from the selected date for the API
  const dateParts = search.value.date.split('-');
  if (dateParts.length >= 2) {
    selectedMonth.value = `${dateParts[0]}-${dateParts[1]}`;
  }
  
  loading.value = true;
  try {
    const response = await api.post('/vouchers/daily-inventory', {
      month: selectedMonth.value,
      date_type: dateType.value,
      date: search.value.date // This will be "2026-08-24" for daily or "2026-08" for monthly
    });
    if (response.data.error === false) {
      itemList.value = response.data.items || [];
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

const handleTypeChange = () => {
  // Reset date when type changes and set appropriate default
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  
  if (dateType.value === 2) {
    // Daily - set to today
    const day = String(now.getDate()).padStart(2, '0');
    search.value.date = `${year}-${month}-${day}`;
  } else if (dateType.value === 4) {
    // Monthly - set to current month
    search.value.date = `${year}-${month}`;
  }
  
  // Auto-load based on new type
  list();
};

const handleDateChange = () => {
  list();
};

const excel = async () => {  
  if (!search.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  
  window.open(`${VUE_APP_API_URL}vouchers/daily-inventory-excel-download/${search.value.date}/${dateType.value}`, '_blank');
};

const excel2 = async () => {  
  if (!search.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  
  window.open(`${VUE_APP_API_URL}vouchers/daily-inventory-excel-download2/${search.value.date}/${dateType.value}`, '_blank');
};

const printReport = async () => {
  if (!search.value.date) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a date first',
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
      date: search.value.date,
      date_type: dateType.value
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
  // Set default date to today for Daily view
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, '0');
  
  // Default to daily view with today's date
  dateType.value = 2;
  search.value.date = `${year}-${month}-${day}`;
  
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