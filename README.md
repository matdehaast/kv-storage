# `kv-storage`

KV-Storage provides an async `Map` like key-value API backed by various persistence options. KV-Storage has been inspired by 
the work of [Keyv](https://github.com/lukechilds/keyv) and the WICG's [kv-storage](https://github.com/WICG/kv-storage)
API. 

## Usage

### Basic Usage
The following is an example of using `kv-storage` using a basic in-memory Map
```typescript
import { StorageArea } from '@kv-storage/core'

(async () => {
  const storage = new StorageArea()
  await storage.set("alice", "Bob");
  console.log(await storage.get("alice")); // Logs "Bob"

  for await (const [key, value] of storage.entries()) {
    console.log(key, value);
  }
  // Logs "alice", "Bob"

  await storage.delete("alice");
  console.log(await storage.get("alice")); // Logs undefined
})();
```

### Persistent Store

```typescript
import { StorageArea } from '@kv-storage/core'
import { RedisDatabase } from '@kv-storage/redis'

(async () => {
  const RedisDatabase = new RedisDatabase("redis://")
  const storage = new StorageArea({ database: RedisDatabase })
 
  await storage.set("alice", "Bob");
})();
```


### Custom Namespaces

```typescript
import { StorageArea } from '@kv-storage/core'
import { RedisDatabase } from '@kv-storage/redis'

(async () => {
  const RedisDatabase = new RedisDatabase("redis://")
  const storageUsers = new StorageArea({ database: RedisDatabase, namespace: 'users' })
  const storageAccounts = new StorageArea({ database: RedisDatabase, namespace: 'accounts' })
 
  await storageUsers.set("alice", "Bob")
  await storageAccounts.set("alice", "Charles")
 
  console.log(await storageUsers.get("alice")); // Logs "Bob"
  console.log(await storageAccounts.get("alice")); // Logs "Charles"
})();
```

## Serializers and Deserializers
Previous projects such as `Keyv` added default support for serializing using `json-buffer`. Reading issues such as 
https://github.com/tc39/proposal-bigint/issues/162, is has been decided to leave serialization/deserialization of non-standard
values (Buffer, bigint etc.) to the user. As users will be able to better understand the needs and format of their data.

### Bigint Example
Consider an object with the following structure

```typescript
const account = {
  id: "Alice",
  balance: 15n
}
```

Custom serializer and deserializer can be defined as follows

```typescript
function replacer(key, value) {
  if(typeof value === 'bigint') {
    return {
      _isBigInt: true,
      v: value.toString()
    }
  }
  return value;
}

const customSerializer = (input) => JSON.stringify(input, replacer)

function reviver(key, value) {
  if(typeof value === 'object' && value._isBigInt) {
    return BigInt(value.v)
  }
  return value
}

const customDeserializer = () => JSON.parse(input, reviver)
```

Using the `customSerializer` and `customDeserializer` 

```typescript
import { StorageArea } from '@kv-storage/core'
import { RedisDatabase } from '@kv-storage/redis'

(async () => {
  const account = {
    id: "Alice",
    balance: 15n
  }

  const storage = new StorageArea({ 
    serialize: customSerializer,
    deserialize: customDeserializer
  })
  
  await storage.set("alice", account)

  console.log(await storage.get("alice")); // Logs {id: "Alice", balance: 15n}
})();
```
 

##  Async Iterators
`kv-storage` provides async iterators to `entries()`, `values()` and `keys()` with no guarantee of isolation. This means 
the following guarantees:
* An iterator will return all values that were present within the store from the start to the end of a full iteration.
* An iterator won't return values that were not present from the start to the end of a full iteration.
* Values that were not constantly present during an iteration may or may not be returned.

Overcoming the above limitations would require adding transaction support to the library. The ability to handle transactions
is on the roadmap but not a top priority.


## Options

#### `namespace`

Namespace in which `key-value` pairs will be stored 

#### `database`

An instance of a `kv-storage` compliant database driver

#### `serialize`

Serialization function that takes in an input (string, number, object etc) and returns a string

#### `deserialize`

Deserialization functions that takes in an input string and returns a given value (string, number, object etc)

## API

### `Map`-like key/value pair API

#### `set(key, value)`

Sets the value of the entry identified by `key` to `value`. Returns a promise that fulfills with `undefined` once this is complete.

#### `get(key)`

Returns a promise for the value of the entry identified by `key`, or `undefined` if no value is present.

#### `delete(key)`

Removes the entry identified by `key`, if it exists. Once this completes, returns a promise for undefined.

#### `clear()`

Clears all entries. Returns a promise for `undefined`.

#### `keys()`

Returns an async iterator for all the stored keys, sorted in the underlying stores order.

#### `values()`

Returns an async iterator for all the stored values, sorted to correspond with `keys()`.

#### `entries()`

Returns an async iterator of `[key, value]` pairs, sorted to correspond with `keys()`.


## Roadmap
- [ ] Transaction Support
- [ ] Serialize/Deserialize helper functions for common types such as buffer, bigint and date
- [ ] Add more datastore options (dynamodb, workers kv, firestore)
- [ ] URI support for StorageArea constructor
- [ ] DB connection error handling


