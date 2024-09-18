import React, { useEffect, useRef, useState } from 'react';
import { getOverdueTasks } from '../Utils/taskUtils';
import { FaBell } from 'react-icons/fa';
import './Notification.scss';

const Notification = ({ onClick }) => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const notificationsRef = useRef(null);

  const hasOverdueTasks = overdueTasks.length > 0;

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      try {
        const overdue = await getOverdueTasks();
        setOverdueTasks(overdue || []); // Ensure overdue is an array
      } catch (error) {
        console.error('Failed to fetch overdue tasks:', error);
        setOverdueTasks([]); // Set to empty array on error
      }
    };

    fetchOverdueTasks();
  }, []);

  const toggleNotification = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const closeDropdown = () => {
    setIsDropDownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setIsDropDownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropDownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropDownOpen]);

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
        <div className="notification-dropdown" ref={notificationsRef}>
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
