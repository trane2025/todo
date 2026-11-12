<template>
  <section class="editor-page">
    <NuxtLink class="back-link" to="/">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 12H5m6-6-6 6 6 6" />
      </svg>
      К заметкам
    </NuxtLink>

    <h1 class="page-title">Редактор заметки</h1>

    <p class="editor-page__meta">Параметр страницы: {{ route.params.id }}</p>
  </section>
</template>

<script setup lang="ts">
  const route = useRoute()
</script>

<style scoped lang="scss">
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-weight: 600;
    text-decoration: none;

    svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }

  .editor-page__meta {
    margin: 16px 0 0;
    color: var(--color-muted);
  }
</style>
