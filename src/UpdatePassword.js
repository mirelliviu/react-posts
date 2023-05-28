import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePasswordApi } from './api/posts';

const ResetPassword = () => {

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(password);
    try {
      const response = await updatePasswordApi.post(`/update-password/${token}`, { password });
      setMessage(response.data.message);
      setPassword('');
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };


  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default ResetPassword;
