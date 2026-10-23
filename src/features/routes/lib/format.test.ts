import { formatDuration, formatLength, formatRating } from './format'

// Intl может вставить неразрывный пробел — сравниваем без него.
const plain = (value: string) => value.replace(/\s/g, ' ')

describe('routes format', () => {
  it('formats length in meters and kilometres', () => {
    expect(plain(formatLength(850))).toBe('850 м')
    expect(plain(formatLength(2500))).toBe('2,5 км')
    expect(plain(formatLength(3000))).toBe('3 км')
    expect(formatLength(null)).toBe('—')
  })

  it('formats duration from seconds', () => {
    expect(formatDuration(27 * 60)).toBe('27 мин')
    expect(formatDuration(60 * 60)).toBe('1 ч')
    expect(formatDuration(95 * 60)).toBe('1 ч 35 мин')
    expect(formatDuration(null)).toBe('—')
  })

  it('formats rating with one decimal', () => {
    expect(formatRating(4.5)).toBe('4,5')
    expect(formatRating(5)).toBe('5,0')
    expect(formatRating(null)).toBe('—')
  })

  it('matches a real backend payload', () => {
    // Так приходит в ответе data-provider: 4276 метров и 2969 секунд.
    expect(plain(formatLength(4276))).toBe('4,3 км')
    expect(formatDuration(2969)).toBe('49 мин')
  })
})
