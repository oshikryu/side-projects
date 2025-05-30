// # Introduction
// # The goal of this interview is to create a task scheduler, essentially a to-do list to keep track of activities and tasks. We'll build it step by step. With each step building on top of the previous one. 

// # Part 1
// # In this initial phase, our objective is to establish the core functionality of the scheduler. Specifically, we aim to create three base methods: 
// # Receive a new task and add it to the to-do list 
// # Fetch an uncompleted task.
// # Accepts a task and mark it as completed 

// Part 2
// # Next, we're introducing the concept of task dependency, which will ensure tasks are completed in the correct order. We want to enable the possibility of providing a list of dependencies when creating a new task, implying that this task will only become available once all the tasks it depends on are completed. The task scheduler should be updated to handle this so that every call to get_next_task will only return tasks that have all of their dependencies completed.


class Task {
  name = ""
  isComplete = false
  // 
  dependencies = []

  constructor(name, dependencies=[]) {
    this.name = name;
    this.dependencies = dependencies;
  }

  setIsComplete = (isComplete) => {
    this.isComplete = isComplete
  }
}

class Todo {
  tasks = []
  currentTaskIdx = 0;

  addTask = (task) => {
    this.tasks.push(task)
  }

  completeTask = (task) => {
    task.setIsComplete(true)
    console.log(`Completed ${task.name}`)
  }

  getNextTask = () => {
    // TODO: check the tasks length, it doesn't get invalid with length === 0
    const curTask = this.tasks[this.currentTaskIdx]

    // check for dependencies
    console.log(curTask.name)
    this.currentTaskIdx += 1
    return curTask
  }

  getCompletionPlanFor = (completionTask) => {
    const runningDepList = []
    let finalList = []

    const getDependencyHelper = (task) => {
      return task.dependencies.filter((tt) => !tt.isComplete)
    }

    let filtered = this.tasks.forEach((task, idx) => {
      if (task.dependencies.length > 0 && idx !== 0 ) {
        // check completion
        finalList.push(...getDependencyHelper(task).flat())
      }
      if (!task.isComplete) {
        finalList.push(task)
      }
    })
    console.log(finalList)


    return finalList
  }
}


// PART 1
const todo = new Todo()
const helloTask = new Task("Say hello")
todo.addTask(helloTask)
// console.log(todo.tasks[0].name)
let nextTask = todo.getNextTask() // Should be helloTask
todo.completeTask(nextTask)
// console.log(todo)

// PART 2

const getIdTask = new Task("Get event ID");
todo.addTask(getIdTask);
const getSwagTask = new Task("Get swag");
todo.addTask(getSwagTask);
let brainstormTask = new Task("Participate on brainstorming", [getIdTask, getSwagTask]);
todo.addTask(brainstormTask);

nextTask = todo.getNextTask(); // Should be getIdTask or getSwagTask
todo.completeTask(nextTask);
nextTask = todo.getNextTask(); // Should be getIdTask or getSwagTask
todo.completeTask(nextTask);
nextTask = todo.getNextTask(); // Should be brainstormTask
todo.completeTask(nextTask);

// PART 3
const checkinTask = new Task("Checkin at the hotel");
todo.addTask(checkinTask);
const getIdTask2 = new Task("Get event ID", [checkinTask]);
todo.addTask(getIdTask);
const getSwagTask2 = new Task("Get swag", [checkinTask]);
todo.addTask(getSwagTask);
brainstormTask = new Task("Participate on brainstorming", [getIdTask2, getSwagTask2])
todo.addTask(brainstormTask)

// Should be [checkin_task, get_id_task, get_swag_task, brainstorm_task] or [checkin_task, get_swag_task, get_id_task, brainstorm_task]
const plan = todo.getCompletionPlanFor(brainstormTask)
console.log("------\n")
console.log(plan)
