/**
 * Map grade key to a value for sorting purposes later
 * 
 * @property {Object}
 */
const GRADE_MAP = {
    'A+': 4.3,
    'A': 4,
    'A-': 3.67,
    'B+': 3.33,
    'B': 3,
    'B-': 2.67,
    'C+': 2.33,
    'C': 2,
    'C-': 1.67,
    'D+': 1.33,
    'D': 1,
    'D-': 0.67,
    'F': 0,
};

/*
 * Complete the 'sort_grades' function below.
 *
 * The function is expected to return a STRING_ARRAY.
 * The function accepts STRING_ARRAY unsorted_grades as parameter.
 * 
 * Take the string input and validate the inputs (unsorted)
 * 
 * Take validated but unsorted array and assign numerical values to the key. Then, sort the array based on the key's numerical value.
 * Once there is a sorted array of objects with keys and values, extract the keys and return a string
 * 
 * NOTES:
 * check if the key is valid
 * 
 * A few test cases:
 * 
 * 1. Just letter grades,
 * 2. Just +/- within a grade
 * 3. Letter grades including +/-
 * 
 * return Highest to lowest
 */

// const unsorted_grades = ['A', 'B', 'C'];
// const bad_grades = ['J', 'A'];
// const bad_grades_2 = ['A*'];

function sort_grades(unsorted_grades) {
  if (!(unsorted_grades instanceof Array)) {
      // raise error?
      return [];
  }
  // 1. validate unsorted_grades
  const validated = validateGrades(unsorted_grades);
  
  // 2. create array of grade objects with values
  const mapped = mapGrades(validated);

  // 3. sort function
  const sorted = sortGrades(mapped);

  // 4. map back to strings
  return sorted.map((g) => g.key);
}

/**
 * Take the unsorted grade objects and reorder them by value
 * 
 * @method sortGrades
 * @return {Array}
 */
const sortGrades = (mapped_grades=[]) => {
    return mapped_grades.sort(function(a,b) {
        return b.value - a.value;
        // what about equal numbers?
    });
}

/**
 * return grades as objects
 *
 * e.g. [{key: 'A', value: 4}]
 * 
 * @param {Array} grades
 * @method mapGrades
 * @return {Array}
 */
const mapGrades = (grades=[]) => {
    return grades.map((g) => {
        return {
            key: g,
            value: GRADE_MAP[g],
        };
    });
}

/**
 * Check if each str in array is valid. Only parse keys that exist in GRADE_MAP
 * 
 * @param {Array} unsorted grades
 * @method validateGrades
 */
const validateGrades = (unsorted_grades=[]) => {
    const validGrades = [];
    unsorted_grades.forEach((grade) => {
        // think about upper-casing here
        const upperCased = grade.toUpperCase();
        if (upperCased in GRADE_MAP) {
            validGrades.push(grade);
        }
    });
    return validGrades;
}


