export type StorageType = 'local' | 'session';

export interface StorageOptions {
  type?: StorageType;
  expiresIn?: number;
  prefix?: string;
}

const DEFAULT_PREFIX = 'lca_';

function getStorage(type: StorageType): Storage {
  return type === 'local' ? localStorage : sessionStorage;
}

export function getItem<T = string>(
  key: string,
  options?: StorageOptions
): T | null {
  const storage = getStorage(options?.type ?? 'local');
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  const fullKey = `${prefix}${key}`;

  try {
    const item = storage.getItem(fullKey);
    if (!item) return null;

    const parsed = JSON.parse(item) as { value: T; expiry?: number };

    if (parsed.expiry && parsed.expiry < Date.now()) {
      storage.removeItem(fullKey);
      return null;
    }

    return parsed.value;
  } catch {
    return storage.getItem(fullKey) as T | null;
  }
}

export function setItem<T>(
  key: string,
  value: T,
  options?: StorageOptions
): void {
  const storage = getStorage(options?.type ?? 'local');
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  const fullKey = `${prefix}${key}`;

  const item = options?.expiresIn
    ? JSON.stringify({ value, expiry: Date.now() + options.expiresIn })
    : JSON.stringify({ value });

  try {
    storage.setItem(fullKey, item);
  } catch (e) {
    console.error('Storage quota exceeded:', e);
  }
}

export function removeItem(key: string, options?: StorageOptions): void {
  const storage = getStorage(options?.type ?? 'local');
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  const fullKey = `${prefix}${key}`;
  storage.removeItem(fullKey);
}

export function clear(prefix?: string, type?: StorageType): void {
  const storage = getStorage(type ?? 'local');
  const targetPrefix = prefix ?? DEFAULT_PREFIX;

  const keysToRemove: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(targetPrefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

export function getAllKeys(prefix?: string, type?: StorageType): string[] {
  const storage = getStorage(type ?? 'local');
  const targetPrefix = prefix ?? DEFAULT_PREFIX;

  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(targetPrefix)) {
      keys.push(key.replace(targetPrefix, ''));
    }
  }

  return keys;
}

export const secureStorage = {
  get: <T = string>(key: string, expiresIn?: number) =>
    getItem<T>(key, { type: 'session', expiresIn }),
  set: <T>(key: string, value: T, expiresIn?: number) =>
    setItem(key, value, { type: 'session', expiresIn }),
  remove: (key: string) => removeItem(key, { type: 'session' }),
  clear: () => clear(undefined, 'session'),
};

export const persistentStorage = {
  get: <T = string>(key: string, expiresIn?: number) =>
    getItem<T>(key, { type: 'local', expiresIn }),
  set: <T>(key: string, value: T, expiresIn?: number) =>
    setItem(key, value, { type: 'local', expiresIn }),
  remove: (key: string) => removeItem(key, { type: 'local' }),
  clear: () => clear(undefined, 'local'),
};