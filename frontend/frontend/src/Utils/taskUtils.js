import moment from "moment-timezone";
import { fetchTasks } from '../Utils/taskManagement';

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
export const getOverdueTasks = async () => {
  const tasks = await fetchTasks();
  if (!tasks) {
    return [];
  }

  const now = new Date();
  const overdueTasks = tasks.filter(task => {
    const taskDeadline = new Date(task.deadline);
    return taskDeadline < now && task.status === 'Pending';
  });

  return overdueTasks;
};

// Make sure user title is unique
export const isTitleUnique = (title, tasks) => {
  return tasks.every(task => task.title !== title);
};

export const formatDueDate = (dueDate) => {
  if (!dueDate) {
    return "";
  }
  const date = new Date(dueDate);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  
  const formattedDay = isTodayOrTomorrow(dueDate);
  const currentYear = new Date().getFullYear();
  const taskYear = date.getFullYear();

  if (currentYear === taskYear && formattedDay !== 'Other') {
    return `${formattedDay} at ${date.toLocaleString('en-US', options)}`;
  } else {
    options.weekday = 'short';
    options.year = 'numeric';
    options.month = 'numeric';
    options.day = 'numeric';
  }

  const formattedDate = date.toLocaleString('en-US', options);

  if (currentYear !== taskYear) {
    return `${formattedDate}, ${taskYear}`;
  }

  return formattedDate;
};

export const isTodayOrTomorrow = (dueDate) => {
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Remove time part for comparison
  const isSameDay = (date1, date2) => 
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, tomorrow)) {
    return 'Tomorrow';
  } else {
    return 'Other';
  }
};
