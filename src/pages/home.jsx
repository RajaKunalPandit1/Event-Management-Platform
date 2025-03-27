import React from "react";

/**
    Just a Simple Home page to Greet (Might change it later)
 */

const Home = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-99 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "86vh",
        position: "fixed",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay for fade effect
          transition: "opacity 1.5s ease-in-out",
        }}
      ></div>
      <div className="position-relative text-center">
        <h2>Welcome to the Home Page</h2>
        <p>Login to join the Event</p>
      </div>
    </div>
  );
};

export default Home;