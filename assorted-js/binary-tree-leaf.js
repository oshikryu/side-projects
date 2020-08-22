class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

let treeList = [];
let newIndex = 0;
/**
 * Take a node from a tree and print the reverse dfs
 *
 * @param node {Node}
 * @param index {Number} - optional
 * @method fetchLeaf
 * @return {void}
 */
const fetchLeaf = (node, index=0) => {
  console.log(`current data node: ${node.data}`);
  console.log(`index level ${index}`);
  if (node.left == null && node.right == null) {
    if (treeList[index] != null) {
      treeList[index].push(node.data);
    } else {
      treeList[index] = [node.data];
    }
    node.data = null;
    return index;
  }

  if (node.left) {
    fetchLeaf(node.left, index); 
    node.left = null;
  }

  if (node.right) {
    fetchLeaf(node.right, index); 
    node.right = null;
  }
  newIndex += 1;
  console.log(`Place ${node.data} in ${newIndex}`);

  fetchLeaf(node, newIndex);
};

/*
 * Example 1
 *
 *      1
 *     / \
 *    2   3
 *   / \
 *  4   5
 *
 *  output = [[4,5,3], [2], [1]]
 */

const node = new Node(1)
node.left = new Node(2);
node.right = new Node(3);
node.left.left = new Node(4);
node.left.right = new Node(5);

//console.log('\n----------')
//console.log('Example 1');
//fetchLeaf(node);
//console.log(treeList);
//console.log('\n----------')

/*
 * Example 2
 *
 *      1
 *     / \
 *    2   3
 *   /     \
 *  4       5
 *         / \
 *        6   7
 *  output = [[4, 6, 7], [2, 3, 5], [1]]
 */

const nodeA = new Node(1)
nodeA.left = new Node(2);
nodeA.left.left = new Node(4);
nodeA.right = new Node(3);
nodeA.right.right = new Node(5);
nodeA.right.right.left = new Node(6);
nodeA.right.right.right = new Node(7);

//console.log('\n----------')
//console.log('Example 2');
//treeList = [];
//fetchLeaf(nodeA);
//console.log(treeList);
//console.log('\n----------')

/*
 * Example 3
 *
 *       1
 *     /   \
 *    2     3
 *   /       \
 *  4         5
 *   \       / \
 *     8    6   7
 *              
 *  output = [[4, 6, 7], [4, 5], [2,3] [1]]
 */

const nodeB = new Node(1)
nodeB.left = new Node(2);
nodeB.left.left = new Node(4);
nodeB.left.right = new Node(8);
nodeB.right = new Node(3);
nodeB.right.right = new Node(5);
nodeB.right.right.left = new Node(6);
nodeB.right.right.right = new Node(7);

console.log('\n----------')
console.log('Example 2');
treeList = [];
fetchLeaf(nodeB);
console.log(treeList);
console.log('\n----------')
