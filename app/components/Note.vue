<script setup lang="ts">
  import BaseButton from '~/components/UI/buttons/BaseButton.vue';
  import BaseCheckbox from '~/components/UI/checkboxes/BaseCheckbox.vue';
  import { EditIcon, TrashIcon } from '~/components/UI/icons';
  import type { Note } from '~/types/note';

  defineProps<{ note: Note }>();
  const emit = defineEmits<{ delete: [] }>();
</script>

<template>
  <li class="note-card">
    <h2 class="note-card__title">{{ note.title }}</h2>

    <ul
      v-if="note.tasks.length"
      class="note-card__tasks list-reset"
      role="list"
    >
      <li
        v-for="task in note.tasks.slice(0, 5)"
        :key="task.id"
        class="note-card__task"
        :class="{ 'note-card__task--done': task.isDone }"
      >
        <BaseCheckbox
          v-model:checked="task.isDone"
          :label="task.isDone ? 'Выполнено' : 'Не выполнено'"
          read-only
        />
        <span class="note-card__task-text">{{ task.text }}</span>
      </li>
    </ul>

    <div class="note-card__actions">
      <NuxtLink class="note-card__edit" :to="`/notes/${note.id}`">
        <EditIcon />
        Редактировать
      </NuxtLink>
      <BaseButton
        class="note-card__delete"
        variant="danger"
        aria-label="Удалить заметку"
        @click="emit('delete')"
      >
        <TrashIcon />
      </BaseButton>
    </div>
  </li>
</template>

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
      align-items: center;
      gap: 14px;
      font-size: 17px;
      font-weight: 550;
      line-height: 24px;
    }

    &__task--done &__task-text {
      color: var(--color-muted);
      text-decoration: line-through;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-self: end;
      justify-content: space-between;
      gap: 12px;
    }

    &__delete {
      inline-size: 44px;
      min-block-size: 44px;
      padding: 0;
      border-radius: 12px;

      svg {
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    &__edit {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-block-size: 32px;
      border-radius: 4px;
      font-weight: 600;
      text-decoration: none;

      svg {
        flex: none;
        inline-size: 20px;
        block-size: 20px;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      &:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 4px;
      }
    }
  }

  :root[data-theme='dark'] .note-card {
    --note-title-color: #a6ccff;
    --checkbox-border-color: #f5a7e8;
  }
</style>
