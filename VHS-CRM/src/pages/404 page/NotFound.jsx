import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "80px", color: "#ff4757" }}>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/home">
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#1abc9c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
