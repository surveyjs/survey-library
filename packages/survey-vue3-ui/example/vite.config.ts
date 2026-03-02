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
    },
    build: {
      commonjsOptions: {
        include: [/survey-core\/build\/themes\/test/, /node_modules/],
      },
    },
    optimizeDeps: {
      include: ["survey-core/themes/test"],
    },
  }
})
