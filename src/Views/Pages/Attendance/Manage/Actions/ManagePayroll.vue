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

  <!-- Auto-save indicator -->
  <div v-if="autoSaving" class="fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg z-50 flex items-center">
    <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Auto-saving...
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto w-full" @click.self="closeModal">
    <!-- Backdrop with blur effect -->
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

    <!-- Modal Content -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-[97%] bg-white rounded-xl shadow-2xl transform transition-all">
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
          <!-- Payroll Period Card -->
          <div class="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div class="flex justify-between items-center">
              <h4 class="font-semibold text-gray-700 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                PAYROLL PERIOD
              </h4>
              <!-- Show CreatePayroll only if no existing payroll data -->
              <CreatePayroll
                v-if="!hasPayrollData"
                :employee="selectedEmployee"
                @payroll-created="handlePayrollCreated"
                @closed="handleModalClosed"
              />

            </div>
            <div v-if="!hasPayrollData" colspan="14" class="px-3 py-8 text-center text-gray-500">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p class="text-sm">No tasks added yet. Click "New Task" to add one.</p>
            </div>
            <!-- Display payroll info if exists -->
            <div v-if="hasPayrollData" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-700">
                <span class="font-medium">Payroll Period:</span> 
                {{ formatDate(payrollData.payroll?.dateFrom) }} to {{ formatDate(payrollData.payroll?.dateTo) }}
              </p>
              <p class="text-sm text-green-700 mt-1">
                <span class="font-medium">Payroll Date:</span> 
                {{ formatDate(payrollData.payroll?.dateOfPayroll) }}
              </p>
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
              <div class="flex items-center space-x-4">
                <span v-if="draftMSG" class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{{ draftMSG }}</span>
                <!-- Process Selected Tasks Button -->
                <button 
                  v-if="hasPayrollData && selectedTasks.length > 0"
                  @click="processSelectedTasks" 
                  class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Process Selected ({{ selectedTasks.length }})
                </button>
              </div>
              <div class="flex gap-2 ml-auto">
                <button v-if="hasPayrollData" @click="weeklytask" class="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors duration-200 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload
                </button>
                <button v-if="hasPayrollData" @click="addRowTask" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </button>
              </div>
            </div>

            <!-- Tasks Table with improved styling -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-8">
                      <input 
                        type="checkbox" 
                        v-model="selectAll" 
                        @change="toggleSelectAll"
                        :disabled="!hasPayrollData"
                        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      >
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-16">Status</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-28">Date</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-16">Type</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-16">S/P</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-28">Task</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-28">Class</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">Rate</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-24">Hrs/Kg</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">Tarima</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-16">Ded</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-24">Total</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32">Remarks</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <!-- Tasks -->
                  <tr v-for="(task, i) in Task" :key="task.id || 'draft-'+i" :class="task.is_draft ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'">
                    <td class="px-3 py-2">
                      <input 
                        type="checkbox" 
                        v-model="task.selected" 
                        :disabled="!hasPayrollData || task.payrollId != 0"
                        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      >
                    </td>
                    <td class="px-3 py-2">
                        <span v-if="task.is_draft" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                        </span>
                        <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Saved
                        </span>
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="date" 
                        v-model="task.date" 
                        :disabled="!task.is_draft || hasPayrollData"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft || hasPayrollData }"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <select 
                        v-model="task.day_type" 
                        :disabled="!task.is_draft || hasPayrollData"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft || hasPayrollData }"
                      >
                        <option value="regular">Reg</option>
                        <option value="special">Spec</option>
                        <option value="holiday">Hol</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                        <select 
                            v-model="task.sp" 
                            :disabled="!task.is_draft || hasPayrollData"
                            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                            :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft || hasPayrollData }"
                        >
                            <option value="1">Solo</option>
                            <option value="2">Pair</option>
                        </select>
                    </td>
                    <td class="px-3 py-2">
                        <select 
                          v-model="task.taskType" 
                          @change="fetchClass(task.taskType, i)" 
                          :disabled="!task.is_draft || hasPayrollData"
                          :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft || hasPayrollData }" 
                          class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">--</option>
                            <option v-for="cd in tdrop" :value="cd.id" :key="cd.id">{{ cd.task_name }}</option>
                        </select>
                    </td>
                    <td class="px-3 py-2">
                        <select 
                          v-model="task.taskId" 
                          :disabled="!task.is_draft || hasPayrollData"
                          :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft || hasPayrollData }" 
                          class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        >
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
                    <td class="px-3 py-2">
                      <input 
                        type="text" 
                        v-model="task.rate"  
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        :class="{ 'bg-gray-100': !task.is_draft || hasPayrollData }"
                        readonly=""
                      >
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex items-center space-x-1">
                        <input 
                          type="number" 
                          :title="'original ' + (task.unit == 3 ? 'kg: ' : 'hrs: ') + task.originalNet"
                          v-model="task.netKgPerEmp" 
                          class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          :class="{ 'bg-gray-100': !task.is_draft || hasPayrollData }"
                          :readonly="!task.is_draft || hasPayrollData"
                        >
                        <span class="text-xs text-gray-500 whitespace-nowrap">{{ task.unit == 3 ? 'kg' : 'hrs' }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="number" 
                        v-model="task.tarima" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100': !task.is_draft || hasPayrollData }"
                        :readonly="!task.is_draft || hasPayrollData"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="number" 
                        v-model="task.deduction" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100': !task.is_draft || hasPayrollData }"
                        :readonly="!task.is_draft || hasPayrollData"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="number" 
                        v-model="task.total" 
                        readonly 
                        class="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="text" 
                        v-model="task.remarks" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100': !task.is_draft || hasPayrollData }"
                        :readonly="!task.is_draft || hasPayrollData"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button 
                          v-if="!hasPayrollData"
                          @click="saveTask(i)" 
                          class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150" 
                          title="Save"
                          :disabled="!task.is_draft"
                          :class="{ 'opacity-50 cursor-not-allowed': !task.is_draft }"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          v-if="!hasPayrollData"
                          @click="confirmDelete(i)" 
                          class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150" 
                          title="Delete"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- No Tasks Message -->
                  <tr v-if="Task.length === 0">
                    <td colspan="14" class="px-3 py-8 text-center text-gray-500">
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
              <div class="w-72 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Gross Income:</span>
                <input type="text" v-model="Dtotal" readonly class="w-32 px-2 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
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
                {{ nonMandatoryCompensations.length }} Items
              </span>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
              <span v-if="miscMSG" class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{{ miscMSG }}</span>
              <div class="flex gap-2 ml-auto">
                <button v-if="hasPayrollData" @click="miscdraft" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>

            <!-- Compensations Table (Non-Mandatory) -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32">Name</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">Amount</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32">Remarks</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-16">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(ded, i) in nonMandatoryCompensations" :key="ded.id || 'ded-'+i" :class="ded.is_draft ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'">
                    <td class="px-3 py-2">
                      <select 
                        v-model="ded.misc_desc" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :disabled="!ded.is_draft"
                      >
                        <option value="0">-- Select Compensation --</option>
                        <option v-for="comp in compensationOptions" :key="comp.id" :value="comp.id">
                          {{ comp.name }}
                        </option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="number" 
                        v-model="ded.misc_amount" 
                        placeholder="0.00" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        step="0.01"
                        :readonly="!ded.is_draft"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="text" 
                        v-model="ded.misc_remarks" 
                        placeholder="Remarks" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :readonly="!ded.is_draft"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button v-if="hasPayrollData && ded.is_draft" @click="miscSave(i)" class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150" title="Save">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button v-if="hasPayrollData" @click="confirmMiscDelete(i)" class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150" title="Delete">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- No Items Message -->
                  <tr v-if="nonMandatoryCompensations.length === 0">
                    <td colspan="4" class="px-3 py-8 text-center text-gray-500">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-sm">No compensation/deduction items added yet.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total for Non-Mandatory -->
            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
              <div class="w-72 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Total:</span>
                <input type="text" v-model="nonMandatoryTotal" readonly class="w-32 px-2 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
              </div>
            </div>
          </div>

          <!-- Government Mandatory Deductions with improved design -->
          <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
              <h4 class="text-white font-semibold flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Government Mandatory Deductions
              </h4>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <!-- Loop through mandatory compensations -->
                <div v-for="(comp, index) in mandatoryCompensations" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span class="text-sm text-gray-600">{{ comp.name }}:</span>
                  <input 
                    type="text" 
                    v-model="comp.amount" 
                    readonly 
                    class="w-36 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-right"
                  >
                </div>
                
                <!-- If no mandatory compensations -->
                <div v-if="mandatoryCompensations.length === 0" class="text-center text-gray-500 py-4">
                  No mandatory deductions configured
                </div>
                
                <!-- Total Government Deductions -->
                <div class="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-lg border border-yellow-300 mt-4">
                  <span class="text-sm font-semibold text-gray-700">Total Government Deductions:</span>
                  <input 
                    type="text" 
                    v-model="mandatoryTotal" 
                    readonly 
                    class="w-36 px-3 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Total Income with prominent design -->
          <div class="flex justify-end">
            <div class="w-96 bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg flex flex-col  gap-x-1 gap-y-5">
              <div class="flex justify-between items-center">
                <span class="text-white font-bold text-lg">TOTAL INCOME</span>
                <div class="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <input 
                    type="text" 
                    :value="totalIncome" 
                    readonly 
                    class="w-40 bg-transparent text-white font-bold text-lg text-right border-none focus:outline-none" 
                    placeholder="0.00"
                  >
                </div>

              </div>
              <div class="flex justify-end">
                <button 
                  @click="submitPayroll"
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-200"
                >
                  <FontAwesomeIcon :icon="faCheckDouble" class="w-4 flex-shrink-0" />
                  Complete Payroll
                </button>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import CreatePayroll from './CreatePayroll.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'

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
const autoSaving = ref(false)
const payrollData = ref(null)
const selectAll = ref(false)
const Dtotal = ref('0')
const CDtotal = ref('0')
const Stotal = ref('0')
const compensationOptions = ref([])
const mandatoryCompensations = ref([])
const nonMandatoryCompensations = ref([])

// Computed property to check if payroll data exists
const hasPayrollData = computed(() => {
  return payrollData.value && payrollData.value.payroll 
})

// Computed property for selected tasks
const selectedTasks = computed(() => {
  return Task.value.filter(task => task.selected && task.payrollId === 0)
})

// Computed totals
const nonMandatoryTotal = computed(() => {
  const total = nonMandatoryCompensations.value.reduce((sum, item) => {
    return sum + (parseFloat(item.misc_amount) || 0)
  }, 0)
  return formatCurrency(total)
})

const mandatoryTotal = computed(() => {
  const total = mandatoryCompensations.value.reduce((sum, item) => {
    return sum + (parseFloat(item.amount) || 0)
  }, 0)
  return formatCurrency(total)
})

// Add cache for class options
const classCache = ref(new Map())

// Add debounce timer refs
const saveTimeouts = ref(new Map())
const autoSaveDelay = 1000 // 1 second delay

// Months for dropdown
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const totalIncome = computed(() => {
  const gross = parseFloat(Dtotal.value.replace(/,/g, '')) || 0
  const nonMandatory = parseFloat(nonMandatoryTotal.value.replace(/,/g, '')) || 0
  const govDeductions = parseFloat(mandatoryTotal.value.replace(/,/g, '')) || 0
  
  const total = gross + nonMandatory - govDeductions
  return formatCurrency(total)
})

// Watch for changes in task fields to calculate total and auto-save
watch(Task, (newTasks) => {
  newTasks.forEach((task, index) => {
    // Calculate total
    if (task.hour || task.rate || task.tarima || task.deduction || task.netKgPerEmp) {
      const hours = parseFloat(task.hour || task.netKgPerEmp) || 0
      const rate = parseFloat(task.rate) || 0
      const tarima = parseFloat(task.tarima) || 0
      const deduction = parseFloat(task.deduction) || 0
      
      // Calculate total (you can adjust this formula as needed)
      task.total = (hours * rate) + tarima - deduction
    }
    
    // Auto-save if task is not draft and has an ID
    if (!task.is_draft && task.id && !task.id.toString().startsWith('temp')) {
      debouncedSaveTask(index, task)
    }
  })
}, { deep: true })

// Watch selected tasks to update selectAll
watch(selectedTasks, (newSelected) => {
  const selectableTasks = Task.value.filter(task => task.payrollId === 0)
  if (selectableTasks.length > 0) {
    selectAll.value = newSelected.length === selectableTasks.length
  } else {
    selectAll.value = false
  }
}, { deep: true })

// Debounced save function
const debouncedSaveTask = (index, task) => {
  // Clear existing timeout for this task
  if (saveTimeouts.value.has(task.id)) {
    clearTimeout(saveTimeouts.value.get(task.id))
  }
  
  // Set new timeout
  const timeout = setTimeout(() => {
    autoSaveTask(index)
  }, autoSaveDelay)
  
  saveTimeouts.value.set(task.id, timeout)
}

// Auto-save function
const autoSaveTask = async (index) => {
  const task = Task.value[index]
  
  // Don't auto-save if required fields are missing
  if (!task.taskId || !task.posId) {
    return
  }
  
  autoSaving.value = true
  
  try {
    const response = await api.post('/payroll/task/save', {
      employee_id: selectedEmployee.value.employeeId,
      task_data: task
    })
    
    if (response.data && !response.data.error) {
      console.log(`Task ${task.id} auto-saved successfully`)
    }
  } catch (error) {
    console.error('Failed to auto-save task:', error)
  } finally {
    autoSaving.value = false
  }
}

// Clear all save timeouts
const clearAllSaveTimeouts = () => {
  saveTimeouts.value.forEach((timeout) => {
    clearTimeout(timeout)
  })
  saveTimeouts.value.clear()
}

// Methods
const openModal = () => {
  selectedEmployee.value = props.employee
  showModal.value = true
  fetchPayrollData()
  fetchTask()
  fetchCompensationOptions()
}

// Fetch compensation options
const fetchCompensationOptions = async () => {
  try {
    const response = await api.get('/compensations/non-mandatory')
    if (response.data && !response.data.error) {
      compensationOptions.value = response.data.compensations || []
    }
  } catch (error) {
    console.error('Failed to fetch compensation options:', error)
  }
}

// Fetch payroll data
const fetchPayrollData = async () => {
  if (!selectedEmployee.value) return
  
  try {
    const response = await api.post('/payroll/get-by-employee', {
      employee_id: selectedEmployee.value.id
    })
    
    if (response.data && !response.data.error) {
      payrollData.value = response.data
      
      // If there's payroll data, map the tasks to the Task array
      if (hasPayrollData.value && response.data.tasks) {
        Task.value = response.data.tasks.map(task => ({
          id: task.id,
          date: task.date ? moment(task.date).format('YYYY-MM-DD') : '',
          day_type: mapDayType(task.dayType),
          sp: task.workerCount?.toString() || '1',
          taskType: task.taskType,
          taskId: task.taskId,
          rate: task.rate?.toString() || '',
          hour: task.hour,
          netKgPerEmp: task.netKgPerEmp,
          unit: task.unit || 'kg',
          tarima: task.tarima || 0,
          originalNet: task.originalNet || 0,
          deduction: task.deduction || 0,
          total: task.total || 0,
          remarks: task.remarks || '',
          is_draft: false,
          isDefault: 1,
          payrollId: task.payrollId || 0,
          selected: false,
          classOptions: []
        }))
        
        // Update totals
        if (response.data.total) {
          Dtotal.value = formatCurrency(response.data.total)
        }
        
        // Fetch class options for each task
        await fetchClassesForExistingTasks()
      } else {
        // Clear tasks if no payroll data
        Task.value = []
        Dtotal.value = '0.00'
      }
    }
  } catch (error) {
    console.error('Failed to fetch payroll data:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load payroll data',
      timer: 2000,
      showConfirmButton: false
    })
  } finally {
    fetchCompensations()
  }
}

const submitPayroll = async () => {

  const result = await Swal.fire({
    title: 'Submit Payroll?',
    text: 'Are you sure you want to submit this payroll? This action cannot be undone.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, submit it',
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) {
    return
  }

  try {
    // Show loading indicator
    Swal.fire({
      title: 'Submitting payroll...',
      text: 'Please wait',
      allowOutsideClick: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await api.post('/payroll/submit', { 
      payroll_id: payrollData.value.payroll.id
    })

    if (response.data && !response.data.error) {
      Swal.close()
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'Payroll submitted successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      // Refresh payroll data
      await fetchPayrollData()
      
      // Close the modal
      closeModal()
      
    } else {
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to submit payroll',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to submit payroll:', error)
    Swal.close()
    
    let errorMessage = 'Failed to submit payroll'
    if (error.response) {
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage
    } else if (error.request) {
      errorMessage = 'No response from server'
    } else {
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

// Fetch classes for all existing tasks
const fetchClassesForExistingTasks = async () => {
  // Get all tasks with taskId
  const tasksWithIds = Task.value
    .map((task, index) => ({ task, index }))
    .filter(item => item.task.taskId && item.task.taskId > 0)
  
  // Fetch class data for each task with its index
  for (const { task, index } of tasksWithIds) {
    await fetchClass(task.taskType, index)
  }
}

const closeModal = () => {
  showModal.value = false
  selectedEmployee.value = null
  Task.value = []
  Deduction.value = []
  payrollData.value = null
  classCache.value.clear()
  clearAllSaveTimeouts() // Clear all pending saves
  mandatoryCompensations.value = []
  nonMandatoryCompensations.value = []
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

// Helper function to format date
const formatDate = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('MMM D, YYYY')
}

const fetchCompensations = async () => {
  if (!selectedEmployee.value || !payrollData.value?.payroll?.id) return
  
  try {
    const response = await api.post('/payroll/compensation-list', {
      payroll_id: payrollData.value.payroll.id
    })
    
    if (response.data && !response.data.error) {
      // Separate mandatory and non-mandatory compensations
      const allCompensations = response.data.compensations || []
      
      // For mandatory compensations, we need to fetch the compensation details
      // This assumes you have a way to get compensation details including is_mandatory flag
      // You might need to modify this based on your actual data structure
      
      // For now, we'll assume the response includes is_mandatory field
      mandatoryCompensations.value = allCompensations.filter(c => c.isMandatory)
      nonMandatoryCompensations.value = allCompensations.filter(c => !c.isMandatory).map(compensation => ({
        payroll_id: compensation.payrollId,
        misc_desc: compensation.compensationId,
        misc_amount: compensation.amount,
        misc_remarks: compensation.remarks,
        is_draft: false,
        id: compensation.id,
        temp_id: 0
      }))

      console.log(allCompensations);
      

      // Update totals
      CDtotal.value = response.data.total || '0.00'
    }
  } catch (error) {
    console.error('Failed to fetch compensations:', error)
  }
}

const addRowTask = async () => {
  try {
    // Create a new task object with default values
    const tempId = 'temp_' + Date.now()
    
    const newTask = {
      id: tempId,
      date: moment().format('YYYY-MM-DD'),
      day_type: 'regular',
      sp: '1',
      class: '',
      taskType: '',
      taskId: '',
      rate: '',
      hour: 0,
      netKgPerEmp: '',
      unit: 'kg',
      tarima: 0,
      deduction: 0,
      total: 0,
      remarks: '',
      is_draft: true,
      classOptions: []
    }

    // Add to local array immediately
    Task.value.push(newTask)

    // Save to database
    const response = await api.post('/payroll/add-task', {
      employee_id: selectedEmployee.value.id,
      task_data: newTask
    })

    if (response.data && !response.data.error) {
      // Refresh tasks to get the newly created task with real ID
      await fetchPayrollData()
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'New task created successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      // Remove the temporary task if save failed
      const taskIndex = Task.value.findIndex(t => t.id === tempId)
      if (taskIndex !== -1) {
        Task.value.splice(taskIndex, 1)
      }
      
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
    
    // Remove the temporary task if save failed
    if (tempId) {
      const taskIndex = Task.value.findIndex(t => t.id === tempId)
      if (taskIndex !== -1) {
        Task.value.splice(taskIndex, 1)
      }
    }
    
    let errorMessage = 'Failed to create new task'
    if (error.response) {
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage
    } else if (error.request) {
      errorMessage = 'No response from server'
    } else {
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
  await fetchPayrollData()
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
const fetchClass = async (taskIds, taskIndex) => {
  if (!taskIds) return
  console.log(taskIds);
  
  try {
    // Check cache first
    if (classCache.value.has(taskIds)) {
      const cachedOptions = classCache.value.get(taskIds)
      
      // Update the specific task's classOptions
      if (taskIndex !== undefined && Task.value[taskIndex]) {
        Task.value[taskIndex].classOptions = cachedOptions
      }
      // Also update the shared cdrop for new tasks
      cdrop.value = cachedOptions
      return
    }
    
    const response = await api.post('/payroll/position', {
      task_id: taskIds
    })
    
    if (response.data && !response.data.error) {
      // Cache the result
      classCache.value.set(taskIds, response.data.position)
      
      // Update the specific task's classOptions
      if (taskIndex !== undefined && Task.value[taskIndex]) {
        Task.value[taskIndex].classOptions = response.data.position
      }
      // Update the shared cdrop for new tasks
      cdrop.value = response.data.position
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
  
  // Clear any pending auto-save for this task
  if (saveTimeouts.value.has(task.id)) {
    clearTimeout(saveTimeouts.value.get(task.id))
    saveTimeouts.value.delete(task.id)
  }
  
  // Validate required fields
  if (!task.taskType) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a task',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!task.taskId) {
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
    
    // Clear any pending auto-save for this task
    if (saveTimeouts.value.has(task.id)) {
      clearTimeout(saveTimeouts.value.get(task.id))
      saveTimeouts.value.delete(task.id)
    }
    
    if (!task.is_draft && task.id && !task.id.toString().startsWith('temp')) {
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

// Toggle select all checkboxes
const toggleSelectAll = () => {
  Task.value.forEach(task => {
    if (task.payrollId === 0) {
      task.selected = selectAll.value
    }
  })
}

// Process selected tasks
const processSelectedTasks = async () => {
  if (selectedTasks.value.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select at least one task to process',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  const payrollId = payrollData.value.payroll[0]?.id
  if (!payrollId) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No payroll ID found',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  const result = await Swal.fire({
    title: 'Process Selected Tasks?',
    text: `You are about to process ${selectedTasks.value.length} selected task(s). This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, process them',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const taskIds = selectedTasks.value.map(task => task.id)
      
      const response = await api.post('/payroll/process-tasks', {
        payroll_id: payrollId,
        task_ids: taskIds
      })

      if (response.data && !response.data.error) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false
        })
        
        // Refresh the data
        await fetchPayrollData()
      }
    } catch (error) {
      console.error('Failed to process tasks:', error.response)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to process tasks',
        showConfirmButton: true
      })
    }
  }
}

const miscdraft = () => {
  const tempId = Date.now()
  
  nonMandatoryCompensations.value.push({
    payroll_id: payrollData.value.payroll.id,
    misc_desc: 0,
    misc_amount: 0,
    misc_remarks: '',
    is_draft: true,
    temp_id: tempId
  })
}

const miscSave = async (index) => {
  const item = nonMandatoryCompensations.value[index]
  
  // Validate required fields
  if (!item.misc_desc || item.misc_desc === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please select a compensation type',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!item.misc_amount) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Please enter a valid amount',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/payroll/compensation-add', {
      compensation_data: {
        ...item,
        payroll_id: payrollData.value.payroll.id
      }
    })
    
    if (response.data && !response.data.error) {
      // Update the item
      item.is_draft = false
      if (item.temp_id) {
        delete item.temp_id
      }
      
      // Refresh compensations
      await fetchCompensations()
      
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
    const item = nonMandatoryCompensations.value[index]
    
    if (!item.is_draft && item.id) {
      try {
        await api.post('/payroll/compensation/delete', {
          compensation_id: item.id
        })
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
    
    nonMandatoryCompensations.value.splice(index, 1)
    
    await Swal.fire({
      icon: 'success',
      title: 'Removed!',
      text: 'Item removed successfully',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const handlePayrollCreated = () => {
  fetchPayrollData()
}

const handleModalClosed = () => {
  // Handle modal closed if needed
}

// Initialize
onMounted(() => {
  
  
  window.addEventListener('beforeunload', () => {
    clearAllSaveTimeouts()
  })
})

// Clean up on component unmount
onUnmounted(() => {
  clearAllSaveTimeouts()
  window.removeEventListener('beforeunload', clearAllSaveTimeouts)
})
</script>