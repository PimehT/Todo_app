import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../Context/authContext';
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Assuming you have a firebase config

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: 'test@example.com' },
  })),
  GoogleAuthProvider: jest.fn(() => ({})),  // Mock GoogleAuthProvider
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

describe('AuthProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when not loading', async () => {
    const mockUser = { email: 'test@example.com' };
    
    // Mock the onAuthStateChanged to simulate a logged-in user
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // Mock unsubscribe function
    });

    render(
      <AuthProvider>
        <div>App Content</div>
      </AuthProvider>
    );

    // Wait for the user to be logged in and content to appear
    await waitFor(() => {
      expect(screen.getByText('App Content')).toBeInTheDocument();
    });
  });

  xit('handles user login with email and password', async () => {
    const mockUser = { email: 'test@example.com', emailVerified: true };
    
    // Mock the signInWithEmailAndPassword to resolve with a mock user
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    render(
      <AuthProvider>
        <div>App Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });

  xit('displays an error if the user email is not verified', async () => {
    const mockUser = { email: 'test@example.com', emailVerified: false };
    
    // Mock the signInWithEmailAndPassword to resolve with a user whose email is not verified
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    render(
      <AuthProvider>
        <div>App Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Email not verified. Please verify your email before logging in.')).toBeInTheDocument();
    });
  });
});
