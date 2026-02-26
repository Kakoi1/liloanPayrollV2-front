<!-- PayrollModal.vue -->
<template>
  <!-- Button to open modal -->
  <button 
    @click="openModal"
    class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
  >
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    Payroll Manager
  </button>

  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <!-- Backdrop with blur effect -->
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

    <!-- Modal Content -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-7xl bg-white rounded-xl shadow-2xl transform transition-all">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h3 class="text-white font-semibold text-lg flex items-center">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Payroll Manager - {{ selectedEmployee?.full_name || 'Employee' }}
          </h3>
          <button @click="closeModal" class="text-white hover:text-gray-200 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body with improved spacing and design -->
        <div class="p-6 max-h-[80vh] overflow-y-auto bg-gray-50">
          <!-- Search Period Card -->
          <div class="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h4 class="font-semibold text-gray-700 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              SEARCH PAYROLL PERIOD
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div class="col-span-1">
                <label class="block text-xs text-gray-500 mb-1">From Date</label>
                <input type="date" v-model="Search.from" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div class="col-span-1">
                <label class="block text-xs text-gray-500 mb-1">To Date</label>
                <input type="date" v-model="Search.to" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div class="col-span-2 flex items-end">
                <button @click="checkTask" class="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Payroll
                </button>
              </div>
            </div>
          </div>

          <!-- Employee Info Cards with improved design -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
              <div class="flex items-center">
                <div class="bg-blue-600 p-2 rounded-lg mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <label class="text-xs text-blue-700 font-medium">EMPLOYEE NAME</label>
                  <p class="text-sm font-semibold text-gray-800">{{ selectedEmployee?.fullName || 'N/A' }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
              <div class="flex items-center">
                <div class="bg-green-600 p-2 rounded-lg mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <label class="text-xs text-green-700 font-medium">EMPLOYEE ID</label>
                  <p class="text-sm font-semibold text-gray-800">{{ selectedEmployee?.employeeId || 'N/A' }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
              <div class="flex items-center">
                <div class="bg-purple-600 p-2 rounded-lg mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <label class="text-xs text-purple-700 font-medium">POSITION</label>
                  <p class="text-sm font-semibold text-gray-800">{{ selectedEmployee?.position || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Daily Tasks Section with improved design -->
          <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 flex justify-between items-center">
              <h4 class="text-white font-semibold flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Daily Task Compilation
              </h4>
              <span class="text-xs text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {{ Task.length }} Tasks
              </span>
            </div>
            
            <!-- Task Actions -->
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
              <span v-if="draftMSG" class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{{ draftMSG }}</span>
              <div class="flex gap-2 ml-auto">
                <button @click="weeklytask" class="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors duration-200 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload
                </button>
                <button @click="addRowTask" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </button>
              </div>
            </div>

            <!-- Tasks Table with improved styling -->
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">S/P</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Task</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rate</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Hours</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tarima</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ded</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Remarks</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <!-- Tasks -->
                  <tr v-for="(task, i) in Task" :key="task.id || 'draft-'+i" :class="task.is_draft ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'">
                    <td class="px-3 py-2">
                        <span v-if="task.is_draft" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                        </span>
                        <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Saved
                        </span>
                    </td>
                    <td class="px-3 py-2"><input type="date" v-model="task.date" class="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"></td>
                    <td class="px-3 py-2">
                      <select v-model="task.day_type" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                        <option value="regular">Reg</option>
                        <option value="special">Spec</option>
                        <option value="holiday">Hol</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                        <select 
                            v-model="task.sp" 
                            :disabled="!task.is_draft"
                            class="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                            :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft }"
                        >
                            <option value="1">Solo</option>
                            <option value="2">Pair</option>
                        </select>
                    </td>
                    <td class="px-3 py-2">
                        <select v-model="task.taskId" @change="fetchClass(task.taskId, i)" :disabled="!task.is_draft" :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft }" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                            <option value="">--</option>
                            <option v-for="cd in tdrop" :value="cd.id" :key="cd.id">{{ cd.task_name }}</option>
                        </select>
                    </td>
                    <td class="px-3 py-2">
                        <select v-model="task.posId" :disabled="!task.is_draft" :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft }" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                            <option value="">--</option>
                            <!-- Use task.classOptions if available, otherwise fallback to shared cdrop -->
                            <option 
                            v-for="cd in task.classOptions || cdrop" 
                            :value="cd.value" 
                            :key="cd.value"
                            >
                            {{ cd.label }}
                            </option>
                        </select>
                    </td>
                    <td class="px-3 py-2"><input type="text" v-model="task.rate"  class="w-16 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="number" v-model="task.hour" class="w-16 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="number" v-model="task.tarima" class="w-16 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="number" v-model="task.deduction" class="w-16 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="number" v-model="task.total" readonly class="w-16 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="text" v-model="task.remarks" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button @click="saveTask(i)" class="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150" title="Save">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button @click="confirmDelete(i)" class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150" title="Delete">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- No Tasks Message -->
                  <tr v-if="Task.length === 0">
                    <td colspan="13" class="px-3 py-8 text-center text-gray-500">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p class="text-sm">No tasks added yet. Click "New Task" to add one.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Gross Income -->
            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
              <div class="w-64 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Gross Income:</span>
                <input type="text" v-model="Dtotal" readonly class="w-28 px-2 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
              </div>
            </div>
          </div>

          <!-- Compensations Section with improved design -->
          <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center">
              <h4 class="text-white font-semibold flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Compensations & Deductions
              </h4>
              <span class="text-xs text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {{ Deduction.length }} Items
              </span>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
              <span v-if="miscMSG" class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{{ miscMSG }}</span>
              <div class="flex gap-2 ml-auto">
                <select v-model="Config.batch" class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Batch</option>
                  <option v-for="b in 5" :key="b">Batch {{ b }}</option>
                </select>
                <button @click="miscdraft" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>

            <!-- Compensations Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Year</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Month</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Batch</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Remarks</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(ded, i) in Deduction" :key="ded.id || 'ded-'+i" :class="ded.is_draft ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'">
                    <td class="px-3 py-2">
                      <span v-if="ded.is_draft" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Saved
                      </span>
                    </td>
                    <td class="px-3 py-2"><input type="text" v-model="ded.misc_year" placeholder="Year" class="w-16 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2">
                      <select v-model="ded.misc_month" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs">
                        <option value="">Month</option>
                        <option v-for="m in months" :key="m">{{ m }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="ded.misc_week" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs">
                        <option value="">Batch</option>
                        <option v-for="b in 5" :key="b">Batch {{ b }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="ded.misc_type" class="w-24 px-2 py-1 border border-gray-300 rounded text-xs">
                        <option value="Compensation">Compensation</option>
                        <option value="Deduction">Deduction</option>
                      </select>
                    </td>
                    <td class="px-3 py-2"><input type="text" v-model="ded.misc_desc" placeholder="Description" class="w-24 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="number" v-model="ded.misc_amount" placeholder="0.00" class="w-20 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2"><input type="text" v-model="ded.misc_remarks" placeholder="Remarks" class="w-24 px-2 py-1 border border-gray-300 rounded text-xs"></td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button @click="miscSave(i)" class="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150" title="Save">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button @click="confirmMiscDelete(i)" class="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150" title="Delete">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- No Items Message -->
                  <tr v-if="Deduction.length === 0">
                    <td colspan="9" class="px-3 py-8 text-center text-gray-500">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-sm">No compensation/deduction items added yet.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total -->
            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
              <div class="w-64 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Total:</span>
                <input type="text" v-model="CDtotal" readonly class="w-28 px-2 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
              </div>
            </div>
          </div>

          <!-- Government Deductions with improved design -->
          <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
              <h4 class="text-white font-semibold flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Government Mandatory Deductions
              </h4>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span class="text-sm text-gray-600">SSS Premium:</span>
                  <input type="text" v-model="Contribution.premium" readonly class="w-32 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-right">
                </div>
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span class="text-sm text-gray-600">Philhealth:</span>
                  <input type="text" v-model="Contribution.philhealth" readonly class="w-32 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-right">
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span class="text-sm text-gray-600">Pag-IBIG:</span>
                  <input type="text" v-model="Contribution.pagibig" readonly class="w-32 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-right">
                </div>
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span class="text-sm text-gray-600">Maxicare:</span>
                  <input type="text" v-model="Contribution.maxicare" readonly class="w-32 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-right">
                </div>
              </div>
              <div class="col-span-2 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Total Government Deductions:</span>
                <input type="text" v-model="Contribution.total" readonly class="w-32 px-3 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
              </div>
            </div>
          </div>

          <!-- Total Income with prominent design -->
          <div class="flex justify-end">
            <div class="w-80 bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg">
              <div class="flex justify-between items-center">
                <span class="text-white font-bold text-lg">TOTAL INCOME</span>
                <div class="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <input type="text" v-model="Stotal" readonly class="w-32 bg-transparent text-white font-bold text-lg text-right border-none focus:outline-none" placeholder="0.00">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'

// Props
const props = defineProps({
  employee: {
    type: Object,
    default: null
  }
})

// State
const showModal = ref(false)
const selectedEmployee = ref(null)
const loading = ref(false)
const Search = ref({ 
  from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
  to: moment().format('YYYY-MM-DD')
})
const Task = ref([])
const Daily = ref([[]])
const Deduction = ref([])
const Misc = ref([])
const tdrop = ref([])
const cdrop = ref([])

const Config = ref({ batch: '' })
const Contribution = ref({
  premium: '1,234.56',
  philhealth: '850.00',
  pagibig: '100.00',
  maxicare: '500.00',
  total: '2,684.56'
})
const Dtotal = ref('12,345.67')
const CDtotal = ref('1,234.56')
const Stotal = ref('10,895.67')
const draftMSG = ref('')
const miscMSG = ref('')

// Add cache for class options
const classCache = ref(new Map())

// Months for dropdown
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Watch for changes in task fields to calculate total
watch(Task, (newTasks) => {
  newTasks.forEach(task => {
    if (task.hour && task.rate) {
      const hours = parseFloat(task.hour) || 0
      const rate = parseFloat(task.rate) || 0
      const tarima = parseFloat(task.tarima) || 0
      const deduction = parseFloat(task.deduction) || 0
      
      // Calculate total (you can adjust this formula as needed)
      task.total = (hours * rate) + tarima - deduction
    }
  })
}, { deep: true })

// Methods
const openModal = () => {
  selectedEmployee.value = props.employee
  showModal.value = true
  fetchTasks().then(() => {
    // After tasks are loaded, fetch class data for each task that has a taskId
    fetchClassesForExistingTasks()
  })
  fetchCompensations()
}

// Fetch classes for all existing tasks
const fetchClassesForExistingTasks = async () => {
  // Get all tasks with taskId
  const tasksWithIds = Task.value
    .map((task, index) => ({ task, index }))
    .filter(item => item.task.taskId && item.task.taskId > 0)
  
  // Fetch class data for each task with its index
  for (const { task, index } of tasksWithIds) {
    await fetchClass(task.taskId, index)
  }
}

const closeModal = () => {
  showModal.value = false
  selectedEmployee.value = null
  Task.value = []
  Deduction.value = []
  classCache.value.clear() // Clear cache when modal closes
}

const fetchTasks = async () => {
  if (!selectedEmployee.value) return
  console.log(selectedEmployee.value);
  
  loading.value = true
  try {
    const response = await api.post('/payroll/compiled-task', {
      employee_id: selectedEmployee.value.id,
      position: selectedEmployee.value.position,
      from_date: Search.value.from,
      to_date: Search.value.to
    })
    
    if (response.data && !response.data.error) {
      // Map the API response to your Task structure
      Task.value = response.data.tasks.map(task => ({
        id: task.id,
        attId: task.attId,
        date: task.workDate,
        day_type: mapDayType(task.dayType),
        sp: task.soloPair?.toString() || '1',
        class: task.class || '',
        taskId: task.taskId || 0,
        posId: task.posId || 0,
        task: task.refNumber || '',
        rate: task.rate?.toString() || '',
        hour: task.hoursWorked || 0,
        tarima: task.tarima || 0,
        deduction: task.deduction || 0,
        total: task.total || 0,
        remarks: task.remarks || '',
        is_draft: task.isDefault === 3, // If isDefault is 3, it's draft; if 1, it's saved
        isDefault: task.isDefault || 1, // Store original value
        reportStatus: task.reportStatus,
        workStatus: task.workStatus,
        payrollPeriod: task.payrollPeriod,
        classOptions: [] // Initialize empty array for class options
      }))
      
      // Update totals if needed
      if (response.data.total) {
        Dtotal.value = formatCurrency(response.data.total)
      }
      
      console.log('Mapped tasks:', Task.value)
    }
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load tasks',
      timer: 2000,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

// Helper function to map dayType numbers to strings
const mapDayType = (dayType) => {
  switch(parseInt(dayType)) {
    case 1:
      return 'regular'
    case 2:
      return 'special'
    case 3:
      return 'holiday'
    default:
      return 'regular'
  }
}

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const fetchCompensations = async () => {
  if (!selectedEmployee.value) return
  
  try {
    const response = await api.post('/payroll/compensations', {
      employee_id: selectedEmployee.value.employeeId
    })
    
    if (response.data && !response.data.error) {
      Deduction.value = response.data.compensations || []
    }
  } catch (error) {
    console.error('Failed to fetch compensations:', error)
  }
}

const checkTask = async () => {
  if (!Search.value.from || !Search.value.to) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select from and to dates',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }
  
  await fetchTasks()
  
  await Swal.fire({
    icon: 'success',
    title: 'Search Complete',
    text: `Found ${Task.value.length} tasks from ${moment(Search.value.from).format('MMM D, YYYY')} to ${moment(Search.value.to).format('MMM D, YYYY')}`,
    timer: 2000,
    showConfirmButton: false
  })
}

const addRowTask = async () => {
  try {
    // Create a new task object with default values
    const newTask = {
      date: moment().format('YYYY-MM-DD'),
      day_type: 'regular',
      sp: '1',
      class: '',
      taskId: '',
      posId: '',
      rate: '',
      hour: 0,
      tarima: 0,
      deduction: 0,
      total: 0,
      remarks: '',
      is_draft: false
    }

    // Show loading indicator
    // await Swal.fire({
    //   title: 'Creating task...',
    //   text: 'Please wait',
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // })
    
    // Save to database
    const response = await api.post('/payroll/add-task', {
      employee_id: selectedEmployee.value.id,
      task_data: newTask
    })

    if (response.data && !response.data.error) {
      Swal.close()
      
      // Refresh tasks to get the newly created task
      await fetchTasks()
      
      // Fetch class data for the new task if it has a taskId
      if (response.data.task_id) {
        const newTaskIndex = Task.value.findIndex(t => t.id === response.data.task_id)
        if (newTaskIndex !== -1 && Task.value[newTaskIndex].taskId) {
          await fetchClass(Task.value[newTaskIndex].taskId, newTaskIndex)
        }
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'New task created successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to create new task',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to create task:', error)
    Swal.close()
    
    let errorMessage = 'Failed to create new task'
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server'
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || errorMessage
    }
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const weeklytask = async () => {
  await fetchTasks()
  await Swal.fire({
    icon: 'info',
    title: 'Reloaded',
    text: 'Tasks have been refreshed',
    timer: 1500,
    showConfirmButton: false
  })
}

const fetchTask = async () => {
  try {
    const response = await api.get('/payroll/list-task')
    
    if (response.data && !response.data.error) {
      tdrop.value = response.data.task
    }
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch tasks',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// Updated fetchClass to accept task index
const fetchClass = async (taskId, taskIndex) => {
  if (!taskId) return
  
  try {
    // Check cache first
    if (classCache.value.has(taskId)) {
      const cachedOptions = classCache.value.get(taskId)
      
      // Update the specific task's classOptions
      if (taskIndex !== undefined && Task.value[taskIndex]) {
        Task.value[taskIndex].classOptions = cachedOptions
      }
      // Also update the shared cdrop for new tasks
      cdrop.value = cachedOptions
      return
    }
    
    console.log('Fetching class for taskId:', taskId)
    
    const response = await api.post('/payroll/position', {
      task_id: taskId
    })
    
    if (response.data && !response.data.error) {
      // Cache the result
      classCache.value.set(taskId, response.data.position)
      
      // Update the specific task's classOptions
      if (taskIndex !== undefined && Task.value[taskIndex]) {
        Task.value[taskIndex].classOptions = response.data.position
      }
      // Update the shared cdrop for new tasks
      cdrop.value = response.data.position

      console.log('Class options:', response.data.position)
    }
  } catch (error) {
    console.error('Failed to fetch class:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch class data',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const saveTask = async (index) => {
  const task = Task.value[index]
  
  // Validate required fields
  if (!task.taskId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a task',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!task.posId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a class/position',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    // Show loading
    await Swal.fire({
      title: 'Saving...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await api.post('/payroll/task/save', {
      employee_id: selectedEmployee.value.employeeId,
      task_data: task
    })
    
    if (response.data && !response.data.error) {
      Swal.close()
      
      // Mark as not draft
      task.is_draft = false
      
      await Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Task saved successfully',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to save task:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save task',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const confirmDelete = async (index) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    const task = Task.value[index]
    
    if (!task.is_draft && task.id) {
      try {
        await api.post('/payroll/task/delete', {
          task_id: task.id
        })
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
    
    Task.value.splice(index, 1)
    
    await Swal.fire({
      icon: 'success',
      title: 'Removed!',
      text: 'Task removed successfully',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const miscdraft = () => {
  const tempId = Date.now()
  
  Deduction.value.push({
    id: tempId,
    misc_year: moment().format('YYYY'),
    misc_month: moment().format('MMMM'),
    misc_week: 'Batch 1',
    misc_type: 'Compensation',
    misc_desc: '',
    misc_amount: 0,
    misc_remarks: '',
    is_draft: true,
    temp_id: tempId
  })
}

const miscSave = async (index) => {
  const item = Deduction.value[index]
  
  // Validate required fields
  if (!item.misc_desc) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter a description',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    // Show loading
    await Swal.fire({
      title: 'Saving...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await api.post('/payroll/compensation/save', {
      employee_id: selectedEmployee.value.employeeId,
      compensation_data: item
    })
    
    if (response.data && !response.data.error) {
      Swal.close()
      
      // Update the item
      item.is_draft = false
      if (item.temp_id) {
        delete item.temp_id
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Item saved successfully',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to save item:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save item',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const confirmMiscDelete = async (index) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    const item = Deduction.value[index]
    
    if (!item.is_draft && item.id) {
      try {
        await api.post('/payroll/compensation/delete', {
          compensation_id: item.id
        })
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
    
    Deduction.value.splice(index, 1)
    
    await Swal.fire({
      icon: 'success',
      title: 'Removed!',
      text: 'Item removed successfully',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// Initialize
onMounted(() => {
  fetchTask()
})
</script>