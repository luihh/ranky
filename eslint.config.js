//  @ts-check

import neostandard from 'neostandard'
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...neostandard({
    ts: true,
    noStyle: true
  }),
  ...tanstackConfig
]
