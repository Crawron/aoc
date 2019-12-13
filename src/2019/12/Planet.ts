import { Vec } from "../common/Vec"

export class Planet {
  velocity = new Vec()
  constructor(public position: Vec) {}

  pullTo(planet: Planet) {
    const direction = planet.position.relativeTo(this.position).capEach(-1, 1)
      .negative.roundEach

    this.velocity = this.velocity.add(direction)
  }

  applyVelocity() {
    this.position = this.position.add(this.velocity)
  }

  get totalEnergy() {
    return this.velocity.manhattanMag * this.position.manhattanMag
  }
}
