

import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Send POST request to the backend API for login
      const response = await fetch("https://student-query-system.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the correct content type
        },
        body: JSON.stringify({ email, password }), // Send the email and password as JSON
      });
  
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }
  
      // Parse the response body as JSON
      const data = await response.json(); // Parse the response to JSON
  
      // Log the response to inspect the structure
      console.log(data);
  
      // Check if the token exists in the response
      if (data?.user?.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('user', data.user.role);
  
        // Redirect based on user role
        if (data?.user?.role === 'student') {
          router.push('/student-dashboard');
        } else {
          router.push('/resolver-dashboard');
        }
      } else {
        throw new Error("Failed to retrieve user data.");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error
      alert("Login failed. Please check your credentials."); // Show alert to user
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md w-80">
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
