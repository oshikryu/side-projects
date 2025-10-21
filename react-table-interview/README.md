# Question: Optimizing a Data-Heavy Table Component

This is a claude-generated react/vite project and prompt

You're working on a dashboard that displays a table with 10,000+ rows of data. Users can:

Sort by any column
Filter by multiple criteria
Select individual rows (with checkboxes)
Export selected rows

The current implementation re-renders the entire table on every interaction, causing significant performance issues.
Part 1: Architecture & Optimization

How would you approach optimizing this component? Discuss specific React patterns and APIs you'd use.
What are the trade-offs between virtualization libraries (react-window/react-virtualized) vs. pagination?

Part 2: Implementation Challenge
Design a custom hook useTableData that handles:
