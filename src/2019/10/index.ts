import { Vec } from "../common/Vec"
import { getInput } from "../../helpers/getInput"

function getViewCounts(asteroids: Vec[]) {
  return asteroids
    .map(asteroid => {
      const sum = new Set<number>()

      for (const other of asteroids) {
        if (other.distTo(asteroid) === 0) continue

        sum.add(asteroid.relativeTo(other).atanXY)
      }

      return {
        point: asteroid,
        viewCount: sum.size,
      }
    })
    .sort((a, b) => b.viewCount - a.viewCount)
}

function parseAsteroids(puzzleInput: string) {
  return puzzleInput
    .split("\n")
    .map(([...row], y) => {
      return row.map((col, x) => {
        if (col !== "#") return undefined
        else return new Vec(x, y)
      })
    })
    .flat()
    .filter(v => v !== undefined) as Vec[]
}

async function partOne() {
  const puzzle = await getInput(__dirname)

  const asteroids = parseAsteroids(puzzle)
  const sums = getViewCounts(asteroids)

  console.log(sums.pop()?.viewCount)
}

async function partTwo() {
  const puzzle = await getInput(__dirname)

  const asteroids = parseAsteroids(puzzle)
  const [center, ...others] = getViewCounts(asteroids).map(o => o.point)

  console.log(center)

  const sortedOthers = sortPoints(center, others)

  console.log("[" + sortedOthers.map(o => `[${o.x},${o.y}]`).join(", ") + "]")

  const twoHundredth = sortedOthers[199]
  console.log(twoHundredth.x * 100 + twoHundredth.y)
}

type Dic<T> = { [_ in number]?: T }

function sortPoints(center: Vec, others: Vec[]): Vec[] {
  const TAU = Math.PI * 2

  others = others
    .map(o => o.add(center.negative))
    .map(o => o.rotateZ(-TAU / 4))
    .map(o => o.roundEach)

  const angleBags: Dic<Vec[]> = {}

  for (const other of others) {
    const bag = angleBags[other.atanXY]
    if (!bag) angleBags[other.atanXY] = [other]
    else angleBags[other.atanXY]!.push(other)
  }

  for (const [k, v] of Object.entries(angleBags)) {
    angleBags[Number(k)] = v!.sort((b, a) => a.mag - b.mag)
  }

  const ordered: Vec[] = []
  const sortedBags = Object.entries(angleBags).sort(
    ([ka], [kb]) => Number(ka) - Number(kb)
  )

  while (sortedBags.filter(([, b]) => b!.length > 0).length > 0) {
    for (let [k, angle] of sortedBags) {
      if (angle!.length === 0) continue

      const pos = angleBags[Number(k)]!.pop()
      if (pos) ordered.push(pos)
    }
  }

  return ordered
    .map(o => o.rotateZ(TAU / 4))
    .map(o => o.roundEach)
    .map(o => o.add(center))
}

//partOne()
partTwo()

const test1 = ".#..#\n.....\n#####\n....#\n...##"
const test2 =
  "......#.#.\n#..#.#....\n..#######.\n.#.#.###..\n.#..#.....\n..#....#.#\n#..#....#.\n.##.#..###\n##...#..#.\n.#....####"
const test3 =
  ".#..##.###...#######\n##.############..##.\n.#.######.########.#\n.###.#######.####.#.\n#####.##.#.##.###.##\n..#####..#.#########\n####################\n#.####....###.#.#.##\n##.#################\n#####.##.###..####..\n..######..##.#######\n####.##.####...##..#\n.#####..#.######.###\n##...#.##########...\n#.##########.#######\n.####.#.###.###.#.##\n....##.##.###..#####\n.#.#.###########.###\n#.#.#.#####.####.###\n###.##.####.##.#..##"
