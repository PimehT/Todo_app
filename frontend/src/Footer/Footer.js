// src/components/Footer.js
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.scss';

const Footer = () => {
  // Get the current year
  const getFullYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="footer" data-testid="footer-container">
      <div className="footer-content">
        {/* Footer links */}
        <div className="footer-section" data-testid="quick-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">About</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        {/* Meet the Team */}
        <div className="footer-section" data-testid="team-members">
          <h4>Meet the Team</h4>
          <div className="team-members">
            <div>
              <p><a href="https://twitter.com/pimehere" target="_blank" rel="noopener noreferrer">Tare-ere Pimeh</a></p>
              <div className='social-icons'>
                <p><a href="https://www.linkedin.com/in/pimeh-tare-ere" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a></p>
                <p><a href="https://github.com/PimehT" target="_blank" rel="noopener noreferrer"><FaGithub /></a></p>
              </div>
            </div>
            <div>
              <p><a href="https://twitter.com/KarlYoshua" target="_blank" rel="noopener noreferrer">Joshua Kalule</a></p>
              <div className='social-icons'>
                <p><a href="https://www.linkedin.com/in/joshua-kalule" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a></p>
                <p><a href="https://github.com/joshuakalule" target="_blank" rel="noopener noreferrer"><FaGithub /></a></p>
              </div>
            </div>
            <div>
              <p><a href="https://x.com/aped_o" target="_blank" rel="noopener noreferrer">Arthur Apedo Justin</a></p>
              <div className='social-icons'>
                <p><a href="https://www.linkedin.com/in/apedo-arthur" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a></p>
                <p><a href="https://github.com/creeds-knight" target="_blank" rel="noopener noreferrer"><FaGithub /></a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom text */}
      <div className="footer-bottom">
        <p>&copy; {getFullYear()} TODO - All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
