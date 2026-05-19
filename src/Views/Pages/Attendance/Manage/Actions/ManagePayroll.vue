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
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-[97%] bg-white rounded-xl shadow-2xl transform transition-all">
        <!-- Header -->
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

        <!-- Body -->
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
              <div class="flex gap-2">
                <select 
                  v-model="selectedPayrollPeriod" 
                  @change="fetchPayrollData"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <option value="0">
                    -- ALL --
                  </option>
                  <option v-for="period in payrollPeriods" :key="period.id" :value="period.id">
                    {{ period.datePeriod }}
                  </option>
                </select>
                <!-- <CreatePayroll
                  v-if="!hasPayrollData"
                  :employee="selectedEmployee"
                  @payroll-created="handlePayrollCreated"
                  @closed="handleModalClosed"
                /> -->
                <div class="flex justify-end mb-4">
                <button @click="submitPayroll" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-200">
                  <FontAwesomeIcon :icon="faCheckDouble" class="w-4 mr-2" />
                  Complete Payroll
                </button>
          </div>
              </div>
            </div>
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

          <!-- Complete Payroll Button -->
          <div v-if="hasPayrollData" class="flex justify-end mb-4">
            <button @click="submitPayroll" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-200">
              <FontAwesomeIcon :icon="faCheckDouble" class="w-4 mr-2" />
              Complete Payroll
            </button>
          </div>

          <!-- Employee Info Cards -->
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

          <!-- Daily Tasks Section -->
          <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 flex justify-between items-center">
              <h4 class="text-white font-semibold flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Daily Task Compilation
              </h4>
              <span class="text-xs text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {{ allTasks.length }} Tasks
              </span>
            </div>
            
            <!-- Task Actions -->
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
              <div class="flex items-center space-x-4">
                <span v-if="draftMSG" class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{{ draftMSG }}</span>
              </div>
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

            <!-- Tasks Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-8">Select</th>
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
                  <!-- Checked Tasks (Processed/Saved) -->
                  <tr v-for="(task, i) in checkedTasks" :key="task.id" class="bg-green-50 hover:bg-green-100">
                    <td class="px-3 py-2 text-center">
                      <input 
                        type="checkbox" 
                        v-model="task.isCaptured"
                        @change="toggleTaskSelection(task, i, 'checked')"
                        class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      >
                    </td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Saved</span>
                    </td>
                    <td class="px-3 py-2">
                      <input type="date" v-model="task.date" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.dayType" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="1">Reg</option>
                        <option value="2">Spec</option>
                        <option value="3">Hol</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.workerCount" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="1">Solo</option>
                        <option value="2">Pair</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.taskType" @change="fetchClassForTask(task, i, 'checked')" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="">--</option>
                        <option v-for="cd in tdrop" :value="cd.id" :key="cd.id">{{ cd.task_name }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.taskId" @change="updateRateFromClass(task, i)" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="">--</option>
                        <option v-for="cd in task.classOptions || cdrop" :value="cd.value" :key="cd.value">{{ cd.label }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" v-model="task.rate" readonly class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100">
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex items-center space-x-1">
                        <input type="number" v-model="task.netKgPerEmp" @input="updateTaskTotal(task)" class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                        <span class="text-xs text-gray-500">{{ getUnitLabel(task.unit) }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="task.tarima" @input="updateTaskTotal(task)" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="task.deduction" @input="updateTaskTotal(task)" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="task.total" readonly class="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" v-model="task.remarks" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button @click="updateTask(task, i, 'checked')" class="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700" title="Update">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button @click="deleteTask(task.id, i, 'checked')" class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700" title="Delete">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Draft Tasks -->
                  <tr v-for="(task, i) in draftTasks" :key="task.id" class="bg-yellow-50 hover:bg-yellow-100">
                    <td class="px-3 py-2 text-center">
                      <input type="checkbox" v-model="task.selected" :disabled="true" class="w-4 h-4 text-gray-400 rounded">
                    </td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>
                    </td>
                    <td class="px-3 py-2">
                      <input type="date" v-model="task.date" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.dayType" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="1">Reg</option>
                        <option value="2">Spec</option>
                        <option value="3">Hol</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.workerCount" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="1">Solo</option>
                        <option value="2">Pair</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.taskType" @change="fetchClassForTask(task, i, 'draft')" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="">--</option>
                        <option v-for="cd in tdrop" :value="cd.id" :key="cd.id">{{ cd.task_name }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select v-model="task.taskId" @change="updateRateFromClass(task, i)" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="">--</option>
                        <option v-for="cd in task.classOptions || cdrop" :value="cd.value" :key="cd.value">{{ cd.label }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" v-model="task.rate" readonly class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100">
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex items-center space-x-1">
                        <input type="number" v-model="task.netKgPerEmp" @input="updateTaskTotal(task)" class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                        <span class="text-xs text-gray-500">{{ getUnitLabel(task.unit) }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="task.tarima" @input="updateTaskTotal(task)" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="task.deduction" @input="updateTaskTotal(task)" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="task.total" readonly class="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" v-model="task.remarks" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button @click="saveDraftTask(i)" class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700" title="Save">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button @click="deleteTask(task.id, i, 'draft')" class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700" title="Delete">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- No Tasks Message -->
                  <tr v-if="allTasks.length === 0">
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
                <span v-if="draftTasks.length > 0" class="text-yellow-600">⚠️ Draft tasks are not included in total</span>
              </div>
              <div class="w-72 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Gross Income:</span>
                <input type="text" v-model="Dtotal" readonly class="w-32 px-2 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
              </div>
            </div>
          </div>

          <!-- Compensations Section -->
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
                <button @click="miscdraft" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>

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
                      <select v-model="ded.misc_desc" class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" :disabled="!ded.is_draft">
                        <option value="0">-- Select Compensation --</option>
                        <option v-for="comp in compensationOptions" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <input type="number" v-model="ded.misc_amount" placeholder="0.00" class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" step="0.01" :readonly="!ded.is_draft">
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" v-model="ded.misc_remarks" placeholder="Remarks" class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" :readonly="!ded.is_draft">
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex space-x-1">
                        <button v-if=" ded.is_draft" @click="miscSave(i)" class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150" title="Save">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button @click="confirmMiscDelete(i)" class="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150" title="Delete">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
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

            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
              <div class="w-72 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
                <span class="text-sm font-semibold text-gray-700">Total:</span>
                <input type="text" v-model="nonMandatoryTotal" readonly class="w-32 px-2 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
              </div>
            </div>
          </div>

          <!-- Government Mandatory Deductions -->
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
                <div v-for="(comp, index) in mandatoryCompensations" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span class="text-sm text-gray-600">{{ comp.name }}:</span>
                  <input type="text" v-model="comp.amount" readonly class="w-36 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-right">
                </div>
                
                <div v-if="mandatoryCompensations.length === 0" class="text-center text-gray-500 py-4">
                  No mandatory deductions configured
                </div>
                
                <div class="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-lg border border-yellow-300 mt-4">
                  <span class="text-sm font-semibold text-gray-700">Total Government Deductions:</span>
                  <input type="text" v-model="mandatoryTotal" readonly class="w-36 px-3 py-1 bg-white border border-yellow-300 rounded-lg text-sm text-right font-medium">
                </div>
              </div>
            </div>
          </div>

          <!-- Total Income -->
          <div class="flex justify-end">
            <div class="w-96 bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg flex flex-col gap-x-1 gap-y-5">
              <div class="flex justify-between items-center">
                <span class="text-white font-bold text-lg">TOTAL INCOME</span>
                <div class="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <input type="text" :value="totalIncome" readonly class="w-40 bg-transparent text-white font-bold text-lg text-right border-none focus:outline-none" placeholder="0.00">
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
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import moment from 'moment'
import api from '@/Js/Services/axios'
import CreatePayroll from './CreatePayroll.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  employee: { type: Object, default: null }
})

// State
const showModal = ref(false)
const selectedEmployee = ref(null)
const tdrop = ref([])
const cdrop = ref([])
const payrollData = ref(null)
const Dtotal = ref('0')
const compensationOptions = ref([])
const mandatoryCompensations = ref([])
const nonMandatoryCompensations = ref([])
const draftMSG = ref('')
const miscMSG = ref('')
const income = ref(0)
const classCache = ref(new Map())
const payrollPeriods = ref([])
const selectedPayrollPeriod = ref('')

// Task arrays
const checkedTasks = ref([])
const draftTasks = ref([])

// Computed
const allTasks = computed(() => [...checkedTasks.value, ...draftTasks.value])
const hasPayrollData = computed(() => payrollData.value && payrollData.value.payroll)

const nonMandatoryTotal = computed(() => {
  const total = nonMandatoryCompensations.value.reduce((sum, item) => sum + (parseFloat(item.misc_amount) || 0), 0)
  return formatCurrency(total)
})

const mandatoryTotal = computed(() => {
  const total = mandatoryCompensations.value.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  return formatCurrency(total)
})

const totalIncome = computed(() => {
  const gross = parseFloat(Dtotal.value.replace(/,/g, '')) || 0
  const nonMandatory = parseFloat(nonMandatoryTotal.value.replace(/,/g, '')) || 0
  const govDeductions = parseFloat(mandatoryTotal.value.replace(/,/g, '')) || 0
  const total = gross + nonMandatory - govDeductions
  income.value = total
  return formatCurrency(total)
})

// Helper functions
const formatCurrency = (value) => new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
const formatNumber = (value) => new Intl.NumberFormat('en-PH').format(value)
const formatDate = (date) => date ? moment(date).format('MMM D, YYYY') : 'N/A'

const getUnitLabel = (unit) => {
  switch(parseInt(unit)) {
    case 1: return 'hrs'
    case 3: return 'kg'
    case 4: return 'container'
    default: return 'unit'
  }
}

const fetchPayrollPeriods = async () => {
  try {
    const response = await api.post('/payroll/list-payroll', { 
      employee_id: selectedEmployee.value?.id 
    })
    if (response.data && !response.data.error) {
      payrollPeriods.value = response.data.payroll || []
      
      if (payrollPeriods.value.length > 0 && !selectedPayrollPeriod.value) {
        selectedPayrollPeriod.value = response.data.currentParollPeriodId
        await fetchPayrollData()
      }
    }
  } catch (error) {
    console.error('Failed to fetch payroll periods:', error)
  }
}

const updateTaskTotal = (task) => {
  let hours = parseFloat(task.netKgPerEmp) || 0
  const rate = parseFloat(task.rate) || 0
  const tarima = parseFloat(task.tarima) || 0
  const multi = parseFloat(task.taskMulti) || 0
  const deduction = parseFloat(task.deduction) || 0
  if (task.unit == 1) hours = hours / 8
  const totalMulti = parseFloat(tarima * multi)
  task.total = ((hours * rate) - (totalMulti + deduction)).toFixed(2)
  calculateGrossTotal()
}

const calculateGrossTotal = () => {
  let total = 0
  checkedTasks.value.forEach(task => { 
    if (task.payrollId !== 0) {
      total += parseFloat(task.total) || 0 
    }
  })
  Dtotal.value = formatCurrency(total)
}

const updateRateFromClass = (task, index) => {
  const selectedClass = (task.classOptions || cdrop.value).find(opt => opt.value == task.taskId)
  if (selectedClass && selectedClass.rate) {
    task.rate = selectedClass.rate
    task.taskMulti = selectedClass.multiplier
    task.unit = selectedClass.measurement
    updateTaskTotal(task)
  }
}

// API Calls
const fetchCompensationOptions = async () => {
  try {
    const response = await api.get('/compensations/non-mandatory')
    if (response.data && !response.data.error) compensationOptions.value = response.data.compensations || []
  } catch (error) { console.error('Failed to fetch compensation options:', error) }
}

const fetchPayrollData = async () => {
  if (!selectedEmployee.value) return
  try {
    const response = await api.post('/payroll/get-by-employee', { 
      employee_id: selectedEmployee.value.id, 
      payroll_id: selectedPayrollPeriod.value
    })
    
    if (response.data && !response.data.error) {
      payrollData.value = response.data
      
      checkedTasks.value = (response.data.payrollChecked || []).map(task => ({
        id: task.id, 
        date: task.date ? moment(task.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        dayType: task.dayType || 1, 
        workerCount: task.workerCount || 1,
        taskType: task.taskType || '', 
        taskId: task.taskId || '',
        rate: task.rate || '', 
        netKgPerEmp: task.unit == 4 ? 1 : task.netKgPerEmp,
        unit: task.unit || 'kg', 
        tarima: task.tarima || 0,
        deduction: task.deduction || 0, 
        total: task.total || 0,
        remarks: task.remarks || '', 
        isCaptured: task.isCapture !== 0,
        payrollId: task.payrollId,
        selected: false, 
        classOptions: []
      }))
      
      draftTasks.value = (response.data.draft || []).map(draft => ({
        id: draft.id, 
        date: draft.date ? moment(draft.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        dayType: draft.dayType || 1, 
        workerCount: draft.workerCount || 1,
        taskType: draft.taskType || '', 
        taskId: draft.taskId || '',
        rate: draft.rate || '', 
        netKgPerEmp: draft.unit == 4 ? 1 : draft.netKgPerEmp,
        unit: draft.unit || 'kg', 
        tarima: draft.tarima || 0,
        deduction: draft.deduction || 0, 
        total: draft.total || 0,
        remarks: draft.remarks || '', 
        classOptions: []
      }))
      
      Dtotal.value = formatCurrency(response.data.total || 0)
      
      await fetchClassesForAllTasks()
    }
  } catch (error) {
    console.error('Failed to fetch payroll data:', error)
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load payroll data', timer: 2000, showConfirmButton: false })
  } finally { 
    fetchCompensations() 
  }
}

const fetchClassesForAllTasks = async () => {
  for (let i = 0; i < checkedTasks.value.length; i++) {
    const task = checkedTasks.value[i]
    if (task.taskType && task.taskType > 0) {
      await fetchClassForTask(task, i, 'checked')
    }
  }
  for (let i = 0; i < draftTasks.value.length; i++) {
    const task = draftTasks.value[i]
    if (task.taskType && task.taskType > 0) {
      await fetchClassForTask(task, i, 'draft')
    }
  }
}

const fetchClassForTask = async (task, index, type) => {
  if (!task.taskType) return
  try {
    if (classCache.value.has(task.taskType)) {
      task.classOptions = classCache.value.get(task.taskType)
      return
    }
    const response = await api.post('/payroll/position', { task_id: task.taskType })
    if (response.data && !response.data.error) {
      classCache.value.set(task.taskType, response.data.position)
      task.classOptions = response.data.position
    }
  } catch (error) { 
    console.error('Failed to fetch class:', error) 
  }
}

const fetchCompensations = async () => {
  try {
    const response = await api.post('/payroll/compensation-list', { 
      emp_id: selectedEmployee.value?.id,
      payroll_id: selectedPayrollPeriod.value
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
        id: compensation.id
      }))
    }
  } catch (error) { 
    console.error('Failed to fetch compensations:', error) 
  }
}

const fetchTask = async () => {
  try {
    const response = await api.get('/payroll/list-task')
    if (response.data && !response.data.error) tdrop.value = response.data.task
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch tasks', timer: 1500, showConfirmButton: false })
  }
}

// Task Operations
const addRowTask = async () => {
  const tempId = 'temp_' + Date.now()
  const newTask = {
    id: tempId, 
    date: moment().format('YYYY-MM-DD'), 
    dayType: 1, 
    workerCount: 1,
    taskType: '', 
    taskId: '', 
    rate: '', 
    netKgPerEmp: '', 
    unit: 'kg',
    tarima: 0, 
    deduction: 0, 
    total: 0, 
    remarks: '', 
    classOptions: []
  }
  draftTasks.value.push(newTask)
  
  try {
    const response = await api.post('/payroll/add-task', { 
      employee_id: selectedEmployee.value.id, 
      task_data: newTask 
    })
    if (response.data && !response.data.error) {
      await fetchPayrollData()
      await Swal.fire({ icon: 'success', title: 'Success!', text: 'New draft task created', timer: 1500, showConfirmButton: false })
    }
  } catch (error) {
    const taskIndex = draftTasks.value.findIndex(t => t.id === tempId)
    if (taskIndex !== -1) draftTasks.value.splice(taskIndex, 1)
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to create new task', timer: 1500, showConfirmButton: false })
  }
}

const updateTask = async (task, index, type) => {
  if (!task.taskType) {
    await Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select a task', timer: 1500, showConfirmButton: false })
    return
  }
  if (!task.taskId) {
    await Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select a class/position', timer: 1500, showConfirmButton: false })
    return
  }

  try {
    Swal.fire({ title: 'Updating Task...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
    
    const taskData = {
      id: task.id, 
      date: task.date, 
      day_type: task.dayType, 
      sp: task.workerCount,
      taskType: task.taskType, 
      taskId: task.taskId, 
      rate: task.rate,
      netKgPerEmp: task.netKgPerEmp, 
      unit: task.unit, 
      tarima: task.tarima,
      deduction: task.deduction, 
      total: task.total, 
      remarks: task.remarks
    }
    
    const payload = {
      employee_id: selectedEmployee.value.id,
      payroll_id: selectedPayrollPeriod.value,
      task_data: taskData,
      task_id: task.id,
      update_task: 1,
      save_task: 1
    }
    if (hasPayrollData.value && payrollData.value?.payroll?.id) payload.payroll_id = payrollData.value.payroll.id
    
    const response = await api.post('/payroll/task-save', payload)
    if (response.data && !response.data.error) {
      Swal.close()
      await Swal.fire({ icon: 'success', title: 'Success!', text: 'Task updated successfully', timer: 1500, showConfirmButton: false })
      await fetchPayrollData()
    }
  } catch (error) {
    Swal.close()
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update task', timer: 1500, showConfirmButton: false })
  }
}

const saveDraftTask = async (index) => {
  const task = draftTasks.value[index]
  if (!task.taskType) {
    await Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select a task', timer: 1500, showConfirmButton: false })
    return
  }
  if (!task.taskId) {
    await Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select a class/position', timer: 1500, showConfirmButton: false })
    return
  }

  const result = await Swal.fire({
    title: 'Save Task', 
    text: 'How would you like to save this task?', 
    icon: 'question',
    showCancelButton: true, 
    showDenyButton: true,
    confirmButtonColor: '#10b981', 
    denyButtonColor: '#f59e0b',
    confirmButtonText: 'Save as Draft', 
    denyButtonText: 'Save & Convert'
  })
  
  if (result.isDismissed) return
  const saveAsDraft = result.isConfirmed
  
  try {
    Swal.fire({ 
      title: saveAsDraft ? 'Saving as Draft...' : 'Saving and Converting...', 
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading() 
    })
    
    const taskData = {
      id: task.id, 
      date: task.date, 
      day_type: task.dayType, 
      sp: task.workerCount,
      taskType: task.taskType, 
      taskId: task.taskId, 
      rate: task.rate,
      netKgPerEmp: task.netKgPerEmp, 
      unit: task.unit, 
      tarima: task.tarima,
      deduction: task.deduction, 
      total: task.total, 
      remarks: task.remarks,
      is_draft: saveAsDraft
    }
    
    const payload = {
      employee_id: selectedEmployee.value.id, 
      payroll_id: selectedPayrollPeriod.value,
      task_data: taskData, 
      task_id: task.id,
      save_task: saveAsDraft ? 0 : 1
    }
    if (hasPayrollData.value && payrollData.value?.payroll?.id) payload.payroll_id = payrollData.value.payroll.id
    
    const response = await api.post('/payroll/task-save', payload)
    if (response.data && !response.data.error) {
      Swal.close()
      await Swal.fire({ 
        icon: 'success', 
        title: saveAsDraft ? 'Draft Saved!' : 'Task Converted!', 
        timer: 1500, 
        showConfirmButton: false 
      })
      await fetchPayrollData()
    }
  } catch (error) {
    Swal.close()
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save task', timer: 1500, showConfirmButton: false })
  }
}

const deleteTask = async (taskId, index, type) => {
  const result = await Swal.fire({ 
    title: 'Are you sure?', 
    text: 'Do you want to remove this task?', 
    icon: 'warning', 
    showCancelButton: true, 
    confirmButtonColor: '#d33', 
    confirmButtonText: 'Yes, remove it!' 
  })
  if (result.isConfirmed) {
    try {
      if (taskId && !taskId.toString().startsWith('temp')) {
        await api.post('/payroll/task-delete', { task_id: taskId })
      }
      
      if (type === 'checked') checkedTasks.value.splice(index, 1)
      else if (type === 'draft') draftTasks.value.splice(index, 1)
      
      await fetchPayrollData()
      await Swal.fire({ icon: 'success', title: 'Removed!', text: 'Task removed successfully', timer: 1500, showConfirmButton: false })
    } catch (error) {
      console.error('Failed to delete task:', error)
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete task', timer: 1500, showConfirmButton: false })
    }
  }
}

const weeklytask = async () => {
  await fetchPayrollData()
  await Swal.fire({ icon: 'info', title: 'Reloaded', text: 'Tasks have been refreshed', timer: 1500, showConfirmButton: false })
}

const submitPayroll = async () => {
  if (draftTasks.value.length > 0) {
    const result = await Swal.fire({
      title: 'Draft Tasks Exist', 
      text: 'There are draft tasks that haven\'t been saved. Do you want to save them before submitting?',
      icon: 'warning', 
      showCancelButton: true, 
      showDenyButton: true,
      confirmButtonText: 'Save All Drafts', 
      denyButtonText: 'Submit Anyway'
    })
    if (result.isConfirmed) await saveAllDraftTasks()
    if (result.isDenied) await proceedWithSubmit()
  } else {
    await proceedWithSubmit()
  }
}

const saveAllDraftTasks = async () => {
  if (draftTasks.value.length === 0) return
  try {
    Swal.fire({ 
      title: 'Saving Drafts...', 
      text: `Saving ${draftTasks.value.length} draft task(s)`, 
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading() 
    })
    for (const task of draftTasks.value) {
      const taskData = { 
        id: task.id, 
        date: task.date, 
        day_type: task.dayType, 
        sp: task.workerCount, 
        taskType: task.taskType, 
        taskId: task.taskId, 
        rate: task.rate, 
        netKgPerEmp: task.netKgPerEmp, 
        unit: task.unit, 
        tarima: task.tarima, 
        deduction: task.deduction, 
        total: task.total, 
        remarks: task.remarks, 
        is_draft: false 
      }
      const payload = { 
        employee_id: selectedEmployee.value.id, 
        task_data: taskData, 
        payroll_id: payrollData.value.payroll.id 
      }
      await api.post('/payroll/task/save', payload)
    }
    Swal.close()
    await fetchPayrollData()
    await proceedWithSubmit()
  } catch (error) {
    Swal.close()
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save draft tasks', timer: 1500, showConfirmButton: false })
  }
}

const proceedWithSubmit = async () => {
  const result = await Swal.fire({ 
    title: 'Submit Payroll?', 
    text: 'Are you sure you want to submit this payroll?', 
    icon: 'question', 
    showCancelButton: true, 
    confirmButtonText: 'Yes, submit it' 
  })
  if (!result.isConfirmed) return
  try {
    Swal.fire({ title: 'Submitting payroll...', allowOutsideClick: true, didOpen: () => Swal.showLoading() })
    const taskIds = checkedTasks.value.map(task => task.id)
    // console.log(taskIds);
    
    const response = await api.post('/payroll/submit', { 
      payroll_ids: taskIds,
      payroll_id: selectedPayrollPeriod.value, 
      total_income: income.value, 
      emp_id: selectedEmployee.value.id 
    })
    if (response.data && !response.data.error) {
      Swal.close()
      await Swal.fire({ icon: 'success', title: 'Success!', text: 'Payroll submitted successfully', timer: 1500, showConfirmButton: false })
      await fetchPayrollData()
      closeModal()
    }
  } catch (error) {
    console.log(error);
    
    Swal.close()
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit payroll', timer: 1500, showConfirmButton: false })
  }
}

// Compensation Operations
const miscdraft = () => {
  nonMandatoryCompensations.value.push({
    payroll_id: selectedPayrollPeriod.value, 
    misc_desc: 0, 
    misc_amount: 0,
    misc_remarks: '', 
    is_draft: true, 
    temp_id: Date.now()
  })
}

const miscSave = async (index) => {
  const item = nonMandatoryCompensations.value[index]
  if (!item.misc_desc || item.misc_desc === 0) {
    await Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please select a compensation type', timer: 1500, showConfirmButton: false })
    return
  }
  if (!item.misc_amount) {
    await Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please enter a valid amount', timer: 1500, showConfirmButton: false })
    return
  }
  try {
    const response = await api.post('/payroll/compensation-add', { 
      compensation_data: { 
        ...item, 
        payroll_id: selectedPayrollPeriod.value, 
        emp_id: selectedEmployee.value.id 
      } 
    })
    if (response.data && !response.data.error) {
      item.is_draft = false
      if (item.temp_id) delete item.temp_id
      await fetchCompensations()
      await Swal.fire({ icon: 'success', title: 'Saved!', text: 'Item saved successfully', timer: 1500, showConfirmButton: false })
    }
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save item', timer: 1500, showConfirmButton: false })
    console.log(error);
    
  }
}

const confirmMiscDelete = async (index) => {
  const result = await Swal.fire({ 
    title: 'Are you sure?', 
    text: 'Do you want to remove this item?', 
    icon: 'warning', 
    showCancelButton: true, 
    confirmButtonText: 'Yes, remove it!' 
  })
  if (result.isConfirmed) {
    const item = nonMandatoryCompensations.value[index]
    if (!item.is_draft && item.id) {
      try { 
        await api.post('/payroll/compensation-delete', { compensation_id: item.id }) 
      } catch (error) { 
        console.error('Failed to delete item:', error) 
      }
    }
    nonMandatoryCompensations.value.splice(index, 1)
    await Swal.fire({ icon: 'success', title: 'Removed!', text: 'Item removed successfully', timer: 1500, showConfirmButton: false })
  }
}

const toggleTaskSelection = async (task, index, type) => {
  // Store the original state
  const originalState = task.isCaptured
  // Toggle the local state immediately for UI responsiveness
  task.isCaptured = !task.isCaptured
  
  try {
    Swal.fire({
      title: task.isCaptured ? 'Remove from Payroll?' : 'Add to Payroll?',
      text: task.isCaptured 
        ? 'This will remove the task from the current payroll.'
        : 'This will add the task to the current payroll.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: task.isCaptured ? 'Yes, remove it' : 'Yes, add it',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Processing...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          })          

          const newPayrollId = task.isCaptured ? selectedPayrollPeriod.value : 0
          
          const response = await api.post('/payroll/process-tasks', {
            task_id: task.id,
            payroll_id: newPayrollId,
            employee_id: selectedEmployee.value.id
          })

          if (response.data && !response.data.error) {
            Swal.close()
            await Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: task.isCaptured ? 'Task removed from payroll' : 'Task added to payroll',
              timer: 1500,
              showConfirmButton: false
            })
            await fetchPayrollData()
          } else {
            // Revert on error
            task.isCaptured = originalState
            Swal.close()
            await Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data?.message || 'Operation failed',
              timer: 1500,
              showConfirmButton: false
            })
          }
        } catch (error) {
          // Revert on error
          task.isCaptured = originalState
          Swal.close()
          console.log(error);
          
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to process request',
            timer: 1500,
            showConfirmButton: false
          })
        }
      } else {
        // Revert if cancelled
        console.log(originalState);
        
        task.isCaptured = originalState
      }
    })
  } catch (error) {
    console.error('Error toggling task:', error)
    task.isCaptured = originalState
  }
}

// Modal Operations
const openModal = async () => {
  selectedEmployee.value = props.employee
  showModal.value = true

  await fetchPayrollPeriods()
  fetchPayrollData()
  fetchTask()
  fetchCompensationOptions()
}

const closeModal = () => {
  showModal.value = false
  selectedEmployee.value = null
  checkedTasks.value = []
  draftTasks.value = []
  payrollData.value = null
  classCache.value.clear()
  mandatoryCompensations.value = []
  nonMandatoryCompensations.value = []
  selectedPayrollPeriod.value = ''
}

const handlePayrollCreated = () => {
  fetchPayrollPeriods()
}
const handleModalClosed = () => {}
</script>