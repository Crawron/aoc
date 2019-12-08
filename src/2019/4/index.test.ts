import { checkDecreasing, checkStrictDoubles } from "."
import { checkRepeating } from "../../helpers/checkRepeating"

it.each([
  ["123456", false],
  ["221458", true],
  ["222222", false],
  ["654123", true],
  ["123454", true],
])("detects decreasing numbers", (a, b) => {
  expect(checkDecreasing(a as string)).toBe(b)
})

it.each<[string, boolean]>([
  ["123456", false],
  ["112456", true],
  ["121212", false],
  ["155133", true],
  ["111111", true],
  ["222784", true],
  ["456123", false],
  ["784134", false],
  ["789441", true],
])("detects repeating numbers", (a, b) => {
  expect(checkRepeating(a as string)).toBe(b)
})

it.each<[string, boolean]>([
  ["123456", false],
  ["112456", true],
  ["121222", false],
  ["155133", true],
  ["111122", true],
  ["222784", false],
  ["456123", false],
  ["784134", false],
  ["789441", true],
])("detects strict doubles", (a, b) => {
  expect(checkStrictDoubles(a)).toBe(b)
})
