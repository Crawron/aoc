import { readFile } from "fs"
import { promisify } from "util"

const readFileAsync = promisify(readFile)

export async function getInput(url: string) {
  return (await readFileAsync(url + "/input")).toString()
}
