<template>
  <button
    class="theme-toggle"
    :class="{ 'is-dark': theme === 'dark' }"
    type="button"
    aria-label="Тёмная тема"
    :aria-pressed="theme === 'dark'"
    @click="toggleTheme"
  >
    <span class="theme-toggle__thumb" aria-hidden="true" />

    <span
      class="theme-toggle__option"
      :class="{ 'is-active': theme === 'light' }"
      aria-hidden="true"
    >
      <SunIcon />
    </span>

    <span
      class="theme-toggle__option"
      :class="{ 'is-active': theme === 'dark' }"
      aria-hidden="true"
    >
      <MoonIcon />
    </span>
  </button>
</template>

<script setup lang="ts">
  import { MoonIcon, SunIcon } from '~/components/UI/icons';
  import { useTheme } from '~/composables/useTheme';

  const { theme, toggleTheme } = useTheme();
</script>

<style scoped lang="scss">
  .theme-toggle {
    --option-width: 44px;
    --option-height: 34px;

    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    padding: 3px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: var(--color-surface);
    color: var(--color-link);
    cursor: pointer;
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: var(--color-shadow) -3px 11px 41px -5px;
    }

    &__thumb {
      position: absolute;
      z-index: 0;
      top: 3px;
      left: 3px;
      width: var(--option-width);
      height: var(--option-height);
      border-radius: 999px;
      background: var(--color-primary);
      pointer-events: none;
      transform: translateX(0);
      transition:
        transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
        background-color 160ms ease;
    }

    &.is-dark .theme-toggle__thumb {
      transform: translateX(100%);
    }

    &__option {
      position: relative;
      z-index: 1;
      display: grid;
      flex: none;
      width: var(--option-width);
      height: var(--option-height);
      place-items: center;
      border-radius: 999px;
      transition: color 160ms ease;

      svg {
        width: 23px;
        height: 23px;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      &.is-active {
        color: var(--color-on-primary);
      }
    }
  }

  @media (max-width: 600px) {
    .theme-toggle {
      --option-width: 38px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle__thumb,
    .theme-toggle__option {
      transition: none;
    }
  }
</style>
