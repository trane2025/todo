<script setup lang="ts">
  import BaseButton from '~/components/UI/buttons/BaseButton.vue';
  import BaseCheckbox from '~/components/UI/checkboxes/BaseCheckbox.vue';
  import ConfirmDialog from '~/components/UI/dialogs/ConfirmDialog.vue';
  import {
    LeftIcon,
    PlusIcon,
    RightIcon,
    TrashIcon,
  } from '~/components/UI/icons';
  import BaseInput from '~/components/UI/inputs/BaseInput.vue';
  import { useNoteDraft } from '~/composables/useNoteDraft';
  import { useUndoRedo } from '~/composables/useUndoRedo';
  import { useNotesStore } from '~/stores/notes.ts';
  import type { Note, NoteItem } from '~/types/note';
  import { copyNote } from '~/utils/copyNote.ts';
  import { createValidator } from '~/utils/validator';

  const { params } = useRoute();
  const id = params.id as string;
  const isNew = id === 'new';
  const { createNote, findById, updateNote, deleteNote } = useNotesStore();
  const savedNote = isNew ? undefined : findById(id);
  const canEdit = computed(() => isNew || findById(id) !== undefined);
  const confirmation = ref<'cancel' | 'delete'>();
  const actionError = ref('');
  const hasTriedToSave = ref(false);
  const { current, change, record, undo, redo, disabledUndo, disabledRedo } =
    useUndoRedo<Note>(
      savedNote ? copyNote(savedNote) : { id, title: '', tasks: [] },
    );
  const { draftToRestore, restoreDraft, finishEditing } = useNoteDraft(
    current,
    () => canEdit.value,
  );

  const taskErrorKey = (taskId: string) => `task:${taskId}`;
  const errors = computed(() => {
    const validator = createValidator();
    if (!hasTriedToSave.value) return validator.errors;

    const { title, tasks } = current.value;
    validator.required('title', title, 'Введите название заметки');
    for (const task of tasks) {
      validator.required(
        taskErrorKey(task.id),
        task.text,
        'Введите текст задачи',
      );
    }

    return validator.errors;
  });

  const textEdit = ref<{
    target: object;
    original: string;
    read: () => string;
    write: (text: string) => void;
  }>();

  const pendingText = computed(
    () => textEdit.value?.read() !== textEdit.value?.original,
  );

  const commitText = () => {
    const edit = textEdit.value;
    textEdit.value = undefined;
    if (!edit) return;

    const { read, write, original } = edit;
    const text = read();
    if (text === original) return;

    record({
      undo: () => write(original),
      redo: () => write(text),
    });
  };

  const editText = <Field extends 'title' | 'text'>(
    target: Record<Field, string>,
    key: Field,
    text: string,
  ) => {
    if (textEdit.value?.target !== target) {
      commitText();
      textEdit.value = {
        target,
        original: target[key],
        read: () => target[key],
        write: (value) => (target[key] = value),
      };
    }
    target[key] = text;
  };

  const addTask = () => {
    const task = { id: crypto.randomUUID(), text: '', isDone: false };
    commitText();
    change({
      undo: (note) => note.tasks.pop(),
      redo: (note) => note.tasks.push(task),
    });
  };

  const removeTask = (task: NoteItem) => {
    const index = current.value.tasks.indexOf(task);
    if (index === -1) return;
    commitText();
    change({
      undo: (note) => note.tasks.splice(index, 0, task),
      redo: (note) => note.tasks.splice(index, 1),
    });
  };

  const changeTaskDone = (task: NoteItem, checked: boolean) => {
    const { isDone } = task;
    if (checked === isDone) return;
    commitText();
    change({
      undo: () => (task.isDone = isDone),
      redo: () => (task.isDone = checked),
    });
  };

  const runHistory = (action: () => void) => {
    commitText();
    action();
  };

  const handleHistoryKey = (event: KeyboardEvent) => {
    if (!canEdit.value) return;
    if (event.defaultPrevented || event.isComposing || event.altKey) return;
    if (!event.ctrlKey && !event.metaKey) return;
    if (event.key.toLowerCase() !== 'z' && event.code !== 'KeyZ') return;

    event.preventDefault();
    runHistory(event.shiftKey ? redo : undo);
  };

  onMounted(() => window.addEventListener('keydown', handleHistoryKey));
  onBeforeUnmount(() =>
    window.removeEventListener('keydown', handleHistoryKey),
  );

  const submit = async (event: SubmitEvent) => {
    const form = event.currentTarget as HTMLFormElement;
    commitText();
    actionError.value = '';
    hasTriedToSave.value = true;

    const [firstInvalidField] = Object.keys(errors.value);
    if (firstInvalidField) {
      await nextTick();
      const input = form.elements.namedItem(firstInvalidField);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }

    const result = isNew
      ? createNote({ ...current.value, id: crypto.randomUUID() })
      : updateNote(current.value);
    if (!result) {
      actionError.value = 'Не удалось сохранить заметку в браузере.';
      return;
    }

    finishEditing();
    navigateTo('/');
  };

  const cancelEditing = () => {
    confirmation.value = undefined;
    finishEditing();
    navigateTo('/');
  };

  const removeNote = () => {
    confirmation.value = undefined;
    if (!deleteNote(id)) {
      actionError.value = 'Не удалось удалить заметку из хранилища браузера.';
      return;
    }

    finishEditing();
    navigateTo('/');
  };
</script>

<template>
  <section class="editor-page">
    <div v-if="canEdit" class="editor-panel">
      <div class="editor-panel__header">
        <h1 class="page-title">
          {{ isNew ? 'Новая заметка' : 'Редактирование заметки' }}
        </h1>
        <div
          class="editor-panel__history"
          role="group"
          aria-label="История изменений"
        >
          <BaseButton
            @click="runHistory(undo)"
            :disabled="disabledUndo && !pendingText"
            class="editor-panel__history-button"
            variant="secondary"
            aria-label="Отменить изменение"
          >
            <LeftIcon />
          </BaseButton>
          <BaseButton
            @click="runHistory(redo)"
            :disabled="disabledRedo || pendingText"
            class="editor-panel__history-button"
            variant="secondary"
            aria-label="Повторить изменение"
          >
            <RightIcon />
          </BaseButton>
        </div>
      </div>
      <form class="editor-form" @submit.prevent="submit" @focusout="commitText">
        <BaseInput
          :model-value="current.title"
          name="title"
          label="Название заметки"
          placeholder="НАПРИМЕР ЗАДАЧИ НА ЗАВТРА"
          :error="errors.title"
          @update:model-value="editText(current, 'title', $event)"
        />
        <div class="editor-form__task-section">
          <div class="editor-panel__task-title">
            <h2 class="editor-form__task-heading">Список задач</h2>
            <BaseButton @click="addTask">
              <PlusIcon />
              Добавить пункт
            </BaseButton>
          </div>
          <div class="editor-form__task-scroll">
            <TransitionGroup
              tag="ul"
              name="task-row"
              class="editor-form__tasks"
              role="list"
            >
              <li
                class="editor-form__task"
                v-for="task in current.tasks"
                :key="task.id"
              >
                <div class="editor-form__task-space">
                  <div class="editor-form__task-content">
                    <BaseCheckbox
                      :checked="task.isDone"
                      label="Выполнение задачи"
                      @update:checked="changeTaskDone(task, $event)"
                    />
                    <BaseInput
                      class="editor-form__task-input"
                      :model-value="task.text"
                      :name="taskErrorKey(task.id)"
                      label="Текст задачи"
                      placeholder="ТУТ ДОБАВЬ ОПИСАНИЕ ЗАДАЧИ"
                      :error="errors[taskErrorKey(task.id)]"
                      hide-label
                      @update:model-value="editText(task, 'text', $event)"
                    />
                    <BaseButton
                      class="editor-form__remove-task"
                      variant="danger"
                      aria-label="Удалить задачу"
                      @click="removeTask(task)"
                    >
                      <TrashIcon />
                    </BaseButton>
                  </div>
                </div>
              </li>
            </TransitionGroup>
          </div>
        </div>

        <div class="editor-form__actions">
          <BaseButton type="submit">Сохранить</BaseButton>
          <BaseButton @click="confirmation = 'cancel'" variant="secondary"
            >Отменить
          </BaseButton>
          <BaseButton
            @click="confirmation = 'delete'"
            v-if="!isNew"
            class="editor-form__delete-note"
            variant="danger"
          >
            Удалить заметку
          </BaseButton>
        </div>
        <p v-if="actionError" role="alert">{{ actionError }}</p>
      </form>
    </div>
    <p v-else role="status">Заметка не найдена.</p>

    <ConfirmDialog
      v-if="canEdit && draftToRestore"
      message="Восстановить черновик? Есть несохранённые изменения."
      confirm-label="Восстановить"
      cancel-label="Не сейчас"
      @confirm="restoreDraft"
      @cancel="draftToRestore = undefined"
    />
    <ConfirmDialog
      v-else-if="canEdit && confirmation === 'cancel'"
      message="Отменить редактирование? Несохранённые изменения будут потеряны."
      @confirm="cancelEditing"
      @cancel="confirmation = undefined"
    />
    <ConfirmDialog
      v-else-if="canEdit && confirmation === 'delete'"
      message="Удалить заметку? Это действие нельзя отменить."
      confirm-label="Удалить"
      confirm-variant="danger"
      @confirm="removeNote"
      @cancel="confirmation = undefined"
    />
  </section>
</template>

<style scoped lang="scss">
  .editor-page,
  .editor-panel,
  .editor-form,
  .editor-form__task-section {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .editor-panel {
    --editor-task-accent: #405fe8;
    --editor-danger-accent: #c3259b;
    padding: clamp(16px, 4vw, 36px);
    border-radius: 28px;
    background: var(--color-surface);

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    &__task-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

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
    --input-error-color: var(--editor-danger-accent);
    gap: clamp(20px, 4vw, 32px);

    &__task-section {
      gap: 12px;
      padding: 30px 20px;
      border: 2px dashed var(--color-border);
      border-radius: 16px;
    }

    &__task-scroll {
      position: relative;
      flex: 1;
      min-block-size: 96px;
      min-inline-size: 0;
      margin-inline: -14px;
      overflow: hidden auto;
      // Keep long lists out of the editor's minimum height.
      contain: size;
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
      grid-template-rows: 1fr;

      &:nth-child(3n + 2) {
        --checkbox-border-color: var(--editor-danger-accent);
      }

      &:nth-child(3n + 3) {
        --checkbox-border-color: var(--editor-task-accent);
      }
    }

    &__task-space {
      min-block-size: 0;
      min-inline-size: 0;
    }

    &__task-content {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      column-gap: clamp(8px, 2vw, 10px);
      padding: 6px 14px;
    }

    &__task-input {
      display: grid;
      grid-area: 1 / 2 / span 2;
      grid-template-rows: subgrid;
    }

    &__task &__remove-task {
      inline-size: 44px;
      min-block-size: 44px;
      padding: 0;
      border-radius: 12px;

      svg {
        inline-size: 26px;
        block-size: 26px;
      }
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

  @media (prefers-reduced-motion: no-preference) {
    .editor-form__tasks {
      --task-toss-duration: 400ms;
      --task-windup-duration: 120ms;
    }

    .task-row-enter-active {
      transition: opacity 180ms ease-out;
    }

    .task-row-leave-active {
      position: relative;
      z-index: 1;
      pointer-events: none;
      transition: grid-template-rows
        calc(var(--task-toss-duration) - var(--task-windup-duration))
        ease-in-out var(--task-windup-duration);

      .editor-form__task-content {
        animation: task-row-toss var(--task-toss-duration) ease-in both;
      }
    }

    .task-row-enter-from {
      opacity: 0;
    }

    .task-row-leave-to {
      grid-template-rows: 0fr;
    }

    @keyframes task-row-toss {
      0% {
        opacity: 1;
        transform: translate(0, 0) rotate(0deg);
        animation-timing-function: ease-out;
      }

      30% {
        opacity: 1;
        transform: translate(-10px, 2px) rotate(-4deg);
      }

      100% {
        opacity: 0;
        transform: translate(clamp(160px, 36vw, 480px), -18px) rotate(13deg);
      }
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
