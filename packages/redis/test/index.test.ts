import { TestSuite } from '@kv-storage/core'
import { RedisDatabase } from '../src'
import { Redis } from 'ioredis'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MockIORedis = require('ioredis-mock')

describe('Redis Store Test Suite', () => {
  const mockRedisClient: Redis = new MockIORedis()
  const redisDb: RedisDatabase = new RedisDatabase(mockRedisClient)
  TestSuite(redisDb)
})
