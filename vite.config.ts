import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      // links.html is the Instagram bio page, served at /links (cleanUrls in vercel.json).
      input: { main: resolve(__dirname, 'index.html'), links: resolve(__dirname, 'links.html') },
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
