<template>
  <section class="notes-page">
    <div class="notes-page__toolbar">
      <h1 class="page-title">{{ title }}</h1>

      <NuxtLink class="create-note" to="/notes/new">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Создать заметку
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  const title = 'Мои заметки'
</script>

<style scoped lang="scss">
  .notes-page__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 32px;
  }

  .create-note {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 48px;
    padding: 12px 20px;
    border-radius: 16px;
    background: var(--color-primary);
    color: var(--color-on-primary);
    font-weight: 600;
    line-height: 1.25;
    text-decoration: none;

    svg {
      flex: none;
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }

    &:hover {
      filter: brightness(1.1);
    }

    &:active {
      filter: brightness(0.95);
    }
  }

  @media (max-width: 600px) {
    .notes-page__toolbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
  }
</style>
