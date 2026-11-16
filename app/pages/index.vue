<script setup lang="ts">
  import EmptyNotesIllustration from '~/components/EmptyNotesIllustration.vue';
  import Note from '~/components/Note.vue';
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

      <NuxtLink v-if="store.notes.length" class="create-note" to="/notes/new">
        <PlusIcon />
        Создать заметку
      </NuxtLink>
    </div>

    <p v-if="deleteError" role="alert">
      Не удалось удалить заметку из хранилища браузера.
    </p>

    <ul v-if="store.notes.length" class="notes-list" role="list">
      <Note
        v-for="note in store.notes"
        :key="note.id"
        :note="note"
        @delete="noteToDelete = note"
      />
    </ul>

    <section v-else class="empty-notes" aria-labelledby="empty-notes-title">
      <EmptyNotesIllustration class="empty-notes__illustration" />

      <div class="empty-notes__content">
        <h2 id="empty-notes-title">Ого, у вас ещё нет заметок!</h2>
        <p>Создайте первую заметку и запишите то, что важно.</p>

        <NuxtLink class="create-note" to="/notes/new">
          <PlusIcon />
          Создать заметку
        </NuxtLink>
      </div>
    </section>

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

  .empty-notes {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: center;
    gap: clamp(24px, 5vw, 56px);
    padding: clamp(20px, 5vw, 56px);
    border: 1px solid var(--color-border);
    border-radius: 28px;
    background: var(--color-surface);
    box-shadow: var(--color-shadow) 10px 10px 100px -37px;

    &__illustration {
      justify-self: center;
      display: block;
      inline-size: 100%;
      max-inline-size: 420px;
      block-size: auto;
    }

    &__content {
      display: grid;
      justify-items: start;
      gap: 12px;

      h2 {
        margin: 0;
        font-size: clamp(24px, 3.5vw, 38px);
        font-weight: 750;
        line-height: 1.12;
        letter-spacing: -0.035em;
        text-wrap: balance;
      }

      p {
        max-inline-size: 32ch;
        margin: 0;
        color: var(--color-muted);
        font-size: clamp(16px, 2vw, 18px);
        text-wrap: balance;
      }

      .create-note {
        margin-block-start: 10px;
      }
    }
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

  @media (max-width: 700px) {
    .empty-notes {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      padding-block: 16px;

      &__illustration {
        max-inline-size: clamp(220px, 70vw, 280px);
      }

      &__content {
        justify-items: center;
        gap: 10px;
        text-align: center;
      }
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
