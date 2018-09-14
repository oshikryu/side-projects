/* 
getNthLeaf

                       A
                B          C
               /| \        /   \
              D E F        G   H
                         J K
                         
A, 0 => D
A, 1 => E
A, 3 => J

    A
 B    C

non-working solution

 */

function Node(val) {
  this.root = val;
  this.children = [];
}

function Stack() {
  this.list = new Array();
  
  this.pop = function() {
    return this.list.pop();
  }
  
  this.push = function(val) {
    this.list.push(val)
  }
  
  this.peek = function() {
    let len = this.this.list.lengt;
    if (len >= 0) {
      return this.list[len].root;
    }
  }
}

function getNthLeaf(node, n) {
  var inc = n;
  function getNthLeafHelper(node) {
    if (node) {
      if (inc === 0) {
        if (!node.children.length) {
          console(node.root)
          return node.root;
        } else {
          for (let ii=0; ii < node.children.length-1; ii+=1) {
            getNthLeaf(node.children[ii], inc);
          }
        }
      }

      if (!node.children.length) {
        console(node.root)
        if (inc > 0) {
          inc -= 1;
          return getNthLeaf(node, inc);
        } else {
          return node.root;
        }
      } else {
        for (let ii=0; ii < node.children.length-1; ii+=1) {
          getNthLeaf(node.children[ii], inc);
        }
      }
    }
  }
  
  return getNthLeafHelper(node);
}
 

let nodeA = new Node('A');
a.left = new Node('B');
a.right = new Node('C');
let stack = new Stack();

stack.push(nodeA);


  this.left = null;
  this.right = null;
left && !node.right    console(node.root)
    getNthLeaf(node.left, inc - 1);
    getNthLeaf(node.right, inc - 1);
