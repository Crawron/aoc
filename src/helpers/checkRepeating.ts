export function checkRepeating(n: string): boolean {
  return /(.)\1/.test(n)
}
