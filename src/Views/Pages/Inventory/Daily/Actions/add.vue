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
    {{ console.log(showModal)
     }}
    
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
        <div class="p-6">
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

          <!-- Manual Input List Header -->
          <div class="mt-6 mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Manual Input List:</label>
            <small v-if="manualItems.length === 0" class="text-red-500 text-center block">No data available**</small>
          </div>

          <!-- Manual Input List Rows -->
          <div v-for="(item, index) in manualItems" :key="index" class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Weight:</label>
            <div class="flex gap-2">
              <input 
                type="number" 
                step="0.01" 
                v-model="item.weight" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter weight"
              />
              <button 
                @click="editManualItem(item, index)" 
                class="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
                title="Edit row"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button 
                @click="removeManualItem(index)" 
                class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                title="Remove row"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
          >
            Cancel
          </button>
          <button 
            @click="saveManual" 
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Save
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
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'saved', 'close']);

// State
const showModal = ref(false);
const form = ref({
  date: new Date().toISOString().slice(0, 10),
  itemName: '',
  id: 0,
  slip: '',
  remarks: ''
});
const amountRows = ref([]);
const manualItems = ref([]);

// Watch for prop changes
// watch(() => props.modelValue, (newVal) => {
//   showModal.value = newVal;
// }, { immediate: true });

// Methods
const openModal = () => {
  showModal.value = true;
  emit('update:modelValue', true);
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
  manualItems.value = [];
};

const addAmountRow = () => {
  amountRows.value.push({ amount: '' });
};

const removeAmountRow = (index) => {
  amountRows.value.splice(index, 1);
};

// const editManualItem = (item, index) => {
//   // Populate form for editing
//   form.value.date = item.date || form.value.date;
//   form.value.itemId = item.itemId;
//   amountRows.value = item.amounts || [];
//   // Remove the item being edited
//   manualItems.value.splice(index, 1);
// };

const removeManualItem = (index) => {
  manualItems.value.splice(index, 1);
};

const saveManual = async () => {
  if (!form.value.date) {
    Swal.fire('Error', 'Please select a date', 'error');
    return;
  }
  
  if (!form.value.id) {
    Swal.fire('Error', 'Please select an item', 'error');
    return;
  }

  if (amountRows.value.filter(row => row.amount).length === 0) {
    Swal.fire('Error', 'Please add at least one amount', 'error');
    return;
  }

  const selectedItem = props.items.find(item => item.id === form.value.id);
  const itemName = selectedItem ? selectedItem.name : '';

  Swal.fire({ 
    title: 'Saving...', 
    allowOutsideClick: false, 
    didOpen: () => Swal.showLoading() 
  });

  try {
    // Prepare data to save
    const payload = {
      date: form.value.date,
      itemId: form.value.id,
      itemName: itemName,
      slip: form.value.slip,
      amounts: amountRows.value.filter(row => row.amount && row.amount !== '').map(row => parseFloat(row.amount)),
      manualItems: manualItems.value,
      remarks: form.value.remarks
    };

    const response = await api.post('/vouchers/manual-input', payload);
    
    if (response.data && !response.data.error) {
      Swal.close();
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Manual item input saved successfully',
        timer: 1500,
        showConfirmButton: false
      });
      
      emit('saved');
      closeModal();
    } else {
      Swal.close();
      Swal.fire('Error', response.data.message || 'Failed to save', 'error');
    }
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>