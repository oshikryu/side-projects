// unbiased shuffle
function shuf(arr) {
  for (var i=0; i<arr.length; i++) {
    var rand = Math.floor(Math.random() * (arr.length - i) + i);
    var temp = arr[i];    
    arr[i] = arr[rand];
    arr[rand] = temp;
  }
  return arr;
}
 
// flatten a nested array
function flattenHelper(list) {
  
  //assuming array
  if (list.length > 0) {
    var tempList = [];
    for (var i=0; i<list.length; i++) {
      var res = flattenHelper(list[i]);
      if (res.length > 0) {
        tempList = tempList.concat(res);
      }
      else {
        tempList.push(res);
      }
    }
    return tempList;
  }
  // assuming just number
  else {
    return list;
  }
  // returns an array of numbers
}
 
function flatten(inputList) {
  var bucket =[];
  for (var i=0; i<inputList.length; i++) {
    // console.log(inputList[i])
    var res = flattenHelper(inputList[i]);
    bucket = bucket.concat(res)
  }
  console.log(bucket);
  return bucket;
}
