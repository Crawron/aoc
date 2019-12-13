import { getInput } from "../../helpers/getInput"
import { Vec } from "../common/Vec"
import { Planet } from "./Planet"

async function partOne() {
  const test1 =
    "<x=-1, y=0, z=2><x=2, y=-10, z=-7><x=4, y=-8, z=8><x=3, y=5, z=-1>"
  const puzzle = await getInput(__dirname)

  let planets = parsePlanets(puzzle).map(p => new Planet(p))
  console.log(planets)

  for (let s = 0; s < 1000; s++) {
    planets = step(planets)
  }

  planets.forEach(p => console.log(p.totalEnergy))
  console.log(
    "total energy:",
    planets.reduce((t, p) => (t += p.totalEnergy), 0)
  )
}

partOne()

function step(planets: Planet[]): Planet[] {
  for (const planet of planets) {
    const otherPlanets = planets.filter(p => p !== planet)
    for (const other of otherPlanets) {
      planet.pullTo(other)
    }
  }

  for (const planet of planets) {
    planet.applyVelocity()
  }

  return planets
}

function parsePlanets(str: string) {
  const regex = /<x= *(-?\d+), y= *(-?\d+), z= *(-?\d+)>/g
  const planets: Vec[] = []

  let match: RegExpExecArray | null
  while ((match = regex.exec(str))) {
    const [, ...coords] = match
    planets.push(new Vec(...coords.map(Number)))
  }

  return planets
}
