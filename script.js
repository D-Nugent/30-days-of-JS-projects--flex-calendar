// Expand Day Logic

// Necessary to prevent listener for firing on load
let isFirstLoad = true;
let deleteCalled = false;

function toggleExpand(e) {
  let deleteIcons = [...document.querySelectorAll('.task__remove')];
  const formElements = [...this.querySelectorAll('form *'),...deleteIcons];
  if (formElements.includes(e.target)) return;
  if (deleteCalled) {
    deleteCalled = false;
    return;
  }
  this.classList.toggle('--active');
  isFirstLoad = false;
}

function toggleTasks(e) {
  if(isFirstLoad) return;
  if(e.propertyName.includes('flex')) {
    this.classList.toggle('--open-active');
  }
  // Alternate option if you want the children themselves to have their class adjusted
  // const tasks = this.querySelector('.tasks');
  // const newTask = this.querySelector('.new-task');
  // if(e.propertyName.includes('flex')) {
  //   tasks.classList.toggle('--active');
  //   newTask.classList.toggle('--active');
  // }
}

const dayPanels = document.querySelectorAll('.day');
dayPanels.forEach(day => day.addEventListener('click',toggleExpand));
dayPanels.forEach(day => day.addEventListener('transitionend',toggleTasks));

// Load Task Logic


function deleteTask(e) {
  const dataDay = e.target.getAttribute('data-day');
  const dataIndex = e.target.getAttribute('data-index');
  dailyTasks[dataDay] = dailyTasks[dataDay].filter((task,i) => i !== Number(dataIndex))
  deleteCalled = true;
  loadTasks()
}

function loadTasks() {
  for (const key in dailyTasks) {
    const taskContainer = document.querySelector(`.day__${key} ul`)
    while (taskContainer.lastElementChild) {
      taskContainer.removeChild(taskContainer.lastElementChild)
    }
    dailyTasks[key].forEach((task,i) => {
      // create new task elements
      const taskItem = document.createElement('li');
      taskItem.classList.add('task');
      const taskTitle = document.createElement('h4');
      taskTitle.classList.add('task__title');
      taskTitle.innerText = task.taskTitle;
      const taskDescription = document.createElement('p');
      taskDescription.classList.add('task__desc');
      taskDescription.innerText = task.taskDescription;
      const taskCategory = document.createElement('p');
      taskCategory.classList.add(`task__category`)
      taskCategory.classList.add(`--${task.category}`)
      taskCategory.innerText = task.category;
      const removeItem = document.createElement('p');
      removeItem.classList.add('task__remove');
      removeItem.setAttribute('data-day',key);
      removeItem.setAttribute('data-index',i);
      removeItem.innerText = '❌';
      removeItem.addEventListener('click',deleteTask)
      taskItem.append(taskTitle,taskDescription,taskCategory,removeItem)
      taskContainer.appendChild(taskItem);
    })
  }  
}

// Adding Task Logic

function submitTasks(e) {
  e.preventDefault();
  const taskDay = this.getAttribute('data-day').toLowerCase();
  const formData = new FormData(this);
  const formProps = Object.fromEntries(formData);
  dailyTasks[taskDay].push(formProps);
  dailyTasks[taskDay].sort((current,next) => current.category < next.category? -1: 1)
  this.reset()
  loadTasks()
}

const newTaskForm = document.querySelectorAll('.new-task');
newTaskForm.forEach(form => form.addEventListener('submit',submitTasks))