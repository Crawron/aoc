import { getInput } from "../helpers/getInput"
import { restoreGravityAssistProgram, reverseOutput } from "./runProgram"

const getProgram = async () => {
  return (await getInput(`${__dirname}/input`)).split(",").map(Number)
}
;(async function() {
  const solutionPartOne = restoreGravityAssistProgram(await getProgram())
  const solutionPartTwo = reverseOutput(await getProgram(), 19690720)
  console.log(
    `Solutions\nPart One: ${solutionPartOne}\nPart Two: ${solutionPartTwo}`
  )
})()
