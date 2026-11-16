<template>
  <div class="app-shell">
    <div class="app-backdrop" aria-hidden="true">
      <span class="app-backdrop__circle" />
    </div>

    <header class="app-header container">
      <NuxtLink class="app-brand" to="/">
        <LogoIcon class="app-brand__icon" />
        <span>Заметки</span>
      </NuxtLink>
      <ThemeToggleButton />
    </header>

    <main
      class="app-main container"
      :class="{ 'app-main--slide-right': currentRoute.path === '/' }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import ThemeToggleButton from '~/components/UI/buttons/ThemeToggleButton.vue';
  import { LogoIcon } from '~/components/UI/icons';

  const { currentRoute } = useRouter();
</script>

<style scoped lang="scss">
  .app-shell {
    position: relative;
    min-height: 100vh;
    padding: 40px;
    isolation: isolate;
    overflow-x: clip;
  }

  .app-shell:has(.editor-page) {
    display: flex;
    flex-direction: column;
    block-size: 100dvh;
    min-block-size: min-content;

    .app-header,
    .app-main {
      inline-size: 100%;
    }

    .app-header {
      flex: none;
    }

    .app-main {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
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
  }

  .app-main--slide-right {
    --notes-slide-leave-x: 400px;
    --notes-slide-enter-x: -38px;
    --notes-slide-origin: top right;
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
      padding: 10px 10px;
    }

    .app-header {
      gap: 12px;
      margin-bottom: 10px;
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
