import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

// Only one Live View area editor may own the pointer controls at a time.
let owner = null;
const listeners = new Set();
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
const snapshot = () => owner;
function claim(next) {
  owner = next;
  listeners.forEach(listener => listener());
}

export default function useTrackingAreaEditor() {
  const id = useRef(Symbol('tracking-area-editor')).current;
  const current = useSyncExternalStore(subscribe, snapshot);
  const generation = useRef(0);
  const begin = useCallback(() => { generation.current += 1; claim(id); }, [id]);
  const end = useCallback(() => {
    generation.current += 1;
    if (owner === id) claim(null);
  }, [id]);
  useEffect(() => end, [end]);
  return {
    editing: current === id,
    anotherEditor: current !== null && current !== id,
    begin,
    end,
    // Async saves must not commit after this editor is cancelled/replaced.
    saveGuard: () => {
      const started = generation.current;
      return () => owner === id && generation.current === started;
    },
  };
}
