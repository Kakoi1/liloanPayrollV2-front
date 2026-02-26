<!-- EmployeeCard.vue -->
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  employee: Object,
  column: String,
  isActive: Boolean
})

const emit = defineEmits(['show-actions', 'hide-actions', 'update-status'])

const getActionButtons = (currentStatus, employeeId) => {
  const statusMap = {
    1: 'present',
    2: 'absent',
    3: 'halfday',
    4: 'restday'
  }
  
  const currentStatusStr = statusMap[currentStatus] || currentStatus
  const allStatuses = ['present', 'absent', 'halfday', 'restday']
  const buttons = []
  
  allStatuses.forEach(status => {
    if (status !== currentStatusStr) {
      const colors = {
        present: 'bg-green-600 hover:bg-green-700',
        absent: 'bg-red-600 hover:bg-red-700',
        halfday: 'bg-yellow-500 hover:bg-yellow-600',
        restday: 'bg-gray-500 hover:bg-gray-600'
      }
      
      buttons.push({
        status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        class: colors[status],
        action: () => emit('update-status', employeeId, status)
      })
    }
  })
  
  return buttons
}
</script>

<template>
  <div class="border rounded-lg bg-white hover:shadow transition-shadow">
    <!-- Action Buttons -->
    <div v-if="isActive" class="p-2">
      <div class="flex flex-wrap gap-1">
        <button
          v-for="btn in getActionButtons(employee.workStatus, employee.id)"
          :key="btn.status"
          @click="btn.action"
          class="px-2 py-1 text-xs text-white rounded"
          :class="btn.class"
        >
          {{ btn.label}} 
        </button>
        <button
          @click="$emit('hide-actions')"
          class="px-2 py-1 text-xs border border-red-300 rounded hover:bg-red-50"
        >
          <FontAwesomeIcon :icon="faTimes" class="text-red-600" />
        </button>
      </div>
    </div>
    
    <!-- Employee Info -->
    <div v-else class="p-3">
      <div class="flex justify-between items-start mb-1">
        <span class="text-sm font-medium">{{ employee.fullName }}</span>
        <button
          @click="$emit('show-actions', employee.empId, column)"
          class="text-gray-400 hover:text-blue-600"
        >
          <FontAwesomeIcon :icon="faArrowRight" />
        </button>
      </div>
      <div class="text-xs text-gray-500">
        <span>{{ employee.employeeId }}</span>
        <span v-if="employee.class" class="ml-2">• {{ employee.class }}</span>
      </div>
      <div class="text-xs text-gray-500 mt-1">
        Hours: {{ employee.hoursWorked }} | Rate: ₱{{ parseFloat(employee.rate).toFixed(2) }}
      </div>
    </div>
  </div>
</template>