# This task is to create a data structure to represent a boolean predicate (there is an example of a boolean predicate in string form below), which can be used to filter
#
# Example boolean predicate:
# ```
# "duration > 3600 AND (loss < 19.2 OR val_acc > 0.9)"
# ```
#
# There are two tasks in this exercise:
#   1) Define a data structure that allows the specification of this predicate in code.
#   2) Create a function that performs filtering of example data, given a predicate using your representation from task 1.
#
# The data is constrained to the following:
#    - data is a list of rows
#    - each row is a set of key-value pairs
#    - all values are stored as floats
#
# Example data:
# ```
# const data = [
#     {'a': 14.0, 'loss': 19.9, 'value3': 6},
#     {'b': 9, 'loss': 25.0, 'accuracy': 45, 'duration': 3500}
# ]
# ```
#
# You should support ">" and "<" comparisons. The predicate should support boolean combinations of sub-clauses.
#
# You do not need to worry about parsing the string representation above.
# Instead just think about how to represent the predicate as structured data.

# Example data
data = [
    {'a': 14.0, 'loss': 19.9, 'value3': 6},
    {'b': 9, 'loss': 25.0, 'accuracy': 45, 'duration': 3500},
    {'duration': 3700, 'loss': 18.0, 'val_acc': 0.91}
]

# Example predicate (duration > 3600 AND (loss < 19.2 OR val_acc > 0.9))
predicate = {
  "left": {
    "left": "duration",
    "op": ">",
    "right": 3600,
  },
  "op": "AND",
  "right": {
    "left": {
      "left": "loss",
      "op": "<",
      "right": 19.2,
    },
    "op": "or",
    "right": {
      "left": "val_acc",
      "op": ">",
      "right": 0.9,
    }
  }
}

def evaluate_predicate(predicate, row):
  if isinstance(predicate["left"], str):
    key = predicate["left"]
    row_val = row.get(key)
    if row_val is None:
        return False

    op = predicate["op"]
    value = predicate["right"]

    if op == ">":
      return row_val > value
    elif op == "<":
      return row_val < value
    else:
      raise ValueError("bad operator")
  else:
    left_result = evaluate_predicate(predicate["left"], row)
    right_result = evaluate_predicate(predicate["right"], row)
    op = predicate["op"].upper()

    if op == "AND":
        return left_result and right_result
    elif op == "OR":
        return left_result or right_result
    else:
        raise ValueError(f"Unsupported boolean op: {op}")


def filter_data(data, predicate):
  return [row for row in data if evaluate_predicate(predicate, row)]

result = filter_data(data, predicate)
print(result)
