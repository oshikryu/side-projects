const _ = require('lodash');
const fs = require('fs');
const THRESHOLD = 0.01
const rawData = fs.readFileSync('test-data.json', 'utf-8')
const data = JSON.parse(rawData)

type Chunk = {
  blocks: Block[]
}
type Block = {
  type: string
  bbox: Bbox
}
type Bbox = {
  left: number
  top: number
  width: number
  height: number
}

// 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 2, 3 , ..
// level 0 
// level 1 
// [ ]

// Box A: group 1 0.130
// Box B:         0.121
// Box C:         0.139 group 1
//                  0.009 < 0.01 
// Box B: group 1

function generateBounds(data: { result: { chunks: Chunk[] } }): Bbox[] {
  return data.result.chunks
    .flatMap((chunk: Chunk) => chunk.blocks)
    .filter((block: Block) => block.type === 'List Item')
    .map((block: Block) => block.bbox)
}

function determineIndentLevels(boxes: Bbox[]): number[] {
  const lefts = boxes.map(b => b.left)

  // Find distinct left groups by sorting and clustering within THRESHOLD
  const sorted = [...new Set(lefts)].sort((a, b) => a - b)
  const groups: number[] = [] // representative value for each group

  for (const val of sorted) {
    const existing = groups.find(g => Math.abs(g - val) <= THRESHOLD)
    if (!existing) {
      groups.push(val)
    }
  }

  groups.sort((a, b) => a - b)

  // Map each box's left value to its indentation level
  return lefts.map(left => {
    return groups.findIndex(g => Math.abs(g - left) <= THRESHOLD)
  })
}

const boundingBoxes = generateBounds(data)
const levels = determineIndentLevels(boundingBoxes)

boundingBoxes.forEach((box, i) => {
  console.log(`level ${levels[i]} | left: ${box.left.toFixed(4)}`)
})
