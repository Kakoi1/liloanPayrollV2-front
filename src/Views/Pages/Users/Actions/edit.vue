<!-- Edit User Modal with SearchDropdown -->
<template>
  <div>
    <!-- Edit Button -->
    <button 
      @click="openModal"
      class="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-1 px-3 rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
      type="button"
    >
      Edit
    </button>

    <!-- Modal -->
    <div v-if="editModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all">
          
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h3 class="text-white font-semibold text-lg">
              Edit User Info
            </h3>
            <button 
              @click="closeModal" 
              class="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6">
            <div class="space-y-4">
              <!-- Employee Fullname Input (Regular Input) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Employee Fullname
                </label>
                <input 
                  type="text" 
                  v-model="userData.fullname"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                >
              </div>
              
              <!-- Username Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder="Input username" 
                  v-model="userData.username"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
              </div>
              
              <!-- Password Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input 
                  type="password" 
                  v-model="userData.password"
                  placeholder="Leave blank to keep current password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
              </div>
              
              <!-- Rights Dropdown -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rights
                </label>
                <select 
                  v-model="userData.rights"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="0">--Select--</option>
                  <option value="2">Admin</option>
                  <option value="3">SuperAdmin</option>
                  <option value="1">Viewer</option>
                </select>
              </div>
              
              <!-- Save Button -->
              <div class="pt-2">
                <button 
                  type="button" 
                  @click.prevent="updateUser"
                  :disabled="loading"
                  class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-2 px-4 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                  <span v-else>Update User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import { FormDx } from '@/Views/Utility/Helper'

// Props
const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['user-updated'])

// State
const editModal = ref(false)
const loading = ref(false)

// User form data
const userData = reactive({
  id: 0,
  emp_id: 0,
  fullname: '',
  username: '',
  password: '',
  rights: 0
})

// Open modal and load user data
const openModal = () => {
  if (props.user) {
    loadUserData()
  }
  editModal.value = true
}

// Load user data into form
const loadUserData = () => {
  if (props.user) {
    userData.id = props.user.id || 0
    userData.emp_id = props.user.emp_id || 0
    userData.fullname = props.user.fullname || ''
    userData.username = props.user.username || ''
    userData.password = '' // Don't load password for security
    userData.rights = props.user.role || 0
  }
}

// Update user
const updateUser = async () => {
  // Validation
  if (!userData.fullname) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Employee fullname is required',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!userData.username) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Please enter username',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  if (!userData.rights || userData.rights === '0') {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Please select a role',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    loading.value = true
    
    const formData = FormDx({
      id: userData.id,
      emp_id: userData.emp_id,
      fullname: userData.fullname,
      username: userData.username,
      password: userData.password,
      rights: userData.rights
    })
    
    const response = await api.post('users/edit', formData)

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'User updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      emit('user-updated', response.data.user)
      closeModal()
    } else {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: response.data?.message || 'Failed to update user',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Failed to update user:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update user',
      timer: 1500,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

// Close modal and reset form
const closeModal = () => {
  editModal.value = false
  resetForm()
}

// Reset form
const resetForm = () => {
  userData.id = 0
  userData.emp_id = 0
  userData.fullname = ''
  userData.username = ''
  userData.password = ''
  userData.rights = 0
}
</script>

<style scoped>
/* Custom animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>