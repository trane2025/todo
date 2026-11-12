import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '#imports'
import { themeStorageKey, type Theme } from './theme'

export function useTheme() {
  const readTheme = (): Theme =>
    localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light'

  const theme = ref<Theme>(import.meta.client ? readTheme() : 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem(themeStorageKey, theme.value)
  }

  const syncTheme = ({ key, storageArea }: StorageEvent) => {
    if (key !== themeStorageKey && key !== null) return
    if (storageArea === localStorage) theme.value = readTheme()
  }

  onMounted(() => window.addEventListener('storage', syncTheme))
  onBeforeUnmount(() => window.removeEventListener('storage', syncTheme))

  useHead(() => ({
    htmlAttrs: {
      'data-theme': theme.value,
    },
  }))

  return { theme, toggleTheme }
}
