<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold leading-tight text-gray-800">
        Dashboard
      </h2>
    </div>

    <!-- Main Content -->
    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- Welcome Card -->
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div class="p-6 text-gray-900">
            You're logged in!
          </div>
        </div>

        <!-- Holidays Section -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Upcoming Holidays</h3>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="mt-2 text-gray-600">Loading holidays...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <!-- Holiday Content -->
          <div v-else>
            <!-- Today's Holidays -->
            <div v-if="todayHolidays.length > 0" class="mb-6">
              <h4 class="text-md font-semibold text-red-600 mb-2">
                🎉 Today's Holidays
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="holiday in todayHolidays" 
                  :key="holiday.id"
                  class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm"
                >
                  <div class="font-semibold text-gray-800">{{ holiday.name }}</div>
                  <div class="text-sm text-gray-600">{{ getTypeLabel(holiday.type) }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(holiday.date) }}</div>
                  <span class="inline-block mt-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                    Today!
                  </span>
                </div>
              </div>
            </div>

            <!-- Upcoming Holidays (within 7 days) -->
            <div v-if="upcomingHolidays.length > 0">
              <h4 class="text-md font-semibold text-blue-600 mb-2">
                📅 Next 7 Days
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="holiday in upcomingHolidays" 
                  :key="holiday.id"
                  class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm"
                >
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-gray-800">{{ holiday.name }}</div>
                    <span class="inline-block text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                      {{ getDaysLeft(holiday.date) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">{{ getTypeLabel(holiday.type) }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(holiday.date) }}</div>
                </div>
              </div>
            </div>

            <!-- No Upcoming Holidays -->
            <div v-if="todayHolidays.length === 0 && upcomingHolidays.length === 0" class="text-center py-8 text-gray-500">
              No upcoming holidays in the next 7 days.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/Js/Services/axios'
import { ref, onMounted, computed } from 'vue'

// Reactive state
const holidays = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch holidays from API
const fetchHolidays = async () => {
  try {
    const response = await api.post('holidays/list-upcoming')
    return response.data?.holidays || []
  } catch (error) {
    console.error('Error fetching holidays:', error)
    throw error
  }
}

// Computed: holidays happening today
const todayHolidays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return holidays.value.filter(holiday => {
    const holidayDate = new Date(holiday.date)
    holidayDate.setHours(0, 0, 0, 0)
    return holidayDate.getTime() === today.getTime()
  })
})

// Computed: upcoming holidays (within 7 days, excluding today)
const upcomingHolidays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const sevenDaysFromNow = new Date(today)
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  
  return holidays.value
    .filter(holiday => {
      const holidayDate = new Date(holiday.date)
      holidayDate.setHours(0, 0, 0, 0)
      // Exclude today's holidays (already shown in todayHolidays)
      const isToday = holidayDate.getTime() === today.getTime()
      // Include holidays within 7 days
      const isWithin7Days = holidayDate >= today && holidayDate <= sevenDaysFromNow
      return isWithin7Days && !isToday
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Get days left message
const getDaysLeft = (dateString) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const holidayDate = new Date(dateString)
  holidayDate.setHours(0, 0, 0, 0)
  
  const diffTime = holidayDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today!'
  if (diffDays === 1) return 'Tomorrow'
  return `${diffDays} days`
}

// Load data on mount
onMounted(async () => {
  try {
    loading.value = true
    const data = await fetchHolidays()
    holidays.value = data
  } catch (err) {
    error.value = 'Failed to load holidays'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Get type label
const getTypeLabel = (type) => {
  const types = {
    3: 'Regular Holiday',
    7: 'Special Non-Working',
    11: 'Special Holiday'
  }
  return types[type] || `Type ${type}`
}
</script>