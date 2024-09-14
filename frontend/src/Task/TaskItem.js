// src/components/TaskItem.js
import React, { useState } from 'react';
import Check from '../assets/check-solid.svg';
import Remove from '../assets/trash-can-regular.svg';
import EditIcon from '../assets/pen-to-square-regular.svg';
import { formatDueDate } from '../Utils/taskUtils';

const TaskItem = ({
  task,
  toggleTaskCompletion,
  handleDeleteTask,
  handleEditTask,
  toggleEditMode,
}) => {
  // const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newDueDate, setNewDueDate] = useState(task.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditTask(task.id, newDescription, newDueDate);
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
          {/* <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
          /> */}
          <textarea
            id={`description-${task.id}`}
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
          <p>{task.description || 'No description available'}</p>
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
