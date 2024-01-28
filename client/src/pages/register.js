import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('ok')
        //handle
      } else {
        // Handle errors
        console.log(response)
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        
      <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
