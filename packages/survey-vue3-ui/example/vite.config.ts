import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      dedupe: ["survey-core", "vue"],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    }
  }
})
