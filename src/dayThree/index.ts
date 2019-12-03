import { splitString } from "../helpers/splitString"
import { getInput } from "../helpers/getInput"

export type Vec2 = [number, number]
export type Line = [Vec2, Vec2]
export type Wire = Line[]

export type Direction = "U" | "D" | "L" | "R"
export type Step = {
  direction: Direction
  distance: number
}

function mapWire(steps: Step[]): Line[] {
  const wireLines: Line[] = []
  let currentPos: Vec2 = [0, 0]

  for (const step of steps) {
    const move: { [key in Direction]: (dist: number) => Vec2 } = {
      U: dist => [currentPos[0], currentPos[1] + dist],
      D: dist => [currentPos[0], currentPos[1] - dist],
      R: dist => [currentPos[0] + dist, currentPos[1]],
      L: dist => [currentPos[0] - dist, currentPos[1]],
    }

    const endPos = move[step.direction](step.distance)
    wireLines.push([currentPos, endPos])
    currentPos = endPos
  }

  return wireLines
}

export function checkVert(line: Line): boolean {
  return line[0][0] === line[1][0]
}

export function checkInRange(point: number, start: number, end: number) {
  const sortedStart = Math.min(start, end)
  const sortedEnd = Math.max(start, end)
  return sortedStart < point && point < sortedEnd
}

export function getIntersection(a: Line, b: Line): Vec2 | undefined {
  // if lines are parallel, they wont intersect
  if (checkVert(a) === checkVert(b)) return undefined

  // check a is in range of b
  if (checkVert(a)) {
    let theyIntersect =
      checkInRange(a[0][0], b[0][0], b[1][0]) &&
      checkInRange(b[0][1], a[0][1], a[1][1])

    if (!theyIntersect) return undefined
    return [a[0][0], b[0][1]]
  } else {
    let theyIntersect =
      checkInRange(b[0][0], a[0][0], a[1][0]) &&
      checkInRange(a[0][1], b[0][1], b[1][1])

    if (!theyIntersect) return undefined
    return [b[0][0], a[0][1]]
  }
}

function checkArraysEqual(a1: Vec2, a2: Vec2) {
  return JSON.stringify(a1) == JSON.stringify(a2)
}

function getManhattanMagnitude(point: Vec2) {
  return Math.abs(point[0]) + Math.abs(point[1])
}

function getWiresIntersections(a: Wire, b: Wire) {
  const intersections: Vec2[] = []

  for (const lineA of a) {
    for (const lineB of b) {
      const intersection = getIntersection(lineA, lineB)
      if (intersection && !checkArraysEqual(intersection, [0, 0]))
        intersections.push(intersection)
    }
  }

  return intersections
}

async function doTheThing() {
  const input = (await getInput(__dirname + "/input"))
    .split("\n")
    .map(wire => wire.split(","))

  const wires: Wire[] = []

  for (const wire of input) {
    const steps: Step[] = []
    for (const step of wire) {
      const split = splitString(step, 1)
      const parsedStep: Step = {
        direction: split[0] as Direction,
        distance: Number(split[1]),
      }
      steps.push(parsedStep)
    }
    console.log(mapWire(steps))
    wires.push(mapWire(steps))
  }

  const intersections = getWiresIntersections(wires[0], wires[1])
  const distances = intersections
    .map(getManhattanMagnitude)
    .sort((a, b) => a - b)

  console.log(intersections, distances)
}

doTheThing()
