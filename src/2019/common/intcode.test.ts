import { Program } from "./intcode"

it("copies itself", () => {
  const input = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
    .split(",")
    .map(Number)

  const program = new Program(input)
  program.run()
})

it("outputs a 16 digit", () => {
  const input = "1102,34915192,34915192,7,4,7,99,0".split(",").map(Number)

  const program = new Program(input)
  program.run()
})

it("outputs the large number", () => {
  const input = "104,1125899906842624,99".split(",").map(Number)

  const program = new Program(input)
  program.run()
})
