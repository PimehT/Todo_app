// src/components/Footer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the footer container', () => {
    expect(screen.getByTestId('footer-container')).toBeInTheDocument();
  });

  it('displays the current year in the copyright text', () => {
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} TODO - All rights reserved.`)).toBeInTheDocument();
  });

  it('renders quick links', () => {
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('renders team members information', () => {
    expect(screen.getByText('Meet the Team')).toBeInTheDocument();
    expect(screen.getByText('Tare-ere Pimeh')).toBeInTheDocument();
    expect(screen.getByText('Joshua Kalule')).toBeInTheDocument();
    expect(screen.getByText('Arthur Apedo Justin')).toBeInTheDocument();
  });
  
  it('renders the quick links section', () => {
    expect(screen.getByTestId('quick-links')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });
  
  it('renders the team members section', () => {
    expect(screen.getByTestId('team-members')).toBeInTheDocument();
    expect(screen.getByText('Meet the Team')).toBeInTheDocument();
    expect(screen.getByText('Tare-ere Pimeh')).toBeInTheDocument();
    expect(screen.getByText('Joshua Kalule')).toBeInTheDocument();
    expect(screen.getByText('Arthur Apedo Justin')).toBeInTheDocument();
  });
  
  it('renders social media links for team members', () => {
    const socialLinks = screen.getAllByRole('link', { name: '' });
    expect(socialLinks.length).toBeGreaterThan(5);
    expect(socialLinks.some(link => link.href.includes('linkedin.com'))).toBe(true);
    expect(socialLinks.some(link => link.href.includes('github.com'))).toBe(true);
  });
});
