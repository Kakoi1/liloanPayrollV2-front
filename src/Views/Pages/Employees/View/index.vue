<template>
    <button
        @click.prevent="openViewModal"
        :class="{ 'opacity-25': isViewModalOpen }"
        :disabled="isViewModalOpen"
        title="View Employee"
        class="bg-blue-600 text-white text-md font-bold py-2 px-2 flex items-center gap-2 hover:bg-blue-700 transition-colors"
    >
        <FontAwesomeIcon :icon="faEye" class="w-4 flex-shrink-0" />
        <span>View</span>
    </button>

    <Modal :show="isViewModalOpen" :maxWidth="'6xl'" title="View Employee Details" @close="handleViewClose">
        <div class="p-6 max-h-[80vh] overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- View Form -->
            <div v-else>
                <!-- Basic Information -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Basic Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.e_first || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.e_middle || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.e_last || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedPositionLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedWorkTypeLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date Started</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.e_start_date || '—' }}</p>
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.e_perma_add || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.tel_no || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.mobile_no || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Provincial Address</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.prov_add || '—' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Personal Information -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Personal Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nick Name</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.n_name || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.height || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.weight || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedBloodTypeLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedGenderLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">SSS No.</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.sss || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.b_date || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedCivilStatusLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">SSS CRN No.</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.sss_crn_no || '—' }}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Birthplace</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.birth_add || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pag-IBIG No.</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.hdmf_no || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Housing Arrangement</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedHousingLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ selectedReligionLabel || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">TIN No.</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.tin_no || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Philhealth No.</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.philhealth || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">License No.</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.prof_no || '—' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Banking -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Banking Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.bank_name || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.bank_account || '—' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Parents -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Parents Information</h4>
                    <div class="mb-4">
                        <h5 class="font-medium text-blue-600 mb-2">Father</h5>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.f_first || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.f_mid || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.f_last || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.f_birthday || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.f_occ || '—' }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.f_add || '—' }}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 class="font-medium text-blue-600 mb-2">Mother</h5>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.m_first || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.m_mid || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.m_last || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.m_birthday || '—' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.m_occ || '—' }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.m_add || '—' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Spouse -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h5 class="font-medium text-blue-600">Spouse/Children</h5>
                    </div>
                    <div v-if="Spo.length > 0" class="space-y-3">
                        <div v-for="(s, index) in Spo" :key="index" class="bg-gray-50 p-4 rounded-lg">
                            <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                                    <p class="text-sm text-gray-800">{{ s.s_first || '—' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Middle Name</label>
                                    <p class="text-sm text-gray-800">{{ s.s_middle || '—' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                                    <p class="text-sm text-gray-800">{{ s.s_last || '—' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Relation</label>
                                    <p class="text-sm text-gray-800">{{ s.s_relation || '—' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Birthday</label>
                                    <p class="text-sm text-gray-800">{{ s.s_bday || '—' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Occupation</label>
                                    <p class="text-sm text-gray-800">{{ s.s_occ || '—' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                        No spouse/children information available
                    </div>
                </div>

                <!-- Emergency Contact -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">Emergency Contact</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.contact_name || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.contact_relation || '—' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Contact #</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.contact_no || '—' }}</p>
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <p class="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-800">{{ form.contact_add || '—' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Footer with Buttons -->
        <template #footer>
            <div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t">
                <button @click="handleViewClose" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Close
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import api from "@/Js/Services/axios";
import Modal from "@/Js/Components/Modal.vue";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
    employee: {
        type: Object,
        required: true
    },
    positions: {
        type: Array,
        default: () => []
    }
});

const isViewModalOpen = ref(false);
const isLoading = ref(false);

// Spouse rows
const Spo = ref([]);

// Form setup
const form = ref({
    e_id: '', e_first: '', e_middle: '', e_last: '', e_position: 0,
    e_work_stat: 0, e_start_date: '', e_perma_add: '', tel_no: '',
    mobile_no: '', prov_add: '', n_name: '', height: '', weight: '',
    blood_type: 0, gender: 0, sss: '', b_date: '', c_stat: 0,
    sss_crn_no: '', birth_add: '', hdmf_no: '', house_arr: 0,
    religion: 0, tin_no: '', philhealth: '', prof_no: '', bank_name: '',
    bank_account: '', f_first: '', f_mid: '', f_last: '', f_birthday: '',
    f_occ: '', f_add: '', m_first: '', m_mid: '', m_last: '',
    m_birthday: '', m_occ: '', m_add: '', contact_name: '',
    contact_relation: '', contact_no: '', contact_add: ''
});

// Label mappings for display
const workTypes = {
    1: 'Full-time',
    2: 'Agency',
    3: 'Part-Time',
    4: 'Contractual',
    5: 'OJT'
};

const bloodTypes = {
    1: 'A+', 2: 'A-', 3: 'B+', 4: 'B-',
    5: 'O+', 6: 'O-', 7: 'AB+', 8: 'AB-'
};

const civilStatus = {
    1: 'Single', 2: 'Married', 3: 'Divorced', 4: 'Widowed'
};

const housingArrangements = {
    1: 'Own House', 2: 'Stay in', 3: 'Rent/Boarding', 4: 'Living with Parents/Relatives'
};

const religions = {
    1: 'Roman Catholic', 2: 'Islam', 3: 'Evangelicals', 4: 'Englesia ni Cristo', 5: 'Others'
};

const genderMap = {
    1: 'Male', 2: 'Female'
};

// Computed labels using props.positions
const selectedPositionLabel = computed(() => {
    if (!form.value.e_position) return '—';

    // Find position in props.positions
    const position = props.positions.find(p => p.value === form.value.e_position);
    return position ? position.label : `Position ID: ${form.value.e_position}`;
});

const selectedWorkTypeLabel = computed(() => {
    return workTypes[form.value.e_work_stat] || '—';
});

const selectedBloodTypeLabel = computed(() => {
    return bloodTypes[form.value.blood_type] || '—';
});

const selectedGenderLabel = computed(() => {
    return genderMap[form.value.gender] || '—';
});

const selectedCivilStatusLabel = computed(() => {
    return civilStatus[form.value.c_stat] || '—';
});

const selectedHousingLabel = computed(() => {
    return housingArrangements[form.value.house_arr] || '—';
});

const selectedReligionLabel = computed(() => {
    return religions[form.value.religion] || '—';
});

const openViewModal = () => {
    isViewModalOpen.value = true;
    viewEmployee();
};

const viewEmployee = async () => {
    isLoading.value = true;

    try {
        // Fetch fresh employee data
        const response = await api.post('/employee/fetch-single', {
            emp_id: props.employee.id || props.employee.employee_id
        });

        console.log('View Employee Response:', response.data);

        if (response.data.error === false && response.data.employee.length > 0) {
            const employeeData = response.data.employee[0];

            // Map the API response to form fields
            form.value.e_id = employeeData.id || '';
            form.value.e_first = employeeData.firstName || '';
            form.value.e_middle = employeeData.middleName || '';
            form.value.e_last = employeeData.lastName || '';
            form.value.e_position = employeeData.posId || 0;
            form.value.e_work_stat = employeeData.workTypeId || 0;
            form.value.e_start_date = employeeData.dateStarted || '';
            form.value.e_perma_add = employeeData.address || '';
            form.value.tel_no = employeeData.telephoneNo || '';
            form.value.mobile_no = employeeData.mobileNo || '';
            form.value.prov_add = employeeData.provinceAddress || '';

            // Personal Information
            form.value.n_name = employeeData.nickName || '';
            form.value.height = employeeData.height || '';
            form.value.weight = employeeData.weight || '';
            form.value.blood_type = employeeData.bloodType || 0;
            form.value.gender = employeeData.gender || 0;
            form.value.sss = employeeData.sssNo || '';
            form.value.b_date = employeeData.bDay || '';
            form.value.c_stat = employeeData.civilStatus || 0;
            form.value.sss_crn_no = employeeData.sssCrn || '';
            form.value.birth_add = employeeData.birthPlace || '';
            form.value.hdmf_no = employeeData.pagIbigNo || '';
            form.value.house_arr = employeeData.housingArrange || 0;
            form.value.religion = employeeData.religion || 0;
            form.value.tin_no = employeeData.tinNo || '';
            form.value.philhealth = employeeData.philHealthNo || '';
            form.value.prof_no = employeeData.profLicenceNo || '';

            // Banking Information
            form.value.bank_name = employeeData.bankName || '';
            form.value.bank_account = employeeData.bankAccNo || '';

            // Parents Information
            form.value.f_first = employeeData.fatherFirstName || '';
            form.value.f_mid = employeeData.fatherMiddleName || '';
            form.value.f_last = employeeData.fatherLastName || '';
            form.value.f_birthday = employeeData.fatherBirthday || '';
            form.value.f_occ = employeeData.fatherOccupation || '';
            form.value.f_add = employeeData.fatherAddress || '';

            form.value.m_first = employeeData.motherFirstName || '';
            form.value.m_mid = employeeData.motherMiddleName || '';
            form.value.m_last = employeeData.motherLastName || '';
            form.value.m_birthday = employeeData.motherBirthday || '';
            form.value.m_occ = employeeData.motherOccupation || '';
            form.value.m_add = employeeData.motherAddress || '';

            // Emergency Contact
            form.value.contact_name = employeeData.emergencyContName || '';
            form.value.contact_relation = employeeData.emergencyContRelation || '';
            form.value.contact_no = employeeData.emergencyContNo || '';
            form.value.contact_add = employeeData.emergencyContAddress || '';

            // Spouse/Children
            if (employeeData.spouse && employeeData.spouse.length > 0) {
                Spo.value = employeeData.spouse.map(sp => ({
                    s_first: sp.firstName || '',
                    s_middle: sp.middleName || '',
                    s_last: sp.lastName || '',
                    s_relation: sp.relation || '',
                    s_bday: sp.bDay || '',
                    s_occ: sp.occupation || ''
                }));
            } else {
                Spo.value = [];
            }
        }
    } catch (error) {
        console.error('Error loading employee data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load employee data'
        });
        isViewModalOpen.value = false;
    } finally {
        isLoading.value = false;
    }
};

const handleViewClose = () => {
    isViewModalOpen.value = false;
    // Reset form when closing
    form.value = {
        e_id: '', e_first: '', e_middle: '', e_last: '', e_position: 0,
        e_work_stat: 0, e_start_date: '', e_perma_add: '', tel_no: '',
        mobile_no: '', prov_add: '', n_name: '', height: '', weight: '',
        blood_type: 0, gender: 0, sss: '', b_date: '', c_stat: 0,
        sss_crn_no: '', birth_add: '', hdmf_no: '', house_arr: 0,
        religion: 0, tin_no: '', philhealth: '', prof_no: '', bank_name: '',
        bank_account: '', f_first: '', f_mid: '', f_last: '', f_birthday: '',
        f_occ: '', f_add: '', m_first: '', m_mid: '', m_last: '',
        m_birthday: '', m_occ: '', m_add: '', contact_name: '',
        contact_relation: '', contact_no: '', contact_add: ''
    };
    Spo.value = [];
};
</script>
