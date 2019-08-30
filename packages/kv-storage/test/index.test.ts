import { TestSuite } from '../src/test-suite'
import { MapDatabase } from '../src/map-store'

describe('Default Test Suite', () => {
  const database = new MapDatabase()
  TestSuite(database)
})
