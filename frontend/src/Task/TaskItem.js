// src/components/TaskItem.js
import React, { useState } from 'react';
import Check from '../assets/check-solid.svg';
import Remove from '../assets/trash-can-regular.svg';
import EditIcon from '../assets/pen-to-square-regular.svg';

const TaskItem = ({
  task,
  toggleTaskCompletion,
  handleDeleteTask,
  handleEditTask,
  toggleEditMode,
}) => {
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newDueDate, setNewDueDate] = useState(task.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditTask(task.id, newTitle, newDescription, newDueDate);
  };

  const formatDueDate = (dueDate) => {
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
    }
  
    const formattedDate = date.toLocaleString('en-US', options);
  
    if (currentYear !== taskYear) {
      return `${formattedDate}, ${taskYear}`;
    }
  
    return formattedDate;
  };

  const isTodayOrTomorrow = (dueDate) => {
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

  return (
    <div className={`todo-list-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        id={`checker-${task.id}`}
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task.id)}
      />
      <label htmlFor={`checker-${task.id}`}>
        <img
          src={Check}
          alt="check icon of the task"
          className="icon check-icon"
        />
      </label>

      {/* Task content or Edit Mode */}
      {task.isEditing ? (
        <form onSubmit={handleSubmit} className="text-content">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Task description"
          />
          <input
            type="datetime-local"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <button type="submit" className="primaryBtn">Save</button>
        </form>
      ) : (
        <details className="text-content">
          <summary>{task.title}</summary>
          <p>{task.description}</p>
          <p>{formatDueDate(task.dueDate)}</p>
        </details>
      )}

      {/* Edit and Remove Icons */}
      <img
        src={EditIcon}
        alt="edit icon of the task"
        className="icon edit-icon"
        onClick={() => toggleEditMode(task.id)}
      />
      <img
        src={Remove}
        alt="delete icon of the task"
        className="icon remove-icon"
        onClick={() => handleDeleteTask(task.id)}
      />
    </div>
  );
};

export default TaskItem;
