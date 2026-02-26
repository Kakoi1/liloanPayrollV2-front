<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: "2xl",
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  color: {
    type: String,
    default: "bg-emerald-900",
  },
  closeable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }
);

const close = () => {
  if (props.closeable) {
    emit("close");
  }
};

const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) {
    close();
  }
};

// Make the theme reactive by using a computed property
const currentMonth = new Date().getMonth(); // Get the current month (0 - 11)
const currentDay = new Date().getDate(); // Get the current day of the month
// Dynamic holiday image logic
const themeByMonth = computed(() => {
  const holidayImages = {
    0: "/images/theme/christmas.gif", // Christmas (December)
    1: "/images/theme/new_year.gif", // New Year (January)
    2: "/images/theme/easter.gif", // Easter (March, Easter theme)
    4: "/images/theme/independence.gif", // Independence Day (June)
    9: "/images/theme/halloween.gif", // Halloween (October)
  };

  // Determine the holiday image based on the current month and holiday
  const isChristmas = currentMonth === 11; // December
  const isNewYear = currentMonth === 0; // January
  const isHalloween = currentMonth === 9 && currentDay === 31; // Halloween on October 31

  if (isChristmas) {
    return { imageUrl: holidayImages[0], overlayClass: "bg-gray-800" }; // Christmas image
  } else if (isNewYear) {
    return { imageUrl: holidayImages[1], overlayClass: "bg-gray-800" }; // New Year image
  } else if (isHalloween) {
    return { imageUrl: holidayImages[9], overlayClass: "bg-gray-800" }; // Halloween image
  }
  // Default image if no holiday
  return { imageUrl: "/images/logo/logo.png", overlayClass: "bg-gray-800" };
});

onMounted(() => {
  document.addEventListener("keydown", closeOnEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEscape);
  document.body.style.overflow = null;
});

const maxWidthClass = computed(() => {
  return {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "4xl": "sm:max-w-4xl",
    "6xl": "sm:max-w-6xl",
    "7xl": "sm:max-w-7xl",
    "8xl": "sm:max-w-8xl",
    fullscreen: "absolute top-0 mt-0 pt-0 h-screen w-screen",
    calendar: "absolute top-0 mt-0 pt-0 min-h-screen min-w-screen overflow-hidden",
  }[props.maxWidth];
});
</script>

<template>
  <Teleport to="body">
    <Transition leave-active-class="duration-200">
      <div
        v-show="show"
        class="fixed inset-0 overflow-auto px-4 py-6 sm:px-0 z-50"
        scroll-region
      >
        <!-- Overlay -->
        <div
          class="fixed inset-0 opacity-90"
          :class="themeByMonth.overlayClass"
          @click.prevent="close"
        >
          <!-- Holiday Image at the bottom right of the overlay -->
          <div v-if="themeByMonth.imageUrl" class="absolute bottom-4 right-4">
            <img
              :src="themeByMonth.imageUrl"
              alt="Holiday Image"
              class="mx-auto"
              style="max-width: 100px; height: auto;"
            />
          </div>
        </div>
        <Transition
        enter-active-class="ease-out duration-300 delay-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="ease-in duration-200 delay-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
        >
          <div
            v-show="show"
            class="mb-6 bg-white rounded-lg overflow-auto shadow-xl transform transition-all sm:w-full sm:mx-auto"
            :class="maxWidthClass"
          >
            <div class="flex justify-between p-3" :class="color" v-if="show">
              <h2 class="text-lg font-semibold text-white">
                {{ title }}
              </h2>
              <button
                title="Close Modal"
                class="flex float-end p-3 bg-transparent  hover:animate-pulse hover:shadow-lg hover:shadow-green-800 rounded-full mr-4 md:mr-1"
                @click.prevent="close"
              >
                <i class="fa fa-times fa-2xl font-extrabold text-red-600"></i>
              </button>
            </div>
            <slot v-if="show" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
