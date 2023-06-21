import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
 plugins: [vue()],
 test:{
	environment: 'jsdom',
 },
 resolve: {
	alias: {
		"@": fileURLToPath(new URL("./src", import.meta.url)),
		"survey-core": path.resolve(__dirname, '../../build/survey-core'),
	},
},
})
