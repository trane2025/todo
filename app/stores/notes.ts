import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useLocalStorage } from '~/composables/useLocalStorage';
import type { Note } from '~/types/note';
import { copyNote } from '~/utils/copyNote.ts';
import { isNoteList, noteStorageCodec } from '~/utils/noteStorage';

export const useNotesStore = defineStore('notes', () => {
  const { read, write, subscribe } = useLocalStorage(
    'todo:notes',
    noteStorageCodec(isNoteList),
  );
  const notes = ref(read() ?? []);

  subscribe((value) => (notes.value = value ?? []));

  const readLatestNotes = () => {
    notes.value = read() ?? notes.value;
    return notes.value;
  };

  const saveNotes = (updatedNotes: Note[]) => {
    if (!write(updatedNotes)) return false;

    notes.value = updatedNotes;
    return true;
  };

  const findById = (id: string) => {
    return notes.value.find((note) => note.id === id);
  };

  const createNote = (note: Note) => {
    const latestNotes = readLatestNotes();
    if (latestNotes.some(({ id }) => id === note.id)) return false;

    return saveNotes([...latestNotes, copyNote(note)]);
  };

  const updateNote = (note: Note) => {
    const latestNotes = readLatestNotes();
    const index = latestNotes.findIndex(
      (savedNote) => savedNote.id === note.id,
    );
    if (index === -1) return false;

    const updatedNotes = latestNotes.slice();
    updatedNotes[index] = copyNote(note);
    return saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) =>
    saveNotes(readLatestNotes().filter((note) => note.id !== id));

  return { notes, findById, createNote, updateNote, deleteNote };
});
