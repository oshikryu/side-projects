var myWorker = new Worker('worker.js');
var csvFile, blob;
var clickStart, clickEnd;

function blockingExport(data) {
  console.log('Initiate blocking csv download');
  var res = d3.csvFormat(data);
  var blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
  saveFile(blob);
}

/* This method will use the data from data.js and trigger creation of a csv
 * @method exportMe
 */
function exportMe(data) {
  clickStart = new Date().getTime();
  csvFile = getCSV(data);
}
function getCSV(data) {
  console.log('Data length is: ' + data.length);
  console.info('Starting call for csv format');
  var csvFormatTimeStart = new Date().getTime();
  var csvFile = workerMaker('csvFormat', data);
  var csvFormatTimeEnd = new Date().getTime();
  var csvFormatTime = csvFormatTimeEnd - csvFormatTimeStart;
  console.log('csv format takes ' + csvFormatTime + ' ms to run');
}

function getBlob(csvFile) {
  console.log('creating blob...')
  var blobFormatTimeStart = new Date().getTime();
  var blob = workerMaker('blobber', csvFile);
  var blobFormatTimeEnd = new Date().getTime();
  var blobFormatTime = blobFormatTimeEnd - blobFormatTimeStart;
  console.log('blob format takes ' + blobFormatTime + ' ms to run');
}

function workerMaker(type, arg) {
  if (window.Worker) {
    myWorker.postMessage({type: type, arg: arg});
  }
}

/* Take a blob and force browser to click a link and save it from a download path
 * log out timing
 *
 * @param {Blob}
 * @method saveFile
 */
function saveFile(blob) {
  var uniqTime = new Date().getTime();
  var filename = 'my_file_' + uniqTime;

  if (navigator.msSaveBlob) { // IE 10+
    console.info('Starting call for ' + 'ie download');
    var csvFormatTimeStart = new Date().getTime();

    var ieFilename = filename + '.csv';
    navigator.msSaveBlob(blob, ieFilename);

    var csvFormatTimeEnd = new Date().getTime();
    var csvFormatTime = csvFormatTimeEnd - csvFormatTimeStart;
    console.log('ie download takes ' + csvFormatTime + ' ms to run');
  } else {
    console.info('Starting call for ' + 'regular download');
    var csvFormatTimeStart = new Date().getTime();

    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    var csvFormatTimeEnd = new Date().getTime();
    var csvFormatTime = csvFormatTimeEnd - csvFormatTimeStart;
    console.log('regular download takes ' + csvFormatTime + ' ms to run');
  }

  clickEnd = new Date().getTime();
  console.log('The whole process took: ' + (clickEnd - clickStart) + ' ms');
}

myWorker.onmessage = function(e) {
  console.log('Message received from worker');
  var response = e.data;
  var data = response.data;
  var type = response.type;
  if (type === 'csvFormat') {
    getBlob(data);
  } else if (type === 'blobber') {
    saveFile(data);
  } else {
    console.error('you dun goofed')
  }
}
