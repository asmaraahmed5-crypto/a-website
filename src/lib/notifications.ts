import { useSyncExternalStore } from 'react';

export type Note = { id: number; kind: 'company' | 'system' | 'secret'; title: string; body: string };

let notes: Note[] = [];
let nextId = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function dismiss(id: number) {
  notes = notes.filter((n) => n.id !== id);
  emit();
}

export function notify(n: Omit<Note, 'id'>) {
  const note: Note = { ...n, id: ++nextId };
  notes = [...notes.slice(-2), note];
  emit();
  window.setTimeout(() => dismiss(note.id), 7500);
}

export function useNotes() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => notes,
  );
}
