<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '-- Select --'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})
</script>

<template>
  <select
    v-model="selected"
    class="w-full border-gray-300 rounded-md  px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
  >
    <option value="0" disabled>
      {{ placeholder }}
    </option>

    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
