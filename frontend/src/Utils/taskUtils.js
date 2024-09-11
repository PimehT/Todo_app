import moment from "moment-timezone";

export const sortTasksByDueDate = (order, tasks) => {
  const tasksCopy = JSON.parse(JSON.stringify(tasks));

  return tasksCopy.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);

    if (order === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};

export const filterOverdueTasks = (tasks) => {
  const now = new Date();
  return tasks.filter(task => new Date(task.dueDate) < now && !task.completed);
};

export const dueEndOfDay = () => {
  // set due date/time to 11:59:59 PM of the current day
  const date = new Date();
  date.setHours(23, 59, 59);
  // format the date to 'YYYY-MM-DDTHH:mm:ss'
  return date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0].slice(0, -3);
};

export const convertToUtc = (dueDate) => {
  const date = new Date(dueDate);
  return date.toISOString().split('.')[0];
}

export const convertToLocalTimeZone = (dueDate) => {
  const userTimezone = moment.tz.guess();
  return moment.utc(dueDate).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss');
}

// Get overdue tasks
export const getOverdueTasks = () => {
  if (!localStorage.getItem('todolist')) {
    return [];
  }
  const tasks = JSON.parse(localStorage.getItem('todolist')) || [];
  const now = new Date();
  return tasks.filter(task => new Date(task.dueDate) < now && !task.completed);
};

// Make sure user title is unique
export const isTitleUnique = (title, tasks) => {
  return tasks.every(task => task.title !== title);
};
