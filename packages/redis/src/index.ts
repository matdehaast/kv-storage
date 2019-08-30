import { Database, Store } from '@kv-storage/core'
import IoRedis, { Redis } from 'ioredis'

export class RedisStore implements Store {
  // eslint-disable-next-line no-useless-constructor
  constructor (private _redis: Redis, private _namespace: string) {
  }

  private _getKeyPrefix (key: string): string {
    return `${this._namespace}:${key}`
  }

  async get (key: string): Promise<string | undefined> {
    const prefixedKey = this._getKeyPrefix(key)
    const value = await this._redis.get(prefixedKey)
    return value || undefined
  }

  async delete (key: string): Promise<undefined> {
    const prefixedKey = this._getKeyPrefix(key)
    await this._redis.del(prefixedKey)
    await this._redis.srem(this._namespace, key)
    return undefined
  }

  async set (key: string, value: string): Promise<undefined> {
    const prefixedKey = this._getKeyPrefix(key)
    await this._redis.set(prefixedKey, value)
    await this._redis.sadd(this._namespace, key)
    return undefined
  }

  entries (): AsyncIterator<[string, string]> {
    const entries = this._redis.smembers(this._namespace)
    const here = this
    let iter = 0
    return {
      next: async function (): Promise<IteratorResult<[string, string]>> {
        const key = (await entries)[iter]
        const length = (await entries).length
        const prefixedKey = here._getKeyPrefix(key)
        const value = await here._redis.get(prefixedKey) as string
        if (iter < length) {
          iter++
          return {
            value: [key, value],
            done: false
          }
        } else {
          return {
            done: true
          } as IteratorResult<[string, string]>
        }
      }
    }
  }

  async clear (): Promise<undefined> {
    const keys: [string] = await this._redis.smembers(this._namespace)
    const promises = keys.map(key => {
      const prefixedKey = this._getKeyPrefix(key)
      return this._redis.del(prefixedKey)
    })
    await Promise.all(promises)
    await this._redis.srem(this._namespace)
    return undefined
  }

  keys (): AsyncIterator<string> {
    const entries = this._redis.smembers(this._namespace)
    let iter = 0
    return {
      next: async function (): Promise<IteratorResult<string>> {
        const key = (await entries)[iter]
        const length = (await entries).length
        if (iter < length) {
          iter++
          return {
            value: key,
            done: false
          }
        } else {
          return {
            done: true
          } as IteratorResult<string>
        }
      }
    }
  }

  values (): AsyncIterator<string> {
    const entries = this._redis.smembers(this._namespace)
    const here = this
    let iter = 0
    return {
      next: async function (): Promise<IteratorResult<string>> {
        const key = (await entries)[iter]
        const length = (await entries).length
        const prefixedKey = here._getKeyPrefix(key)
        const value = await here._redis.get(prefixedKey) as string
        if (iter < length) {
          iter++
          return {
            value: value,
            done: false
          }
        } else {
          return {
            done: true
          } as IteratorResult<string>
        }
      }
    }
  }
}

export class RedisDatabase implements Database {
  private readonly _redis: Redis

  constructor (opts: Redis | string) {
    this._redis = typeof opts === 'string' ? new IoRedis(opts) : opts
  }

  createStore (namespace: string) {
    return new RedisStore(this._redis, namespace)
  }
}
