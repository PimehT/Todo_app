// src/components/TaskList.js
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({
  tasks,
  toggleTaskCompletion,
  handleDeleteTask,
  handleEditTask,
  toggleEditMode,
}) => {
  return (
    <div className="todo-list">
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
