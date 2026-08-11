<template>
  <div 
    class="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-move transition-colors"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="toggleActions"
  >
    <div class="flex items-center min-w-0 flex-1">
      <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
        {{ employee.fullName ? employee.fullName.charAt(0) : '?' }}
      </div>
      <div class="ml-2 truncate">
        <div class="text-sm font-medium text-gray-900 truncate">
          {{ employee.fullName }}
        </div>
        <div class="text-xs text-gray-500 truncate">
          ID: {{ employee.employeeId }}
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-1 flex-shrink-0 ml-2">
      <span 
        v-if="!showActions" 
        class="text-xs text-gray-400"
        title="Drag to move or click for actions"
      >
        <FontAwesomeIcon :icon="faGripVertical" />
      </span>
      <div v-else class="flex space-x-1">
        <button 
          v-for="status in availableStatuses" 
          :key="status.value"
          @click.stop="updateStatus(status.value)"
          class="px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
          :class="status.class"
        >
          {{ status.label }}
        </button>
        <button 
          @click.stop="toggleActions"
          class="px-1 py-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon :icon="faTimes" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes, faGripVertical } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
  column: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['drag-start', 'drag-end', 'update-status'])

// State
const showActions = ref(false)

// Available statuses based on current column
const availableStatuses = computed(() => {
  const allStatuses = [
    { value: 'present', label: 'Present', class: 'text-green-600 hover:bg-green-50' },
    { value: 'absent', label: 'Absent', class: 'text-red-600 hover:bg-red-50' },
    { value: 'halfday', label: 'Halfday', class: 'text-yellow-600 hover:bg-yellow-50' },
    { value: 'restday', label: 'Restday', class: 'text-gray-600 hover:bg-gray-50' }
  ]
  // Filter out current status
  return allStatuses.filter(status => status.value !== props.column)
})

// Drag handlers
const onDragStart = (event) => {
  // Add a visual indication that the item is being dragged
  event.target.style.opacity = '0.5'
  // Pass the employee data and column to parent
  emit('drag-start', event, {
    ...props.employee,
    currentColumn: props.column
  })
}

const onDragEnd = (event) => {
  event.target.style.opacity = '1'
  emit('drag-end')
}

// Toggle action buttons
const toggleActions = (event) => {
  showActions.value = !showActions.value
}

// Update employee status
const updateStatus = (newStatus) => {
  // Use empAtt_id if available, otherwise fallback to empId
  const id = props.employee.empAtt_id || props.employee.empId
  emit('update-status', id, newStatus)
  showActions.value = false
}
</script>

<style scoped>
.cursor-move {
  cursor: move;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Optional: Add a subtle animation when showing actions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>