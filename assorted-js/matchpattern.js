/*
matchPattern(pattern: int[], candidate: string) → boolean
[1, 2, 1, 2], "cat dog cat dog" → true
[1, 2, 3, 2, 1], "dog ant cat ant dog" → true
[1, 2, 3, 2, 1], "dog ant cat dog dog" → false

[1, 2, 3, 1, 1], "dog ant cat dog dog" → true

// orig
[1, 2, 3, 400000], "ant ant ant ant" → true

// ex
[1, 2, 3, 400000], "Ant ant ant ant" → true
[1, 2, 3, 400000], "ont ant ant ant" → true
[2, 2, 3, 400000], "ont ant ant ant" → false

[1, 2, 3, 400000, 400000], "ant ant ant ant falcon" → false
// ex 2
[1, 2, 3, 400000, 400000], "ant ant ant ant falcon" → false
// ex 3
[1, 2, 3, 400000, 400000, 5], "ant ant ant ant falcon" → false

// falcon -> 400000
// ant - > [1,2,3,400000]
*/


/*

@param {Array}
@param {String}
@ return {boolean}

*/
const matchPattern = (pattern=[], candidate) => {
  
  const origLength = pattern.length;  
  const checkUnique = new Set(pattern);
  const checkUniqueArr = Array.from(checkUnique);
  
  if (origLength === checkUniqueArr.length) {
    return true;
  }
  
  // pattern diff
  // pattern [1,2,3]
    // aaaaaaaaaaaaaaaa a a a a
  const candidateArr = candidate.split(' ');
  
  if (pattern.length !== candidateArr.length) {
    return false;
  }
  
  const uniqueCandidateMap = {};
  candidateArr.forEach((val, idx) => {
    uniqueCandidateMap[val] = pattern[idx];
  });
  
  let doesMatchPattern = false;
  const matchChecks = candidateArr.map((val, idx) => {
    return uniqueCandidateMap[val] === pattern[idx];
  });
  
  return !matchChecks.includes(false);
};


console.log("last")
console.log(matchPattern([1, 2, 3, 400000], "ant ant ant ant"));

const res1 = matchPattern([1, 2, 1, 2], "cat dog cat dog");
console.log('test1', res1);


const res2 = matchPattern([1, 2, 3, 2, 1], "dog ant cat ant dog");
console.log('test2', res2);


const res3 = matchPattern([1, 2, 3, 400000, 400000, 5], "ant ant ant ant falcon");
console.log('test3', res3);


/*
matchPattern2(pattern: int[][], candidate: string) → boolean
[ [1, 2], [2, 3], [1, 3] ], "dog cat ant" → true 
[ [1, 2], [2], [1, 2] ], "ant cat falcon" → false
// checking ant
// ant: 
const existingVals = [[1,2], [2]]
{
ant: [1,2],
cat: [2],

}
[ [1, 3], [2], [1, 2] ], "ant cat falcon" → true
[ [1, 2], [1], [1, 2] ], "dog cat cat" → true
[ [1, 2], [3], [1, 2] ], "dog cat cat" → true
[ [1, 2], [2], [1, 2], [1, 2, 400000] ], "cat cat dog ant" → true
*/


//  matchPattern2([ [1, 2], [2, 3], [1, 3] ], "dog cat ant"): true
    // ----> 1,2,3 OR 2,3,1 are OK
// arg1 101 matchPattern2(1,2,3) ==> true
