<template>
  <div class="relative w-full p-0 m-0" ref="dropdownRef">
    <div class="flex">
      <input
        type="text"
        :id="inputId"
        :placeholder="placeholder"
        v-model="searchQuery"
        :title="searchQuery"
        @input="onInput"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @blur="handleBlur"
        autocomplete="off"
        :class="
          className ? className : 'mt-0 p-2 border-l border-t border-b rounded-l w-full'
        "
      />
      <button type="button" @click.prevent="viewItems()" class="absolute top-2 right-2">
        <i class="fa fa-xs font-extrabold text-black fa-chevron-down"></i>
      </button>
    </div>

    <!-- Loading indicator while fetching initial data -->
    <div
      v-if="isLoading && filteredItems.length === 0"
      class="dropdown-menu absolute bg-white shadow w-full mt-1 p-4 text-center"
    >
      <div class="flex justify-center items-center space-x-2">
        <i class="fa fa-spinner fa-spin text-gray-600"></i>
        <span class="text-gray-600">Loading...</span>
      </div>
    </div>

    <!-- Dropdown with items -->
    <div
      class="dropdown-menu absolute bg-white shadow w-full mt-1"
      v-else-if="filteredItems.length > 0"
      @scroll="handleScroll"
      style="max-height: 200px; overflow-y: auto"
    >
      <ul>
        <li
          v-for="(item, index) in filteredItems"
          :key="item[itemId]"
          :class="[
            'p-2 border-l-2 border-slate-200 flex py-2 font-bold shadow text-gray-600 cursor-pointer hover:bg-gray-100',
            { 'bg-slate-200': selectedIndex === index },
          ]"
          @click="selectItem(item)"
          @mouseover="selectedIndex = index"
        >
          {{ labelFormatter(item) }}
        </li>
        
        <!-- Loading more indicator at bottom -->
        <li v-if="loadingMore" class="text-center py-3 bg-gray-50">
          <div class="flex justify-center items-center space-x-2">
            <i class="fa fa-spinner fa-spin text-gray-500"></i>
            <span class="text-gray-500 text-sm">Loading more...</span>
          </div>
        </li>
        
        <!-- No more items indicator -->
        <li v-if="!loadingMore && !hasMoreItems && filteredItems.length > 0" class="text-center py-2 text-gray-500 border-t">
          No more items
        </li>
      </ul>
    </div>
    
    <!-- Not found state - shows when input is focused and has search term -->
    <div 
      v-else-if="isFocused && !isLoading && searchQuery && filteredItems.length === 0"
      class="dropdown-menu absolute bg-white shadow w-full mt-1 p-4 text-center border rounded"
    >
      <div class="flex flex-col items-center space-y-2">
        <i class="fa fa-search text-gray-400 text-xl"></i>
        <span class="text-gray-500">No results found for "{{ searchQuery }}"</span>
        <span class="text-gray-400 text-sm">Try different keywords</span>
      </div>
    </div>
    
    <!-- Empty state when focused but no search has been performed -->
    <div 
      v-else-if="isFocused && !isLoading && !searchQuery && filteredItems.length === 0"
      class="dropdown-menu absolute bg-white shadow w-full mt-1 p-4 text-center border rounded"
    >
      <div class="flex flex-col items-center space-y-2">
        <i class="fa fa-chevron-up text-gray-400 text-xl"></i>
        <span class="text-gray-500">Type to search</span>
        <span class="text-gray-400 text-xs">Start typing to see results</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, onBeforeUnmount } from "vue";
import api from "../Services/axios";
import { useDebounce, convertStringToArray, BearToken } from "@/Views/Utility/Helper"
import { VUE_APP_API_URL } from "@/Views/Utility/Global";

const props = defineProps({
  apiEndpoint: String,
  searchModel: Object,
  placeholder: String,
  itemLabel: String,
  itemId: String,
  inputId: String,
  returnName: String,
  dataKey: String,
  className: {
    type: String,
    default: "",
  },
  defaultValue: String,
  formatLabel: {
    type: String,
    default: "none",
  },
  // Optional: Control whether dropdown shows on focus
  showOnFocus: {
    type: Boolean,
    default: true
  }
});

const keyName = ref(convertStringToArray(props.returnName));
const emit = defineEmits(["item-selected"]);

const searchQuery = ref("");
const filteredItems = ref([]);
const selectedIndex = ref(-1);
const isLoading = ref(false);
const loadingMore = ref(false);
const hasMoreItems = ref(true);
const page = ref(1);
const dropdownRef = ref(null);
const isFocused = ref(false);
const token = localStorage.getItem("token");

const viewItems = () => {
  if (filteredItems.value.length > 0) {
    filteredItems.value = [];
  } else {
    fetchItems();
  }
};

const handleFocus = () => {
  isFocused.value = true;
  // Optionally fetch items when focused if there's a default search
  if (props.showOnFocus && searchQuery.value) {
    fetchItems();
  }
};

const handleBlur = () => {
  // Delay blur to allow click events on dropdown items
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
    isFocused.value = false;
  }
};

const closeDropdown = () => {
  filteredItems.value = [];
  selectedIndex.value = -1;
};

const fetchItems = async (loadMore = false) => {
  try {
    if (!loadMore) {
      filteredItems.value = [];
      page.value = 1;
      hasMoreItems.value = true;
      isLoading.value = true;
    }

    const response = await api.post(
      props.apiEndpoint,
      {
        ...props.searchModel,
        page_num: page.value,
      }
    );

    const newItems =
      props.dataKey && response.data[props.dataKey]
        ? response.data[props.dataKey]
        : Array.isArray(response.data)
        ? response.data
        : Object.values(response.data).find((val) => Array.isArray(val)) || [];

    if (newItems.length === 0) {
      hasMoreItems.value = false;
    } else if (loadMore) {
      filteredItems.value.push(...newItems);
    } else {
      filteredItems.value = newItems;
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
    hasMoreItems.value
  ) {
    page.value += 1;
    loadingMore.value = true;
    fetchItems(true);
  }
};

const labelFormatter = (item) => {
  const formatLabel = props.formatLabel;
  const key = keyName.value;
  if (key.length > 3) return "Maximum Allowed key is 3 only!";
  
  const third_value =
    key?.length >= 2 && item[key[2]]?.length > 0 ? " (" + (item[key[2]] ?? "") + ")" : "";
  switch (formatLabel) {
    case "none":
      return key?.length > 0
        ? (item[key[0]] ?? "") + "  " + (item[key[1]] ?? "") + " " + (item[key[2]] ?? "")
        : item[key[0]] ?? "";
    case "dashed":
      return key?.length > 0
        ? (item[key[0]] ?? "") +
            " - " +
            (item[key[1]] ?? "") +
            "  " +
            (item[key[2]] ?? "")
        : item[key[0]] ?? "";
    case "dashed_and_parenthesis":
      return key?.length > 0
        ? (item[key[0]] ?? "") +
            " - " +
            (item[key[1]] ?? "") +
            "  (" +
            (item[key[2]] + ")" ?? "")
        : item[key[0]] ?? "";
    case "parenthesis":
      return key?.length == 2
        ? (item[key[0]] ?? "") + " (" + (item[key[1]] + ")" ?? ")")
        : item[key[0]] ?? "";
    case "third_parenthesis":
      return key?.length > 0
        ? (item[key[0]] ?? "") + " - " + (item[key[1]] ?? "") + third_value
        : item[key[0]] ?? "";
    default:
      return key?.length > 0
        ? (item[key[0]] ?? "") + "  " + (item[key[1]] ?? "") + (item[key[2]] ?? "")
        : item[key[0]] ?? "";
  }
};

const debouncedFetchItems = useDebounce(fetchItems, 500);

const onInput = (event) => {
  searchQuery.value = event.target.value;
  props.searchModel.search = searchQuery.value;

  debouncedFetchItems();
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
      closeDropdown();
      isFocused.value = false;
      break;
  }
};

const selectItem = (item) => {
  const labelName = labelFormatter(item);
  searchQuery.value = labelName;
  filteredItems.value = [];
  selectedIndex.value = -1;
  isFocused.value = false;

  emit("item-selected", item);
};

onMounted(() => {
  searchQuery.value = props.defaultValue;
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-menu {
  z-index: 9999;
  position: relative;
  border-radius: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
}

/* Smooth transitions */
.dropdown-menu {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading spinner animation */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Optional: Style for focused input */
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>