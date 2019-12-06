import { runProgram } from "../common/intcode"

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
