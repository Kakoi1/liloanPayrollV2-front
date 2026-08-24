<template>
  <div>
    <!-- Button to open modal -->
    <button 
      @click="openModal" 
      class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 float-right text-white rounded-md transition"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      Manual Item Input
    </button>
    <br>
    <br>
    
    <!-- Modal -->
    <Modal 
      :show="showModal"
      @close="closeModal"
      title="Create a Voucher"
      color="bg-gradient-to-r from-blue-600 to-blue-700"
      maxWidth="4xl"
      :closeable="true"
    >
      <div class="bg-white rounded-lg shadow-xl mx-4 max-h-[90vh]">
        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <!-- Report Date -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Report Date:</label>
            <input 
              type="date" 
              v-model="form.date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <!-- Item Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Item:</label>
            <select 
              v-model="form.id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option :value="0">Choose item!</option>
              <option v-for="item in props.items" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Weigh Slip:</label>
            <input 
              type="text" 
              v-model="form.slip" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
            <textarea v-model="form.remarks" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter Remarks..."></textarea>
          </div>

          <!-- Add Rows Button -->
          <div class="flex justify-end mb-4">
            <button 
              @click="addAmountRow" 
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Rows
            </button>
          </div>

          <!-- Dynamic Amount Rows -->
          <div v-for="(row, index) in amountRows" :key="index" class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount {{ index + 1 }}:</label>
            <div class="flex gap-2">
              <input 
                type="number" 
                step="0.01" 
                v-model="row.amount" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              <button 
                @click="removeAmountRow(index)" 
                class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                title="Remove row"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Table to display saved items -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">Saved Items:</label>
              <span class="text-sm text-gray-500">Total: {{ manualItems.length }} items</span>
            </div>

            <!-- Date Range Filter for Table -->
            <div class="flex gap-4 mb-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Date From:</label>
                <input 
                  type="date" 
                  v-model="search.date_from" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  @change="fetchSavedItems"
                />
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Date To:</label>
                <input 
                  type="date" 
                  v-model="search.date_to" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  @change="fetchSavedItems"
                />
              </div>
              <div class="flex items-end">
                <button 
                  @click="fetchSavedItems" 
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  <i class="fa-solid fa-magnifying-glass mr-2"></i> Search
                </button>
              </div>
            </div>
            
            <div v-if="loading" class="text-center py-4">
              <div class="text-gray-600">Loading...</div>
            </div>

            <div v-else-if="manualItems.length === 0" class="text-center py-4 bg-gray-50 rounded-md border border-gray-200">
              <small class="text-red-500">No data available**</small>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">#</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Date</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Item</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Weigh Slip</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Amounts</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Total</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Remarks</th>
                    <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in manualItems" :key="index" class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-3 py-2 text-sm text-center">{{ index + 1 }}</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">{{ item.date || '-' }}</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">{{ item.itemName }}</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">{{ item.slip || '-' }}</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">
                      <span v-for="(amount, idx) in item.amounts" :key="idx" class="inline-block mr-1">
                        {{ formatNumber(amount) }}
                        <span v-if="idx < item.amounts.length - 1">, </span>
                      </span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-sm font-semibold text-blue-600">
                      {{ formatNumber(item.total) }}
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">{{ item.remarks || '-' }}</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm text-center">
                      <button 
                        @click="deleteItem(item.id, index)" 
                        class="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                        :disabled="deleting"
                      >
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <Pagination
                    v-if="data.totalrows"
                    :page_number="search.page_num"
                    :total_rows="data.totalrows ?? 0"
                    :itemsperpage="search.itemsperpage"
                    @page_num="handlePagination"
                  />
                <tfoot v-if="manualItems.length > 0">
                  <tr class="bg-gray-50 font-bold">
                    <td colspan="5" class="border border-gray-300 px-3 py-2 text-right text-sm">Grand Total:</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm text-blue-600">{{ formatNumber(grandTotal) }}</td>
                    <td colspan="2" class="border border-gray-300 px-3 py-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
          >
            Close
          </button>
          <button 
            @click="saveManual" 
            class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
            :disabled="!form.id || amountRows.filter(row => row.amount).length === 0 || saving"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import Modal from '@/Js/Components/Modal.vue';
import api from '@/Js/Services/axios';
import { handleApiError } from '@/Views/Utility/Helper';
import Swal from 'sweetalert2';
import { ref, watch, computed } from 'vue';
import Pagination from "@/Js/Components/Paginate.vue"

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: null
  }
});

const data = ref({
  totalrows: 0
});

const search = ref({
  date_from: "",
  date_to: "",
  page_num: 1,
  itemsperpage: 10,
});

// Emits
const emit = defineEmits(['update:modelValue', 'saved', 'close']);

// State
const showModal = ref(false);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const form = ref({
  date: new Date().toISOString().slice(0, 10),
  itemName: '',
  id: 0,
  slip: '',
  remarks: ''
});
const amountRows = ref([]);
const manualItems = ref([]);

// Computed
const grandTotal = computed(() => {
  return manualItems.value.reduce((sum, item) => sum + (item.total || 0), 0);
});

// Methods
const openModal = () => {
  showModal.value = true;
  emit('update:modelValue', true);
  fetchSavedItems();
};

const closeModal = () => {
  showModal.value = false;
  emit('update:modelValue', false);
  emit('close');
  resetForm();
};

const resetForm = () => {
  form.value = {
    date: new Date().toISOString().slice(0, 10),
    itemName: '',
    id: 0,
    slip: '',
    remarks: ''
  };
  amountRows.value = [];
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  fetchSavedItems();
};

const fetchSavedItems = async () => {
  loading.value = true;
  try {
    const payload = {
      date_from: search.value.date_from,
      date_to: search.value.date_to,
      page_num: search.value.page_num,
      itemsperpage: search.value.itemsperpage
    };

    const response = await api.post('/vouchers/manual-items', payload);
    
    if (response.data && !response.data.error) {
      manualItems.value = response.data.data || [];
      data.value.totalrows = response.data.totalrows || 0;
    }
  } catch (error) {
    console.error('Error fetching saved items:', error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const addAmountRow = () => {
  amountRows.value.push({ amount: '' });
};

const removeAmountRow = (index) => {
  amountRows.value.splice(index, 1);
};

const deleteItem = async (id, index) => {
  if (!id) {
    manualItems.value.splice(index, 1);
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "This item will be permanently deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      deleting.value = true;
      try {
        const response = await api.delete(`/vouchers/manual-items/${id}`);
        
        if (response.data && !response.data.error) {
          manualItems.value.splice(index, 1);
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Item has been removed.',
            timer: 1500,
            showConfirmButton: false
          });
          
          emit('saved');
        } else {
          Swal.fire('Error', response.data.message || 'Failed to delete', 'error');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        handleApiError(error);
      } finally {
        deleting.value = false;
      }
    }
  });
};

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00';
  return parseFloat(value).toFixed(2);
};

const saveManual = async () => {
  if (!form.value.id) {
    Swal.fire('Error', 'Please select an item', 'error');
    return;
  }

  const validAmounts = amountRows.value.filter(row => row.amount && row.amount !== '');
  if (validAmounts.length === 0) {
    Swal.fire('Error', 'Please add at least one amount', 'error');
    return;
  }

  const selectedItem = props.items.find(item => item.id === form.value.id);
  const itemName = selectedItem ? selectedItem.name : '';

  const amounts = validAmounts.map(row => parseFloat(row.amount));
  const total = amounts.reduce((sum, val) => sum + val, 0);

  const newItem = {
    date: form.value.date,
    itemId: form.value.id,
    itemName: itemName,
    slip: form.value.slip,
    amounts: amounts,
    total: total,
    remarks: form.value.remarks
  };

  saving.value = true;
  Swal.fire({ 
    title: 'Saving...', 
    allowOutsideClick: false, 
    didOpen: () => Swal.showLoading() 
  });

  try {
    const payload = {
      date: form.value.date,
      itemId: form.value.id,
      itemName: itemName,
      slip: form.value.slip,
      amounts: amounts,
      remarks: form.value.remarks
    };

    const response = await api.post('/vouchers/manual-input', payload);
    
    if (response.data && !response.data.error) {
      if (response.data.id) {
        newItem.id = response.data.id;
      }
      
      Swal.close();
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Manual item input saved successfully',
        timer: 1500,
        showConfirmButton: false
      });
      
      form.value.id = 0;
      form.value.slip = '';
      form.value.remarks = '';
      amountRows.value = [];
      
      emit('saved');
    } else {
      Swal.close();
      Swal.fire('Error', response.data.message || 'Failed to save', 'error');
    }
  } catch (error) {
    Swal.close();
    handleApiError(error);
  } finally {
    saving.value = false;
  }
};

// Watch for date prop changes
watch(() => props.date, (newDate) => {
  if (newDate && showModal.value) {
    form.value.date = newDate;
    fetchSavedItems();
  }
});

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  showModal.value = newVal;
}, { immediate: true });
</script>

<style scoped>
/* Add any additional styles here */
</style>