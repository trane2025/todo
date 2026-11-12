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
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
        />
      </svg>
    </span>

    <span
      class="theme-toggle__option"
      :class="{ 'is-active': theme === 'dark' }"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M20.5 14.3A8.7 8.7 0 0 1 9.7 3.5a8.7 8.7 0 1 0 10.8 10.8Z" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
  import { useTheme } from './useTheme'

  const { theme, toggleTheme } = useTheme()
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
