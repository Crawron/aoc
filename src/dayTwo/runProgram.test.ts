import { restoreGravityAssistProgram, reverseOutput } from "./runProgram"
import { getInput } from "../helpers/getInput"

it("restores the gravity assist program", async () => {
  const input = (await getInput(`${__dirname}/input`)).split(",").map(Number)
  console.log(restoreGravityAssistProgram(input))
})

it("actually reverse engineers", async () => {
  const input = (await getInput(`${__dirname}/input`)).split(",").map(Number)
  console.log(reverseOutput(input, 19690720))
})
