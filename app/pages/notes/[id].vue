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
          @click="runHistory(undo)"
          :disabled="disabledUndo && !pendingText"
        >
          <LeftIcon />
        </BaseButton>
        <BaseButton
          class="editor-panel__history-button"
          variant="secondary"
          aria-label="Повторить изменение"
          @click="runHistory(redo)"
          :disabled="disabledRedo || pendingText"
        >
          <RightIcon />
        </BaseButton>
      </div>

      <form class="editor-form" @submit.prevent @focusout="commitText">
        <BaseInput
          :value="current.title"
          label="Название заметки"
          @update:value="editText(current, 'title', $event)"
        />

        <div class="editor-form__task-section">
          <h2 class="editor-form__task-heading">Список задач</h2>
          <ul v-if="current.tasks.length" class="editor-form__tasks" role="list">
            <li
              v-for="(task, taskIndex) in current.tasks"
              :key="task.id"
              class="editor-form__task"
            >
              <BaseCheckbox
                :checked="task.isDone"
                @update:checked="changeTaskDone(task, $event)"
                :label="`Выполнение задачи ${taskIndex + 1}`"
              />
              <BaseInput
                :value="task.text"
                @update:value="editText(task, 'text', $event)"
                :label="`Текст задачи ${taskIndex + 1}`"
                :class="{ 'editor-form__task-field--done': task.isDone }"
                hide-label
              />
              <BaseButton
                class="editor-form__remove-task"
                variant="danger"
                :aria-label="`Удалить задачу ${taskIndex + 1}`"
                @click="removeTask(task)"
              >
                <TrashIcon />
              </BaseButton>
            </li>
          </ul>

          <BaseButton class="editor-form__add-task" @click="addTask">
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
  import type { Note as NoteData, NoteItem } from '~/types/note'
  import BaseButton from '~/components/UI/buttons/BaseButton.vue'
  import BaseCheckbox from '~/components/UI/checkboxes/BaseCheckbox.vue'
  import { LeftIcon, PlusIcon, RightIcon, TrashIcon } from '~/components/UI/icons'
  import BaseInput from '~/components/UI/inputs/BaseInput.vue'
  import { useUndoRedo } from '~/composables/useUndoRedo'

  const route = useRoute()
  const isNew = route.params.id === 'new'
  const { current, change, record, undo, redo, disabledUndo, disabledRedo } =
    useUndoRedo<NoteData>({
      id: route.params.id as string,
      title: isNew ? '' : 'Подготовка к интервью',
      tasks: isNew
        ? []
        : [
            { id: 'task-1', text: 'Повторить Vue', isDone: true },
            { id: 'task-2', text: 'Продумать историю', isDone: false },
            { id: 'task-3', text: 'Проверить Docker', isDone: false },
          ],
    })

  const textEdit = ref<{
    target: object
    original: string
    read: () => string
    write: (text: string) => void
  }>()

  const pendingText = computed(
    () => textEdit.value?.read() !== textEdit.value?.original,
  )

  const commitText = () => {
    const edit = textEdit.value
    textEdit.value = undefined
    if (!edit) return

    const { read, write, original } = edit
    const text = read()
    if (text === original) return

    record({
      undo: () => write(original),
      redo: () => write(text),
    })
  }

  const editText = <Field extends 'title' | 'text'>(
    target: Record<Field, string>,
    key: Field,
    text: string,
  ) => {
    if (textEdit.value?.target !== target) {
      commitText()
      textEdit.value = {
        target,
        original: target[key],
        read: () => target[key],
        write: (value) => (target[key] = value),
      }
    }
    target[key] = text
  }

  const addTask = () => {
    const task = { id: crypto.randomUUID(), text: '', isDone: false }
    commitText()
    change({
      undo: (note) => note.tasks.pop(),
      redo: (note) => note.tasks.push(task),
    })
  }

  const removeTask = (task: NoteItem) => {
    const index = current.value.tasks.indexOf(task)
    if (index === -1) return
    commitText()
    change({
      undo: (note) => note.tasks.splice(index, 0, task),
      redo: (note) => note.tasks.splice(index, 1),
    })
  }

  const changeTaskDone = (task: NoteItem, checked: boolean) => {
    const { isDone } = task
    if (checked === isDone) return
    commitText()
    change({
      undo: () => (task.isDone = isDone),
      redo: () => (task.isDone = checked),
    })
  }

  const runHistory = (action: () => void) => {
    commitText()
    action()
  }

  const handleHistoryKey = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.altKey) return
    if (!event.ctrlKey && !event.metaKey) return
    if (event.key.toLowerCase() !== 'z' && event.code !== 'KeyZ') return

    event.preventDefault()
    runHistory(event.shiftKey ? redo : undo)
  }

  onMounted(() => window.addEventListener('keydown', handleHistoryKey))
  onBeforeUnmount(() =>
    window.removeEventListener('keydown', handleHistoryKey),
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
