import { MapDatabase, MapStore } from './map-store'

const loadStore = (namespace: string): BackingStore => {
  const database = new MapDatabase()

  return {
    database,
    store: database.createStore(namespace)
  }
}

export interface Database {
  createStore: (namespace: string) => Store;
}

export interface Store {
  get: (id: string) => Promise<string | undefined>;
  set: (id: string, value: string) => Promise<undefined>;
  delete: (id: string) => Promise<undefined>;
  clear: () => Promise<undefined>;
  keys: () => AsyncIterator<string>;
  values: () => AsyncIterator<string>;
  entries: () => AsyncIterator<[string, string]>;
}

export interface BackingStore {
  store: Store;
  database: Database;
}

export interface StorageOptions {
  namespace?: string;
  database?: Database | string;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

export class StorageArea<T> {
  readonly namespace: string
  readonly backingStore: BackingStore

  readonly serialize: (value: T) => string
  readonly deserialize: (value: string) => T

  constructor (opts?: StorageOptions) {
    this.serialize = (opts && opts.serialize) || JSON.stringify
    this.deserialize = (opts && opts.deserialize) || JSON.parse

    this.namespace = (opts && opts.namespace) || ''

    if (opts && opts.database && typeof opts.database !== 'string') {
      const database = opts.database
      const store = database.createStore(this.namespace)
      this.backingStore = {
        database,
        store
      }
    } else {
      this.backingStore = loadStore(this.namespace)
    }
  }

  async get (key: string): Promise<T | undefined> {
    return this.backingStore.store.get(key).then((data: string | undefined) => {
      return typeof data === 'undefined' ? data : this.deserialize(data)
    })
  }

  async set (key: string, value: T): Promise<undefined> {
    return this.backingStore.store.set(key, this.serialize(value))
  }

  async delete (key: string): Promise<undefined> {
    return this.backingStore.store.delete(key)
  }

  values (): AsyncIterator<T> {
    const values = this.backingStore.store.values()

    return {
      async next (): Promise<IteratorResult<T>> {
        const next = await values.next()

        return {
          done: next.done,
          value: !next.done ? JSON.parse(next.value) : next.value
        }
      }
    }
  }

  keys (): AsyncIterator<string> {
    return this.backingStore.store.keys()
  }

  entries (): AsyncIterator<[string, T]> {
    const entries = this.backingStore.store.entries()

    return {
      async next (): Promise<IteratorResult<[string, T]>> {
        const next = await entries.next()

        return {
          done: next.done,
          value: !next.done ? [next.value[0], JSON.parse(next.value[1])] : next.value
        }
      }
    }
  }

  async clear (): Promise<undefined> {
    return this.backingStore.store.clear()
  }
}

export {
  MapStore
}

export * from './test-suite'
