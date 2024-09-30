import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
    ],
    server: {
      watch: {
        ignored: ["survey-vue3-ui"].map((m) => `!**/node_modules/${m}/**`)
      }
    },
    build: {
      commonjsOptions: { exclude: ["survey-core"] },
    },
    optimizeDeps: {
      exclude: ["survey-vue3-ui"],
      include: ["survey-core", "survey-core/survey.i18n", "survey-core/plugins/bootstrap-integration", "survey-core/plugins/bootstrap-material-integration" ]
    },
    resolve: {
      preserveSymlinks: command == "serve" ? false : true,
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        "survey-core": fileURLToPath(new URL('./node_modules/survey-core', import.meta.url)),
      }
    }
  }
})
