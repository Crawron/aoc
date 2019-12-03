// https://adventofcode.com/2019/day/1

export const calculateModuleFuel = (moduleMass: number) =>
  Math.max(Math.floor(moduleMass / 3) - 2, 0)

// Part 1
export function calculateInitialFuel(massList: number[]) {
  return massList.reduce((total, mass) => total + calculateModuleFuel(mass), 0)
}

// Part 2
export function calculateTotalFuel(massList: number[]) {
  return massList.reduce((total, mass) => {
    let totalModuleFuel = 0
    let fuelRequired = calculateModuleFuel(mass)

    do {
      totalModuleFuel += fuelRequired
      fuelRequired = calculateModuleFuel(fuelRequired)
    } while (fuelRequired > 0)

    return total + totalModuleFuel
  }, 0)
}
