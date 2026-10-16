import { formatDuration, formatLength, formatRating } from './format'

// Intl может вставить неразрывный пробел — сравниваем без него.
const plain = (value: string) => value.replace(/\s/g, ' ')

describe('routes format', () => {
  it('formats length in km', () => {
    expect(plain(formatLength(2.5))).toBe('2,5 км')
    expect(plain(formatLength(3))).toBe('3 км')
    expect(formatLength(null)).toBe('—')
  })

  it('formats duration in minutes and hours', () => {
    expect(formatDuration(27)).toBe('27 мин')
    expect(formatDuration(60)).toBe('1 ч')
    expect(formatDuration(95)).toBe('1 ч 35 мин')
    expect(formatDuration(null)).toBe('—')
  })

  it('formats rating with one decimal', () => {
    expect(formatRating(4.5)).toBe('4,5')
    expect(formatRating(5)).toBe('5,0')
    expect(formatRating(null)).toBe('—')
  })
})
