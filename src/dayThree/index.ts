import { splitString } from "../helpers/splitString"
import { getInput } from "../helpers/getInput"
import { Step, Wire, WireSegment, Intersection, Direction } from "./types"
import { Vec2 } from "./types/Vec2"
import { Line } from "./types/Line"

function mapWire(steps: Step[]): Wire {
  const wire: Wire = []
  let pos: Vec2 = new Vec2()
  let distanceTraveled = 0

  for (const step of steps) {
    const move: { [key in Direction]: (dist: number) => Vec2 } = {
      U: dist => new Vec2(pos.x, pos.y + dist),
      D: dist => new Vec2(pos.x, pos.y - dist),
      R: dist => new Vec2(pos.x + dist, pos.y),
      L: dist => new Vec2(pos.x - dist, pos.y),
    }

    const endPos = move[step.direction](step.travel)
    const line = new Line(pos, endPos)
    const segment = new WireSegment(line, distanceTraveled)

    wire.push(segment)

    pos = endPos
    distanceTraveled += Math.abs(segment.length)
  }

  return wire
}

export function checkVert(line: Line): boolean {
  return line.start.x === line.end.x
}

export function checkInRange(point: number, start: number, end: number) {
  const sortedStart = Math.min(start, end)
  const sortedEnd = Math.max(start, end)
  return sortedStart < point && point < sortedEnd
}

export function getIntersection(
  a: WireSegment,
  b: WireSegment
): Intersection | undefined {
  const aIsVert = checkVert(a)

  // if lines are parallel, they wont intersect
  if (aIsVert === checkVert(b)) return undefined

  const vert = aIsVert ? a : b
  const horiz = aIsVert ? b : a

  let theyIntersect =
    checkInRange(vert.start.x, horiz.start.x, horiz.end.x) &&
    checkInRange(horiz.start.y, vert.start.y, vert.end.y)

  if (!theyIntersect) return undefined

  const pos = new Vec2(vert.start.x, horiz.start.y)
  const travelA = Math.abs(a.travel) + Math.abs(a.start.distTo(pos))
  const travelB = Math.abs(b.travel) + Math.abs(b.start.distTo(pos))
  return new Intersection(pos, travelA + travelB)
}

function checkArraysEqual(a1: Vec2, a2: Vec2) {
  return JSON.stringify(a1) == JSON.stringify(a2)
}

function getWiresIntersections(a: Wire, b: Wire) {
  const intersections: Intersection[] = []

  for (const lineA of a) {
    for (const lineB of b) {
      const intersection = getIntersection(lineA, lineB)
      if (intersection && new Vec2().distTo(intersection.pos) > 0)
        intersections.push(intersection)
    }
  }

  return intersections
}

// Part 1
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
        travel: Number(split[1]),
      }
      steps.push(parsedStep)
    }

    wires.push(mapWire(steps))
  }

  const intersections = getWiresIntersections(wires[0], wires[1]).sort(
    (a, b) => a.travel - b.travel
  )
  const distances = intersections
    .map(i => i.pos.manhattanMag)
    .sort((a, b) => a - b)

  console.log(intersections)
  console.log(`Solution:\nThe closest intersection: ${distances[0]}`)
}

doTheThing()
