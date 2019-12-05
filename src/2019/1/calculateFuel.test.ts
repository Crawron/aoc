import { getInput } from "../../helpers/getInput"
import { calculateInitialFuel, calculateTotalFuel } from "./calculateFuel"

it("calculates fuel for modules", async () => {
  const input = (await getInput(`${__dirname}`)).split("\n").map(Number)
  console.log(calculateInitialFuel(input))
})

it("calculates total fuel for modules", async () => {
  const input = (await getInput(`${__dirname}`)).split("\n").map(Number)
  console.log(calculateTotalFuel(input))
})
