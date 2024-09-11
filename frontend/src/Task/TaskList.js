// src/components/TaskList.js
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({
  tasks,
  toggleTaskCompletion,
  handleDeleteTask,
  handleEditTask,
  toggleEditMode,
  sleepingJake,
}) => {
  return (
    <div className={`todo-list ${sleepingJake ? 'sleeping' : ''}`}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTaskCompletion={toggleTaskCompletion}
          handleDeleteTask={handleDeleteTask}
          handleEditTask={handleEditTask}
          toggleEditMode={toggleEditMode}
        />
      ))}
    </div>
  );
};

export default TaskList;
