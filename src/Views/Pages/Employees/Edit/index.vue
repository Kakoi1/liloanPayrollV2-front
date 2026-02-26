<template>
    <button
        @click.prevent="openEditModal"
        :class="{ 'opacity-25': isEditModalOpen }"
        :disabled="isEditModalOpen"
        title="Edit Employee"
        class="bg-orange-700 text-white text-md font-bold py-2 px-2 flex items-center gap-2 rounded-md hover:bg-orange-800 transition-colors"
    >
        <FontAwesomeIcon :icon="faEdit" class="w-4 flex-shrink-0" />
        <span>Edit</span>
    </button>

    <Modal :show="isEditModalOpen" :maxWidth="'6xl'" title="Edit Employee" @close="handleEditClose">
        <div class="p-6 max-h-[80vh] overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
            </div>

            <!-- Edit Form -->
            <div v-else>
                <!-- Basic Information -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-orange-600 pl-4 mb-4">Basic Information</h4>
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
                            <select v-model="form.e_position" class="w-full px-3 py-2 border rounded-md" required>
                                <option value="0">Select Position</option>
                                <option v-for="pos in props.positions" :key="pos.value" :value="pos.value">
                                    {{ pos.label }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                            <select v-model="form.e_work_stat" class="w-full px-3 py-2 border rounded-md" required>
                                <option value="0">Select Work Type</option>
                                <option value="1">Full-time</option>
                                <option value="2">Agency</option>
                                <option value="3">Part-Time</option>
                                <option value="4">Contractual</option>
                                <option value="5">OJT</option>
                            </select>
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
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-orange-600 pl-4 mb-4">Personal Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div><input type="text" v-model="form.n_name" placeholder="Nick Name" class="w-full px-3 py-2 border rounded-md"></div>
                        <div><input type="number" v-model="form.height" placeholder="Height (cm)" class="w-full px-3 py-2 border rounded-md"></div>
                        <div><input type="number" v-model="form.weight" placeholder="Weight (kg)" class="w-full px-3 py-2 border rounded-md"></div>
                        <div>
                            <select v-model="form.blood_type" class="w-full px-3 py-2 border rounded-md">
                                <option value="0">Blood Type</option>
                                <option value="1">A+</option>
                                <option value="2">A-</option>
                                <option value="3">B+</option>
                                <option value="4">B-</option>
                                <option value="5">O+</option>
                                <option value="6">O-</option>
                                <option value="7">AB+</option>
                                <option value="8">AB-</option>
                            </select>
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
                            <select v-model="form.c_stat" class="w-full px-3 py-2 border rounded-md" required>
                                <option value="0">Civil Status *</option>
                                <option value="1">Single</option>
                                <option value="2">Married</option>
                                <option value="3">Divorced</option>
                                <option value="4">Widowed</option>
                            </select>
                        </div>
                        <div><input type="text" v-model="form.sss_crn_no" placeholder="SSS CRN No." class="w-full px-3 py-2 border rounded-md"></div>
                        <div class="md:col-span-2"><input type="text" v-model="form.birth_add" placeholder="Birthplace *" class="w-full px-3 py-2 border rounded-md" required></div>
                        <div><input type="text" v-model="form.hdmf_no" placeholder="Pag-IBIG No." class="w-full px-3 py-2 border rounded-md"></div>
                        <div>
                            <select v-model="form.house_arr" class="w-full px-3 py-2 border rounded-md">
                                <option value="0">Housing Arrangement</option>
                                <option value="1">Own House</option>
                                <option value="2">Stay in</option>
                                <option value="3">Rent/Boarding</option>
                                <option value="4">Living with Parents/Relatives</option>
                            </select>
                        </div>
                        <div>
                            <select v-model="form.religion" class="w-full px-3 py-2 border rounded-md">
                                <option value="0">Religion</option>
                                <option value="1">Roman Catholic</option>
                                <option value="2">Islam</option>
                                <option value="3">Evangelicals</option>
                                <option value="4">Englesia ni Cristo</option>
                                <option value="5">Others</option>
                            </select>
                        </div>
                        <div><input type="text" v-model="form.tin_no" placeholder="TIN No." class="w-full px-3 py-2 border rounded-md"></div>
                        <div><input type="text" v-model="form.philhealth" placeholder="Philhealth No." class="w-full px-3 py-2 border rounded-md"></div>
                        <div><input type="text" v-model="form.prof_no" placeholder="License No." class="w-full px-3 py-2 border rounded-md"></div>
                    </div>
                </div>

                <!-- Banking -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-orange-600 pl-4 mb-4">Banking Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><input type="text" v-model="form.bank_name" placeholder="Bank Name" class="w-full px-3 py-2 border rounded-md"></div>
                        <div><input type="text" v-model="form.bank_account" placeholder="Bank Account" class="w-full px-3 py-2 border rounded-md"></div>
                    </div>
                </div>

                <!-- Parents -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-orange-600 pl-4 mb-4">Parents Information</h4>
                    <div class="mb-4">
                        <h5 class="font-medium text-orange-600 mb-2">Father</h5>
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
                        <h5 class="font-medium text-orange-600 mb-2">Mother</h5>
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
                        <h5 class="font-medium text-orange-600">Spouse/Children</h5>
                        <button type="button" @click="addRowSpouse" class="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
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
                        <div class="absolute top-2 right-2">
                            <button type="button" @click="removeRowSpouse(index)" :disabled="Spo.length === 1" class="px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 disabled:opacity-50">
                                <FontAwesomeIcon :icon="faTrash" /> Remove
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Emergency Contact -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-gray-900 border-l-4 border-orange-600 pl-4 mb-4">Emergency Contact</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><input type="text" v-model="form.contact_name" placeholder="Full Name *" class="w-full px-3 py-2 border rounded-md" required></div>
                        <div><input type="text" v-model="form.contact_relation" placeholder="Relationship *" class="w-full px-3 py-2 border rounded-md" required></div>
                        <div><input type="text" v-model="form.contact_no" placeholder="Contact # *" class="w-full px-3 py-2 border rounded-md" required></div>
                        <div class="md:col-span-3"><input type="text" v-model="form.contact_add" placeholder="Address *" class="w-full px-3 py-2 border rounded-md" required></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Footer with Buttons -->
        <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button @click="handleEditClose" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                Cancel
            </button>
            <button @click="updateEmployee" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center" :disabled="isSubmitting">
                <FontAwesomeIcon :icon="faSave" class="mr-2" /> 
                {{ isSubmitting ? 'Updating...' : 'Update Employee' }}
            </button>
        </div>
    </Modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import api from '@/Js/Services/axios'
import Modal from "@/Js/Components/Modal.vue";
import { faEdit, faPlus, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
    employee: {
        type: Object,
        required: true
    },
    positions: {
        type: Object,
        required: true
    }
});



const emit = defineEmits(['employee-updated']);

const isEditModalOpen = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);

// Spouse rows
const Spo = ref([]);

// Form state
const form = ref({
    e_id: '',
    e_first: '',
    e_middle: '',
    e_last: '',
    e_position: 0,
    e_work_stat: 0,
    e_start_date: '',
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
    contact_add: '',
});

// Methods
const addRowSpouse = () => {
    Spo.value.push({
        s_first: '',
        s_middle: '',
        s_last: '',
        s_relation: '',
        s_bday: '',
        s_occ: ''
    });
};

const removeRowSpouse = (index) => {
    if (Spo.value.length > 1) Spo.value.splice(index, 1);
};

const openEditModal = () => {
    console.log(props.positions);
    isEditModalOpen.value = true;
    editEmployee();
};

const editEmployee = async () => {
    isLoading.value = true;

    try {
        // Fetch fresh employee data
        const response = await api.post('/employee/fetch-single', {
            emp_id: props.employee.id || props.employee.employee_id
        });

        if (response.data.error === false && response.data.employee.length > 0) {
            const employeeData = response.data.employee[0];

            // Map the API response to form fields
            form.value = {
                e_id: employeeData.id || '',
                e_first: employeeData.firstName || '',
                e_middle: employeeData.middleName || '',
                e_last: employeeData.lastName || '',
                e_position: employeeData.posId || 0,
                e_work_stat: employeeData.workTypeId || 0,
                e_start_date: employeeData.dateStarted || '',
                e_perma_add: employeeData.address || '',
                tel_no: employeeData.telephoneNo || '',
                mobile_no: employeeData.mobileNo || '',
                prov_add: employeeData.provinceAddress || '',
                n_name: employeeData.nickName || '',
                height: employeeData.height || '',
                weight: employeeData.weight || '',
                blood_type: employeeData.bloodType || 0,
                gender: employeeData.gender || 0,
                sss: employeeData.sssNo || '',
                b_date: employeeData.bDay || '',
                c_stat: employeeData.civilStatus || 0,
                sss_crn_no: employeeData.sssCrn || '',
                birth_add: employeeData.birthPlace || '',
                hdmf_no: employeeData.pagIbigNo || '',
                house_arr: employeeData.housingArrange || 0,
                religion: employeeData.religion || 0,
                tin_no: employeeData.tinNo || '',
                philhealth: employeeData.philHealthNo || '',
                prof_no: employeeData.profLicenceNo || '',
                bank_name: employeeData.bankName || '',
                bank_account: employeeData.bankAccNo || '',
                f_first: employeeData.fatherFirstName || '',
                f_mid: employeeData.fatherMiddleName || '',
                f_last: employeeData.fatherLastName || '',
                f_birthday: employeeData.fatherBirthday || '',
                f_occ: employeeData.fatherOccupation || '',
                f_add: employeeData.fatherAddress || '',
                m_first: employeeData.motherFirstName || '',
                m_mid: employeeData.motherMiddleName || '',
                m_last: employeeData.motherLastName || '',
                m_birthday: employeeData.motherBirthday || '',
                m_occ: employeeData.motherOccupation || '',
                m_add: employeeData.motherAddress || '',
                contact_name: employeeData.emergencyContName || '',
                contact_relation: employeeData.emergencyContRelation || '',
                contact_no: employeeData.emergencyContNo || '',
                contact_add: employeeData.emergencyContAddress || ''
            };

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
                Spo.value = [{ s_first: '', s_middle: '', s_last: '', s_relation: '', s_bday: '', s_occ: '' }];
            }
        } else {
            throw new Error('No employee data found');
        }

    } catch (error) {
        console.error('Error loading employee data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to load employee data'
        });
        isEditModalOpen.value = false;
    } finally {
        isLoading.value = false;
    }
};

const updateEmployee = async () => {
    // Validation
    if (!form.value.e_first || !form.value.e_last || !form.value.e_position || !form.value.e_work_stat) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please fill in all required fields'
        });
        return;
    }

    isSubmitting.value = true;

    Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we update the employee information.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        // Prepare data
        const formData = {
            id: form.value.e_id,
            e_first: form.value.e_first,
            e_middle: form.value.e_middle,
            e_last: form.value.e_last,
            e_position: form.value.e_position,
            e_work_stat: form.value.e_work_stat,
            e_start_date: form.value.e_start_date,
            e_perma_add: form.value.e_perma_add,
            tel_no: form.value.tel_no,
            mobile_no: form.value.mobile_no,
            prov_add: form.value.prov_add,
            n_name: form.value.n_name,
            height: form.value.height,
            weight: form.value.weight,
            blood_type: form.value.blood_type,
            gender: form.value.gender,
            sss: form.value.sss,
            b_date: form.value.b_date,
            c_stat: form.value.c_stat,
            sss_crn_no: form.value.sss_crn_no,
            birth_add: form.value.birth_add,
            hdmf_no: form.value.hdmf_no,
            house_arr: form.value.house_arr,
            religion: form.value.religion,
            tin_no: form.value.tin_no,
            philhealth: form.value.philhealth,
            prof_no: form.value.prof_no,
            bank_name: form.value.bank_name,
            bank_account: form.value.bank_account,
            contact_name: form.value.contact_name,
            contact_relation: form.value.contact_relation,
            contact_no: form.value.contact_no,
            contact_add: form.value.contact_add,
            f_first: form.value.f_first,
            f_mid: form.value.f_mid,
            f_last: form.value.f_last,
            f_birthday: form.value.f_birthday,
            f_occ: form.value.f_occ,
            f_add: form.value.f_add,
            m_first: form.value.m_first,
            m_mid: form.value.m_mid,
            m_last: form.value.m_last,
            m_birthday: form.value.m_birthday,
            m_occ: form.value.m_occ,
            m_add: form.value.m_add,
            spouse: Spo.value.filter(s => s.s_first || s.s_last).map(s => ({
                s_first: s.s_first,
                s_middle: s.s_middle,
                s_last: s.s_last,
                s_relation: s.s_relation,
                s_bday: s.s_bday,
                s_occ: s.s_occ
            }))
        };

        // Submit to API
        const response = await api.post('/employee/update', formData);

        if (response.data.error === false) {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message || 'Employee updated successfully',
                timer: 2000
            });

            // Close modal
            handleEditClose();

            // Emit event to refresh parent data
            emit('employee-updated');
        } else {
            throw new Error(response.data.message || 'Update failed');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to update employee'
        });
    } finally {
        isSubmitting.value = false;
    }
};

const handleEditClose = () => {
    isEditModalOpen.value = false;
    // Reset form
    form.value = {
        e_id: '',
        e_first: '',
        e_middle: '',
        e_last: '',
        e_position: 0,
        e_work_stat: 0,
        e_start_date: '',
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
        contact_add: '',
    };
    Spo.value = [{ s_first: '', s_middle: '', s_last: '', s_relation: '', s_bday: '', s_occ: '' }];
};
</script>