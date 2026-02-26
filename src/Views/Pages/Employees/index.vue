<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExpand, faMinus, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons'
import Edit from "./Edit/index.vue";
import View from "./View/index.vue"
import Paginator from '@/Js/Components/Paginate.vue'
import api from '@/Js/Services/axios'
import Swal from 'sweetalert2'

// State
const data = ref([])
const totalRows = ref(0)
const loading = ref(false)
const positions = ref([])

// Search and pagination
const search = ref('')
const pageNum = ref(1)
const itemsPerPage = ref(10)

// Modal state
const masterlistModal = ref(null)
const editModal = ref('')

// User info from localStorage
const user = ref({
    position: ''
})

// Computed
const position = computed(() => user.value?.position || '')
const emptyResult = computed(() => data.value.length === 0)

// Select all checkbox
const allSelected = computed({
    get: () => data.value.length > 0 && data.value.every(item => item.selected),
    set: (value) => {
        data.value.forEach(item => item.selected = value)
    }
})

// Fetch user info from localStorage
const fetchUserInfo = () => {
    try {
        const userData = localStorage.getItem('auth')
        if (userData) {
            user.value = JSON.parse(userData)
        }
    } catch (error) {
        console.error('Error fetching user info:', error)
    }
}

// Fetch data using axios
const fetchData = async () => {
    loading.value = true
    try {
        const response = await api.post('/employee/list', {
            search: search.value,
            page_num: pageNum.value,
            items_perpage: itemsPerPage.value
        })

        data.value = response.data.listEmployee.map(emp => ({
            ...emp,
            selected: false,
            employee_id: emp.employeeId,
            full_name: emp.fullName,
            position: emp.position,
            start_date: emp.dateStarted,
            work_status: emp.workStatus
        }))
        totalRows.value = response.data.totalrows
    } catch (error) {
        console.error('Error fetching data:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch employee data'
        })
    } finally {
        loading.value = false
    }
}

// Handle page change
const handlePageNum = (page_num) => {
    pageNum.value = page_num
    fetchData()
}

// Search debounce
let timeout = null
watch(search, () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        pageNum.value = 1
        fetchData()
    }, 500)
})

// Download methods
const downloadSelected = () => {
    const selectedIds = data.value
        .filter(item => item.selected)
        .map(item => item.employee_id)

    if (selectedIds.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please select at least one employee'
        })
        return
    }

    window.location.href = `/masterlist/download-selected?ids=${selectedIds.join(',')}`
}

const downloadAll = () => {
    window.location.href = '/masterlist/ex'
}

// Fetch positions function
const fetchPositions = async () => {
    try {
        console.log('Fetching positions...')
        const response = await api.get('/employee/positions')
        console.log('Positions API Response:', response.data)

        // Clear existing positions
        positions.value = []

        // Check if response has the data structure
        if (response.data?.position) {
            // Map the positions to value/label format
            positions.value = response.data.position
        }

        console.log('Mapped positions:', positions.value)

    } catch (error) {
        console.error('Error fetching positions:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load positions'
        })
    }
}

// View/Edit methods
const viewDetails = (employee) => {
    masterlistModal.value = employee
    editModal.value = 'View'
}

const editDetails = (employee) => {
    masterlistModal.value = employee
    editModal.value = 'Edit'
}

const handleTransaction = () => {
    fetchData()
}

// Navigation function (replacement for Inertia Link)
const navigateTo = (path) => {
    window.location.href = path
}

// Initialize
onMounted(() => {
    fetchUserInfo()
    fetchData()
    fetchPositions()
})
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Content Header -->
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-semibold text-gray-900">Employee</h1>
                    <div class="text-sm text-gray-500">
                        <a href="/dashboard" class="text-blue-600 hover:text-blue-800">Home</a>
                        <span class="mx-2">/</span>
                        <span class="text-gray-700">Employee Masterlist</span>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- Card Header -->
                <div class="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h5 class="text-white font-medium text-lg">Employee Masterlist</h5>
                    <div class="flex space-x-2">
                        <button type="button" class="text-white hover:text-gray-200 transition-colors">
                            <FontAwesomeIcon :icon="faExpand" />
                        </button>
                        <button type="button" class="text-white hover:text-gray-200 transition-colors">
                            <FontAwesomeIcon :icon="faMinus" />
                        </button>
                    </div>
                </div>

                <!-- Card Body -->
                <div class="p-6">
                    <!-- Search -->
                    <div class="mb-4">
                        <div class="relative">
                            <input
                                v-model="search"
                                type="text"
                                placeholder="Search by name, position, ID..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                            <FontAwesomeIcon :icon="faSearch" class="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>

                    <!-- Download Buttons (SuperAdmin only) -->
                    <div v-if="position === 'SuperAdmin'" class="mb-4 flex flex-wrap gap-2">
                        <button
                            @click="downloadSelected"
                            class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <FontAwesomeIcon :icon="faFileExcel" class="mr-2" />
                            Download Selected Excel
                        </button>
                        <a
                            href="/masterlist/ex"
                            class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <FontAwesomeIcon :icon="faFileExcel" class="mr-2" />
                            Download All Excel
                        </a>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="loading" class="flex justify-center items-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th v-if="position === 'SuperAdmin'" class="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            v-model="allSelected"
                                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        >
                                    </th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID #</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Hired</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="e in data" :key="e.employee_id" class="hover:bg-gray-50 transition-colors">
                                    <td v-if="position === 'SuperAdmin'" class="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            v-model="e.selected"
                                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        >
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900">{{ e.employee_id }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">{{ e.full_name }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">{{ e.position }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">{{ e.start_date }}</td>
                                    <td class="px-4 py-3">
                                        <span
                                            class="px-2 py-1 text-xs font-medium rounded-full"
                                            :class="{
                                                'bg-green-100 text-green-800': e.work_status === 'Active',
                                                'bg-yellow-100 text-yellow-800': e.work_status === 'Probationary',
                                                'bg-red-100 text-red-800': e.work_status === 'Inactive'
                                            }"
                                        >
                                            {{ e.work_status }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex space-x-2">
                                            <Edit
                                                :employee="e"
                                                :positions="positions"
                                                @employee-updated="handleTransaction()"
                                            />
                                            <View
                                                :employee="e"
                                                :positions="positions"
                                                @employee-updated="handleTransaction()"
                                            />
                                            <a
                                                v-if="position === 'SuperAdmin'"
                                                :href="'/masterlist/bd?id=' + e.employee_id"
                                                target="_blank"
                                                class="text-yellow-600 hover:text-yellow-800 transition-colors"
                                                title="Generate Biodata"
                                            >
                                                <FontAwesomeIcon :icon="faFileExcel" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Empty State -->
                                <tr v-if="emptyResult">
                                    <td :colspan="position === 'SuperAdmin' ? 7 : 6" class="px-4 py-12 text-center">
                                        <div class="flex flex-col items-center text-gray-400">
                                            <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 class="text-lg font-medium text-gray-500">No Record Found</h3>
                                            <p class="text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalRows > 0" class="mt-6">
                        <Paginator
                            :page_number="pageNum"
                            :total_rows="totalRows"
                            :itemsperpage="itemsPerPage"
                            @page_num="handlePageNum"
                        />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>