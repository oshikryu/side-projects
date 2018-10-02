/* 

# Implement a function to reverse an array
# For example reverse( [1,2,3,4,5] ) should return [5,4,3,2,1]
for [1,2,3,4,5]:
    
 */


function reverse(inputArray) {
    let arr = []
    inputArray.forEach((idx) => {
      arr.unshift(idx);
    });
    console.log(arr);
    return arr;
}

reverse([1,2,3,4,5])


// in place reverse
function inPlaceReverse(inputArray) {
  const len = inputArray.length;
  const isEven = len % 2 === 0;
  
  if (len === 0) {
      console.log('[]');
      return [];
  }
  
  const lastIdx = len - 1;
  const middleLength = isEven ? lastIdx / 2 : Math.floor(lastIdx / 2);

  for(let i=0;  i < middleLength; i+=1) {
      const holderVal = inputArray[i];
      inputArray[i] = inputArray[lastIdx - i];
      inputArray[lastIdx - i] = holderVal;
  }

  console.log(inputArray);
  return inputArray;
}

inPlaceReverse([]);
inPlaceReverse([1]);
inPlaceReverse([5,4,3,2,1]);

// Implement square root

function squareRoot(val) {
    
    function findUpperBound(val) {
      let lastGoodValue = 0;
      for (let i=0; i<=val; i+=1) {
        // squared
        const potentialRootSquare = Math.pow(i, 2);
        if (potentialRootSquare < val) {
          lastGoodValue = i;
        } else {
          console.log(lastGoodValue)
          return {
              lowerBound: lastGoodValue,
              upperBound: i
          };
        }
      }
    }
  
    function rootFinder(matchVal, {lowerBound, upperBound}, incVal = 1) {
        for (let idx=lowerBound; idx<=upperBound; idx += incVal) {
          if (Math.pow(idx, 2) === matchVal) {
              console.log('found it');
              console.log(`incVal:${incVal} index:${idx}`);
              return idx;
          }
            console.log(`incVal:${incVal} index:${idx}`);
        }
        
        let midpoint = (upperBound + lowerBound) / 2;
        
        // if (midpoint >= incVal) {
        //     midpoint = midpoint / 2 ;
        // }
        // does not work for 2
        
        const newInc = incVal / 10;
        return rootFinder(matchVal, {lowerBound, upperBound}, newInc);
    }
    
    const boundaries = findUpperBound(val);
    const rootVal = rootFinder(val, boundaries);
    console.log(rootVal);
    return rootVal;
}

    
squareRoot(2);