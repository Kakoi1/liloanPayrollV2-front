<template>
  <div>
    <div class="p-2 min-h-screen">
      <h1 class="text-lg md:text-2xl font-bold">Item Inventory</h1>
      <div class="">
        <!-- Static Tabs -->
        <ul
          class="flex flex-wrap -mb-px text-lg font-bold text-center text-gray-500 dark:text-gray-400"
        >
          <!-- 'Item-in Tab -->
          <li class="me-2">
            <a
              href="#"
              @click.prevent="activateTab('Daily')"
              :class="{
                'inline-flex text-blue-500 border-b-2 p-4 border-blue-600 bg-blue-100 rounded-t-lg active dark:text-blue-500 dark:border-blue-500':
                  activeTab === 'Daily',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Daily',
              }"
            >
              <i class="fas fa-users me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md">Daily</span>
            </a>
          </li>
          <li class="me-2">
            <a
              href="#"
              @click.prevent="activateTab('Combined')"
              :class="{
                'inline-flex text-red-500 border-b-2 p-4 border-red-600 bg-red-100 rounded-t-lg active dark:text-red-500 dark:border-red-500':
                  activeTab === 'Combined',
                'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group':
                  activeTab !== 'Combined',
              }"
            >
              <i class="fas fa-network-wired me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md">Combined</span>
            </a>
          </li>

        </ul>
      </div>

      <!-- Tab content -->
      <Daily v-if="activeTab == 'Daily'"></Daily>
      <Combined v-if="activeTab == 'Combined'"></Combined>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Daily from '@/Views/Pages/Inventory/Daily/Index.vue';
import Combined from '@/Views/Pages/Inventory/Combined/Index.vue';


// Define the active tab state
const activeTab = ref("Daily");

// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>
