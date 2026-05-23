import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { AVAILABLE_MODELS, selectedModelStore } from '~/lib/stores/model';

export function ModelSelector() {
  const selectedModel = useStore(selectedModelStore);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md
                   bg-bolt-elements-item-backgroundDefault
                   hover:bg-bolt-elements-item-backgroundActive
                   text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary
                   border border-bolt-elements-borderColor
                   transition-colors"
      >
        <span className="max-w-[120px] truncate">{currentModel.name}</span>
        <div className={`i-ph:caret-down text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 min-w-[220px]
                      bg-bolt-elements-background-depth-1
                      border border-bolt-elements-borderColor rounded-lg shadow-lg overflow-hidden"
        >
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                selectedModelStore.set(model.id);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors
                ${model.id === selectedModel
                  ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                  : 'text-bolt-elements-textSecondary hover:bg-bolt-elements-item-backgroundActive hover:text-bolt-elements-textPrimary'
                }
              `}
            >
              <div className="font-medium">{model.name}</div>
              <div className="text-xs text-bolt-elements-textTertiary mt-0.5">{model.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
