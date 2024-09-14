// src/components/Task.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Add from '../assets/plus-solid.svg';
import { FaFilter } from 'react-icons/fa';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './Task.scss';
import { fetchTasks, createTask, updateTask, deleteTask } from '../Utils/taskManagement';
import { convertToLocalTimeZone, convertToUtc, dueEndOfDay, sortTasksByDueDate, isTitleUnique } from '../Utils/taskUtils';

const Task = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sleepingJake, setSleepingJake] = useState(false);

  const handleSubmitTask = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    if (newTitle.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }

    if (!isTitleUnique(newTitle, allTasks)) {
      alert("Task title must be unique");
      return;
    }

    const date = newDueDate ? newDueDate : dueEndOfDay();
    const userDescription = newDescription ? newDescription : '';

    const newTaskItem = {
      id: uuidv4(),
      title: newTitle,
      description: userDescription,
      dueDate: newDueDate.length > 0 ? newDueDate : date,
      completed: false,
      isEditing: false,
    };

    const taskData = {
      title: newTitle,
      description: userDescription,
      deadline: newDueDate ? convertToUtc(newDueDate) : convertToUtc(date),
      status: newTaskItem.completed ? 'Complete' : 'Pending',
    };

    const updatedTasksArr = [...allTasks, newTaskItem];
    setAllTasks(updatedTasksArr);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    localStorage.setItem('todolist', JSON.stringify(updatedTasksArr));
    await createTask(taskData);
    console.log('Task created successfully');
  };

  const handleDeleteTask = async (id) => {
    const reducedTasks = allTasks.filter((task) => task.id !== id);
    localStorage.setItem('todolist', JSON.stringify(reducedTasks));
    setAllTasks(reducedTasks);
    await deleteTask(id);
    console.log('Task deleted successfully');
  };

  const toggleTaskCompletion = async (id) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setAllTasks(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));

    const taskToUpdate = allTasks.find((task) => task.id === id);
    taskToUpdate.completed = !taskToUpdate.completed;
    const taskData = {
      status: taskToUpdate.completed ? 'Complete' : 'Pending',
    };

    await updateTask(id, taskData);
    console.log('Task updated successfully');
  };

  const handleEditTask = async (taskId, newDescription, newDueDate) => {
    const taskToUpdate = allTasks.find((task) => task.id === taskId);
    const date = newDueDate !== taskToUpdate.dueDate && newDueDate.trim() !== '' ? newDueDate : dueEndOfDay();
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? {
        ...task,
        description: newDescription,
        dueDate: date,
        isEditing: false
      } : task
    );
    setAllTasks(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));

    const taskData = {
      description: newDescription ? newDescription : taskToUpdate.description,
      deadline: newDueDate ? convertToUtc(newDueDate) : convertToUtc(date),
    };
    
    await updateTask(taskId, taskData);
    console.log('Task updated successfully');
  };

  const toggleTab = (status) => {
    if (status !== isCompleteScreen) {
      setIsCompleteScreen(status);
      setSortedTasks([]);
    }
    setIsCompleteScreen(status);
    if (isCompleteScreen) {
      setDisplayedTasks(allTasks.filter((task) => task.completed));
    } else {
      setDisplayedTasks(allTasks.filter((task) => !task.completed));
    }
  };

  const toggleEditMode = (taskId) => {
    const updatedTasks = allTasks.map(task =>
      task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
    );
    setAllTasks(updatedTasks);
  };

  const toggleRotate = (e) => {
    e.currentTarget.classList.toggle('rotated');
    setIsFormVisible(!isFormVisible);
    sleepingJake ? setSleepingJake(!sleepingJake) : setSleepingJake(sleepingJake);
  };

  const toggleFilter = () => setIsOpen(!isOpen);

  const handleFilterTask = (order) => {
    if (order === 'cancel') {
      setIsOpen(false);
      setSortedTasks([]);
      return;
    }
    setSortedTasks(sortTasksByDueDate(order, displayedTasks));
  }

  const fetchAllTasks = async () => {
    try {
      const tasks = await fetchTasks();
      // for each task in tasks, extract the title, description, deadline, status, and id
      const updatedTasks = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: convertToLocalTimeZone(task.deadline),
        completed: task.status === 'Complete',
        isEditing: false,
      }));
      if (updatedTasks.length > 0) {
        setAllTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    // const savedTasks = JSON.parse(localStorage.getItem('todolist'));
    const fetchData = async () => {
     const dbTasks = fetchAllTasks();
      if (dbTasks.length > 0) {
        setAllTasks(dbTasks);
        localStorage.setItem('todolist', JSON.stringify(dbTasks));
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // if sortedTasks and isCompleteScreen is false, display all tasks pending
    if (sortedTasks.length > 0 && !isCompleteScreen) {
      setDisplayedTasks(sortedTasks);
      return;
    }
    // if sortedTasks and isCompleteScreen is true, display all tasks completed
    if (sortedTasks.length > 0 && isCompleteScreen) {
      setDisplayedTasks(sortedTasks);
      return;
    }
    // if sortedTasks is empty and isCompleteScreen is false, display all tasks pending
    if (allTasks.length > 0 && !isCompleteScreen) {
      setDisplayedTasks(allTasks.filter((task) => !task.completed));
      return;
    }
    // if sortedTasks is empty and isCompleteScreen is true, display all tasks completed
    if (allTasks.length > 0 && isCompleteScreen) {
      setDisplayedTasks(allTasks.filter((task) => task.completed));
      return;
    }
  }, [allTasks, isCompleteScreen, sortedTasks]);

  useEffect(() => {
    if (allTasks.filter((task) => !task.completed).length === 0 && isCompleteScreen === false) {
      setSleepingJake(true);
    } else {
      setSleepingJake(false);
    }
  }, [allTasks, isCompleteScreen]);

  return (
    <section className={"todo-wrapper container"}>
      <div className="create-task" onClick={toggleRotate}>
        <img
          src={Add}
          alt="add icon to display form to add task"
          className="icon add-icon"
        />
        <p>Add task</p>
      </div>

      {isFormVisible && (
        <TaskForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          newDueDate={newDueDate}
          setNewDueDate={setNewDueDate}
          handleSubmitTask={handleSubmitTask}
        />
      )}

      <div className="btn-area">
        <button
          className={`secondaryBtn ${!isCompleteScreen && 'active'}`}
          onClick={() => toggleTab(false)}
        >
          Todo
        </button>
        <button
          className={`secondaryBtn ${isCompleteScreen && 'active'}`}
          onClick={() => toggleTab(true)}
        >
          Completed
        </button>
        {/* Add react filter icon that shows a dropdown to sort by dueDate */}
        <div className="filter-dropdown">
          <FaFilter className="filter-icon" onClick={toggleFilter} />
          {isOpen && (<div className="dropdown-content">
            <button onClick={() => handleFilterTask('asc')}>
              Sort by Due Date (Asc)
            </button>
            <button onClick={() => handleFilterTask('desc')}>
              Sort by Due Date (Desc)
            </button>
            <button onClick={() => handleFilterTask('cancel')}>
              Cancel Filter
            </button>
          </div>)}
        </div>
      </div>

      <TaskList
        tasks={displayedTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        handleDeleteTask={handleDeleteTask}
        handleEditTask={handleEditTask}
        toggleEditMode={toggleEditMode}
        sleepingJake={sleepingJake}
      />
    </section>
  );
};

export default Task;
