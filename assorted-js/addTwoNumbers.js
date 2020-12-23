var addTwoNumbers = function(l1, l2) {
    let node = null
    const carry = arguments[2]
    if (l1 || l2) {
        const val1 = l1 ? l1.val : 0
        const val2 = l2 ? l2.val : 0
        const next1 = l1 ? l1.next : null
        const next2 = l2 ? l2.next : null
        const val = carry ? val1 + val2 + 1 : val1 + val2
        node = new ListNode(val % 10)
        node.next = addTwoNumbers(next1, next2, val >= 10)  
    } else if (carry) {
        node = new ListNode(1)
        node.next = null
    }
    return node
};

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
