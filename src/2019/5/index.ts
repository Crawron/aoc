import { Program } from "../common/intcode"
import { getInput } from "../../helpers/getInput"

// Part 1
export function parseProgram(input: string) {
  console.log(new Program(input.split(",").map(Number)).run())
}

;(async function() {
  parseProgram(await getInput(__dirname))
})()
