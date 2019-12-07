import { createInterface } from "readline"
import { promisify } from "util"

const rl = createInterface({ input: process.stdin, output: process.stdout })
export async function readInput(query: string = "Input: ") {
  return new Promise<string>(resolve => rl.question(query, resolve))
}
