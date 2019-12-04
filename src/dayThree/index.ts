import { splitString } from "../helpers/splitString"
import { getInput } from "../helpers/getInput"

export class Vec2 {
  constructor(public x = 0, public y = 0) {}
}

export class Line {
  start: Vec2
  end: Vec2

  constructor(start: Vec2 | [number, number], end: Vec2 | [number, number]) {
    if (!(start instanceof Vec2)) start = new Vec2(...start)
    if (!(end instanceof Vec2)) end = new Vec2(...end)

    this.start = start
    this.end = end
  }
}

export type Wire = Line[]

export type Direction = "U" | "D" | "L" | "R"
export type Step = {
  direction: Direction
  distance: number
}

function mapWire(steps: Step[]): Line[] {
  const wireLines: Line[] = []
  let pos: Vec2 = new Vec2()

  for (const step of steps) {
    const move: { [key in Direction]: (dist: number) => Vec2 } = {
      U: dist => new Vec2(pos.x, pos.y + dist),
      D: dist => new Vec2(pos.x, pos.y - dist),
      R: dist => new Vec2(pos.x + dist, pos.y),
      L: dist => new Vec2(pos.x - dist, pos.y),
    }

    const endPos = move[step.direction](step.distance)
    wireLines.push(new Line(pos, endPos))
    pos = endPos
  }

  return wireLines
}

export function checkVert(line: Line): boolean {
  return line.start.x === line.end.x
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
      checkInRange(a.start.x, b.start.x, b.end.x) &&
      checkInRange(b.start.y, a.start.y, a.end.y)

    if (!theyIntersect) return undefined
    return new Vec2(a.start.x, b.start.y)
  } else {
    let theyIntersect =
      checkInRange(b.start.x, a.start.x, a.end.x) &&
      checkInRange(a.start.y, b.start.y, b.end.y)

    if (!theyIntersect) return undefined
    return new Vec2(b.start.x, a.start.y)
  }
}

function checkArraysEqual(a1: Vec2, a2: Vec2) {
  return JSON.stringify(a1) == JSON.stringify(a2)
}

function getManhattanMagnitude(point: Vec2) {
  return Math.abs(point.x) + Math.abs(point.y)
}

function getWiresIntersections(a: Wire, b: Wire) {
  const intersections: Vec2[] = []

  for (const lineA of a) {
    for (const lineB of b) {
      const intersection = getIntersection(lineA, lineB)
      if (intersection && !checkArraysEqual(intersection, new Vec2()))
        intersections.push(intersection)
    }
  }

  return intersections
}

async function doTheThing() {
  const input = (await getInput(__dirname))
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

    wires.push(mapWire(steps))
  }

  const intersections = getWiresIntersections(wires[0], wires[1])
  const distances = intersections
    .map(getManhattanMagnitude)
    .sort((a, b) => a - b)

  console.log(`Solution:\nThe closest intersection: ${distances[0]}`)
}

doTheThing()
