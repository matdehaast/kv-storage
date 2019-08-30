import {Database, StorageArea} from '../index'

export const ValuesTest = (database: Database): any => {
  let store1: StorageArea<any>

  beforeEach(async () => {
    store1 = new StorageArea({ database })
    await store1.clear()
  })

  it('value can be false', async () => {
    await store1.set('foo', false)

    expect(await store1.get('foo')).toEqual(false)
  })

  it('value can be null', async () => {
    await store1.set('foo', null)

    expect(await store1.get('foo')).toEqual(null)
  })

  it('value can be undefined', async () => {
    await store1.set('foo', undefined)

    expect(await store1.get('foo')).toEqual(undefined)
  })

  it('value can be a number', async () => {
    await store1.set('foo', 0)

    expect(await store1.get('foo')).toEqual(0)
  })

  it('value can be an object', async () => {
    const value = { fizz: 'buzz' }

    await store1.set('foo', value)

    expect(await store1.get('foo')).toStrictEqual(value)
  })

  it('value can contain quotes', async () => {
    const value = '"'

    await store1.set('foo', value)

    expect(await store1.get('foo')).toStrictEqual(value)
  })
}
