var counter = 0;
var data = [];
while (counter < 100000) {
  data.push({
    x: counter,
    y: counter,
  });
  counter += 1;
};

var regData = data;
var doubleData = data.concat(data);
//var doubleCompareData = compareData.concat(compareData);
var millionData = [];
for (var idx=0; idx < 10; idx += 1) {
  millionData = millionData.concat(doubleData);
}
