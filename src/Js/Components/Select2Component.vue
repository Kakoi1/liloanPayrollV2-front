<template>
  <div class="relative w-full p-0 m-0" ref="dropdownRef">
    <!-- For single select -->
    <template v-if="!multiple">
      <div class="flex relative">
        <input
          type="text"
          :id="inputId"
          :placeholder="placeholder"
          v-model="searchQuery"
          :title="searchQuery || selectedLabel"
          @input="onInput"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="handleBlur"
          autocomplete="off"
          :class="className || 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'"
        />
        <button 
          type="button" 
          @click.prevent="toggleDropdown" 
          class="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          <svg 
            class="w-4 h-4 transition-transform duration-200" 
            :class="{ 'transform rotate-180': isOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </template>

    <!-- For multiple select -->
    <template v-else>
      <div class="flex flex-wrap gap-1 p-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <!-- Selected tags -->
        <span 
          v-for="value in selectedMultipleValues" 
          :key="value"
          class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          {{ getOptionLabel(value) }}
          <button 
            @click="removeValue(value)"
            class="ml-1 text-blue-600 hover:text-blue-800"
            type="button"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        
        <!-- Input field -->
        <input
          type="text"
          :id="inputId"
          :placeholder="selectedMultipleValues.length === 0 ? placeholder : ''"
          v-model="searchQuery"
          @input="onInput"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="handleBlur"
          autocomplete="off"
          class="flex-1 min-w-[120px] px-2 py-1 outline-none"
        />
        
        <!-- Dropdown toggle button -->
        <button 
          type="button" 
          @click.prevent="toggleDropdown" 
          class="px-1 text-gray-500 hover:text-gray-700"
        >
          <svg 
            class="w-4 h-4 transition-transform duration-200" 
            :class="{ 'transform rotate-180': isOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </template>

    <!-- Loading indicator -->
    <div
      v-if="isLoading && filteredItems.length === 0"
      class="dropdown-menu absolute bg-white shadow-lg w-full mt-1 p-4 text-center border rounded-lg z-50"
    >
      <div class="flex justify-center items-center space-x-2">
        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Loading...</span>
      </div>
    </div>

    <!-- Dropdown items -->
    <div
      v-else-if="filteredItems.length > 0"
      class="dropdown-menu absolute bg-white shadow-lg w-full mt-1 border rounded-lg z-50"
      @scroll="handleScroll"
      style="max-height: 200px; overflow-y: auto"
    >
      <ul class="py-1">
        <li
          v-for="(item, index) in filteredItems"
          :key="item[itemId]"
          :class="[
            'px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors',
            { 'bg-blue-100': isSelected(item[itemId]) },
            { 'bg-gray-100': selectedIndex === index },
          ]"
          @click="selectItem(item)"
          @mouseover="selectedIndex = index"
        >
          {{ labelFormatter(item) }}
          <span v-if="isSelected(item[itemId])" class="float-right text-blue-600">
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </li>
        
        <!-- Loading more -->
        <li v-if="loadingMore" class="text-center py-3 bg-gray-50">
          <div class="flex justify-center items-center space-x-2">
            <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-500 text-sm">Loading more...</span>
          </div>
        </li>
        
        <!-- No more items -->
        <li v-if="!loadingMore && !hasMoreItems && filteredItems.length > 0" class="text-center py-2 text-gray-500 border-t">
          No more items
        </li>
      </ul>
    </div>
    
    <!-- No results -->
    <div 
      v-else-if="isFocused && !isLoading && searchQuery && filteredItems.length === 0"
      class="dropdown-menu absolute bg-white shadow-lg w-full mt-1 p-4 text-center border rounded-lg z-50"
    >
      <div class="flex flex-col items-center space-y-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-gray-500">No results found for "{{ searchQuery }}"</span>
        <span class="text-gray-400 text-sm">Try different keywords</span>
      </div>
    </div>
    
    <!-- Empty state -->
    <div 
      v-else-if="isFocused && !isLoading && !searchQuery && filteredItems.length === 0"
      class="dropdown-menu absolute bg-white shadow-lg w-full mt-1 p-4 text-center border rounded-lg z-50"
    >
      <div class="flex flex-col items-center space-y-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-gray-500">Type to search</span>
        <span class="text-gray-400 text-xs">Start typing to see results</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useDebounce } from "@/Views/Utility/Helper";
import api from "@/Js/Services/axios";

const props = defineProps({
  // Local options (if not using remote)
  options: {
    type: Array,
    default: () => []
  },
  // v-model
  modelValue: {
    type: [String, Number, Array],
    default: null
  },
  placeholder: {
    type: String,
    default: "-- Select --"
  },
  // Field names for the item
  itemId: {
    type: String,
    default: "id"
  },
  itemLabel: {
    type: String,
    default: "fullName"
  },
  inputId: {
    type: String,
    default: ""
  },
  className: {
    type: String,
    default: ""
  },
  formatLabel: {
    type: String,
    default: "none"
  },
  returnName: {
    type: String,
    default: "fullName"
  },
  multiple: {
    type: Boolean,
    default: false
  },
  // Remote API configuration
  remote: {
    type: Boolean,
    default: false
  },
  apiEndpoint: {
    type: String,
    default: null
  },
  searchModel: {
    type: Object,
    default: () => ({ search: "" })
  },
  dataKey: {
    type: String,
    default: "listEmployee" // Default to match your backend response
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  defaultValue: {
    type: String,
    default: ""
  },
  // Additional parameters for the API
  additionalParams: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["update:modelValue", "change", "item-selected"]);

// State
const searchQuery = ref("");
const filteredItems = ref([]);
const selectedIndex = ref(-1);
const isLoading = ref(false);
const loadingMore = ref(false);
const hasMoreItems = ref(true);
const page = ref(1);
const dropdownRef = ref(null);
const isFocused = ref(false);
const localOptions = ref([]);
const totalRows = ref(0);

// Computed
const selectedLabel = computed(() => {
  if (props.multiple) return "";
  if (!props.modelValue) return "";
  const item = filteredItems.value.find(opt => opt[props.itemId] === props.modelValue) || 
                props.options.find(opt => opt[props.itemId] === props.modelValue) ||
                localOptions.value.find(opt => opt[props.itemId] === props.modelValue);
  return item ? formatItemLabel(item) : "";
});

const selectedMultipleValues = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

// Methods
const formatItemLabel = (item) => {
  if (!item) return "";
  // Try different possible label fields
  return item[props.itemLabel] || 
         item.fullName || 
         item.name || 
         item.label || 
         `${item.firstName || ''} ${item.lastName || ''}`.trim() ||
         JSON.stringify(item);
};

const isSelected = (value) => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value);
  }
  return props.modelValue === value;
};

const getOptionLabel = (value) => {
  const item = [...props.options, ...localOptions.value].find(opt => opt[props.itemId] === value);
  return item ? formatItemLabel(item) : value;
};

const toggleDropdown = () => {
  if (!isFocused.value) {
    isFocused.value = true;
    fetchItems();
  } else {
    isFocused.value = false;
  }
};

const handleFocus = () => {
  isFocused.value = true;
  if (!props.remote) {
    filterLocalOptions();
  } else {
    fetchItems();
  }
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
    if (!props.multiple && !props.modelValue) {
      searchQuery.value = "";
    }
  }, 200);
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isFocused.value = false;
    if (!props.multiple && !props.modelValue) {
      searchQuery.value = "";
    }
  }
};

const filterLocalOptions = () => {
  if (!searchQuery.value) {
    filteredItems.value = props.options;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredItems.value = props.options.filter(opt => 
      formatItemLabel(opt).toLowerCase().includes(query)
    );
  }
};

const fetchItems = async (loadMore = false) => {
  if (!props.remote) {
    filterLocalOptions();
    return;
  }

  try {
    if (!loadMore) {
      filteredItems.value = [];
      page.value = 1;
      hasMoreItems.value = true;
      isLoading.value = true;
    }

    const payload = {
      search: searchQuery.value,
      page_num: page.value,
      items_perpage: props.itemsPerPage,
    };

    const response = await api.post(
      props.apiEndpoint,
      payload
    );

    // Handle your specific response structure
    if (response.data && !response.data.error) {
      const newItems = response.data[props.dataKey] || [];
      
      // Store total rows for pagination
      if (response.data.totalrows) {
        totalRows.value = response.data.totalrows;
      }

      if (newItems.length === 0) {
        hasMoreItems.value = false;
      } else {
        if (loadMore) {
          filteredItems.value.push(...newItems);
          localOptions.value.push(...newItems);
        } else {
          filteredItems.value = newItems;
          localOptions.value = newItems;
        }
        
        // Check if we have more items
        const totalPages = Math.ceil(totalRows.value / props.itemsPerPage);
        hasMoreItems.value = page.value < totalPages;
      }
    } else {
      filteredItems.value = [];
      hasMoreItems.value = false;
    }

    isLoading.value = false;
    loadingMore.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoading.value = false;
    loadingMore.value = false;
    filteredItems.value = [];
  }
};

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;

  if (
    scrollTop + clientHeight >= scrollHeight - 5 &&
    !loadingMore.value &&
    !isLoading.value &&
    hasMoreItems.value &&
    props.remote
  ) {
    page.value += 1;
    loadingMore.value = true;
    fetchItems(true);
  }
};

const labelFormatter = (item) => {
  if (props.formatLabel === "none") {
    return formatItemLabel(item);
  }
  
  // Handle different formatLabel options
  switch (props.formatLabel) {
    case "fullName":
      return `${item.fullName || ''}`;
    case "employeeId":
      return `${item.employeeId || ''} - ${item.fullName || ''}`;
    case "position":
      return `${item.fullName || ''} (${item.position || ''})`;
    default:
      return formatItemLabel(item);
  }
};

const onInput = (event) => {
  searchQuery.value = event.target.value;
  if (props.remote) {
    page.value = 1; // Reset to first page on new search
    debouncedFetchItems();
  } else {
    filterLocalOptions();
  }
};

const selectItem = (item) => {
  const value = item[props.itemId];
  
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    if (!currentValues.includes(value)) {
      currentValues.push(value);
      emit("update:modelValue", currentValues);
      emit("change", currentValues);
      emit("item-selected", item);
    }
    searchQuery.value = ""; // Clear search after selection
  } else {
    searchQuery.value = formatItemLabel(item);
    emit("update:modelValue", value);
    emit("change", value);
    emit("item-selected", item);
  }
  
  isFocused.value = false;
  filteredItems.value = [];
  selectedIndex.value = -1;
};

const addValue = (value) => {
  const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  if (!currentValues.includes(value)) {
    currentValues.push(value);
    emit("update:modelValue", currentValues);
    emit("change", currentValues);
  }
  searchQuery.value = "";
};

const removeValue = (value) => {
  const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  const index = currentValues.indexOf(value);
  if (index > -1) {
    currentValues.splice(index, 1);
    emit("update:modelValue", currentValues);
    emit("change", currentValues);
  }
};

const handleKeyDown = (event) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (selectedIndex.value < filteredItems.value.length - 1) {
        selectedIndex.value += 1;
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (selectedIndex.value > 0) {
        selectedIndex.value -= 1;
      }
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0 && filteredItems.value[selectedIndex.value]) {
        selectItem(filteredItems.value[selectedIndex.value]);
      }
      break;
    case "Escape":
      isFocused.value = false;
      if (!props.multiple && !props.modelValue) {
        searchQuery.value = "";
      }
      break;
    case "Backspace":
      if (props.multiple && !searchQuery.value && selectedMultipleValues.value.length > 0) {
        removeValue(selectedMultipleValues.value[selectedMultipleValues.value.length - 1]);
      }
      break;
  }
};

const debouncedFetchItems = useDebounce(fetchItems, 300);

// Watch for external options changes
watch(() => props.options, (newOptions) => {
  if (!props.remote && newOptions.length > 0) {
    filterLocalOptions();
  }
}, { deep: true });

// Watch for modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (!props.multiple && !newVal) {
    searchQuery.value = "";
  }
});

// Initialize
onMounted(() => {
  if (props.defaultValue) {
    searchQuery.value = props.defaultValue;
  }
  document.addEventListener("click", handleClickOutside);
  
  if (!props.remote) {
    filteredItems.value = props.options;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-menu {
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>