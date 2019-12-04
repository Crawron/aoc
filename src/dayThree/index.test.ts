import { checkVert, Line, getIntersection, checkInRange, Vec2 } from "./index"

it.each([
  [new Line([0, 1], [0, 8]), true],
  [new Line([5, 1], [9, 1]), false],
  [new Line([20, 8], [8, 8]), false],
  [new Line([15, -6], [1, -6]), false],
  [new Line([-20, 1], [-20, 18]), true],
])("checkVertical", (a, b) => {
  expect(checkVert(a as Line)).toBe(b)
})

const linePair: [Line, Line] = [
  new Line([3, 5], [3, 2]),
  new Line([6, 3], [2, 3]),
]

it.each([[linePair, new Vec2(3, 3)]])("intersection", (a, b) => {
  a = a as [Line, Line]
  expect(getIntersection(a[0], a[1])).toStrictEqual(b)
})

it.each([[[3, 5, 2], true], [[-20, 1, 100], false], [[10, 50, -8], true]])(
  "checkInRange",
  (a, b) => {
    expect(checkInRange(...(a as [number, number, number]))).toBe(b)
  }
)
