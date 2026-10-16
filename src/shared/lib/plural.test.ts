import { plural } from './plural'

const FORMS = ['отзыв', 'отзыва', 'отзывов'] as const

describe('plural', () => {
  it.each([
    [0, 'отзывов'],
    [1, 'отзыв'],
    [2, 'отзыва'],
    [5, 'отзывов'],
    [11, 'отзывов'],
    [12, 'отзывов'],
    [21, 'отзыв'],
    [22, 'отзыва'],
    [111, 'отзывов'],
  ])('%i → %s', (count, expected) => {
    expect(plural(count, FORMS)).toBe(expected)
  })
})
