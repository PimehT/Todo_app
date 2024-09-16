import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResponseModal from './ResponseModal';

describe('ResponseModal', () => {
  const defaultProps = {
    title: 'Test Title',
    message: 'Test Message',
    onClose: jest.fn(),
  };

  it('renders the modal with title and message', () => {
    render(<ResponseModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ResponseModal {...defaultProps} />);
    fireEvent.click(screen.getByText('×'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders resend button and message when onResend is provided', () => {
    const onResend = jest.fn();
    const resendMessage = 'Resend message';
    render(
      <ResponseModal {...defaultProps} onResend={onResend} resendMessage={resendMessage} />
    );
    expect(screen.getByText('Resend Verification Email')).toBeInTheDocument();
    expect(screen.getByText('Resend message')).toBeInTheDocument();
  });

  it('calls onResend when resend button is clicked', () => {
    const onResend = jest.fn();
    render(<ResponseModal {...defaultProps} onResend={onResend} />);
    fireEvent.click(screen.getByText('Resend Verification Email'));
    expect(onResend).toHaveBeenCalled();
  });

  it('renders confirm and cancel buttons when onConfirm is provided', () => {
    const onConfirm = jest.fn();
    render(<ResponseModal {...defaultProps} onConfirm={onConfirm} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', () => {
    const onConfirm = jest.fn();
    render(<ResponseModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('closes the modal when clicking outside', () => {
    const { container } = render(<ResponseModal {...defaultProps} />);
    fireEvent.mouseDown(container);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
