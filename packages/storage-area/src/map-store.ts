import { Database, Store } from './index'

const _removeKeyPrefix = (key: string, namespace: string): string => {
  // This is potentially dangerous
  return key.replace(`${namespace}:`, '')
}

export class MapStore implements Store {
  private _map = new Map<string, string>()

  // eslint-disable-next-line no-useless-constructor
  constructor (private _namespace: string) {
  }

  private _getKeyPrefix (key: string): string {
    return `${this._namespace}:${key}`
  }

  async get (key: string): Promise<string | undefined> {
    return Promise.resolve(this._map.get(key))
  }

  async set (key: string, value: string): Promise<undefined> {
    this._map.set(key, value)
    return undefined
  }

  async delete (key: string): Promise<undefined> {
    this._map.delete(key)
    return undefined
  }

  async clear (): Promise<undefined> {
    this._map.clear()
    return undefined
  }

  keys (): AsyncIterator<string> {
    const keys = this._map.keys()
    return {
      next: async function (): Promise<IteratorResult<string>> {
        return keys.next()
      }
    }
  }

  values (): AsyncIterator<string> {
    const values = this._map.values()
    return {
      next: async function (): Promise<IteratorResult<string>> {
        return values.next()
      }
    }
  }

  entries (): AsyncIterator<[string, string]> {
    const entries = this._map.entries()
    return {
      next: async function (): Promise<IteratorResult<[string, string]>> {
        return entries.next()
      }
    }
  }
}

export class MapDatabase implements Database {
  createStore (namespace: string): Store {
    return new MapStore(namespace)
  }
}
