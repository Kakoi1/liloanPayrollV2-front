<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Pakyaw Task Report</h1>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From:</label>
          <input 
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="Filter.dateFrom"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To:</label>
          <input 
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="Filter.dateTo"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Employee:</label>
          <select 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="Filter.employeeId"
          >
            <option value="0">All Employees</option>
            <option v-for="emp in employee_data" :key="emp.id" :value="emp.id">
              {{ emp.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Task:</label>
          <select 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="Filter.taskId"
          >
            <option value="0">All Tasks</option>
            <option v-for="task in task_data" :key="task.id" :value="task.id">
              {{ task.task_name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="flex gap-2 justify-end">
        <button @click="filter" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
          🔍 Search
        </button>

        <a
            target="_blank"
            :href="`${VUE_APP_API_URL}reports/pakyaw-task-report-excel-download/${Filter.dateFrom}/${Filter.dateTo}/${Filter.employeeId}/${Filter.taskId ?? 0}`"
            class="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200"
        >
            <i class="fa fa-file-excel"></i>
            <span>Generate as Excel</span>
        </a>

        <button @click="printReport" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition">
          🖨️ Print
        </button>
        <button @click="reset" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition">
          🔄 Reload
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-600">Loading...</div>
    </div>

    <!-- Report Content -->
    <div v-else id="print" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="(d, index) in data" :key="index" class="bg-white rounded-lg shadow-md p-4">
        <!-- Employee Info -->
        <div class="mb-4">
          <table class="w-full text-sm">
            <tr class="border-b">
              <td class="py-2 font-semibold w-1/3">Employee:</td>
              <td class="py-2">{{ d.fullName || '-' }}</td>
              <td class="py-2 font-semibold">ID #:</td>
              <td class="py-2">{{ d.employeeId || '-' }}</td>
            </tr>
            <tr>
              <td class="py-2 font-semibold">Position:</td>
              <td class="py-2">{{ d.position || '-' }}</td>
              <td class="py-2 font-semibold">Period:</td>
              <td class="py-2">{{ d.datePeriod || '-' }}</td>
            </tr>
          </table>
        </div>

        <!-- Tasks Table -->
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-2 py-2 text-left">Date</th>
              <th class="px-2 py-2 text-left">Task</th>
              <th class="px-2 py-2 text-left">Class</th>
              <th class="px-2 py-2 text-left">Hours/Weight</th>
               <th class="px-2 py-2 text-left">Rate</th>
              <th class="px-2 py-2 text-left">Total</th>
              <!-- <th class="px-2 py-2 text-left">Remarks</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-if="!d.tasks || d.tasks.length === 0">
              <td colspan="5" class="text-center py-4 text-gray-500">No data available</td>
            </tr>
            <tr v-for="(task, idx) in d.tasks" :key="idx" class="border-b">
              <td class="px-2 py-2">{{ task.date || '-' }}</td>
              <td class="px-2 py-2">{{ task.task_name || '-' }}</td>
              <td class="px-2 py-2">{{ task.name || '-' }}</td>
              <td class="px-2 py-2">{{ task.netKgPerEmp || '0' }} {{ task.unitAbbre }}</td>
              <td class="px-2 py-2">{{ task.rate || '0' }}</td>
              <td class="px-2 py-2 font-semibold text-green-600">{{ formatNumber(task.total) }}</td>
              <!-- <td class="px-2 py-2">{{ task.remarks || '-' }}</td> -->
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td colspan="5" class="px-2 py-2 text-right font-semibold">Total:</td>
              <td class="px-2 py-2 font-bold text-green-700">{{ formatNumber(d.totalIncome) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <!-- Signature -->
        <!-- <div class="mt-6 text-right">
          <div class="border-t-2 border-gray-400 inline-block px-4 pt-1">
            <small>Signature {{ d.employee?.name || '' }}</small>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/Js/Services/axios';
import { VUE_APP_API_URL } from '@/Views/Utility/Global';
import { handleApiError } from '@/Views/Utility/Helper'

// State
const loading = ref(false);
const data = ref([]);
const Filter = ref({
  dateFrom: '',
  dateTo: '',
  employeeId: 0,
  taskId: 0
});
const employee_data = ref([]);
const task_data = ref([]);

// Format number
const formatNumber = (value) => {
  if (!value && value !== 0) return '0.00';
  return parseFloat(value).toFixed(2);
};

// Fetch employees
const fetchEmployees = async () => {
  try {
    const response = await api.post('/employee/active-list-dropdown');
    if (response.data && response.data.error === false) {
      employee_data.value = response.data.employee || [];
    }
  } catch (error) {
    handleApiError(error);
    console.error('Error fetching employees:', error);
  }
};

// Fetch tasks
const fetchTasks = async () => {
  try {
    const response = await api.get('/payroll/list-task');
    if (response.data && response.data.error === false) {
      task_data.value = response.data.task || [];
    }
  } catch (error) {
    handleApiError(error);
    console.error('Error fetching tasks:', error);
  }
};

// Fetch data
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await api.post('/reports/pakyaw-task-report', Filter.value);
    if (response.data && response.data.error === false) {
      data.value = response.data.data || [];
    } else {
      data.value = [];
    }
  } catch (error) {
    handleApiError(error);
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// Filter
const filter = async () => {
  await fetchData();
};

// Reset
const reset = async () => {
  Filter.value = { 
    dateFrom: '', 
    dateTo: '', 
    employeeId: 0, 
    taskId: '' 
  };
  await fetchData();
};

// Excel export
const excel = async () => {
  try {
    const response = await api.post('/reports/pakyaw-task-report/excel', Filter.value, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pakyaw_task_report.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleApiError(error);
    console.error('Error:', error);
  }
};

// Print report
const printReport = () => {
  const printContent = document.getElementById('print').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Pakyaw Task Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f3f4f6; }
          .border-b { border-bottom: 1px solid #ddd; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .mb-4 { margin-bottom: 16px; }
          .mt-6 { margin-top: 24px; }
          .inline-block { display: inline-block; }
          .px-4 { padding-left: 16px; padding-right: 16px; }
          .pt-1 { padding-top: 4px; }
          .border-t-2 { border-top-width: 2px; }
          .border-gray-400 { border-color: #9ca3af; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchEmployees(),
    fetchTasks(),
    fetchData()
  ]);
});
</script>