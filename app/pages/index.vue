<template>
  <section class="notes-page">
    <div class="notes-page__toolbar">
      <h1 class="page-title">Мои заметки</h1>

      <NuxtLink class="create-note" to="/notes/new">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Создать заметку
      </NuxtLink>
    </div>

    <ul class="notes-list" role="list">
      <Note v-for="note in notes" :key="note.id" :note="note" />
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { Note, type NoteData } from '~/components/Note'

  const notes: NoteData[] = [
    {
      id: '1',
      title: 'Первая заметка',
      tasks: [
        {
          id: 'task-1',
          text: 'Повторить Vue',
          isDone: false,
        },
      ],
    },
    {
      id: '2',
      title: 'Первая заметка',
      tasks: [
        {
          id: 'task-2',
          text: 'Повторить Vue',
          isDone: false,
        },
      ],
    },
    {
      id: '3',
      title: 'Первая заметка',
      tasks: [
        {
          id: 'task-3',
          text: 'Повторить Vue',
          isDone: true,
        },
        {
          id: 'task-4',
          text: 'Изучить Nuxt',
          isDone: true,
        },
      ],
    },
  ]
</script>

<style scoped lang="scss">
  .notes-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .notes-page {
    display: grid;
    gap: 32px;
  }

  .notes-page__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
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

  @media (max-width: 1100px) {
    .notes-list {
      grid-template-columns: 1fr;
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
