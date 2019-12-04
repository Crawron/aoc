import { Line } from "./Line"
import { Vec2 } from "./Vec2"

export class WireSegment extends Line {
  constructor(public line: Line, public travel: number) {
    super(line.start, line.end)
  }
}

export type Wire = WireSegment[]

export type Direction = "U" | "D" | "L" | "R"

export class Intersection {
  constructor(public pos: Vec2, public travel: number) {}
}

export type Step = {
  direction: Direction
  travel: number
}
