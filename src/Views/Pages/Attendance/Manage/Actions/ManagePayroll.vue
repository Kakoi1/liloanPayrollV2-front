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
                {{ Task.length }} Tasks ({{ regularTasksCount }} active)
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
                <!-- Submit Selected Tasks Button -->
                <!-- <button 
                  v-if="hasPayrollData && selectedTasks.length > 0"
                  @click="submitSelectedTasks" 
                  class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-xs hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Selected ({{ selectedTasks.length }})
                </button> -->
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
                        :disabled="!hasPayrollData || regularTasksCount === 0"
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
                        :disabled=" task.payrollId != 0"
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
                        :disabled="!task.is_draft"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft}"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <select 
                        v-model="task.day_type" 
                        :disabled="!task.is_draft"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft}"
                      >
                        <option value="1">Reg</option>
                        <option value="2">Spec</option>
                        <option value="3">Hol</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select 
                        v-model="task.sp" 
                        :disabled="!task.is_draft"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft }"
                      >
                        <option value="1">Solo</option>
                        <option value="2">Pair</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select 
                        v-model="task.taskType" 
                        @change="fetchClass(task.taskType, i)" 
                        :disabled="!task.is_draft"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft }" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">--</option>
                        <option v-for="cd in tdrop" :value="cd.id" :key="cd.id">{{ cd.task_name }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select 
                        v-model="task.taskId" 
                        @change="updateRateFromClass(task, i)"
                        :disabled="!task.is_draft"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !task.is_draft }" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">--</option>
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
                        :class="{ 'bg-gray-100': !task.is_draft }"
                        readonly=""
                      >
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex items-center space-x-1">
                        <input 
                          type="number" 
                          :title="getUnitTitle(task)"
                          v-model="task.netKgPerEmp" 
                          @input="updateTaskTotal(task)"
                          class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          :class="{ 'bg-gray-100': !task.is_draft }"
                          :readonly="!task.is_draft"
                        >
                        <span class="text-xs text-gray-500 whitespace-nowrap">{{ getUnitLabel(task.unit) }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="number" 
                        v-model="task.tarima" 
                        @input="updateTaskTotal(task)"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100': !task.is_draft }"
                        :readonly="!task.is_draft"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        type="number" 
                        v-model="task.deduction" 
                        @input="updateTaskTotal(task)"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        :class="{ 'bg-gray-100': !task.is_draft }"
                        :readonly="!task.is_draft"
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
                        :class="{ 'bg-gray-100': !task.is_draft }"
                        :readonly="!task.is_draft"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <!-- Save button - ONLY for draft tasks -->
                        <button 
                          v-if="task.is_draft"
                          @click="saveDraftTask(i)" 
                          class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150 group relative" 
                          title="Click to save (Choose between draft or convert)"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <!-- Tooltip -->
                          <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Save (Draft/Convert)
                          </span>
                        </button>
                        
                        <!-- Delete button - ONLY for draft tasks -->
                        <button 
                          v-if="task.is_draft"
                          @click="confirmDelete(i)" 
                          class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150" 
                          title="Delete Draft"
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
            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
              <div class="text-xs text-gray-500">
                <span v-if="hasDraftTasks" class="text-yellow-600">
                  ⚠️ Draft tasks are not included in total
                </span>
              </div>
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
            <div class="w-96 bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg flex flex-col gap-x-1 gap-y-5">
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
const Task = ref([])
const tdrop = ref([])
const cdrop = ref([])
const payrollData = ref(null)
const selectAll = ref(false)
const Dtotal = ref('0')
const compensationOptions = ref([])
const mandatoryCompensations = ref([])
const nonMandatoryCompensations = ref([])
const draftMSG = ref('')
const miscMSG = ref('')

// Computed property to check if payroll data exists
const hasPayrollData = computed(() => {
  return payrollData.value && payrollData.value.payroll 
})

// Computed property for regular tasks count (non-draft)
const regularTasksCount = computed(() => {
  return Task.value.filter(task => !task.is_draft).length
})

// Computed property to check if there are draft tasks
const hasDraftTasks = computed(() => {
  return Task.value.some(task => task.is_draft)
})

// Computed property for selected tasks (only non-draft)
const selectedTasks = computed(() => {
  return Task.value.filter(task =>  task.selected && task.payrollId === 0)
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

const totalIncome = computed(() => {
  const gross = parseFloat(Dtotal.value.replace(/,/g, '')) || 0
  const nonMandatory = parseFloat(nonMandatoryTotal.value.replace(/,/g, '')) || 0
  const govDeductions = parseFloat(mandatoryTotal.value.replace(/,/g, '')) || 0
  
  const total = gross + nonMandatory - govDeductions
  return formatCurrency(total)
})

const getUnitLabel = (unit) => {
  switch(parseInt(unit)) {
    case 1:
      return 'hrs'
    case 3:
      return 'kg'
    case 4:
      return 'container'
    default:
      return 'unit'
  }
}

// Get unit title/tooltip text
const getUnitTitle = (task) => {
  const unit = parseInt(task.unit)
  const originalNet = task.originalNet || 0
  
  switch(unit) {
    case 1:
      return `Original hours: ${originalNet}`
    case 3:
      return `Original kg: ${originalNet}`
    case 4:
      return `Original containers: ${originalNet}`
    default:
      return `Original: ${originalNet}`
  }
}

// Update task total calculation
const updateTaskTotal = (task) => {
  let hours = parseFloat(task.netKgPerEmp) || 0
  const rate = parseFloat(task.rate) || 0
  const tarima = parseFloat(task.tarima) || 0
  const multi = parseFloat(task.taskMulti) || 0
  const deduction = parseFloat(task.deduction) || 0

  if (task.unit == 1) {
      hours = hours / 8
  }

  const totalMulti = parseFloat(tarima*multi)
  
  task.total = ((hours * rate) - (totalMulti + deduction)).toFixed(2)
  
  // Recalculate gross total
  calculateGrossTotal()
}

// Calculate gross total from non-draft tasks
const calculateGrossTotal = () => {
  let totalFromRegularTasks = 0
  Task.value.forEach((task) => {
    if (!task.is_draft) {
      totalFromRegularTasks += parseFloat(task.total) || 0
    }
  })
  Dtotal.value = formatCurrency(totalFromRegularTasks)
}

// Update rate when class is selected
const updateRateFromClass = (task, index) => {
  const selectedClass = (task.classOptions || cdrop.value).find(opt => opt.value == task.taskId)
  if (selectedClass && selectedClass.rate) {
    task.rate = selectedClass.rate
    task.taskMulti = selectedClass.multiplier
    task.unit = selectedClass.measurement
    updateTaskTotal(task)
  }
}

// Watch for changes in task fields to update total
watch(Task, () => {
  calculateGrossTotal()
}, { deep: true })

// Watch selected tasks to update selectAll
watch(selectedTasks, (newSelected) => {
  const selectableTasks = Task.value.filter(task => !task.is_draft && task.payrollId === 0)
  if (selectableTasks.length > 0) {
    selectAll.value = newSelected.length === selectableTasks.length
  } else {
    selectAll.value = false
  }
}, { deep: true })

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
      
      if (hasPayrollData.value) {
        // Process regular tasks (non-draft)
        const regularTasks = (response.data.tasks || []).map(task => ({
          id: task.id,
          date: task.date ? moment(task.date).format('YYYY-MM-DD') : '',
          day_type: task.dayType,
          sp: task.workerCount == 1? 1 : 2,
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
        
        // Process draft tasks
        const draftTasks = (response.data.draft || []).map(draft => ({
          id: draft.id,
          date: draft.date ? moment(draft.date).format('YYYY-MM-DD') : '',
          day_type: draft.dayType,
          sp: draft.workerCount?.toString() || '1',
          taskType: draft.taskType,
          taskId: draft.taskId,
          rate: draft.rate?.toString() || '',
          hour: draft.hour,
          netKgPerEmp: draft.netKgPerEmp,
          unit: draft.unit || 'kg',
          tarima: draft.tarima || 0,
          originalNet: draft.originalNet || 0,
          deduction: draft.deduction || 0,
          total: draft.total || 0,
          remarks: draft.remarks || '',
          is_draft: true,
          isDefault: 1,
          payrollId: draft.payrollId || 0,
          selected: false,
          classOptions: [],
          belongsToPayroll: true
        }))
        
        Task.value = [...regularTasks, ...draftTasks]
        
        // Calculate total from regular tasks only
        const totalFromRegularTasks = regularTasks.reduce((sum, task) => {
          return sum + (parseFloat(task.total) || 0)
        }, 0)
        
        Dtotal.value = formatCurrency(totalFromRegularTasks)
        
        // Fetch class options for all tasks
        await fetchClassesForExistingTasks()
      } else {
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

// Save draft task (manual save)
// Save draft task with confirmation
const saveDraftTask = async (index) => {
  const task = Task.value[index]
  
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

  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Save Task',
    text: 'How would you like to save this task?',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonColor: '#10b981',
    denyButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Save as Draft',
    denyButtonText: 'Save & Convert',
    cancelButtonText: 'Cancel'
  })

  // If user cancels, exit
  if (result.isDismissed) return

  // Determine save type
  const saveAsDraft = result.isConfirmed // Save as Draft
  const saveAndConvert = result.isDenied // Save and Convert to Regular

  try {
    Swal.fire({
      title: saveAsDraft ? 'Saving as Draft...' : 'Saving and Converting...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const taskData = {
      id: task.id,
      date: task.date,
      day_type: task.day_type,
      sp: task.sp,
      taskType: task.taskType,
      taskId: task.taskId,
      rate: task.rate,
      hour: task.hour,
      netKgPerEmp: task.netKgPerEmp,
      unit: task.unit,
      tarima: task.tarima,
      originalNet: task.originalNet,
      deduction: task.deduction,
      total: task.total,
      remarks: task.remarks,
      is_draft: saveAsDraft ? true : false // If save and convert, set to false
    }
    
    const payload = {
      employee_id: selectedEmployee.value.id,
      task_data: taskData,
      task_id: task.id,
      save_task: saveAsDraft ? 0 : 1 // 0 = save as draft, 1 = save and convert to regular
    }
    
    if (hasPayrollData.value && payrollData.value?.payroll?.id) {
      payload.payroll_id = payrollData.value.payroll.id
    }

    const response = await api.post('/payroll/task-save', payload)
    
    if (response.data && !response.data.error) {
      Swal.close()
      
      if (response.data.task) {
        task.id = response.data.task.id
        task.is_draft = saveAsDraft ? true : false
      }
      
      await Swal.fire({
        icon: 'success',
        title: saveAsDraft ? 'Draft Saved!' : 'Task Converted!',
        text: saveAsDraft 
          ? 'Task saved as draft. You can continue editing it.' 
          : 'Task has been saved and converted to regular task.',
        timer: 1500,
        showConfirmButton: false
      })
      
      await fetchPayrollData()
    } else {
      Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data?.message || 'Failed to save task',
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
      text: error.response?.data?.message || 'Failed to save task',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

// Submit selected tasks function
// const submitSelectedTasks = async () => {
//   if (selectedTasks.value.length === 0) {
//     await Swal.fire({
//       icon: 'warning',
//       title: 'Warning',
//       text: 'Please select at least one task to submit',
//       timer: 1500,
//       showConfirmButton: false
//     })
//     return
//   }

//   const result = await Swal.fire({
//     title: 'Submit Selected Tasks?',
//     text: `You are about to submit ${selectedTasks.value.length} selected task(s). This will finalize these tasks and they cannot be edited further.`,
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonColor: '#10b981',
//     cancelButtonColor: '#6b7280',
//     confirmButtonText: 'Yes, submit them',
//     cancelButtonText: 'Cancel'
//   })

//   if (result.isConfirmed) {
//     try {
//       Swal.fire({
//         title: 'Submitting Tasks...',
//         text: 'Please wait',
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading()
//         }
//       })

//       const taskIds = selectedTasks.value.map(task => task.id)
      
//       const response = await api.post('/payroll/submit-tasks', {
//         payroll_id: payrollData.value.payroll.id,
//         task_ids: taskIds
//       })

//       if (response.data && !response.data.error) {
//         Swal.close()
//         await Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: response.data.message || `${selectedTasks.value.length} task(s) submitted successfully`,
//           timer: 1500,
//           showConfirmButton: false
//         })
        
//         // Refresh the data
//         await fetchPayrollData()
//       } else {
//         Swal.close()
//         await Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: response.data?.message || 'Failed to submit tasks',
//           timer: 1500,
//           showConfirmButton: false
//         })
//       }
//     } catch (error) {
//       console.error('Failed to submit tasks:', error)
//       Swal.close()
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.response?.data?.message || 'Failed to submit tasks',
//         timer: 1500,
//         showConfirmButton: false
//       })
//     }
//   }
// }

// Submit payroll function
const submitPayroll = async () => {
  if (hasDraftTasks.value) {
    const result = await Swal.fire({
      title: 'Draft Tasks Exist',
      text: 'There are draft tasks that haven\'t been saved. Do you want to save them before submitting?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#10b981',
      denyButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Save All Drafts',
      denyButtonText: 'Submit Anyway',
      cancelButtonText: 'Cancel'
    })
    
    if (result.isConfirmed) {
      await saveAllDraftTasks()
      return
    }
    
    if (result.isDenied) {
      await proceedWithSubmit()
    }
  } else {
    await proceedWithSubmit()
  }
}

// Save all draft tasks
const saveAllDraftTasks = async () => {
  const draftTasks = Task.value.filter(task => task.is_draft)
  
  if (draftTasks.length === 0) return
  
  try {
    Swal.fire({
      title: 'Saving Drafts...',
      text: `Saving ${draftTasks.length} draft task(s)`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    
    for (const task of draftTasks) {
      const taskData = {
        id: task.id,
        date: task.date,
        day_type: task.day_type,
        sp: task.sp,
        taskType: task.taskType,
        taskId: task.taskId,
        rate: task.rate,
        hour: task.hour,
        netKgPerEmp: task.netKgPerEmp,
        unit: task.unit,
        tarima: task.tarima,
        originalNet: task.originalNet,
        deduction: task.deduction,
        total: task.total,
        remarks: task.remarks,
        is_draft: false
      }
      
      const payload = {
        employee_id: selectedEmployee.value.employeeId,
        task_data: taskData,
        payroll_id: payrollData.value.payroll.id
      }
      
      await api.post('/payroll/task/save', payload)
    }
    
    Swal.close()
    await fetchPayrollData()
    await proceedWithSubmit()
  } catch (error) {
    console.error('Failed to save drafts:', error)
    Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save draft tasks',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const proceedWithSubmit = async () => {
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

  if (!result.isConfirmed) return

  try {
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
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'Payroll submitted successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      await fetchPayrollData()
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
  const tasksWithIds = Task.value
    .map((task, index) => ({ task, index }))
    .filter(item => item.task.taskType && item.task.taskType > 0)
  
  for (const { task, index } of tasksWithIds) {
    await fetchClass(task.taskType, index)
  }
}

const closeModal = () => {
  showModal.value = false
  selectedEmployee.value = null
  Task.value = []
  payrollData.value = null
  classCache.value.clear()
  mandatoryCompensations.value = []
  nonMandatoryCompensations.value = []
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
      const allCompensations = response.data.compensations || []
      
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
    }
  } catch (error) {
    console.error('Failed to fetch compensations:', error)
  }
}

const addRowTask = async () => {
  try {
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
      payrollId: 0,
      classOptions: []
    }

    Task.value.push(newTask)

    const response = await api.post('/payroll/add-task', {
      employee_id: selectedEmployee.value.id,
      task_data: newTask
    })

    if (response.data && !response.data.error) {
      await fetchPayrollData()
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'New draft task created',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
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
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create new task',
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

const fetchClass = async (taskIds, taskIndex) => {
  if (!taskIds) return
  
  try {
    if (classCache.value.has(taskIds)) {
      const cachedOptions = classCache.value.get(taskIds)
      
      if (taskIndex !== undefined && Task.value[taskIndex]) {
        Task.value[taskIndex].classOptions = cachedOptions
      }
      cdrop.value = cachedOptions
      return
    }
    
    const response = await api.post('/payroll/position', {
      task_id: taskIds
    })
    
    if (response.data && !response.data.error) {
      classCache.value.set(taskIds, response.data.position)
      
      if (taskIndex !== undefined && Task.value[taskIndex]) {
        Task.value[taskIndex].classOptions = response.data.position
      }
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

const confirmDelete = async (index) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this draft task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    const task = Task.value[index]
    
    if (task.id && !task.id.toString().startsWith('temp')) {
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
      text: 'Draft task removed successfully',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const toggleSelectAll = () => {
  Task.value.forEach(task => {
    if (!task.is_draft && task.payrollId === 0) {
      task.selected = selectAll.value
    }
  })
}

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

  const payrollId = payrollData.value.payroll.id
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
      item.is_draft = false
      if (item.temp_id) {
        delete item.temp_id
      }
      
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
  // No auto-save to clean up
})

// Clean up on component unmount
onUnmounted(() => {
  // Clean up
})
</script>