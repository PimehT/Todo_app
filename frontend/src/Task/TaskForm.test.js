import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const mockSetNewTitle = jest.fn();
  const mockSetNewDescription = jest.fn();
  const mockSetNewDueDate = jest.fn();
  const mockHandleSubmitTask = jest.fn((e) => e.preventDefault());

  const setup = () => {
    render(
      <TaskForm
        newTitle=""
        setNewTitle={mockSetNewTitle}
        newDescription=""
        setNewDescription={mockSetNewDescription}
        newDueDate=""
        setNewDueDate={mockSetNewDueDate}
        handleSubmitTask={mockHandleSubmitTask}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  test('renders TaskForm with all input fields and button', () => {
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  test('calls setNewTitle on title input change', () => {
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Task' } });
    expect(mockSetNewTitle).toHaveBeenCalledWith('New Task');
  });

  test('calls setNewDescription on description input change', () => {
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Task Description' } });
    expect(mockSetNewDescription).toHaveBeenCalledWith('Task Description');
  });

  test('calls setNewDueDate on due date input change', () => {
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: '2023-10-10T10:00' } });
    expect(mockSetNewDueDate).toHaveBeenCalledWith('2023-10-10T10:00');
  });

  test('focuses on description input when Enter is pressed on title input', () => {
    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });
    expect(descriptionInput).toHaveFocus();
  });

  test('submits the form when Enter is pressed on description input', () => {
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.keyDown(descriptionInput, { key: 'Enter', code: 'Enter' });
    expect(mockHandleSubmitTask).toHaveBeenCalled();
  });

  test('calls handleSubmitTask on form submit', () => {
    fireEvent.submit(screen.getByRole('button', { name: /Add Task/i }));
    expect(mockHandleSubmitTask).toHaveBeenCalled();
  });
});
