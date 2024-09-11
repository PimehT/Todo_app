import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { getOverdueTasks } from '../Utils/taskUtils';
import './Notification.scss';

const Notification = ({ onClick }) => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  useEffect(() => {
    const overdue = getOverdueTasks();
    setOverdueTasks(overdue);
  }, []);

  const hasOverdueTasks = overdueTasks.length > 0;

  const toggleNotification = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const closeDropdown = () => {
    setIsDropDownOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} onClick={onClick}>
      <FaBell style={{ color: hasOverdueTasks ? '#FC5813' : 'gray', fontSize: '24px' }}
       onClick={toggleNotification} />
      {hasOverdueTasks && (
        <span
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '10px',
            height: '10px',
            backgroundColor: 'red',
            borderRadius: '50%',
          }}
        ></span>
      )}
      {isDropDownOpen && (
        <div className="notification-dropdown">
          <button className="close-btn" onClick={closeDropdown}>&times;</button>
          <h4>Overdue Tasks</h4>
          {overdueTasks.length === 0 ? (
            <p>No overdue tasks</p>
          ) : (
            <ul>
              {overdueTasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong>: {task.description} (Due: {new Date(task.dueDate).toLocaleString()})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
