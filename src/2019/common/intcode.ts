export type ArgMode = "position" | "immediate"
export type Argument = { value: number; mode: ArgMode }
export class Program {
  pointer = 0

  constructor(private data: number[]) {}

  run(noun?: number, verb?: number) {
    if (noun) this.write(1, noun)
    if (verb) this.write(2, verb)

    while (this.getValue() !== 99) {
      this.runCurrentInstruction()
    }

    return this.getValue(0)
  }

  runCurrentInstruction() {
    const { getValue: get, pointer } = this

    const [, modesMatch, opStr, opButNoModes] =
      /^(\d+)(\d\d)|(\d+)$/.exec(get().toString()) ?? []

    const code = Number(modesMatch ? opStr : opButNoModes)
    const modesStr = modesMatch ?? ""
    const op = opCodes[code]

    const args: Argument[] = [...modesStr.padStart(op.argCount, "0")]
      .map(m => (m === "1" ? "immediate" : "position"))
      .reverse()
      .map((m, i) => ({ value: get(pointer + i + 1), mode: m }))

    op.run(this, args)
    this.pointer += op.argCount + 1
  }

  getValue = (arg?: Argument | number) => {
    if (!arg) return this.data[this.pointer]
    if (typeof arg === "number") return this.data[arg]
    if (arg.mode === "position") return this.data[arg.value]
    else return arg.value
  }

  write(position: number, value: number) {
    this.data[position] = value
  }
}

const opCodes: { [key: number]: Operation } = {
  1: {
    argCount: 3,
    run: (prog, [a, b, out]) => {
      prog.write(out.value, prog.getValue(a) + prog.getValue(b))
    },
  },
  2: {
    argCount: 3,
    run: (prog, [a, b, out]) => {
      prog.write(out.value, prog.getValue(a) * prog.getValue(b))
    },
  },
  3: {
    argCount: 1,
    run: (prog, [out]) => {
      prog.write(out.value, readInput())
    },
  },
  4: {
    argCount: 1,
    run: (prog, [input]) => {
      console.log(prog.getValue(input))
    },
  },
}

export type Operation = {
  argCount: number
  run: (program: Program, args: Argument[]) => void
}

export function readInput() {
  return 1
}
