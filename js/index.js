const refs = {
  taskInput: document.getElementById('newTask'),
  tasksList: document.querySelector('.todo-list'),
  clearBtn: document.querySelector('#clearList')
}
const updateToDoList = (tasksList) => {
  refs.tasksList.innerHTML = '';
  refs.tasksList.insertAdjacentHTML('beforeend', tasksList.map(task => createTaskElement(task)).join(''))
}

const addTaskElement = task => {
  const taskEl = createTaskElement(task)
  refs.tasksList.insertAdjacentHTML('beforeend', taskEl)
}

const updateTaskElement = (task) => {
  const taskEl = refs.tasksList.querySelector(`li[data-taskid="${task.id}"]`)
  
  taskEl.firstElementChild.textContent = task.value
  taskEl.firstElementChild.className = task.state
}

const createTaskElement = task => {
  return `<li class="task-item" data-taskId=${task.id}>
  <span class="${task.state}">${task.value}</span>
  <input type="button" class="confirmTask" data-taskId=${task.id} value="готово">
  <input type="button" class="deleteTask" data-taskId=${task.id} value="видалити">
  <input type="button" class="editTask" data-taskId=${task.id} value="редагувати">
</li>`
}

todo.getAllTask().then(data => {
  updateToDoList(data)
});

refs.taskInput.addEventListener('keyup', e => {
  if(e.key !== "Enter") return
  
  if (todo.currentTaskID) {
    
    todo.updateTask(todo.currentTaskID, {
      value: e.target.value,
    })
    .then(task => {
      updateTaskElement(task)
      todo.setCurrentTask(null)
    })

  } else {
    
    todo.createTask({
      value: e.target.value, 
      state: 'pending'
    })
    .then(task => addTaskElement(task))

  }

  e.target.value = ''
});


refs.tasksList.addEventListener('click', e => {
  const task = new Task(e.target.dataset.taskid)

  switch(e.target.className) {
    case 'editTask': {
      task.editTask();
      break;
    }
    case 'deleteTask': {
      task.deleteTask();
      break;
    }
    case 'confirmTask': {
      task.confirmTask();
      break;
    } 
    default: {
      console.count('no handler')
    }
  }
})

class Task {
  constructor(id) {
    this.id = id
  }

  editTask() {
    todo.getTaskById(this.id)
    .then(task => {
      refs.taskInput.value = task.value;
      todo.setCurrentTask(this.id)
    })
  }

  deleteTask() {
    todo.deleteTask(this.id)
    .then(taskId => {
      refs.tasksList
      .querySelector(`li[data-taskid="${taskId}"]`)
      .remove();
    })
  }

  confirmTask() {
    todo.updateTask(this.id, {state: 'done'})
      .then(task => updateTaskElement(task))
  }
}
