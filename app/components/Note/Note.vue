<template>
  <li class="note-card">
    <h2 class="note-card__title">{{ note.title }}</h2>

    <ul
      v-if="note.tasks.length"
      class="note-card__tasks list-reset"
      role="list"
    >
      <li
        v-for="task in note.tasks.slice(0, 3)"
        :key="task.id"
        class="note-card__task"
        :class="{ 'note-card__task--done': task.isDone }"
      >
        <BaseCheckbox
          :checked="task.isDone"
          :label="task.isDone ? 'Выполнено' : 'Не выполнено'"
          read-only
        />
        <span class="note-card__task-text">{{ task.text }}</span>
      </li>
      <NuxtLink class="note-card__edit" :to="`/notes/${note.id}`">
        <EditIcon />
        Редактировать
      </NuxtLink>
    </ul>
  </li>
</template>

<script setup lang="ts">
  import BaseCheckbox from '~/components/UI/checkboxes/BaseCheckbox.vue'
  import { EditIcon } from '~/components/UI/icons'
  import type { Note } from './Note'

  defineProps<{ note: Note }>()
</script>

<style scoped lang="scss">
  .note-card {
    --note-title-color: #405fe8;
    --checkbox-border-color: #c3259b;

    display: grid;
    gap: 20px;
    inline-size: 100%;
    padding: clamp(18px, 4vw, 28px);
    border-radius: 28px;
    background: var(--color-surface);
    color: var(--color-text);
    overflow-wrap: anywhere;

    &__title {
      margin: 0;
      color: var(--note-title-color);
      font-size: clamp(18px, 3.5vw, 22px);
      line-height: 1.15;
      text-transform: uppercase;
    }

    &__tasks {
      display: grid;
      gap: 12px;
    }

    &__task {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: 14px;
      font-size: 17px;
      font-weight: 550;
      line-height: 24px;
    }

    &__task--done &__task-text {
      color: var(--color-muted);
      text-decoration: line-through;
    }

    &__edit {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      svg {
        flex: none;
        inline-size: 20px;
        block-size: 20px;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }
  }

  :root[data-theme='dark'] .note-card {
    --note-title-color: #a6ccff;
    --checkbox-border-color: #f5a7e8;
  }
</style>
