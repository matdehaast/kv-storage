import { Database, StorageArea } from '../index'

export const NamespaceTest = (database: Database): any => {
  let store1: StorageArea<any>
  let store2: StorageArea<any>

  beforeEach(async () => {
    store1 = new StorageArea({ database, namespace: 'keyv1' })
    store2 = new StorageArea({ database, namespace: 'keyv2' })
    await store1.clear()
    await store2.clear()
  })

  it('namespaced set/get don\'t collide', async () => {
    await store1.set('foo', 'keyv1')
    await store2.set('foo', 'keyv2')

    expect(await store1.get('foo')).toEqual('keyv1')
    expect(await store2.get('foo')).toEqual('keyv2')
  })

  it('namespaced delete only deletes from current namespace', async () => {
    await store1.set('foo', 'keyv1')
    await store2.set('foo', 'keyv2')

    await store1.delete('foo')

    expect(await store1.get('foo')).toBeUndefined()
    expect(await store2.get('foo')).toEqual('keyv2')
  })

  it('namespaced clear only clears current namespace', async () => {
    await store1.set('foo', 'keyv1')
    await store1.set('bar', 'keyv1')
    await store2.set('foo', 'keyv2')
    await store2.set('bar', 'keyv2')

    await store1.clear()

    expect(await store1.get('foo')).toBeUndefined()
    expect(await store1.get('bar')).toBeUndefined()
    expect(await store2.get('foo')).toEqual('keyv2')
    expect(await store2.get('bar')).toEqual('keyv2')
  })
}
