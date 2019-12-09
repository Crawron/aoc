export enum ParamMode {
  Position,
  Immediate,
  Relative,
}
export type Parameter = { value: number; mode: ParamMode }
export type Argument = { value: number; address: number }
export class Program {
  pointer = 0
  relativeBase = 0

  constructor(
    private memory: number[],
    public readInput: () => string | undefined = () => "1",
    public output: (str: string) => void = console.log
  ) {}

  run() {
    while (this.getValue().value !== 99) {
      if (!this.runCurrentInstruction()) return undefined
    }

    return this.getValue(0)
  }

  runCurrentInstruction() {
    const { pointer } = this

    const [, modesMatch, opStr, opButNoModes] =
      /^(\d+)(\d\d)|(\d+)$/.exec(this.getValue().value.toString()) ?? []

    const code = Number(modesMatch ? opStr : opButNoModes)
    const modesStr = modesMatch ?? ""
    const op = opCodes[code]

    const args: Argument[] = [...modesStr.padStart(op.argCount, "0")]
      .map(Number)
      .map(m => {
        return [ParamMode.Position, ParamMode.Immediate, ParamMode.Relative][m]
      })
      .reverse()
      .map((m, i) => ({ value: this.memory[pointer + i + 1], mode: m }))
      .map(this.getValue)

    // xdddddd
    try {
      op.run(this, args)
      this.pointer += op.argCount + 1
      return true
    } catch (e) {
      return false
    }
  }

  getValue = (arg?: Parameter | number): Argument => {
    if (!arg) return { value: this.memory[this.pointer], address: this.pointer }
    if (typeof arg === "number")
      return { value: this.memory[arg], address: arg }

    switch (arg.mode) {
      case ParamMode.Position:
        return { value: this.memory[arg.value], address: arg.value }
      case ParamMode.Immediate:
        return { value: arg.value, address: -1 } // how tf
      case ParamMode.Relative:
        return {
          value: this.memory[this.relativeBase + arg.value],
          address: this.relativeBase + arg.value,
        }
    }
  }

  write(position: Argument | number, value: number) {
    if (typeof position === "number") this.memory[position] = value
    else this.memory[position.address] = value
  }
}

const opCodes: { [key: number]: Operation } = {
  1: {
    name: "add",
    argCount: 3,
    run: (prog, [a, b, out]) => {
      prog.write(out, a.value + b.value)
    },
  },
  2: {
    name: "multiply",
    argCount: 3,
    run: (prog, [a, b, out]) => {
      prog.write(out, a.value * b.value)
    },
  },
  3: {
    name: "read",
    argCount: 1,
    run: (prog, [out]) => {
      const input = prog.readInput()
      if (input === undefined) throw "fuck"

      prog.write(out, Number(input))
    },
  },
  4: {
    name: "print",
    argCount: 1,
    run: (prog, [input]) => {
      prog.output(input.value.toString())
    },
  },
  5: {
    name: "jump-if-true",
    argCount: 2,
    run: (prog, [val, pos]) => {
      if (val.value !== 0) prog.pointer = pos.value - 3
    },
  },
  6: {
    name: "jump-if-false",
    argCount: 2,
    run: (prog, [val, pos]) => {
      if (val.value === 0) prog.pointer = pos.value - 3
    },
  },
  7: {
    name: "less-than",
    argCount: 3,
    run: (prog, [a, b, pos]) => {
      prog.write(pos, a.value < b.value ? 1 : 0)
    },
  },
  8: {
    name: "equals",
    argCount: 3,
    run: (prog, [a, b, pos]) => {
      prog.write(pos, a.value === b.value ? 1 : 0)
    },
  },
  9: {
    name: "relative base offset",
    argCount: 1,
    run: (prog, [val]) => {
      prog.relativeBase += val.value
    },
  },
}

export type Operation = {
  name: string
  argCount: number
  run: (program: Program, args: Argument[]) => void
}
