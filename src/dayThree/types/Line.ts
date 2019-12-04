import { Vec2 } from "./Vec2"

export class Line {
  start: Vec2
  end: Vec2

  constructor(start: Vec2 | [number, number], end: Vec2 | [number, number]) {
    if (!(start instanceof Vec2)) start = new Vec2(...start)
    if (!(end instanceof Vec2)) end = new Vec2(...end)

    this.start = start
    this.end = end
  }

  get length(): number {
    return this.start.distTo(this.end)
  }
}
