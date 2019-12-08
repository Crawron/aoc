import { getInput } from "../../helpers/getInput"
import { Program } from "../common/intcode"
import { checkRepeating } from "../../helpers/checkRepeating"

function inputFactory(inputs: string[]) {
  let inputCopy = [...inputs]
  return () => {
    const input = inputCopy.shift()
    return input ?? "0"
  }
}

function createSequences(...range: [number, number]) {
  const [from, to] = range.sort()
  const sequences = new Set<string>()

  for (let a = from; a <= to; a++)
    for (let b = from; b <= to; b++)
      for (let c = from; c <= to; c++)
        for (let d = from; d <= to; d++)
          for (let e = from; e <= to; e++) {
            const inputs = [a, b, c, d, e].map(String).reverse()
            if (checkRepeating([...inputs].sort().join(""))) continue
            sequences.add(inputs.join(""))
          }

  return [...sequences]
}

async function partOne() {
  const puzzleInput = [...(await getInput(__dirname)).split(",").map(Number)]
  const sequences = createSequences(0, 4)
  let outputs = []

  for (const sequence of sequences) {
    const inputs = sequence.split("")

    let out: string = "0"
    for (const input of inputs) {
      const program = new Program(
        puzzleInput,
        inputFactory([input, out]),
        str => (out = str)
      )
      program.run()

      outputs.push({ in: inputs.join(""), out: out })
    }
  }

  console.log(
    outputs
      .map(a => ({ in: a.in, out: Number(a.out) }))
      .sort((a, b) => b.out - a.out)[0]
  )
}

type Inputter = {
  inputQueue: string[]
  read: () => string | undefined
}
function createInputter(inputs: string[]): Inputter {
  let i = 0
  return {
    inputQueue: inputs,
    read: () => {
      const input = inputs.shift()
      //console.log("in " + input)
      return input
    },
  }
}

async function partTwo() {
  const puzzle = await getInput(__dirname)
  const test1 =
    "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5"
  const test2 =
    "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10"

  const puzzleInput = [...puzzle.split(",").map(Number)]

  const sequences = createSequences(5, 9)

  const signalResults = []

  for (let [...sequence] of sequences) {
    let lastSignal: string = "0"
    let inputters: Inputter[] = sequence.map(e => createInputter([e]))
    const programs: Program[] = inputters.map(
      inputter => new Program([...puzzleInput], inputter.read)
    )

    programs.map(
      (p, i) =>
        (p.output = output => {
          //console.log("out " + output)
          inputters[(i + 1) % programs.length].inputQueue.push(output)
          lastSignal = output
        })
    )

    inputters[0].inputQueue.push("0")

    let i = 0
    while (true) {
      //console.log("program " + i + ", queue: " + inputters[i].inputQueue)
      const e = programs[i].run()
      //console.log("\n")

      if (i === 4 && e !== undefined) {
        //console.log(`program ${i} halted (${e})`)
        break
      }
      i = (i + 1) % programs.length
    }

    signalResults.push({ sequence: sequence.join(""), lastSignal })
  }

  console.log(
    signalResults
      .sort((b, a) => Number(a.lastSignal) - Number(b.lastSignal))
      .shift()
  )
}

partOne()
partTwo()
