"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var THRESHOLD = 0.01;
var rawData = fs_1.default.readFileSync('test-data.json', 'utf-8');
var data = JSON.parse(rawData);
// 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 2, 3 , ..
// level 0 
// level 1 
// [ ]
// Box A: group 1 0.130
// Box B:         0.121
// Box C:         0.139 group 1
//                  0.009 < 0.01 
// Box B: group 1
// [ 1, 2 , 1]
function generateBounds(data) {
    return data.result.chunks
        .flatMap(function (chunk) { return chunk.blocks; })
        .filter(function (block) { return block.type === 'List Item'; })
        .map(function (block) { return block.bbox; });
}
var boundingBoxes = generateBounds(data);
console.log(JSON.stringify(boundingBoxes, null, 2));
