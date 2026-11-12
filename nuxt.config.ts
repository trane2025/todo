// https://nuxt.com/docs/api/configuration/nuxt-config
import { themeStorageKey } from './app/components/UI/buttons/ThemeToggleButton/theme'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      script: [
        {
          key: 'theme-init',
          tagPriority: 'critical',
          // Restore the saved theme before the browser paints the page.
          innerHTML: `document.documentElement.dataset.theme =
  localStorage.getItem(${JSON.stringify(themeStorageKey)}) === 'dark' ? 'dark' : 'light'`,
        },
      ],
    },
  },
  css: ['~/assets/scss/main.scss'],
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
