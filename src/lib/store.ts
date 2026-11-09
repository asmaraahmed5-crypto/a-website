import { useSyncExternalStore } from 'react';
import { notify, type Note } from './notifications';

/** Optional progress persistence (localStorage). Everything still works if storage is blocked. */
export type Saved = {
  begun: boolean;
  swiped: boolean;
  checks: string[];
  eggs: string[];
};

const KEY = 'the-road-to-30:v1';
const defaults: Saved = { begun: false, swiped: false, checks: [], eggs: [] };

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const p = JSON.parse(raw) as Partial<Saved>;
    return { begun: !!p.begun, swiped: !!p.swiped, checks: strings(p.checks), eggs: strings(p.eggs) };
  } catch {
    return defaults;
  }
}

let state: Saved = read();
const listeners = new Set<() => void>();

export function setSaved(patch: Partial<Saved>) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: keep going in memory */
  }
  listeners.forEach((l) => l());
}

export function resetSaved() {
  setSaved({ ...defaults });
}

export function useSaved(): Saved {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => state,
  );
}

/** Show a hidden-message notification and remember that this easter egg was found. */
export function foundEgg(id: string, kind: Note['kind'], title: string, body: string) {
  notify({ kind, title, body });
  if (!state.eggs.includes(id)) setSaved({ eggs: [...state.eggs, id] });
}

export const EGG_COUNT = 6;
