export class Vec2 {
  constructor(public x = 0, public y = 0) {}

  get manhattanMag(): number {
    return Math.abs(this.x) + Math.abs(this.y)
  }

  distTo(vec: Vec2) {
    const { abs } = Math
    return new Vec2(vec.x - this.x, vec.y - this.y).manhattanMag
  }
}
