import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for inputs
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload

    if (!credentials.email || !credentials.password) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await authService.login(credentials);
      console.log("response", response);
      dispatch(login(response));
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Branding Section */}
        <div className="hidden md:flex flex-col items-center justify-center bg-red-800 text-white p-10">
          <h1 className="text-3xl font-bold">Vijay Home Services</h1>
          <p className="mt-2 text-center">
            Your trusted partner for Painting, Cleaning, and Polishing.
          </p>
        </div>

        {/* Right Login Form Section */}
        <div className="p-10 flex flex-col justify-center">
          <div className="flex justify-center mb-4">
            <img src="vhs.png" alt="Logo" className="w-16" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            LOGIN TO YOUR ACCOUNT
          </h2>

          <form className="mt-6" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email/Username</label>
              <input
                type="text"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a
                href="/forgot-password"
                className="text-red-600 hover:underline text-sm"
              >
                Forgot Password?
              </a>
            </div>

            <button className="w-full mt-4 bg-red-800 text-white py-2 rounded-lg hover:bg-red-900 transition">
              Login
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Never share your login details with anyone.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
