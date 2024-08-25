import React, { useRef } from 'react';

const TaskForm = ({
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newDueDate,
  setNewDueDate,
  handleSubmitTask,
}) => {
  const descriptionInputRef = useRef(null);

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      descriptionInputRef.current.focus();
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitTask(e); // Submit the form
    }
  };

  return (
    <div className="todo-input">
      <form onSubmit={handleSubmitTask}>
        <div className="todo-input-item">
          <label htmlFor="taskTitle" className='required'>Title</label>
          <input
            type="text"
            id="taskTitle"
            name="title"
            placeholder="Task's title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            required
          />
        </div>
        <div className="todo-input-item">
          <label htmlFor="taskDescription">Description</label>
          <textarea
            id="taskDescription"
            name="description"
            placeholder="Task's description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            ref={descriptionInputRef}
            onKeyDown={handleDescriptionKeyDown}
          ></textarea>
        </div>
        <div className="todo-input-item">
          <label htmlFor="taskDueDate">Due Date</label>
          <input
            type="datetime-local"
            id="taskDueDate"
            name="dueDate"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
        </div>
        <div className="todo-input-item">
          <button type="submit" className="primaryBtn">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
