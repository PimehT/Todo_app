// src/components/Contact.js
import React from 'react';
import './Contact.scss';

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>If you have any questions, feel free to reach out to us through the following methods:</p>
      <ul>
        <li>Email: <a href="mailto:xekeso6223@cetnob.com">support@onepimeht.tech</a></li>
        <li>Phone: +234 7012348911</li>
        <li>Alt Phone: +256 354305771</li>
        <li>Address: 1234 Main St, Anytown, USA</li>
      </ul>
      <form className="contact-form">
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Message:
          <textarea name="message" required></textarea>
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
