import { ApiTests } from './api'
import { NamespaceTest } from './namespace'
import { ValuesTest } from './values'
import { Database } from '../index'
// import keyvOfficialTests from './official';

export const TestSuite = (database: Database): any => {
  ApiTests(database)
  NamespaceTest(database)
  ValuesTest(database)
}

export {
  ApiTests,
  NamespaceTest,
  ValuesTest
}
