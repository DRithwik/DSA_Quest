import { cn } from '../utils'
import { describe, it, expect } from 'vitest'

describe('cn util', () => {
  it('merges class names', () => {
    const res = cn('a', 'b', '')
    expect(res).toContain('a')
    expect(res).toContain('b')
  })
})
