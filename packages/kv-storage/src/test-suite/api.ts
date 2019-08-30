import { Database, StorageArea } from '../index'

export const ApiTests = (database: Database): any => {
  let storage: StorageArea<string>

  beforeEach(async () => {
    storage = new StorageArea({ database })
    await storage.clear()
  })

  afterEach(async () => {
    await storage.clear()
  })

  it('.set(key, value) returns a Promise', () => {
    expect(storage.set('foo', 'bar') instanceof Promise)
  })

  it('.set(key, value) resolves to undefined', async () => {
    expect(await storage.set('foo', 'bar')).toBeUndefined()
  })

  it('.set(key, value) sets a value', async () => {
    await storage.set('foo', 'bar')
    expect(await storage.get('foo')).toEqual('bar')
  })

  it('.get(key) returns a Promise', () => {
    expect(storage.get('foo') instanceof Promise)
  })

  it('.get(key) resolves to value', async () => {
    await storage.set('foo', 'bar')
    expect(await storage.get('foo')).toEqual('bar')
  })

  it('.get(key) with nonexistent key resolves to undefined', async () => {
    expect(await storage.get('foo')).toBeUndefined()
  })

  it('.delete(key) returns a Promise', async () => {
    expect(storage.delete('foo')).toBeInstanceOf(Promise)
  })

  it('.delete(key) resolves to undefined', async () => {
    expect(await storage.delete('foo')).toEqual(undefined)
  })

  it('.delete(key) deletes a key', async () => {
    await storage.set('foo', 'bar')
    expect(await storage.get('foo')).toEqual('bar')

    await storage.delete('foo')

    expect(await storage.get('foo')).toBeUndefined()
  })

  it('.clear() returns a Promise', async () => {
    expect(storage.clear()).toBeInstanceOf(Promise)
  })

  it('.clear() resolves to undefined', async () => {
    await storage.set('foo', 'bar')
    expect(await storage.clear()).toBeUndefined()
  })

  it('.clear() deletes all key/value pairs', async () => {
    await storage.set('foo', 'bar')
    await storage.set('fizz', 'buzz')
    expect(await storage.get('foo')).toEqual('bar')
    expect(await storage.get('fizz')).toEqual('buzz')

    await storage.clear()

    expect(await storage.get('foo')).toBeUndefined()
    expect(await storage.get('fizz')).toBeUndefined()
  })

  it('.keys()', async () => {
    await storage.set('foo', 'bar')
    await storage.set('fizz', 'buzz')

    const keys = await storage.keys()

    expect(await keys.next()).toEqual({
      done: false,
      value: 'foo'
    })
    expect(await keys.next()).toEqual({
      done: false,
      value: 'fizz'
    })
    expect(await keys.next()).toEqual({
      done: true
    })
  })

  it('.values()', async () => {
    await storage.set('foo', 'bar')
    await storage.set('fizz', 'buzz')

    const values = await storage.values()

    expect(await values.next()).toEqual({
      done: false,
      value: 'bar'
    })
    expect(await values.next()).toEqual({
      done: false,
      value: 'buzz'
    })
    expect(await values.next()).toEqual({
      done: true
    })
  })

  it('.entries()', async () => {
    await storage.set('foo', 'bar')
    await storage.set('fizz', 'buzz')

    const entries = await storage.entries()

    expect(await entries.next()).toEqual({
      done: false,
      value: ['foo', 'bar']
    })
    expect(await entries.next()).toEqual({
      done: false,
      value: ['fizz', 'buzz']
    })
    expect(await entries.next()).toEqual({
      done: true
    })
  })
}
