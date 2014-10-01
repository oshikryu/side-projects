function doResult1(callback) {
    $.ajax({
        url: 'http://brlewis.com/demo/random.html?1',
        success: function(result) {
            $('p').append('First: ' + result + '. ');
            callback(result);
        }
    });
}

function doResult2(callback) {
    $.ajax({
        url: 'http://brlewis.com/demo/random.html?2',
        success: function(result) {
            $('p').append('Second: ' + result + '. ');
            callback(result);
        }
    });
}

function getTotal(a, b) {
    $('p').append('Total: ' + (a + b));
}

// funA and funB are functions that take one
// argument, which is a callback called with
// an asynchronously-derived result.
// Once funA and funB have run, pass their
// return values as arguments to callback.
function join(funA, funB, callback) {
    var resolved = [];
    var defer = $.Deferred();
    var counter = 0;
    var res1, res2;
    funA(function(result) {
      res1 = result;
      counter += 1;
      areTheyDone(defer, counter);
    });
    
    funB(function(result) {
      res2 = result;
      counter += 1;
      areTheyDone(defer, counter);
    });
    
    // something when they both return
    function areTheyDone(defer, counter) {
       if (counter < 2) {
         return false;
       }
       else {
         defer.resolve();
       }
    }

    
    defer.done(function() {
       callback.call(this, res1, res2);
    });
    
}

join(doResult1, doResult2, getTotal);
