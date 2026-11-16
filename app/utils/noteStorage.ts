import type { Note, NoteItem } from '~/types/note';

const version = 1;

const isNoteItem = (value: unknown): value is NoteItem =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof value.id === 'string' &&
  'text' in value &&
  typeof value.text === 'string' &&
  'isDone' in value &&
  typeof value.isDone === 'boolean';

export const isNote = (value: unknown): value is Note =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof value.id === 'string' &&
  'title' in value &&
  typeof value.title === 'string' &&
  'tasks' in value &&
  Array.isArray(value.tasks) &&
  value.tasks.every(isNoteItem);

export const isNoteList = (value: unknown): value is Note[] =>
  Array.isArray(value) && value.every(isNote);

export const noteStorageCodec = <Value>(
  isValid: (value: unknown) => value is Value,
) => ({
  parse: (raw: string) => {
    const stored: unknown = JSON.parse(raw);

    if (
      typeof stored === 'object' &&
      stored !== null &&
      'version' in stored &&
      stored.version === version &&
      'data' in stored &&
      isValid(stored.data)
    ) {
      return stored.data;
    }
  },
  serialize: (value: Value) => JSON.stringify({ version, data: value }),
});
