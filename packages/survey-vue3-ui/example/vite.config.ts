import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
    ],
    build: {
      commonjsOptions: {
        include: [/survey\.i18n/, /node_modules/]
      }
    },
    optimizeDeps: {
      include: [ "survey-core/survey.i18n"]
    },
    resolve: {
      dedupe: ["survey-core", "vue"],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    }
  }
})
