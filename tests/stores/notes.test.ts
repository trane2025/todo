// @vitest-environment happy-dom

import { createPinia, disposePinia, type Pinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useNotesStore } from '~/stores/notes';
import type { Note } from '~/types/note';

const storageKey = 'todo:notes';
const firstNote: Note = {
  id: 'note-1',
  title: 'Подготовка к сдаче',
  tasks: [{ id: 'task-1', text: 'Запустить тесты', isDone: false }],
};
const secondNote: Note = {
  id: 'note-2',
  title: 'Покупки',
  tasks: [],
};

const writeStoredNotes = (notes: Note[]) => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({ version: 1, data: notes }),
  );
};

const readStoredNotes = () =>
  JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');

describe('useNotesStore', () => {
  let pinia: Pinia;

  beforeEach(() => {
    window.localStorage.clear();
    pinia = createPinia();
  });

  afterEach(() => {
    disposePinia(pinia);
  });

  it('загружает сохранённые заметки при первом обращении', () => {
    writeStoredNotes([firstNote, secondNote]);

    const store = useNotesStore(pinia);

    expect(store.notes).toEqual([firstNote, secondNote]);
    expect(store.findById(firstNote.id)).toEqual(firstNote);
    expect(store.findById('unknown')).toBeUndefined();
  });

  it('создаёт заметку и сохраняет её вместе с версией схемы', () => {
    const store = useNotesStore(pinia);

    expect(store.notes).toEqual([]);
    expect(store.createNote(firstNote)).toBe(true);
    expect(store.notes).toEqual([firstNote]);
    expect(readStoredNotes()).toEqual({ version: 1, data: [firstNote] });
  });

  it('отклоняет создание заметки с уже существующим ID', () => {
    writeStoredNotes([firstNote]);
    const store = useNotesStore(pinia);

    expect(store.createNote({ ...firstNote, title: 'Дубликат' })).toBe(false);
    expect(store.notes).toEqual([firstNote]);
    expect(readStoredNotes()).toEqual({ version: 1, data: [firstNote] });
  });

  it('обновляет название и задачи только у выбранной заметки', () => {
    writeStoredNotes([firstNote, secondNote]);
    const store = useNotesStore(pinia);
    const updatedNote: Note = {
      ...firstNote,
      title: 'Проверки завершены',
      tasks: [{ id: 'task-1', text: 'Запустить тесты', isDone: true }],
    };

    expect(store.updateNote(updatedNote)).toBe(true);
    expect(store.notes).toEqual([updatedNote, secondNote]);
    expect(readStoredNotes()).toEqual({
      version: 1,
      data: [updatedNote, secondNote],
    });
  });

  it('удаляет выбранную заметку из списка и хранилища', () => {
    writeStoredNotes([firstNote, secondNote]);
    const store = useNotesStore(pinia);

    expect(store.deleteNote(firstNote.id)).toBe(true);
    expect(store.notes).toEqual([secondNote]);
    expect(store.findById(firstNote.id)).toBeUndefined();
    expect(readStoredNotes()).toEqual({ version: 1, data: [secondNote] });
  });

  it('синхронизирует список после удаления заметки в другой вкладке', () => {
    writeStoredNotes([firstNote, secondNote]);
    const store = useNotesStore(pinia);

    writeStoredNotes([secondNote]);
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: storageKey,
        storageArea: window.localStorage,
      }),
    );

    expect(store.notes).toEqual([secondNote]);
  });

  it('отклоняет сохранение удалённой заметки до получения события storage', () => {
    writeStoredNotes([firstNote]);
    const store = useNotesStore(pinia);
    writeStoredNotes([]);

    expect(store.updateNote({ ...firstNote, title: 'Изменение' })).toBe(false);
    expect(store.notes).toEqual([]);
    expect(readStoredNotes()).toEqual({ version: 1, data: [] });
  });

  it.each([
    ['повреждённый JSON', '{'],
    [
      'неизвестную версию схемы',
      JSON.stringify({ version: 2, data: [firstNote] }),
    ],
  ])('игнорирует %s в хранилище', (_, raw) => {
    window.localStorage.setItem(storageKey, raw);

    expect(useNotesStore(pinia).notes).toEqual([]);
  });
});
