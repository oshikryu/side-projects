

import React, { useState } from 'react';
import './App.css';

/**
 * Question 1:
 *
 * Create a custom hook named `useSum` that returns an array containing:
 *   (1) the sum of two numbers
 *   (2) a function that updates the sum based on two new numbers
 *
 * After defining the hook, use it inside the App component to:
 *   - Display the current sum
 *   - Update the sum when a button is clicked
 *
 * Example usage:
 *
 *   const [sum, updateSum] = useSum(1, 2); // sum is 3
 *   updateSum(3, 4); // sum becomes 7
 */




 export function useSum(firstNum, secondNum) {
  const [sum, setSum] = useState(firstNum + secondNum)
  const updateSum = (a, b) => {
    setSum(a + b)
  }
  return [sum, updateSum];
}


export default function App() {
  const [sum, updateSum] = useSum(1, 2)

  return (
    <div className="App">
      <h1>Sum: {sum}</h1>
      <button onClick={() => updateSum(3,4)}>
          Update Sum
        </button>
    </div>
  );
}
