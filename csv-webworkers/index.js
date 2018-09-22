var myWorker = new Worker('worker.js');
var csvFile, blob;
var clickStart, clickEnd;

function blockingExport(data) {
  console.log('Initiate blocking csv download');
  var res = d3.csvFormat(data);
  var blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
  saveFile(blob);
}

/* This method will use the data passed in and trigger an export
 * with the csv conversion process offloaded to a worker
 *
 * @param {Array} data - e.g. [{x: 1, y: 1}]
 * @method nonBlockingExport
 * @return {Undefined}
 */
const nonBlockingExport = (data) => {
  clickStart = new Date().getTime();
  getCSV(data);
}

/* This method will call the worker with a particular type that maps to a callback to format the csv
 *
 * @param {Array} data - e.g. [{x: 1, y: 1}]
 * @method getCSV
 * @return {Undefined}
 */
const getCSV = (data) => {
  console.log('Data length is: ' + data.length);
  console.info('Starting call for csv format');
  const csvFormatTimeStart = new Date().getTime();
  const csvFile = workerMaker('csvFormat', data);
  const csvFormatTimeEnd = new Date().getTime();
  const csvFormatTime = csvFormatTimeEnd - csvFormatTimeStart;
  console.log('csv format takes ' + csvFormatTime + ' ms to run');
}

/* This method will call the worker with a particular type that maps to a callback to create a blob
 *
 * @param {File} csvFile
 * @method getBlob
 * @return {Undefined}
 */
const getBlob = (csvFile) => {
  console.log('creating blob...');
  const blobFormatTimeStart = new Date().getTime();
  const blob = workerMaker('blobber', csvFile);
  const blobFormatTimeEnd = new Date().getTime();
  const blobFormatTime = blobFormatTimeEnd - blobFormatTimeStart;
  console.log('blob format takes ' + blobFormatTime + ' ms to run');
}

/* Take a blob and force browser to click a link and save it from a download path
 * log out timing
 *
 * @param {Blob}
 * @method saveFile
 */
function saveFile(blob) {
  const uniqTime = new Date().getTime();
  const filename = `my_file_${uniqTime}`;

  if (navigator.msSaveBlob) { // IE 10+
    console.info('Starting call for ' + 'ie download');
    const csvFormatTimeStart = new Date().getTime();

    const ieFilename = `${filename}.csv`;
    navigator.msSaveBlob(blob, ieFilename);

    const csvFormatTimeEnd = new Date().getTime();
    const csvFormatTime = csvFormatTimeEnd - csvFormatTimeStart;
    console.log('ie download takes ' + csvFormatTime + ' ms to run');
  } else {
    console.info('Starting call for ' + 'regular download');
    const csvFormatTimeStart = new Date().getTime();
    let link = document.createElement("a");
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

    const csvFormatTimeEnd = new Date().getTime();
    const csvFormatTime = csvFormatTimeEnd - csvFormatTimeStart;
    console.log('regular download takes ' + csvFormatTime + ' ms to run');
  }

  clickEnd = new Date().getTime();
  console.log('The whole process took: ' + (clickEnd - clickStart) + ' ms');
}

const workerMaker = (type, arg) => {
  // check if a worker has been imported
  if (window.Worker) {
    myWorker.postMessage({type, arg});
  }
}

myWorker.onmessage = function(e) {
  console.log('Message received from worker');
  const response = e.data;
  const data = response.data;
  const type = response.type;
  if (type === 'csvFormat') {
    getBlob(data);
  } else if (type === 'blobber') {
    saveFile(data);
  } else {
    console.error('An Invalid type has been passed in');
  }
}
