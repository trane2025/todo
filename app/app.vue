<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />

    <div class="app-backdrop" aria-hidden="true">
      <span class="app-backdrop__circle" />
    </div>

    <header class="app-header">
      <NuxtLink class="app-brand" to="/">
        <svg
          class="app-brand__icon"
          viewBox="0 0 32 40"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="26" height="34" rx="7" />
          <path d="M10 13h12M10 20h12M10 27h7" />
        </svg>
        <span>Заметки</span>
      </NuxtLink>
      <ThemeToggleButton />
    </header>

    <main class="app-main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
  import ThemeToggleButton from '~/components/UI/buttons/ThemeToggleButton.vue'
</script>

<style scoped lang="scss">
  .app-shell {
    position: relative;
    min-height: 100vh;
    min-height: 100svh;
    padding: 40px;
    isolation: isolate;
  }

  .app-backdrop {
    position: absolute;
    z-index: 0;
    inset: 0;
    overflow: hidden;
    pointer-events: none;

    &::before,
    &::after {
      position: absolute;
      right: 0;
      content: '';
      background: var(--color-decoration);
    }

    &::before {
      top: 0;
      width: clamp(260px, 36vw, 520px);
      height: clamp(160px, 20vw, 240px);
      border-bottom-left-radius: 200px;
    }

    &::after {
      bottom: 0;
      width: clamp(300px, 40vw, 560px);
      aspect-ratio: 1;
      border-top-left-radius: 100%;
    }
  }

  .app-header,
  .app-main {
    position: relative;
    z-index: 1;
    max-width: 1040px;
    margin-inline: auto;
  }

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 56px;
  }

  .app-brand {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    color: var(--color-text);
    font-size: 28px;
    font-weight: 750;
    line-height: 1.2;
    text-decoration: none;
    border-radius: 8px;

    &__icon {
      flex: none;
      width: 34px;
      height: 42px;
      color: var(--color-link);
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  @media (max-width: 600px) {
    .app-shell {
      padding: 24px 20px 40px;
    }

    .app-header {
      gap: 12px;
      margin-bottom: 36px;
    }

    .app-brand {
      gap: 10px;
      font-size: 22px;

      &__icon {
        width: 28px;
        height: 36px;
      }
    }
  }
</style>
