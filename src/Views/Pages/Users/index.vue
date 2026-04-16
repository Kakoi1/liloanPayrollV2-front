<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Content Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
          </div>
          <div>
            <ol class="flex text-sm text-gray-500">
              <li class="flex items-center">
                <a href="#" class="hover:text-gray-700">Home</a>
                <span class="mx-2">/</span>
              </li>
              <li class="text-gray-700 font-medium">New User</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="container mx-auto px-4 py-6">
      <div class="flex flex-wrap -mx-3">
        <!-- Left Column - Create User Form -->
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center">
              <h5 class="text-white font-semibold">NEW USER</h5>
              <div class="flex space-x-2">
                <button type="button" @click="maximizeCard" class="text-white hover:text-gray-200 transition">
                  <i class="fas fa-expand"></i>
                </button>
                <button type="button" @click="toggleCard" class="text-white hover:text-gray-200 transition">
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
            
            <div v-show="cardExpanded" class="p-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Active Employee</label>
                  <SearchDropdown
                    :apiEndpoint="'employee/active-list'"
                    :searchModel="searchEmp"
                    placeholder="Search for Employees..."
                    itemLabel="fullName"
                    itemId="id"
                    returnName="['fullName']"
                    dataKey="employees"
                    @item-selected="handleEmployeeSelected"
                    :defaultValue="selectedEmployee?.fullName"
                    formatLabel="none"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="Input username" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    v-model="Users.username"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    v-model="Users.password"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Roles</label>
                  <select 
                    v-model="Users.rights"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">--Select--</option>
                    <option value="2">Admin</option>
                    <option value="3">SuperAdmin</option>
                    <option value="1">Viewer</option>
                  </select>
                </div>
                
                <div>
                  <button 
                    class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-2 px-4 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    type="button" 
                    @click.prevent="nUsers"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - User Table -->
        <div class="w-full md:w-2/3 px-3">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center">
              <h5 class="text-white font-semibold">USER TABLE</h5>
              <div class="flex space-x-2">
                <button type="button" @click="maximizeTable" class="text-white hover:text-gray-200 transition">
                  <i class="fas fa-expand"></i>
                </button>
                <button type="button" @click="toggleTable" class="text-white hover:text-gray-200 transition">
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
            
            <div v-show="tableExpanded">
              <div class="p-4">
                <div class="mb-4">
                  <input 
                    placeholder="Search" 
                    type="search" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    v-model="searchUser.search" 
                    @keyup="filter"
                  >
                </div>
              </div>
              
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO.</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fullname</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(t, tt) in data" :key="tt" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ tt + 1 }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ t.fullname }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ getRole(t.role) }}</td>
                      <td class="px-4 py-3">
                        <input 
                          type="text" 
                          v-model="t.username" 
                          class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                      </td>
                      <td class="px-4 py-3 text-sm">
                        <span :class="t.status === 1 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                          {{ t.status == 1 ? 'Active' : 'Deactivated' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm">
                        <div class="flex space-x-2" v-if="t.status == 1">
                          <EditUser
                            :user="t" 
                            @user-updated="handleUserUpdated"
                          />
                          <button 
                            class="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 text-sm"
                            @click.prevent="updStat(t.id, 'Disable')" 
                            type="button"
                          >
                            Disable
                          </button>
                        </div>
                        <button 
                          v-if="t.status == 2"
                          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 text-sm"
                          @click.prevent="updStat(t.id, 'Active')" 
                          type="button"
                        >
                          Enable
                        </button>
                      </td>
                    </tr>
                    <tr v-if="data.length == 0">
                      <td colspan="6" class="px-4 py-8 text-center">
                        <div class="text-gray-400 text-lg">No Record Found</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="totalRows > 0" class="px-4 py-4 border-t border-gray-200">
                <paginate
                  :page_number="searchUser.page_num"
                  :total_rows="totalRows"
                  :itemsperpage="searchUser.itemsperpage"
                  @page_num="handlePageNum"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SearchDropdown from '@/Js/Components/SearchDropdown.vue'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import { FormDx } from '@/Views/Utility/Helper'
import Paginate from '@/Js/Components/Paginate.vue'
import EditUser from './Actions/edit.vue'

// State
const cardExpanded = ref(true)
const tableExpanded = ref(true)
const cdrop = ref([])
const data = ref([])
const search = reactive({
  text: ''
})
const currentPage = ref(1)
const rowCountPage = ref(10)
const selectedEmployee = ref(null)
const totalRows = ref(0)
const pageRange = ref(5)
const loading = ref(false)

// Form data
const Users = ref({
  emp_id: 0,
  fullname: '',
  username: '',
  password: '',
  rights: 0
})

const searchEmp = ref({
  search: '',
  itemsperpage: 10,
  page_num: 1
})

const searchUser = ref({
  search: '',
  itemsperpage: 10,
  page_num: 1
})

// Methods
const maximizeCard = () => {
  console.log('Maximize card')
}

const toggleCard = () => {
  cardExpanded.value = !cardExpanded.value
}

const maximizeTable = () => {
  console.log('Maximize table')
}

const toggleTable = () => {
  tableExpanded.value = !tableExpanded.value
}

const getRole = (status) => {
  switch(parseInt(status)) {
    case 1:
      return 'Viewer'
    case 2:
      return 'Admin'
    case 3:
      return 'Super Admin'
    default:
      return 'Undefined'
  }
}

const handleUserUpdated = (updatedUser) => {
  fetchUsers()
}

const nUsers = async () => {
  try {
    loading.value = true
    const formData = FormDx(Users.value)
    const response = await api.post('users/add', formData)

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'User created successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      reset()
      await fetchUsers()
    } else {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: response.data?.message || 'Failed to create user',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to create user:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to create user',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

let timer

const filter = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    fetchUsers()
  }, 300)
}

const updStat = async (id, action) => {
  loading.value = true
  
  try {
    const formData = FormDx({
      id: id,
      status: action === 'Active' ? 1 : 2
    })
    
    const response = await api.post('users/edit-status', formData)
    
    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `User ${action.toLowerCase()}d successfully`,
        timer: 1500,
        showConfirmButton: false
      })
      
      await fetchUsers()
    } else {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: response.data?.message || `Failed to ${action.toLowerCase()} user`,
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to update status:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update user status',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  loading.value = true
  const formData = FormDx(searchUser.value)
  
  try {
    const response = await api.post('/users/list', formData)
    
    if (response.data && !response.data.error) {
      data.value = response.data.users
      totalRows.value = response.data.totalrows
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load users list',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

const handleEmployeeSelected = (employee) => {
  selectedEmployee.value = employee
  Users.value.emp_id = employee.id
  Users.value.fullname = employee.fullName
}

const handlePageNum = (page_num) => {
  searchUser.value.page_num = page_num
  fetchUsers()
}

const reset = () => {
  Users.value.emp_id = 0
  Users.value.fullname = ''
  Users.value.password = ''
  Users.value.rights = 0
  Users.value.username = ''
  selectedEmployee.value = null
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>