export interface NoteItem {
  id: string
  text: string
  isDone: boolean
}

export interface Note {
  id: string
  title: string
  tasks: NoteItem[]
}
