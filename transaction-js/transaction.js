class Database {
  constructor() {
    this.db = {}
    this.transactions = [] // Stack of transaction states
  }

  get(key) {
    // Check transactions from most recent to oldest
    for (let i = this.transactions.length - 1; i >= 0; i--) {
      if (this.transactions[i].hasOwnProperty(key)) {
        return this.transactions[i][key]
      }
    }
    // If not in any transaction, return from main db
    return this.db[key]
  }

  set(key, value) {
    if (this.transactions.length > 0) {
      // If in a transaction, set in the most recent transaction
      this.transactions[this.transactions.length - 1][key] = value
    } else {
      // If not in a transaction, set in main db
      this.db[key] = value
    }
  }

  delete(key) {
    if (this.transactions.length > 0) {
      // Mark as deleted in transaction by setting to undefined
      this.transactions[this.transactions.length - 1][key] = undefined
    } else {
      const exists = Object.keys(this.db).indexOf(key) > -1;
      if (exists) {
        delete this.db[key]
      }
    }
  }

  beginTransaction() {
    // Push a new transaction state onto the stack
    this.transactions.push({})
  }

  commit() {
    if (this.transactions.length === 0) {
      throw new Error('No transaction to commit')
    }

    const currentTransaction = this.transactions.pop()

    if (this.transactions.length > 0) {
      // If there's a parent transaction, merge changes into it
      const parentTransaction = this.transactions[this.transactions.length - 1]
      for (let key in currentTransaction) {
        parentTransaction[key] = currentTransaction[key]
      }
    } else {
      // If no parent transaction, commit to main db
      for (let key in currentTransaction) {
        if (currentTransaction[key] === undefined) {
          delete this.db[key]
        } else {
          this.db[key] = currentTransaction[key]
        }
      }
    }
  }

  rollback() {
    if (this.transactions.length === 0) {
      throw new Error('No transaction to rollback')
    }
    // Simply discard the most recent transaction
    this.transactions.pop()
  }
}


// Test the nested transaction example
const db = new Database()

console.log('GET("A"):', db.get("A")) // undefined
db.set("A", "123")
console.log('SET("A", "123")')

db.beginTransaction() // Transaction C
console.log('BEGIN_TRANSACTION() // C')

console.log('GET("A"):', db.get("A")) // 123
db.set("A", "456")
console.log('SET("A", "456")')
console.log('GET("A"):', db.get("A")) // 456

db.beginTransaction() // Transaction B
console.log('BEGIN_TRANSACTION() // B')

console.log('GET("A"):', db.get("A")) // 456
db.set("A", "999")
console.log('SET("A", "999")')
console.log('GET("A"):', db.get("A")) // 999

db.commit()
console.log('COMMIT() // B commits to C')
console.log('GET("A"):', db.get("A")) // 999

db.rollback()
console.log('ROLLBACK() // C rolls back everything including B')
console.log('GET("A"):', db.get("A")) // 123
