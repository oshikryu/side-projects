if('function' === typeof importScripts) {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/d3/4.8.0/d3.min.js')
  onmessage = function(e) {
    var data = e.data;
    var type = data.type;
    var arg = data.arg;

    console.log('Message received from main script');
    switch (type) {
      case 'csvFormat':
        // start timer -----------------
        console.log('Posting message back to main script');
        var timeStart = new Date().getTime();
        // -----------------------------

        var res = d3.csvFormat(arg);
        // end timer -------------------
        var timeEnd = new Date().getTime();
        var timeDiff = timeEnd - timeStart;
        console.log('blobbing takes ' + timeDiff + ' ms to run');
        // -----------------------------

        postMessage({
          type: type,
          data: res,
        });

        break;
      case 'blobber':
        // start timer -----------------
        console.log('Posting message back to main script');
        var timeStart = new Date().getTime();
        // -----------------------------

        var blob = new Blob([arg], { type: 'text/csv;charset=utf-8;' });

        // end timer -------------------
        var timeEnd = new Date().getTime();
        var timeDiff = timeEnd - timeStart;
        console.log('blobbing takes ' + timeDiff + ' ms to run');
        // -----------------------------

        postMessage({
          type: type,
          data: blob,
        });
        break;
      default:
        console.error('invalid stuff');
        break;
    }
  }
}
