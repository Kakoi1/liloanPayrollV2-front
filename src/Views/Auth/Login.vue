<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome Back 👋
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            v-model="username"
            type="text"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <!-- Remember -->
        <div class="flex items-center justify-between">
          <label class="flex items-center text-sm text-gray-600">
            <input type="checkbox" class="mr-2 rounded">
            Remember me
          </label>
          <a href="#" class="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Sign In
        </button>

      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?
        <a href="#" class="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/Js/Services/axios'
import axios from 'axios';
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL


const handleLogin = async () => {
  try {
    await axios.get(apiBaseUrl + 'sanctum/csrf-cookie') // CSRF cookie first
    
    const res = await api.post('/login', {
      username: username.value,
      password: password.value
    })

    console.log(res.data)

    localStorage.setItem('auth', 'true')
    localStorage.setItem('user', JSON.stringify(res.data.user)) // ✅ FIX

    router.push({ name: 'dashboard' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}

</script>
