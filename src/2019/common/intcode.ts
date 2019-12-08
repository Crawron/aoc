import { readInput } from "../../helpers/readInput"

export type ArgMode = "position" | "immediate"
export type Argument = { value: number; mode: ArgMode }
export class Program {
  pointer = 0

  constructor(
    private memory: number[],
    public readInput: () => string | undefined,
    public output: (str: string) => void = console.log
  ) {}

  run() {
    while (this.getValue() !== 99) {
      if (!this.runCurrentInstruction()) return undefined
    }

    return this.getValue(0)
  }

  runCurrentInstruction() {
    const { pointer } = this

    const [, modesMatch, opStr, opButNoModes] =
      /^(\d+)(\d\d)|(\d+)$/.exec(this.getValue().toString()) ?? []

    const code = Number(modesMatch ? opStr : opButNoModes)
    const modesStr = modesMatch ?? ""
    const op = opCodes[code]

    const args: Argument[] = [...modesStr.padStart(op.argCount, "0")]
      .map(m => (m === "1" ? "immediate" : "position"))
      .reverse()
      .map((m, i) => ({ value: this.getValue(pointer + i + 1), mode: m }))

    // xdddddd
    try {
      op.run(this, args)
      this.pointer += op.argCount + 1
      return true
    } catch (e) {
      return false
    }
  }

  getValue = (arg?: Argument | number) => {
    if (!arg) return this.memory[this.pointer]
    if (typeof arg === "number") return this.memory[arg]
    if (arg.mode === "position") return this.memory[arg.value]
    else return arg.value
  }

  write(position: number, value: number) {
    this.memory[position] = value
  }
}

const opCodes: { [key: number]: Operation } = {
  1: {
    name: "add",
    argCount: 3,
    run: (prog, [a, b, out]) => {
      prog.write(out.value, prog.getValue(a) + prog.getValue(b))
    },
  },
  2: {
    name: "multiply",
    argCount: 3,
    run: (prog, [a, b, out]) => {
      prog.write(out.value, prog.getValue(a) * prog.getValue(b))
    },
  },
  3: {
    name: "read",
    argCount: 1,
    run: (prog, [out]) => {
      const input = prog.readInput()
      if (input === undefined) throw "fuck"

      prog.write(out.value, parseInt(input))
    },
  },
  4: {
    name: "print",
    argCount: 1,
    run: (prog, [input]) => {
      prog.output(prog.getValue(input).toString())
    },
  },
  5: {
    name: "jump-if-true",
    argCount: 2,
    run: (prog, [val, pos]) => {
      if (prog.getValue(val) !== 0) prog.pointer = prog.getValue(pos) - 3
    },
  },
  6: {
    name: "jump-if-false",
    argCount: 2,
    run: (prog, [val, pos]) => {
      if (prog.getValue(val) === 0) prog.pointer = prog.getValue(pos) - 3
    },
  },
  7: {
    name: "less-than",
    argCount: 3,
    run: (prog, [a, b, pos]) => {
      prog.write(pos.value, prog.getValue(a) < prog.getValue(b) ? 1 : 0)
    },
  },
  8: {
    name: "equals",
    argCount: 3,
    run: (prog, [a, b, pos]) => {
      prog.write(pos.value, prog.getValue(a) === prog.getValue(b) ? 1 : 0)
    },
  },
}

export type Operation = {
  name: string
  argCount: number
  run: (program: Program, args: Argument[]) => void
}
