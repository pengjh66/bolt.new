import { atom, onMount } from 'nanostores';

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', description: 'Best balance of speed and capability' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', description: 'Fast and capable' },
  { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', description: 'Most powerful, deep reasoning' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', description: 'Fastest, lightweight tasks' },
];

const STORAGE_KEY = 'bolt_selected_model';

export const selectedModelStore = atom<string>(AVAILABLE_MODELS[0].id);

onMount(selectedModelStore, () => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored && AVAILABLE_MODELS.some((m) => m.id === stored)) {
      selectedModelStore.set(stored);
    }
  }

  const unsubscribe = selectedModelStore.listen((model) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, model);
    }
  });

  return unsubscribe;
});
