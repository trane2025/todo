import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useLocalStorage } from '~/composables/useLocalStorage';
import type { Note } from '~/types/note';
import { isNote, noteStorageCodec } from '~/utils/noteStorage';

export const useNoteDraft = (current: Ref<Note>, canEdit: () => boolean) => {
  const { read, write, remove } = useLocalStorage(
    'todo:note-draft',
    noteStorageCodec(isNote),
  );
  const initialSnapshot = JSON.stringify(current.value);
  const storedDraft = read();
  const matchingDraft =
    storedDraft?.id === current.value.id ? storedDraft : undefined;
  const draftToRestore = ref<Note>();
  let lastSnapshot = initialSnapshot;
  let storedSnapshot = matchingDraft && JSON.stringify(matchingDraft);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let finished = false;

  if (canEdit() && storedSnapshot !== initialSnapshot) {
    draftToRestore.value = matchingDraft;
  }

  const removeDraft = () => {
    // A different editor may have replaced the last draft in the meantime.
    if (
      storedSnapshot !== undefined &&
      JSON.stringify(read()) === storedSnapshot
    ) {
      remove();
    }
    storedSnapshot = undefined;
  };

  const persistDraft = () => {
    clearTimeout(timer);
    if (finished || !canEdit()) return;

    const snapshot = JSON.stringify(current.value);
    if (snapshot === lastSnapshot) return;

    if (snapshot === initialSnapshot) {
      removeDraft();
    } else if (write(current.value)) {
      storedSnapshot = snapshot;
    } else {
      return;
    }

    lastSnapshot = snapshot;
  };

  watch(
    current,
    () => {
      clearTimeout(timer);
      if (!finished) timer = setTimeout(persistDraft, 350);
    },
    { deep: true },
  );

  const persistWhenHidden = () => {
    if (document.visibilityState === 'hidden') persistDraft();
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', persistWhenHidden);
    window.addEventListener('pagehide', persistDraft);
  });

  onBeforeUnmount(() => {
    persistDraft();
    document.removeEventListener('visibilitychange', persistWhenHidden);
    window.removeEventListener('pagehide', persistDraft);
  });

  const restoreDraft = () => {
    if (!draftToRestore.value) return;

    lastSnapshot = JSON.stringify(draftToRestore.value);
    current.value = draftToRestore.value;
    draftToRestore.value = undefined;
  };

  const finishEditing = () => {
    finished = true;
    clearTimeout(timer);
    removeDraft();
  };

  return { draftToRestore, restoreDraft, finishEditing };
};
