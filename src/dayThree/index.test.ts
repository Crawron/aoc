import { checkVert, Line, getIntersection, checkInRange } from "./index"

it.each([
  [[[0, 1], [0, 8]], true],
  [[[5, 1], [9, 1]], false],
  [[[20, 8], [8, 8]], false],
  [[[15, -6], [1, -6]], false],
  [[[-20, 1], [-20, 18]], true],
])("checkVertical", (a, b) => {
  expect(checkVert(a as Line)).toBe(b)
})

const linePair: [Line, Line] = [[[3, 5], [3, 2]], [[6, 3], [2, 3]]]

it.each([[linePair, [3, 3]]])("intersection", (a, b) => {
  a = a as [Line, Line]
  expect(getIntersection(a[0], a[1])).toStrictEqual(b)
})

it.each([[[3, 5, 2], true], [[-20, 1, 100], false], [[10, 50, -8], true]])(
  "checkInRange",
  (a, b) => {
    expect(checkInRange(...(a as [number, number, number]))).toBe(b)
  }
)
