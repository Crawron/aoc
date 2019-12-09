import { getInput } from "../../helpers/getInput"
import { Program } from "../common/intcode"

async function partOne() {
  const input = (await getInput(__dirname)).split(",").map(Number)

  const program = new Program(input, () => {
    console.log("in 1")
    return "1"
  })
  program.run()
}

partOne()
