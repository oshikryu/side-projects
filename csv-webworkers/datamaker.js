var regData = data;
var doubleData = data.concat(data);
var doubleCompareData = compareData.concat(compareData);
var millionData = [];
for (var idx=0; idx < 10; idx += 1) {
  millionData = millionData.concat(doubleCompareData);
}
