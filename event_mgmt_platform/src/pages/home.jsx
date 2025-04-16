import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Array of image URLs used for the background slideshow.
 * @type {string[]}
 */

const images = [
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1514190226263-0a4456a291f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1542732351-fa2c82b0c746?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D",
];

/**
 * Home component that displays a full-page background slideshow with text overlay and navigation button.
 *
 * - Background image cycles every 3 seconds with fade effect.
 * - Displays a welcome message and a button to navigate to the registration page.
 * - Includes a dark overlay for better text visibility.
 *
 * @component
 * @example
 * return (
 *   <Home />
 * )
 *
 * @returns {JSX.Element} The rendered Home component.
 */

const Home = () => {

  /**
   * State to manage the current background image.
   * @type {[string, Function]}
   */
  const [bgImage, setBgImage] = useState(images[0]);

  /**
   * State to manage the fade effect during image transition.
   * @type {[boolean, Function]}
   */
  const [fade, setFade] = useState(true);

  const navigate = useNavigate();

  /**
   * useEffect hook to start the background image slideshow on component mount.
   * Clears the interval on component unmount.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBgImage((prevImage) => {
          const currentIndex = images.indexOf(prevImage);
          return images[(currentIndex + 1) % images.length];
        });
        setFade(true);
      }, 1000); // Wait for fade out before changing image
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        transition: "background-image 1s ease-in-out",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
        }}
      ></div>
      <div className="position-relative text-center">
        <h2 className="animated-text">Welcome to the Home Page</h2>
        <p className="animated-text">Login to join the Events.</p>
        <button
        className="btn btn-light mt-3 px-4 py-2 fw-bold"
        onClick={() => navigate("/register")}
      >
        Join Now
      </button>
      </div>
      <footer
        className="position-absolute bottom-0 w-100 text-center py-2"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
        }}
      >
        &copy; All rights reserved
      </footer>
    </div>
  );
};

export default Home;