import { getInput } from "../../helpers/getInput"

class Orbit {
  constructor(public id: string, public parent?: Orbit) {}
  get level(): number {
    return this.parent ? this.parent.level + 1 : 0
  }
}

function parseOrbits(input: string) {
  const orbits: Orbit[] = [new Orbit("COM")]
  const planetOrbits = input.split("\n")

  while (planetOrbits.length > 0) {
    //console.log(planetOrbits.length)
    const orbitStr = planetOrbits.shift()
    if (!orbitStr) break

    const [parentId, childId] = orbitStr.split(")")

    const findOrbit = ({ id }: Orbit) => id === parentId
    const parentOrbit = orbits.find(findOrbit)

    if (!parentOrbit) {
      planetOrbits.push(orbitStr)
      continue
    }

    orbits.push(new Orbit(childId, parentOrbit))
  }

  return orbits
}

;(async () => {
  const input = await getInput(__dirname)
  const test = "D)E\nB)C\nC)D\nE)J\nE)F\nB)G\nG)H\nD)I\nK)L\nJ)K\nCOM)B"
  const test2 =
    "COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN"

  const orbits = parseOrbits(input)

  // Part 1
  console.log(orbits.reduce((total, orb) => total + orb.level, 0))

  // common orbits between YOU and SAN
  const YOU = orbits.find(orb => orb.id === "YOU")!
  const SAN = orbits.find(orb => orb.id === "SAN")!

  const YOUOrbits: Orbit[] = getParentOrbits(YOU)
  const SANOrbits: Orbit[] = getParentOrbits(SAN)

  console.log(YOUOrbits.map(orb => `${orb.parent?.id})${orb.id}`).join(","))

  const highestCommonOrbitLevel =
    YOUOrbits.filter(youOrb => SANOrbits.includes(youOrb)).sort(
      (a, b) => b.level - a.level
    )[0]?.level ?? 0

  console.log(YOU.level + SAN.level - highestCommonOrbitLevel * 2 - 2)
})()

function getParentOrbits(orbit: Orbit): Orbit[] {
  const orbits: Orbit[] = []
  let currentParent = orbit.parent

  while (currentParent) {
    orbits.push(currentParent)
    currentParent = currentParent.parent
  }

  return orbits
}
