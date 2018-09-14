## CSV export (with webworkers)
Timing based on 4 columns (x, y, _cycle, and compare_by)
The data imported is generated into lists of 50k, 100k, 50k (compare by), 100k (compare by), and 1
million (compare by)


Time logging is all in the console.

To see that webworkers are non-blocking, there is a textarea input you should be able to type in
while the workers are firing away


NOTE: you need to provide your own data files as defined in datamaker.js
Requires that data files with the format:

var data = [
	{
		x: 1,
		y: 2,
	}
]

are supplied



## To run
You must have a python server running
python -m SimpleHTTPServer 3434

A webserver is required to reference webworker files in the browser due to cross-site requirements