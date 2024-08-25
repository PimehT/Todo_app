// src/components/Task.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Add from '../assets/plus-solid.svg';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './Task.scss';

const Task = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);

  const handleSubmitTask = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    if (newTitle.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }

    const newTaskItem = {
      id: uuidv4(),
      title: newTitle,
      description: newDescription,
      dueDate: newDueDate,
      completed: false,
      created: new Date().toLocaleString(),
      updated: new Date().toLocaleString(),
      isEditing: false,
    };

    console.log(newTaskItem);

    const updatedTasksArr = [...allTasks, newTaskItem];
    setAllTasks(updatedTasksArr);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    localStorage.setItem('todolist', JSON.stringify(updatedTasksArr));
  };

  const handleDeleteTask = (id) => {
    const reducedTasks = allTasks.filter((task) => task.id !== id);
    localStorage.setItem('todolist', JSON.stringify(reducedTasks));
    setAllTasks(reducedTasks);
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setAllTasks(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));
  };

  const handleEditTask = (taskId, newTitle, newDescription, newDueDate) => {
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle, description: newDescription, dueDate: newDueDate, isEditing: false } : task
    );
    setAllTasks(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));
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
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('todolist'));
    if (savedTasks) {
      setAllTasks(savedTasks);
    }
  }, []);

  const displayedTasks = isCompleteScreen
    ? allTasks.filter((task) => task.completed)
    : allTasks.filter((task) => !task.completed);

  return (
    <section className="todo-wrapper container">
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
          onClick={() => setIsCompleteScreen(false)}
        >
          Todo
        </button>
        <button
          className={`secondaryBtn ${isCompleteScreen && 'active'}`}
          onClick={() => setIsCompleteScreen(true)}
        >
          Completed
        </button>
      </div>

      <TaskList
        tasks={displayedTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        handleDeleteTask={handleDeleteTask}
        handleEditTask={handleEditTask}
        toggleEditMode={toggleEditMode}
      />
    </section>
  );
};

export default Task;
