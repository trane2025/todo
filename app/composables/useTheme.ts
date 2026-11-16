import { ref } from 'vue';
import { useHead } from '#imports';
import { themeStorageKey } from '#shared/theme';
import { useLocalStorage } from '~/composables/useLocalStorage';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const { read, write, subscribe } = useLocalStorage<Theme>(themeStorageKey, {
    parse: (value) => (value === 'dark' ? 'dark' : 'light'),
    serialize: (value) => value,
  });
  const theme = ref<Theme>(read() ?? 'light');

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    write(theme.value);
  };

  subscribe((value) => (theme.value = value ?? 'light'));

  useHead(() => ({
    htmlAttrs: {
      'data-theme': theme.value,
    },
  }));

  return { theme, toggleTheme };
};
