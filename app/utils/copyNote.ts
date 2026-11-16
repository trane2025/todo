import type { Note } from '~/types/note.ts'

export const copyNote = (note: Note) => {
  return {
    ...note,
    tasks: note.tasks.map((task) => ({ ...task })),
  }
}
