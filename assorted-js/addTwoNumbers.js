
//
// not working solution

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Does not work due to number representation limit
 *
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    const num1 = []
    while (l1 && l1.next || l1 && l1.next == null && !isNaN(l1.val)) {
        const val = l1.val
        num1.unshift(val)
        l1 = l1.next
    }
    
    let num1String = ""
    num1.forEach((val) => {
        num1String += val
    })
    
    const num2 = []
    while (l2 && l2.next || l2 && l2.next == null && !isNaN(l2.val)) {
        const val = l2.val
        num2.unshift(val)
        l2 = l2.next
    }

    let num2String = ""
    num2.forEach((val) => {
        num2String += val
    })
    
    const sum = Number(num1String) + Number(num2String)
    const stringSum = sum.toString()
    const head = createNodes(stringSum)
    return head
};

function createNodes(stringSum, curNode) {
    if (stringSum.length === 0) {
        return curNode
    }
    
    const val = Number(stringSum[0])
    if (curNode == null) {
        const newNode = new ListNode(val)
        return createNodes(stringSum.slice(1), newNode)
    } else {
        const nextNode = new ListNode(val, curNode)
        return createNodes(stringSum.slice(1), nextNode)
    }
}
