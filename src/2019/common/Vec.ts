export class Vec {
  constructor(public x = 0, public y = 0, public z = 0) {}

  get manhattanMag(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
  }

  get mag(): number {
    const { x, y } = this
    const { pow, sqrt } = Math
    const sq = (n: number) => pow(n, 2)
    return sqrt(sq(x) + sq(y))
  }

  get array() {
    return [this.x, this.y, this.z]
  }

  distTo(vec: Vec) {
    return this.relativeTo(vec).mag
  }

  manhattanTo(vec: Vec) {
    return this.relativeTo(vec).manhattanMag
  }

  relativeTo(vec: Vec) {
    return new Vec(vec.x - this.x, vec.y - this.y, vec.z - this.z)
  }

  get negative() {
    return new Vec(-this.x, -this.y, -this.z)
  }

  /** Rotate in the Z axis */
  rotateZ(angle: number) {
    const { cos, sin } = Math
    const { x, y } = this
    return new Vec(
      x * cos(angle) - y * sin(angle),
      x * sin(angle) + y * cos(angle)
    )
  }

  add(vec: Vec) {
    return new Vec(vec.x + this.x, vec.y + this.y, vec.z + this.z)
  }

  get abs() {
    const axes = this.array.map(Math.abs)
    return new Vec(...axes)
  }

  capEach(min: number, max: number) {
    const axes = this.array.map(a => (a < min ? min : a > max ? max : a))
    return new Vec(...axes)
  }

  get roundEach() {
    const axes = this.array.map(Math.round)
    return new Vec(...axes)
  }

  get atanXY() {
    return Math.atan2(this.y, this.x)
  }
}
