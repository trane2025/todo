<script setup lang="ts">
  import { Note } from '~/components/Note';
  import ConfirmDialog from '~/components/UI/dialogs/ConfirmDialog.vue';
  import { PlusIcon } from '~/components/UI/icons';
  import { useNotesStore } from '~/stores/notes.ts';
  import type { Note as NoteData } from '~/types/note';

  const store = useNotesStore();
  const heading = useTemplateRef<HTMLHeadingElement>('heading');
  const noteToDelete = ref<NoteData>();
  const deleteError = ref(false);

  const deleteSelectedNote = async () => {
    const note = noteToDelete.value;
    if (!note) return;

    deleteError.value = !store.deleteNote(note.id);
    noteToDelete.value = undefined;
    await nextTick();
    heading.value?.focus();
  };
</script>

<template>
  <section class="notes-page">
    <div class="notes-page__toolbar">
      <h1 ref="heading" class="page-title" tabindex="-1">Мои заметки</h1>

      <NuxtLink class="create-note" to="/notes/new">
        <PlusIcon />
        Создать заметку
      </NuxtLink>
    </div>

    <p v-if="deleteError" role="alert">
      Не удалось удалить заметку из хранилища браузера.
    </p>

    <ul class="notes-list" role="list">
      <Note
        v-for="note in store.notes"
        :key="note.id"
        :note="note"
        @delete="noteToDelete = note"
      />
    </ul>

    <ConfirmDialog
      v-if="noteToDelete"
      :message="`Удалить заметку «${noteToDelete.title}»?`"
      confirm-label="Удалить"
      confirm-variant="danger"
      @confirm="deleteSelectedNote"
      @cancel="noteToDelete = undefined"
    />
  </section>
</template>

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
