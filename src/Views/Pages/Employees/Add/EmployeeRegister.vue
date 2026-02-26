<template>
    <div class="bg-gray-100 min-h-screen py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-6 flex justify-between items-center">
                <h1 class="text-2xl font-semibold text-gray-900">Employee</h1>
                <div class="text-sm text-gray-500">
                    <a href="/dashboard" class="hover:text-blue-600">Home</a> / <span class="text-gray-700">New Employee</span>
                </div>
            </div>

            <!-- Form Card -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="bg-blue-600 px-6 py-4">
                    <h5 class="text-white font-medium">Add New Employee</h5>
                </div>

                <div class="p-6">
                    <!-- Loading State for Positions -->
                    <div v-if="positionsLoading" class="flex justify-center items-center py-12">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-gray-600">Loading positions...</span>
                    </div>

                    <form v-else @submit.prevent="newEmployee">
                        <!-- Basic Information -->
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Basic Information</h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input type="text" v-model="form.e_first" class="w-full px-3 py-2 border rounded-md" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name *</label>
                                    <input type="text" v-model="form.e_middle" class="w-full px-3 py-2 border rounded-md" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input type="text" v-model="form.e_last" class="w-full px-3 py-2 border rounded-md" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                                    <SelectComponent 
                                        v-model="form.e_position" 
                                        :options="positionOptions" 
                                        placeholder="Select Position" 
                                        class="w-full" 
                                        :disabled="positionsLoading"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                                    <SelectComponent v-model="form.e_work_stat" :options="workTypes" placeholder="Select Work Type" class="w-full" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Date Started *</label>
                                    <input type="date" v-model="form.e_start_date" class="w-full px-3 py-2 border rounded-md" required>
                                </div>
                                <div class="md:col-span-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Permanent Address *</label>
                                    <input type="text" v-model="form.e_perma_add" class="w-full px-3 py-2 border rounded-md" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                                    <input type="text" v-model="form.tel_no" class="w-full px-3 py-2 border rounded-md">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                                    <input type="text" v-model="form.mobile_no" class="w-full px-3 py-2 border rounded-md" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Provincial Address</label>
                                    <input type="text" v-model="form.prov_add" class="w-full px-3 py-2 border rounded-md">
                                </div>
                            </div>
                        </div>

                        <!-- Personal Information -->
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Personal Information</h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div><input type="text" v-model="form.n_name" placeholder="Nick Name" class="w-full px-3 py-2 border rounded-md"></div>
                                <div><input type="number" v-model="form.height" placeholder="Height (cm)" class="w-full px-3 py-2 border rounded-md"></div>
                                <div><input type="number" v-model="form.weight" placeholder="Weight (kg)" class="w-full px-3 py-2 border rounded-md"></div>
                                <div>
                                    <SelectComponent v-model="form.blood_type" :options="bloodTypes" placeholder="Blood Type" class="w-full" />
                                </div>
                                <div>
                                    <select v-model="form.gender" class="w-full px-3 py-2 border rounded-md" required>
                                        <option value="0">Gender *</option>
                                        <option value="1">Male</option>
                                        <option value="2">Female</option>
                                    </select>
                                </div>
                                <div><input type="text" v-model="form.sss" placeholder="SSS No." class="w-full px-3 py-2 border rounded-md"></div>
                                <div><input type="date" v-model="form.b_date" class="w-full px-3 py-2 border rounded-md" required></div>
                                <div>
                                    <SelectComponent v-model="form.c_stat" :options="civilStatus" placeholder="Civil Status *" class="w-full" />
                                </div>
                                <div><input type="text" v-model="form.sss_crn_no" placeholder="SSS CRN No." class="w-full px-3 py-2 border rounded-md"></div>
                                <div class="md:col-span-2"><input type="text" v-model="form.birth_add" placeholder="Birthplace *" class="w-full px-3 py-2 border rounded-md" required></div>
                                <div><input type="text" v-model="form.hdmf_no" placeholder="Pag-IBIG No." class="w-full px-3 py-2 border rounded-md"></div>
                                <div>
                                    <SelectComponent v-model="form.house_arr" :options="housingArrangements" placeholder="Housing Arrangement" class="w-full" />
                                </div>
                                <div>
                                    <SelectComponent v-model="form.religion" :options="religions" placeholder="Religion" class="w-full" />
                                </div>
                                <div><input type="text" v-model="form.tin_no" placeholder="TIN No." class="w-full px-3 py-2 border rounded-md"></div>
                                <div><input type="text" v-model="form.philhealth" placeholder="Philhealth No." class="w-full px-3 py-2 border rounded-md"></div>
                                <div><input type="text" v-model="form.prof_no" placeholder="License No." class="w-full px-3 py-2 border rounded-md"></div>
                            </div>
                        </div>

                        <!-- Banking -->
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Banking Information</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><input type="text" v-model="form.bank_name" placeholder="Bank Name" class="w-full px-3 py-2 border rounded-md"></div>
                                <div><input type="text" v-model="form.bank_account" placeholder="Bank Account" class="w-full px-3 py-2 border rounded-md"></div>
                            </div>
                        </div>

                        <!-- Parents -->
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Parents Information</h4>
                            <div class="mb-4">
                                <h5 class="font-medium text-blue-600 mb-2">Father</h5>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><input type="text" v-model="form.f_first" placeholder="First Name" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="text" v-model="form.f_mid" placeholder="Middle Name" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="text" v-model="form.f_last" placeholder="Last Name" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="date" v-model="form.f_birthday" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="text" v-model="form.f_occ" placeholder="Occupation" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div class="md:col-span-2"><input type="text" v-model="form.f_add" placeholder="Address" class="w-full px-3 py-2 border rounded-md"></div>
                                </div>
                            </div>
                            <div>
                                <h5 class="font-medium text-blue-600 mb-2">Mother</h5>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><input type="text" v-model="form.m_first" placeholder="First Name" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="text" v-model="form.m_mid" placeholder="Middle Name" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="text" v-model="form.m_last" placeholder="Last Name" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="date" v-model="form.m_birthday" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div><input type="text" v-model="form.m_occ" placeholder="Occupation" class="w-full px-3 py-2 border rounded-md"></div>
                                    <div class="md:col-span-2"><input type="text" v-model="form.m_add" placeholder="Address" class="w-full px-3 py-2 border rounded-md"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Spouse -->
                        <div class="mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <h5 class="font-medium text-blue-600">Spouse/Children</h5>
                                <button type="button" @click="addRowSpouse" class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                    <FontAwesomeIcon :icon="faPlus" class="mr-1" /> Add
                                </button>
                            </div>
                            <div v-for="(s, index) in Spo" :key="index" class="bg-gray-50 p-4 rounded-lg mb-3 relative">
                                <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                                    <div><input type="text" v-model="Spo[index].s_first" placeholder="First Name" class="w-full px-2 py-1 border rounded-md text-sm"></div>
                                    <div><input type="text" v-model="Spo[index].s_middle" placeholder="Middle Name" class="w-full px-2 py-1 border rounded-md text-sm"></div>
                                    <div><input type="text" v-model="Spo[index].s_last" placeholder="Last Name" class="w-full px-2 py-1 border rounded-md text-sm"></div>
                                    <div><input type="text" v-model="Spo[index].s_relation" placeholder="Relation" class="w-full px-2 py-1 border rounded-md text-sm"></div>
                                    <div><input type="date" v-model="Spo[index].s_bday" class="w-full px-2 py-1 border rounded-md text-sm"></div>
                                    <div><input type="text" v-model="Spo[index].s_occ" placeholder="Occupation" class="w-full px-2 py-1 border rounded-md text-sm"></div>
                                </div>
                                <div class="absolute top-12 right-2">
                                    <button type="button" @click="removeRowSpouse(index)" :disabled="Spo.length === 1" class="px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 disabled:opacity-50">
                                        <FontAwesomeIcon :icon="faTrash" /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Emergency Contact -->
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Emergency Contact</h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><input type="text" v-model="form.contact_name" placeholder="Full Name *" class="w-full px-3 py-2 border rounded-md" required></div>
                                <div><input type="text" v-model="form.contact_relation" placeholder="Relationship *" class="w-full px-3 py-2 border rounded-md" required></div>
                                <div><input type="text" v-model="form.contact_no" placeholder="Contact # *" class="w-full px-3 py-2 border rounded-md" required></div>
                                <div class="md:col-span-3"><input type="text" v-model="form.contact_add" placeholder="Address *" class="w-full px-3 py-2 border rounded-md" required></div>
                            </div>
                        </div>

                        <!-- Submit -->
                        <div class="flex justify-end">
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center" :disabled="isSubmitting || positionsLoading">
                                <FontAwesomeIcon :icon="faSave" class="mr-2" /> 
                                {{ isSubmitting ? 'Saving...' : 'Save Employee' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSave, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import SelectComponent from '@/Js/Components/SelectComponent.vue'
import api from '@/Js/Services/axios'
import Swal from 'sweetalert2'

const props = defineProps({
    employeeData: {
        type: Object,
        default: () => ({})
    }
})

// Employee form data - reactive object
const form = ref({
    e_first: '',
    e_middle: '',
    e_last: '',
    e_position: 0,
    e_work_stat: 0,
    e_start_date: new Date().toISOString().split('T')[0],
    e_perma_add: '',
    tel_no: '',
    mobile_no: '',
    prov_add: '',
    n_name: '',
    height: '',
    weight: '',
    blood_type: 0,
    gender: 0,
    sss: '',
    b_date: '',
    c_stat: 0,
    sss_crn_no: '',
    birth_add: '',
    hdmf_no: '',
    house_arr: 0,
    religion: 0,
    tin_no: '',
    philhealth: '',
    prof_no: '',
    bank_name: '',
    bank_account: '',
    f_first: '',
    f_mid: '',
    f_last: '',
    f_birthday: '',
    f_occ: '',
    f_add: '',
    m_first: '',
    m_mid: '',
    m_last: '',
    m_birthday: '',
    m_occ: '',
    m_add: '',
    contact_name: '',
    contact_relation: '',
    contact_no: '',
    contact_add: ''
})

// Spouse rows
const Spo = ref([{ s_first: '', s_middle: '', s_last: '', s_relation: '', s_bday: '', s_occ: '' }])
const isSubmitting = ref(false)

// Positions state
const positions = ref([])
const positionsLoading = ref(true)
const positionsError = ref(null)

// Dropdown options with numeric values
const positionOptions = computed(() => 
    positions.value.map(p => ({ value: Number(p.value), label: p.label })) || []
)


const workTypes = [
    { value: 1, label: 'Full-time' },
    { value: 2, label: 'Agency' },
    { value: 3, label: 'Part-Time' },
    { value: 4, label: 'Contractual' },
    { value: 5, label: 'OJT' }
]

const bloodTypes = [
    { value: 1, label: 'A+' }, { value: 2, label: 'A-' }, { value: 3, label: 'B+' },
    { value: 4, label: 'B-' }, { value: 5, label: 'O+' }, { value: 6, label: 'O-' },
    { value: 7, label: 'AB+' }, { value: 8, label: 'AB-' }
]

const civilStatus = [
    { value: 1, label: 'Single' }, { value: 2, label: 'Married' },
    { value: 3, label: 'Divorced' }, { value: 4, label: 'Widowed' }
]

const housingArrangements = [
    { value: 1, label: 'Own House' }, { value: 2, label: 'Stay in' },
    { value: 3, label: 'Rent/Boarding' }, { value: 4, label: 'Living with Parents/Relatives' }
]

const religions = [
    { value: 1, label: 'Roman Catholic' }, { value: 2, label: 'Islam' },
    { value: 3, label: 'Evangelicals' }, { value: 4, label: 'Englesia ni Cristo' },
    { value: 5, label: 'Protestant' }, { value: 6, label: 'Aglipayan' },
    { value: 7, label: 'Seventh-day Adventist' }, { value: 8, label: 'Bible Baptist Church' },
    { value: 9, label: 'Jehovahs Witness' }, { value: 10, label: 'Born Again Christian' },
    { value: 11, label: 'Others' }
]

// Fetch positions from API
const fetchPositions = async () => {
    positionsLoading.value = true
    positionsError.value = null
    
    try {
        const response = await api.get('/employee/positions')
        
            positions.value = response.data.position
  
    } catch (error) {
        console.error('Error fetching positions:', error)
        positionsError.value = error.response?.data?.message || 'Failed to load positions'
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load positions. Please refresh the page.'
        })
    } finally {
        positionsLoading.value = false
    }
}


// Methods
const addRowSpouse = () => {
    Spo.value.push({ s_first: '', s_middle: '', s_last: '', s_relation: '', s_bday: '', s_occ: '' })
}

const removeRowSpouse = (index) => {
    if (Spo.value.length > 1) Spo.value.splice(index, 1)
}

const resetForm = () => {
    form.value = {
        e_first: '',
        e_middle: '',
        e_last: '',
        e_position: 0,
        e_work_stat: 0,
        e_start_date: new Date().toISOString().split('T')[0],
        e_perma_add: '',
        tel_no: '',
        mobile_no: '',
        prov_add: '',
        n_name: '',
        height: '',
        weight: '',
        blood_type: 0,
        gender: 0,
        sss: '',
        b_date: '',
        c_stat: 0,
        sss_crn_no: '',
        birth_add: '',
        hdmf_no: '',
        house_arr: 0,
        religion: 0,
        tin_no: '',
        philhealth: '',
        prof_no: '',
        bank_name: '',
        bank_account: '',
        f_first: '',
        f_mid: '',
        f_last: '',
        f_birthday: '',
        f_occ: '',
        f_add: '',
        m_first: '',
        m_mid: '',
        m_last: '',
        m_birthday: '',
        m_occ: '',
        m_add: '',
        contact_name: '',
        contact_relation: '',
        contact_no: '',
        contact_add: ''
    }
    Spo.value = [{ s_first: '', s_middle: '', s_last: '', s_relation: '', s_bday: '', s_occ: '' }]
}

const newEmployee = async () => {
    // Basic validation
    if (!form.value.e_first || !form.value.e_last || !form.value.e_position || !form.value.e_work_stat) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please fill in all required fields'
        })
        return
    }

    isSubmitting.value = true

    Swal.fire({
        title: 'Processing...',
        text: 'Saving employee data, please wait.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })

    try {
        // Prepare data
        const formData = {
            ...form.value,
            spouse: Spo.value.filter(s => s.s_first || s.s_last || s.s_relation)
        }

        // Submit to API
        const response = await api.post('/employee/add', formData)

        if (response.data.error === false || response.data.success) {
            Swal.close()
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message || 'Employee added successfully',
                timer: 2000
            })
            
            // Reset form
            resetForm()
        } else {
            throw new Error(response.data.message || 'Failed to add employee')
        }
    } catch (error) {
        console.error('Error:', error)
        Swal.close()
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || error.message || 'Failed to add employee'
        })
    } finally {
        isSubmitting.value = false
    }
}

// Load existing data for edit mode
onMounted(() => {
    fetchPositions()
    
    if (props.employeeData && Object.keys(props.employeeData).length > 0) {
        // Populate form with existing data
        Object.keys(form.value).forEach(key => {
            if (props.employeeData[key] !== undefined) {
                form.value[key] = props.employeeData[key]
            }
        })

        if (props.employeeData.spouse && props.employeeData.spouse.length > 0) {
            Spo.value = props.employeeData.spouse
        }
    }
})
</script>