## CSV export (with webworkers)
### Description of code
The output for time logging is all in the console.

Timing based on 4 columns (x and y keys in an array called `data`). The data imported is generated into lists of 100k, 200k, and 2 million points

To see that webworkers are non-blocking, there is a textarea input you should be able to type in
while the workers are exporting data

Modify the data array with the following format:
```
var data = [
	{
		x: 1,
		y: 2,
	}
]
```

## To run
You must have a python server running
python -m SimpleHTTPServer 3434

A webserver is required to reference webworker files in the browser due to cross-site requirements

### Access the web app at
```
http://localhost:3434/index.html
```
