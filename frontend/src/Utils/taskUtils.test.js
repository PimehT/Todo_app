import moment from 'moment-timezone';
import { 
  sortTasksByDueDate, 
  filterOverdueTasks, 
  dueEndOfDay, 
  convertToUtc, 
  convertToLocalTimeZone, 
  getOverdueTasks, 
  isTitleUnique, 
  formatDueDate, 
  isTodayOrTomorrow 
} from './taskUtils';

describe('taskUtils', () => {
  const tasks = [
    { title: 'Task 1', dueDate: '2024-09-11T10:00:00', completed: false },
    { title: 'Task 2', dueDate: '2024-09-12T10:00:00', completed: true },
    { title: 'Task 3', dueDate: '2024-09-21T10:00:00', completed: false },
  ];

  test('sortTasksByDueDate sorts tasks in ascending order', () => {
    const sortedTasks = sortTasksByDueDate('asc', tasks);
    expect(sortedTasks[0].title).toBe('Task 1');
    expect(sortedTasks[1].title).toBe('Task 2');
    expect(sortedTasks[2].title).toBe('Task 3');
  });

  test('sortTasksByDueDate sorts tasks in descending order', () => {
    const sortedTasks = sortTasksByDueDate('desc', tasks);
    expect(sortedTasks[0].title).toBe('Task 3');
    expect(sortedTasks[1].title).toBe('Task 2');
    expect(sortedTasks[2].title).toBe('Task 1');
  });

  test('filterOverdueTasks filters out non-overdue tasks', () => {
    const overdueTasks = filterOverdueTasks(tasks);
    expect(overdueTasks.length).toBe(1);
    expect(overdueTasks[0].title).toBe('Task 1');
  });

  test('dueEndOfDay returns correct end of day time', () => {
    const endOfDay = dueEndOfDay();
    const date = new Date();
    date.setHours(23, 59, 59);
    expect(endOfDay).toBe(date.toISOString().split('T')[0] + 'T23:59');
  });

  test('convertToUtc converts date to UTC', () => {
    const utcDate = convertToUtc('2024-10-01T10:00:00');
    expect(utcDate).toBe('2024-10-01T09:00:00');
  });

  test('convertToLocalTimeZone converts date to local time zone', () => {
    const localDate = convertToLocalTimeZone('2024-10-01T10:00:00Z');
    const userTimezone = moment.tz.guess();
    const expectedDate = moment.utc('2024-10-01T10:00:00').tz(userTimezone).format('YYYY-MM-DD HH:mm:ss');
    expect(localDate).toBe(expectedDate);
  });

  test('getOverdueTasks returns overdue tasks from localStorage', () => {
    localStorage.setItem('todolist', JSON.stringify(tasks));
    const overdueTasks = getOverdueTasks();
    expect(overdueTasks.length).toBe(1);
    expect(overdueTasks[0].title).toBe('Task 1');
  });

  test('isTitleUnique checks for unique title', () => {
    expect(isTitleUnique('Task 4', tasks)).toBe(true);
    expect(isTitleUnique('Task 1', tasks)).toBe(false);
  });

  test('formatDueDate formats due date correctly', () => {
    const formattedDate = formatDueDate('2024-10-01T10:00:00');
    const date = new Date('2024-10-01T10:00:00');
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const expectedDate = `${isTodayOrTomorrow('2024-10-01T10:00:00')} at ${date.toLocaleString('en-US', options)}`;
    expect(formattedDate).toBe("Tue 10:00 AM");
    expect(expectedDate).toBe("Other at 10:00 AM");
  });

  test('isTodayOrTomorrow returns correct day', () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    expect(isTodayOrTomorrow(today.toISOString())).toBe('Today');
    expect(isTodayOrTomorrow(tomorrow.toISOString())).toBe('Tomorrow');
    expect(isTodayOrTomorrow('2024-10-01T10:00:00')).toBe('Other');
  });
});
