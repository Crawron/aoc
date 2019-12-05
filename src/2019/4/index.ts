import { getInput } from "../../helpers/getInput"

export function checkDecreasing(n: string): boolean {
  const digits = n.split("").map(Number)

  for (let i = 1; i < digits.length; i++) {
    if (digits[i - 1] > digits[i]) return true
  }

  return false
}

export function checkRepeating(n: string): boolean {
  return /(.)\1/.test(n)
}

export function checkStrictDoubles(n: string): boolean {
  const regex = /(\d)\1+/g
  const matches = n.match(regex)

  if (!matches) return false

  const doubleMatches = matches.filter(match => match.length === 2)

  return doubleMatches.length > 0
}

function partOne(input: string) {
  const split = input.split("-").map(Number)
  const from = split[0]
  const to = split[1]

  let counter = 0

  for (let i = from; i <= to; i++) {
    const code = i.toString()

    if (!checkStrictDoubles(code)) continue
    if (checkDecreasing(code)) continue

    counter++
  }

  return counter
}

;(async function() {
  console.log(partOne(await getInput(__dirname)))
})()
