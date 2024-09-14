// src/components/Privacy.js
import React from 'react';
import './Privacy.scss';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <h1>Privacy Policy</h1>
      <p>At OnePimeh Tech, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your information.</p>
      <h2>Information We Collect</h2>
      <p>We may collect the following information:</p>
      <ul>
        <li>Personal identification information (Name, email address, phone number, etc.)</li>
        <li>Usage data (pages visited, time spent on the site, etc.)</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect in the following ways:</p>
      <ul>
        <li>To provide and maintain our service</li>
        <li>To notify you about changes to our service</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our service</li>
      </ul>
      <h2>Security of Your Information</h2>
      <p>We take the security of your information seriously and implement appropriate measures to protect it.</p>
      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@onepimeht.tech">privacy@onepimeht.tech</a>.</p>
    </div>
  );
};

export default Privacy;
