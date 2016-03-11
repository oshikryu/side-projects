/*
1. Binary Search: ​Given an array of sorted integers and an integer, write a function that

returns true if and only if the integer argument exists in the array.

a. Iteratively

b. Recursively

c. with log(n) runtime
*/

function midpoint(imin, imax) {
	var diff = imax - imin;
	return imin + (Math.floor(diff/2));
}

/*
	@method iterativeSearch
	@param array Sorted array
	@param imin index of lowest value
	@param imax index of highest value
*/
function iterativeSearch(array, target, imin, imax) {
	while(imin <= imax) {
		var imid = midpoint(imin, imax);
		if (array[imix] === target) {
			// return imid;
			return true;
		} else if (array[imid] < target) {
			imin += imid + 1;
		} else {
			imax += imid - 1;
		}
	}
	return false;
}

function recursiveSearch(array, target, imin, imax) {
  // test if array is empty
  if (imax < imin) {
  	return false;
  } else {
      var imid = midpoint(imin, imax);
     
      if (array[imid] > target) {
        return recursiveSearch(array, target, imin, imid - 1);
      }
      else if (array[imid] < target) {
        return recursiveSearch(array, target, imid + 1, imax);
      }
      else {
        // return imid;
        return true;
      }
    }	
}



/*
2. Flatten: ​Given a Tree structure (you may choose your interface), write a function that

traverses the tree:

a. in depth first order

b. in breadth first order

*/

function Stack() {
   this.stuff = new Array();

   this.pop = function(){
     return this.stuff.pop();
   }

   this.push = function(item){
     this.stuff.push(item);
   }

   this.peek = function() {
     var last_idx = this.stuff.length - 1;
     if (this.stuff) {
         return this.stuff[last_idx];
     }
   }
 }

//Depth first search
function Node(val){
  this.value = val;
  this.left = null;
  this.right = null;
}

// depth first search preorder recursive
function dfs(node){
	if(node) {
		console.log(node.value);
		dfs(node.left);
		dfs(node.right);
		return arr;
	}
}

var a = new Node('a');
var b = new Node('b');
var c = new Node('c');
var d = new Node('d');
var e = new Node('e');
a.left = b;
a.right = c;
b.left = d;
b.right = e;
/*
      tree
      ----
       a    <-- root
     /   \
    b      c
  /   \      
 d     e      

*/

// run dfs code
dfs(a);


//Breadth first search
function Queue(){
  var queue  = [];
  var offset = 0;

  this.getLength = function(){
    return (queue.length - offset);
  }

  this.isEmpty = function(){
    return (queue.length == 0);
  }

  this.enqueue = function(item){
    queue.push(item);
  }

  this.dequeue = function(){

    if (queue.length === 0) return undefined;

    var item = queue[offset];

    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    return item;

  }

  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

}

function bfs(queue) {
	if (queue.isEmpty()) {
		return;
	}
	var node = queue.dequeue();
	console.log(node)
  if (node.left) {
    queue.enqeueue(node.left);
  }
	if (node.right) {
		queue.enqueue(node.right);
	}
	bfs(queue);
}

var a = new Node('a');
var b = new Node('b');
var c = new Node('c');
var d = new Node('d');
var e = new Node('e');
a.left = b;
a.right = c;
b.left = d;
b.right = e;

// run bfs code
var myQueue = new Queue();
myQueue.enqueue(a);
bfs(myQueue);

/*
7. #include <stdlib.h> ​aka String questions

Strings ­ the standard battery of string functions. not a total fan of this, but it’s

better than fizz­buzz

A. Reverse a string

a. depending on the language, they may need to understand that making a new

String copy is expensive. Or building a new string is expensive because

you’re creating new copies. An efficient implementation would use an

array and the known size of the string or something like that.

B. atoi() ­ convert a string to an integer

C. printf() ­ convert an integer to a string
*/

// reverse
function reverse(str) {
	var reversed = [];
	for (var ii=str.length-1; ii>=0; ii--) {
		reversed.push(str[ii]);
	}
	return reversed.join('');
}

// atoi
function atoi(str) {
	return Number(str);
}

function printf(integer) {
	return String(integer);
}
