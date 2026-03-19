<template>
  <div class="content-wrapper">
    <!-- Content Header -->
    <div class="content-header bg-white border-b">
      <div class="container-fluid px-6 py-4">
        <div class="flex flex-wrap items-center justify-between mb-2">
          <div class="sm:col-span-6">
            <h1 class="text-2xl font-bold text-gray-800 m-0">Compensation & Deductions</h1>
          </div>
          <div class="sm:col-span-6">
            <ol class="flex space-x-2 text-sm">
              <li class="breadcrumb-item">
                <a href="#" class="text-blue-600 hover:text-blue-800">Home</a>
              </li>
              <li class="breadcrumb-item text-gray-500">Compensation</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="container-fluid px-6 py-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Card Header -->
            <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg flex justify-between items-center">
              <h5 class="text-white font-semibold text-lg">COMPENSATION & DEDUCTIONS TABLE</h5>
              <div class="flex space-x-2" id="tools">
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="maximize">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </button>
                <button type="button" class="text-white hover:text-gray-200 transition-colors" @click="collapse">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <div class="flex flex-wrap">
                <div class="w-full mt-4 mb-0 pb-0">
                  <!-- Header with Add Button and Search -->
                  <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
                    <div class="relative w-full md:w-64">
                      <input 
                        type="search" 
                        placeholder="Search..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        v-model="search.search" 
                        @keyup="filter"
                      >
                      <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    
                    <!-- Add Compensation Button -->
                    <AddCompensation @saved="fetchCompensations" />
                  </div>

                  <!-- Compensations Table -->
                    <div class="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                    <table class="w-full text-sm text-gray-700">
                        
                        <thead class="bg-gray-50 border-b border-gray-200">
                        <tr class="text-center">
                            <th class="px-6 py-3 font-semibold tracking-wide">Name</th>
                            <th class="px-6 py-3 font-semibold tracking-wide">Mandatory</th>
                            <th class="px-6 py-3 font-semibold tracking-wide">Actions</th>
                        </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-100">

                        <tr v-if="data.length === 0">
                            <td colspan="3" class="px-6 py-10 text-center text-red-500 font-medium">
                            No records found
                            </td>
                        </tr>

                        <tr 
                            v-for="(item, index) in data" 
                            :key="item.id"
                            class="hover:bg-gray-50 transition"
                        >

                            <!-- Name -->
                            <td class="px-6 py-4">
                            <div class="flex justify-center">
                                <input 
                                type="text"
                                v-model="item.name"
                                class="w-[85%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                :class="{ 'bg-yellow-50 border-yellow-300': item.isEditing }"
                                />
                            </div>
                            </td>

                            <!-- Mandatory -->
                            <td class="px-6 py-4 text-center">
                            <input
                                type="checkbox"
                                v-model="item.is_mandatory"
                                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4">
                            <div class="flex justify-center gap-2">

                                <button
                                @click="updateCompensation(index)"
                                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                                >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7"/>
                                </svg>
                                Update
                                </button>

                                <button
                                @click="confirmDelete(item.id)"
                                class="flex items-center justify-center w-8 h-8 text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm"
                                title="Delete"
                                >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-1 12H6L5 7m5 4v6m4-6v6M9 4h6"/>
                                </svg>
                                </button>

                            </div>
                            </td>

                        </tr>

                        </tbody>
                    </table>
                    </div>

                  <!-- Pagination -->
                  <div v-if="totalUsers > 0" class="mt-6">
                    <Pagination
                      :page_number="search.page_num"
                      :total_rows="totalUsers"
                      :itemsperpage="search.items_perpage"
                      @page_num="handlePageNum"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/Js/Services/axios'
import Pagination from '@/Js/Components/Paginate.vue'
import AddCompensation from './Actions/add.vue'
import { FormDx } from '@/Views/Utility/Helper'

// State
const data = ref([])
const totalUsers = ref(0)

const search = ref({
  search: '',
  page_num: 1,
  items_perpage: 10
})

// Methods
const maximize = () => {}
const collapse = () => {}

const filter = async () => {
  search.value.page_num = 1
  await fetchCompensations()
}

const handlePageNum = (page_num) => {
  search.value.page_num = page_num
  fetchCompensations()
}

const fetchCompensations = async () => {
  try {
    const formData = FormDx(search.value)
    const response = await api.post('/compensations/list', formData)
    
    if (response.data && !response.data.error) {
      // Add isEditing flag to each item
      data.value = (response.data.compensations || []).map(item => ({
        ...item,
        is_mandatory: item.isMandatory == 1 ? true : false,
        isEditing: false
      }))
      totalUsers.value = response.data.totalrows || 0
    }
  } catch (error) {
    console.error('Failed to fetch compensations:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load compensations',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const updateCompensation = async (index) => {
  const item = data.value[index]
  
  // Validate required fields
  if (!item.name.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Name cannot be empty',
      timer: 1500,
      showConfirmButton: false
    })
    return
  }

  try {
    const response = await api.post('/compensations/update', {
      id: item.id,
      name: item.name,
      is_mandatory: item.is_mandatory ? 1 : 0
    })

    if (response.data && !response.data.error) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Compensation updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
      
      // Refresh the list to get updated data
      await fetchCompensations()
    }
  } catch (error) {
    console.error('Failed to update compensation:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update compensation',
      timer: 1500,
      showConfirmButton: false
    })
  }
}

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await api.post('/compensations/delete', {
        id: id
      })
      
      if (response.data && !response.data.error) {
        await fetchCompensations()
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Item deleted successfully',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete item',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }
}

// Initialize
onMounted(() => {
  fetchCompensations()
})
</script>