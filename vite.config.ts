import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
          if (/node_modules\/(gsap|lenis)\//.test(id)) return 'motion'
          if (/node_modules\/(vue|@vue)\//.test(id)) return 'vendor-vue'
        },
      },
    },
  },
})
