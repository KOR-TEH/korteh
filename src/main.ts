//import { createApp } from 'vue'
import { ViteSSG } from 'vite-ssg'
//import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

//import PrimeVue from 'primevue/config'
//import Button from 'primevue/button'

import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
//import 'prismjs/themes/prism-coy.css'
import './assets/styles/layout.scss'

const routes = setupLayouts(generatedRoutes)
//const router = createRouter({
//  history: createWebHistory(import.meta.env.BASE_URL),
//  routes,
//})

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).forEach(i => i.install?.(ctx))
  },
)
//
/*
const app = createApp(App)
app
  .use(router)
  .use(PrimeVue)
  .component('Button', Button)

.mount('#app')
*/