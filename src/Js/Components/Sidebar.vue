<template>
  <aside
    class="bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out relative h-screen sticky top-0"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Collapse Toggle Button -->
    <button
      @click="toggleCollapse"
      class="absolute -right-3 top-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg z-10 transition-transform"
      :title="isCollapsed ? 'Expand' : 'Collapse'"
    >
      <FontAwesomeIcon :icon="isCollapsed ? faChevronRight : faChevronLeft" class="w-3 h-3" />
    </button>

    <!-- Brand -->
    <div class="p-4 border-b border-gray-700" :class="isCollapsed ? 'text-center' : 'text-center'">
      <img
        src=""
        class="h-10 mx-auto mb-2 opacity-80"
        alt="Logo"
        v-if="!isCollapsed"
      >
      <h4 class="font-bold text-green-400 text-lg">
        {{ isCollapsed ? 'JWT' : 'Janwilbur Trading' }}
      </h4>
      <p v-if="!isCollapsed" class="text-xs text-gray-400">
        Payroll Management System
      </p>
    </div>

    <!-- User Info -->
    <div class="p-4 border-b border-gray-700" :class="isCollapsed ? 'flex justify-center' : 'flex items-center space-x-3'">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
        {{ userInitials }}
      </div>
      <div v-if="!isCollapsed" class="overflow-hidden">
        <div class="text-sm font-semibold truncate">
          {{user_data.username }}
        </div>
        <div class="text-xs text-gray-400 truncate">
          {{ user.position }}
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <!-- Dashboard -->
      <RouterLink
        v-if="user.position !== 'Viewer'"
        to="/dashboard"
        class="flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 relative group"
        :class="[isCollapsed ? 'justify-center' : 'space-x-3', { 'bg-gray-800 text-green-400': isActive('/dashboard') }]"
        :title="isCollapsed ? 'Dashboard' : ''"
      >
        <FontAwesomeIcon :icon="faTachometerAlt" class="w-4 flex-shrink-0" :class="{ 'text-green-400': isActive('/dashboard') }" />
        <span v-if="!isCollapsed" class="flex-1">Dashboard</span>
        
        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Dashboard
        </div>
      </RouterLink>

      <!-- Employee Information -->
      <div v-if="user.position !== 'Viewer'" class="relative">
        <button
          @click="!isCollapsed && toggle('employee')"
          class="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : 'justify-between'"
          :title="isCollapsed ? 'Employee Information' : ''"
        >
          <span class="flex items-center" :class="!isCollapsed && 'space-x-3'">
            <FontAwesomeIcon :icon="faUsers" class="w-4 flex-shrink-0" />
            <span v-if="!isCollapsed">Employees</span>
          </span>
          <span v-if="!isCollapsed" class="text-xs transition-transform" :class="{ 'rotate-180': openMenu === 'employee' }">▼</span>
        </button>

        <!-- Submenu -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="!isCollapsed && openMenu === 'employee'" class="pl-10 mt-1 space-y-1 overflow-hidden">
            <RouterLink to="/employees/add" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Register Employee</span>
              </span>
            </RouterLink>
            <RouterLink to="/employees" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Employee List</span>
              </span>
            </RouterLink>
          </div>
        </transition>

        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Employee Information
        </div>
      </div>

      <!-- Payroll -->
      <div v-if="user.position !== 'Viewer'" class="relative">
        <button
          @click="!isCollapsed && toggle('payroll')"
          class="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : 'justify-between'"
          :title="isCollapsed ? 'Payroll' : ''"
        >
          <span class="flex items-center" :class="!isCollapsed && 'space-x-3'">
            <FontAwesomeIcon :icon="faMoneyBillWave" class="w-4 flex-shrink-0" />
            <span v-if="!isCollapsed">Payroll</span>
          </span>
          <span v-if="!isCollapsed" class="text-xs transition-transform" :class="{ 'rotate-180': openMenu === 'payroll' }">▼</span>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="!isCollapsed && openMenu === 'payroll'" class="pl-10 mt-1 space-y-1 overflow-hidden">
            <RouterLink to="/attendance" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Attendance</span>
              </span>
            </RouterLink>
            <RouterLink to="/manage-payroll" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Payroll Management</span>
              </span>
            </RouterLink>
            <RouterLink to="/rate" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Rates</span>
              </span>
            </RouterLink>
            <RouterLink to="/contribution" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Contribution</span>
              </span>
            </RouterLink>
          </div>
        </transition>

        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Payroll
        </div>
      </div>

      <!-- Voucher -->
      <div v-if="user.position !== 'Viewer'" class="relative">
        <button
          @click="!isCollapsed && toggle('voucher')"
          class="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : 'justify-between'"
          :title="isCollapsed ? 'Voucher' : ''"
        >
          <span class="flex items-center" :class="!isCollapsed && 'space-x-3'">
            <FontAwesomeIcon :icon="faTag" class="w-4 flex-shrink-0" />
            <span v-if="!isCollapsed">Voucher</span>
          </span>
          <span v-if="!isCollapsed" class="text-xs transition-transform" :class="{ 'rotate-180': openMenu === 'voucher' }">▼</span>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="!isCollapsed && openMenu === 'voucher'" class="pl-10 mt-1 space-y-1 overflow-hidden">
            <RouterLink to="/voucher" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Voucher</span>
              </span>
            </RouterLink>
            <RouterLink to="/supplier" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Supplier</span>
              </span>
            </RouterLink>
            <RouterLink to="/pricelist" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Pricelist</span>
              </span>
            </RouterLink>
            <RouterLink to="/deduction" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Deductions</span>
              </span>
            </RouterLink>
            <RouterLink to="/payables" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Payables Report</span>
              </span>
            </RouterLink>
            <RouterLink to="/daily_task_report" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Daily Item Inventory</span>
              </span>
            </RouterLink>
          </div>
        </transition>

        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Voucher
        </div>
      </div>

      <!-- Production -->
      <RouterLink
        to="/production"
        class="flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 relative group"
        :class="[isCollapsed ? 'justify-center' : 'space-x-3', { 'bg-gray-800 text-green-400': isActive('/production') }]"
        :title="isCollapsed ? 'Production' : ''"
      >
        <FontAwesomeIcon :icon="faIndustry" class="w-4 flex-shrink-0" :class="{ 'text-green-400': isActive('/production') }" />
        <span v-if="!isCollapsed" class="flex-1">Production</span>
        
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Production
        </div>
      </RouterLink>

      <!-- Loading -->
      <RouterLink
        to="/loading"
        class="flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 relative group"
        :class="[isCollapsed ? 'justify-center' : 'space-x-3', { 'bg-gray-800 text-green-400': isActive('/loading') }]"
        :title="isCollapsed ? 'Loading' : ''"
      >
        <FontAwesomeIcon :icon="faTruck" class="w-4 flex-shrink-0" :class="{ 'text-green-400': isActive('/loading') }" />
        <span v-if="!isCollapsed" class="flex-1">Loading</span>
        
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Loading
        </div>
      </RouterLink>

      <!-- Reports -->
      <div v-if="user.position !== 'Viewer'" class="relative">
        <button
          @click="!isCollapsed && toggle('reports')"
          class="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : 'justify-between'"
          :title="isCollapsed ? 'Reports' : ''"
        >
          <span class="flex items-center" :class="!isCollapsed && 'space-x-3'">
            <FontAwesomeIcon :icon="faBook" class="w-4 flex-shrink-0" />
            <span v-if="!isCollapsed">Reports</span>
          </span>
          <span v-if="!isCollapsed" class="text-xs transition-transform" :class="{ 'rotate-180': openMenu === 'reports' }">▼</span>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="!isCollapsed && openMenu === 'reports'" class="pl-10 mt-1 space-y-1 overflow-hidden">
            <button @click="openPrintModal" class="block w-full text-left py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Payslip Print</span>
              </span>
            </button>
            <RouterLink to="/pakyaw_task" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Pakyaw Task</span>
              </span>
            </RouterLink>
            <RouterLink to="/payroll_summary" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Payroll Summary</span>
              </span>
            </RouterLink>
            <RouterLink to="/pakyaw_summary" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Pakyaw Summary</span>
              </span>
            </RouterLink>
            <RouterLink to="/print_history" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Print History</span>
              </span>
            </RouterLink>
          </div>
        </transition>

        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Reports
        </div>
      </div>

      <!-- Request -->
      <div class="relative">
        <button
          @click="!isCollapsed && toggle('request')"
          class="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : 'justify-between'"
          :title="isCollapsed ? 'Request' : ''"
        >
          <span class="flex items-center" :class="!isCollapsed && 'space-x-3'">
            <FontAwesomeIcon :icon="faRocket" class="w-4 flex-shrink-0" />
            <span v-if="!isCollapsed">Request</span>
          </span>
          <span v-if="!isCollapsed" class="text-xs transition-transform" :class="{ 'rotate-180': openMenu === 'request' }">▼</span>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="!isCollapsed && openMenu === 'request'" class="pl-10 mt-1 space-y-1 overflow-hidden">
            <button @click="openRequestModal" class="block w-full text-left py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Request</span>
              </span>
            </button>
            <RouterLink to="/history" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Request History</span>
              </span>
            </RouterLink>
            <RouterLink v-if="user.position === 'SuperAdmin'" to="/approval" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Approve Request</span>
              </span>
            </RouterLink>
          </div>
        </transition>

        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Request
        </div>
      </div>

      <!-- System Management - SuperAdmin Only -->
      <div v-if="user.position === 'SuperAdmin'" class="relative">
        <button
          @click="!isCollapsed && toggle('system')"
          class="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : 'justify-between'"
          :title="isCollapsed ? 'System Management' : ''"
        >
          <span class="flex items-center" :class="!isCollapsed && 'space-x-3'">
            <FontAwesomeIcon :icon="faCog" class="w-4 flex-shrink-0" />
            <span v-if="!isCollapsed">System Management</span>
          </span>
          <span v-if="!isCollapsed" class="text-xs transition-transform" :class="{ 'rotate-180': openMenu === 'system' }">▼</span>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="!isCollapsed && openMenu === 'system'" class="pl-10 mt-1 space-y-1 overflow-hidden">
            <RouterLink to="/user" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>New User</span>
              </span>
            </RouterLink>
            <RouterLink to="/configuration" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Configuration</span>
              </span>
            </RouterLink>
            <RouterLink to="/logs" class="block py-2 px-2 text-sm rounded hover:bg-gray-800 hover:text-green-400 transition-colors">
              <span class="flex items-center space-x-2">
                <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>System Logs</span>
              </span>
            </RouterLink>
          </div>
        </transition>

        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          System Management
        </div>
      </div>
    </nav>

    <!-- Logout -->
    <div class="p-4 border-t border-gray-700">
      <button
        @click="confirmLogout"
        class="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 relative group font-medium"
        :class="isCollapsed ? 'px-2' : 'space-x-3'"
        :title="isCollapsed ? 'Logout' : ''"
      >
        <FontAwesomeIcon :icon="faPowerOff" class="w-4 flex-shrink-0" />
        <span v-if="!isCollapsed">Logout</span>
        
        <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-gray-700">
          Logout
        </div>
      </button>
    </div>
  </aside>

  <!-- Payslip Print Modal -->
  <transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="printModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closePrintModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="bg-gray-800 px-6 py-4">
          <h3 class="text-lg font-semibold text-white">Print Payslip</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select v-model="printData.group" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="regular">Regular</option>
              <option value="pakyaw">Pakyaw</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div v-if="printData.group !== 'regular'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select v-model="printData.batch" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="Batch 0">Batch 0</option>
              <option value="Batch 1">Batch 1</option>
              <option value="Batch 2">Batch 2</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input type="month" v-model="printData.month" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input type="date" v-model="printData.from" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input type="date" v-model="printData.to" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select v-model="printData.type" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="payslip">Payslip</option>
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          <div class="flex items-center">
            <input type="checkbox" v-model="printData.contribution" id="contribution" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
            <label for="contribution" class="ml-2 block text-sm text-gray-700">Include Contribution</label>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button @click="closePrintModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button @click="printPayslip" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Print
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Request Modal -->
  <transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="reqModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeRequestModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="bg-gray-800 px-6 py-4">
          <h3 class="text-lg font-semibold text-white">New Request</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div v-if="msgModal" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {{ msgModal }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" v-model="requestData.rdate" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select v-model="requestData.type" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Type</option>
              <option value="leave">Leave</option>
              <option value="overtime">Overtime</option>
              <option value="adjustment">Salary Adjustment</option>
              <option value="document">Document Request</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select v-model="requestData.period" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Period</option>
              <option value="first">First Half</option>
              <option value="second">Second Half</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea v-model="requestData.remarks" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter details..."></textarea>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button @click="closeRequestModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button @click="submitRequest" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors" :disabled="!isRequestValid">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Logout Confirmation Modal -->
  <transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="logoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="logoutModal = false">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div class="bg-red-600 px-6 py-4">
          <h3 class="text-lg font-semibold text-white">Confirm Logout</h3>
        </div>
        
        <div class="p-6">
          <p class="text-gray-700">Are you sure you want to logout?</p>
        </div>

        <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button @click="logoutModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../Services/axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTachometerAlt,
  faUsers,
  faMoneyBillWave,
  faTag,
  faBook,
  faRocket,
  faCog,
  faIndustry,
  faTruck,
  faPowerOff,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
const user_data = JSON.parse(localStorage.getItem('user'))

const router = useRouter()
const route = useRoute()

// State
const isCollapsed = ref(false)
const openMenu = ref(null)
const printModal = ref(false)
const reqModal = ref(false)
const msgModal = ref('')
const logoutModal = ref(false)
const user = ref({
  fname: '',
  username: '',
  position: ''
})

// Form data
const printData = ref({
  group: 'regular',
  batch: 'Batch 0',
  month: '',
  from: '',
  to: '',
  type: 'payslip',
  contribution: true
})

const requestData = ref({
  rdate: new Date().toISOString().split('T')[0],
  type: '',
  period: '',
  remarks: ''
})

// Computed
const userInitials = computed(() => {
  if (user.value.fname) {
    return user.value.fname.charAt(0).toUpperCase()
  }
  return user.value.username ? user.value.username.charAt(0).toUpperCase() : 'U'
})

const isRequestValid = computed(() => {
  return requestData.value.type && requestData.value.period && requestData.value.remarks
})

// Methods
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    openMenu.value = null
  }
}

const toggle = (menu) => {
  openMenu.value = openMenu.value === menu ? null : menu
}

const isActive = (path) => {
  return route.path.startsWith(path)
}

const openPrintModal = () => {
  printModal.value = true
  openMenu.value = null
}

const closePrintModal = () => {
  printModal.value = false
  // Reset form
  printData.value = {
    group: 'regular',
    batch: 'Batch 0',
    month: '',
    from: '',
    to: '',
    type: 'payslip',
    contribution: true
  }
}

const printPayslip = () => {
  // Implement print logic
  console.log('Printing payslip:', printData.value)
  // You can emit an event or call an API here
  closePrintModal()
}

const openRequestModal = () => {
  reqModal.value = true
  openMenu.value = null
  msgModal.value = ''
}

const closeRequestModal = () => {
  reqModal.value = false
  // Reset form
  requestData.value = {
    rdate: new Date().toISOString().split('T')[0],
    type: '',
    period: '',
    remarks: ''
  }
  msgModal.value = ''
}

const submitRequest = async () => {
  if (!isRequestValid.value) return
  
  try {
    // API call to submit request
    // await api.post('/requests', requestData.value)
    
    msgModal.value = 'Request submitted successfully!'
    setTimeout(() => {
      closeRequestModal()
    }, 1500)
  } catch (error) {
    console.error('Error submitting request:', error)
    msgModal.value = 'Error submitting request. Please try again.'
  }
}

const confirmLogout = () => {
  logoutModal.value = true
}

const logout = async () => {
  try {
    await api.post('/logout')
    router.push({ name: 'login' })
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    } catch (err) {
    console.error('Logout error:', err)
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    router.push({ name: 'login' })
  } finally {
    logoutModal.value = false
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
  }
}

// Load user data
const loadUser = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await api.get('/user')
      user.value = res.data
    }
  } catch (err) {
    console.error('Failed to load user', err)
    // If unauthorized, redirect to login
    if (err.response?.status === 401) {
      router.push({ name: 'login' })
    }
  }
}

// Lifecycle
onMounted(() => {
  loadUser()
})
</script>

<style scoped>
/* Custom scrollbar for the nav */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Active link styles */
.router-link-active {
  @apply bg-gray-800 text-green-400;
}

/* Transition for submenu */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease, max-height 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>