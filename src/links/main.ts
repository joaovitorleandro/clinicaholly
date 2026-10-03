import { createApp, createSSRApp } from 'vue'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '../styles/main.css'
import LinksApp from './LinksApp.vue'

const root = document.getElementById('app')
if (root) {
  const create = root.hasChildNodes() ? createSSRApp : createApp
  create(LinksApp).mount(root)
}
