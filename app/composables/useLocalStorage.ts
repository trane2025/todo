import { onScopeDispose } from 'vue';

type StorageCodec<Value> = {
  parse: (raw: string) => Value | undefined;
  serialize: (value: Value) => string;
};

export const useLocalStorage = <Value>(
  key: string,
  { parse, serialize }: StorageCodec<Value>,
) => {
  const getStorage = () => {
    if (import.meta.server) return;

    try {
      return window.localStorage;
    } catch {
      return undefined;
    }
  };

  const storage = getStorage();

  const read = () => {
    try {
      const raw = storage?.getItem(key);
      if (raw != null) return parse(raw);
    } catch {
      return undefined;
    }
  };

  const write = (value: Value) => {
    if (!storage) return false;

    try {
      storage.setItem(key, serialize(value));
      return true;
    } catch {
      return false;
    }
  };

  const remove = () => {
    try {
      storage?.removeItem(key);
    } catch {
      return;
    }
  };

  const subscribe = (update: (value: Value | undefined) => void) => {
    if (!storage) return;

    const sync = (event: StorageEvent) => {
      if (
        event.storageArea === storage &&
        (event.key === key || event.key === null)
      ) {
        update(read());
      }
    };

    window.addEventListener('storage', sync);
    onScopeDispose(() => window.removeEventListener('storage', sync));
  };

  return { read, write, remove, subscribe };
};
