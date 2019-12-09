import { getInput } from "../../helpers/getInput"

function parseLayers(input: string, width: number, height: number) {
  const layerRegex = new RegExp(`\\d{${width * height}}`, "g")
  const rowRegex = new RegExp(`\\d{${width}}`, "g")
  const layers = input
    .match(layerRegex)
    ?.map(layer => [...layer.match(rowRegex)!])

  return layers
}

async function partOne() {
  const puzzleInput = await getInput(__dirname)

  const layers = parseLayers(puzzleInput, 25, 6)?.map(layer => layer.join(""))

  const layerData = layers?.map(([...pixels]) => {
    const zeroes = pixels.reduce(
      (t, pixel) => (pixel === "0" ? (t += 1) : t),
      0
    )

    const oneCount = pixels.reduce(
      (t, pixel) => (pixel === "1" ? (t += 1) : t),
      0
    )
    const twoCount = pixels.reduce(
      (t, pixel) => (pixel === "2" ? (t += 1) : t),
      0
    )

    return {
      zeroes,
      onesTwos: oneCount * twoCount,
    }
  })

  console.log(layerData?.sort((a, b) => a.zeroes - b.zeroes).shift())
}

async function partTwo() {
  const puzzleInput = await getInput(__dirname)

  const layers = parseLayers(puzzleInput, 25, 6)

  const raster = layers?.reduce((__, layer, _, layers) => {
    return layer.map(([...row], ri) => {
      return row
        .map((_, ci) => {
          for (const layer of layers) {
            const finalPixel = layer[ri][ci]
            if (finalPixel !== "2") return finalPixel
          }
          return "?"
        })
        .join("")
    })
  })

  console.log(raster?.join("\n"))
}

partOne()
partTwo()

// 1110001100100011001011100
// 1001010010100011010010010
// 1001010000010101100010010
// 1110010000001001010011100
// 1010010010001001010010100
// 1001001100001001001010010
