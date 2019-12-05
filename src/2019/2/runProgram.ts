// https://adventofcode.com/2019/day/2

type Operation = (a: number, b: number) => number

const opCodes: { [key: number]: Operation } = {
  1: (a, b) => a + b,
  2: (a, b) => a * b,
}

function runProgram(program: number[], noun: number, verb: number): number {
  program[1] = noun
  program[2] = verb

  for (let pos = 0; program[pos] !== 99; pos += 4) {
    const op = program[pos]
    const a = program[program[pos + 1]]
    const b = program[program[pos + 2]]
    const resultPtr = program[pos + 3]

    program[resultPtr] = opCodes[op](a, b)
  }
  return program[0]
}

// Part 1
export function restoreGravityAssistProgram(program: number[]) {
  return runProgram(program, 12, 2)
}

// Part 2
export function reverseOutput(
  program: number[],
  desiredOutput: number
): number {
  for (let noun = 0; noun !== 99; noun++) {
    for (let verb = 0; verb !== 99; verb++) {
      const programCopy = [...program] // get a fresh copy of the program
      const output = runProgram(programCopy, noun, verb)
      if (output === desiredOutput) return 100 * noun + verb
    }
  }
  return NaN
}
