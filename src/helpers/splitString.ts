export function splitString(str: string, index: number): [string, string] {
  return [str.substring(0, index), str.substring(index)]
}
