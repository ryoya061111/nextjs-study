import { describe, it, expect } from 'vitest'

// Record<string, string> ↔ Array<{key, value}> の変換ロジック
const recordToArray = (record: Record<string, string>) =>
  Object.entries(record).map(([key, value]) => ({ key, value }))

const arrayToRecord = (array: Array<{ key: string; value: string }>) =>
  Object.fromEntries(array.map(({ key, value }) => [key, value]))

describe('links 変換ロジック', () => {
  it('Record を Array に変換できる', () => {
    const record = {
      GitHub: 'https://github.com/example',
      Twitter: 'https://twitter.com/example',
    }
    const result = recordToArray(record)
    expect(result).toEqual([
      { key: 'GitHub', value: 'https://github.com/example' },
      { key: 'Twitter', value: 'https://twitter.com/example' },
    ])
  })

  it('Array を Record に変換できる', () => {
    const array = [
      { key: 'GitHub', value: 'https://github.com/example' },
      { key: 'Twitter', value: 'https://twitter.com/example' },
    ]
    const result = arrayToRecord(array)
    expect(result).toEqual({
      GitHub: 'https://github.com/example',
      Twitter: 'https://twitter.com/example',
    })
  })

  it('空のRecord を変換できる', () => {
    const result = recordToArray({})
    expect(result).toEqual([])
  })

  it('空の Array を変換できる', () => {
    const result = arrayToRecord([])
    expect(result).toEqual({})
  })

  it('Round trip: Record → Array → Record', () => {
    const original = {
      GitHub: 'https://github.com/example',
      Twitter: 'https://twitter.com/example',
      Website: 'https://example.com',
    }
    const array = recordToArray(original)
    const result = arrayToRecord(array)
    expect(result).toEqual(original)
  })

  it('重複するキーの場合、後ろの値で上書きされる', () => {
    const array = [
      { key: 'GitHub', value: 'https://github.com/old' },
      { key: 'GitHub', value: 'https://github.com/new' },
    ]
    const result = arrayToRecord(array)
    expect(result.GitHub).toBe('https://github.com/new')
  })
})
