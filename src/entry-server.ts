import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

export { clinic } from './data/clinic'

/** Executed at build time only; hosting still serves plain static files. */
export async function render(): Promise<string> {
  return renderToString(createSSRApp(App))
}
