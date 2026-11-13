<template>
  <section class="editor-page">
    <NuxtLink class="back-link" to="/">
      <LeftIcon />
      К заметкам
    </NuxtLink>

    <h1 class="page-title">
      {{ isNew ? 'Новая заметка' : 'Редактирование заметки' }}
    </h1>

    <div class="editor-panel">
      <div
        class="editor-panel__history"
        role="group"
        aria-label="История изменений"
      >
        <BaseButton
          class="editor-panel__history-button"
          variant="secondary"
          aria-label="Отменить изменение"
          disabled
        >
          <LeftIcon />
        </BaseButton>
        <BaseButton
          class="editor-panel__history-button"
          variant="secondary"
          aria-label="Повторить изменение"
          disabled
        >
          <RightIcon />
        </BaseButton>
      </div>

      <form class="editor-form" @submit.prevent>
        <BaseInput v-model:value="title" label="Название заметки" />

        <div class="editor-form__task-section">
          <h2 class="editor-form__task-heading">Список задач</h2>
          <ul v-if="tasks.length" class="editor-form__tasks" role="list">
            <li
              v-for="(task, taskIndex) in tasks"
              :key="task.id"
              class="editor-form__task"
            >
              <BaseCheckbox
                v-model:checked="task.isDone"
                :label="`Выполнение задачи ${taskIndex + 1}`"
              />
              <BaseInput
                v-model:value="task.text"
                :label="`Текст задачи ${taskIndex + 1}`"
                :class="{ 'editor-form__task-field--done': task.isDone }"
                hide-label
              />
              <BaseButton
                class="editor-form__remove-task"
                variant="danger"
                :aria-label="`Удалить задачу ${taskIndex + 1}`"
                disabled
              >
                <TrashIcon />
              </BaseButton>
            </li>
          </ul>

          <BaseButton class="editor-form__add-task" disabled>
            <PlusIcon />
            Добавить пункт
          </BaseButton>
        </div>

        <div class="editor-form__actions">
          <BaseButton type="submit" disabled>Сохранить</BaseButton>
          <BaseButton variant="secondary" disabled>Отменить</BaseButton>
          <BaseButton
            v-if="!isNew"
            class="editor-form__delete-note"
            variant="danger"
            disabled
          >
            Удалить заметку
          </BaseButton>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { NoteItem } from '~/components/Note'
  import BaseButton from '~/components/UI/buttons/BaseButton.vue'
  import BaseCheckbox from '~/components/UI/checkboxes/BaseCheckbox.vue'
  import { LeftIcon, PlusIcon, RightIcon, TrashIcon } from '~/components/UI/icons'
  import BaseInput from '~/components/UI/inputs/BaseInput.vue'

  const route = useRoute()
  const isNew = route.params.id === 'new'
  const title = ref(isNew ? '' : 'Подготовка к интервью')
  const tasks = ref<NoteItem[]>(
    isNew
      ? []
      : [
          { id: 'task-1', text: 'Повторить Vue', isDone: true },
          { id: 'task-2', text: 'Продумать историю', isDone: false },
          { id: 'task-3', text: 'Проверить Docker', isDone: false },
        ],
  )
</script>

<style scoped lang="scss">
  .editor-panel {
    --editor-task-accent: #405fe8;
    --editor-danger-accent: #c3259b;

    margin-block-start: clamp(20px, 4vw, 32px);
    padding: clamp(16px, 4vw, 36px);
    border-radius: 28px;
    background: var(--color-surface);
    color: var(--color-text);

    svg {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    &__history {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-block-end: 10px;
    }

    &__history &__history-button {
      min-inline-size: 52px;
      min-block-size: 40px;
      padding: 6px;
      border: 2px solid var(--color-link);
      border-radius: 12px;
      background: transparent;
      color: var(--color-link);
    }
  }

  :root[data-theme='dark'] .editor-panel {
    --editor-task-accent: #a6ccff;
    --editor-danger-accent: #f5a7e8;
  }

  .editor-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(20px, 4vw, 32px);

    &__task-section,
    &__tasks {
      display: grid;
      gap: 12px;
    }

    &__task-heading {
      margin: 0;
      color: var(--editor-task-accent);
      font-size: clamp(18px, 3vw, 24px);
      line-height: 1.25;
      text-transform: uppercase;
    }

    &__task {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: clamp(8px, 2vw, 20px);

      &:nth-child(3n + 2) {
        --checkbox-border-color: var(--editor-danger-accent);
      }

      &:nth-child(3n + 3) {
        --checkbox-border-color: var(--editor-task-accent);
      }
    }

    &__task-field--done {
      --input-text-color: var(--color-muted);
      --input-text-decoration: line-through;
    }

    &__task &__remove-task {
      min-block-size: 44px;
      padding: 0;
      background: transparent;
      color: var(--editor-danger-accent);
    }

    &__add-task {
      justify-self: start;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    &__delete-note {
      margin-inline-start: auto;
    }
  }

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

  @media (max-width: 600px) {
    .editor-form__actions {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }

    .editor-form__delete-note {
      margin-inline-start: 0;
    }
  }
</style>
