<template>
  <div class="flex flex-col min-h-screen relative">
    <!-- Overlay: Applying Changes -->
    <transition name="fade">
      <div
        v-if="isApplyingChanges"
        class="absolute inset-0 bg-blue-800 bg-opacity-60 flex items-center justify-center z-50 text-white text-lg font-bold"
        aria-live="polite"
      >
        Applying changes...
      </div>
    </transition>

    <div class="min-h-screen bg-gray-100 flex">
      <!-- Right Content Area -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Page Heading -->
        <header class="bg-gray-900 shadow min-h-10">
          <div class="px-6 py-4">
            <!-- You can add header content here if needed -->
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex">
          <Sidebar
            :is-open="isDrawerOpen"
            @openDrawer="handleDrawer"
            @warehouseChanged="handleWarehouseChange"
          />
          <div class="w-full">
          <RouterView :key="routerKey" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";
import Sidebar from "@/Js/Components/Sidebar.vue";

const route = useRoute();

// Token check (keep if needed elsewhere, remove if not)
const hasToken = !!localStorage.getItem("token");

// Reactive states
const isDrawerOpen = ref(false);
const isMobile = ref(window.innerWidth < 1285);
const routerKey = ref(0);
const isApplyingChanges = ref(false);

// Screen resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 1285;
};

// Is login route
const isLoginRoute = computed(() => {
  return route.name === "login" || route.path === "/";
});

// Drawer control
const handleDrawer = (open) => {
  isDrawerOpen.value = open;
};

// Warehouse change logic
const handleWarehouseChange = () => {
  isApplyingChanges.value = true;
  routerKey.value++;
  setTimeout(() => {
    isApplyingChanges.value = false;
  }, 1000);
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>