# `@kv-storage/redis`

Redis persistence for `kv-storage`

## Install

```shell
npm install --save @keyv/redis
```

## Usage

```typescript
import { StorageArea } from '@kv-storage/core'
import { RedisDatabase } from '@kv-storage/redis'
const redisDatabase = new RedisDatabase('redis://user:pass@localhost:6379');

const storage = new StorageArea({ database: redisDatabase });
```
