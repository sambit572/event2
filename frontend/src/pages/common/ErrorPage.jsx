import React, { useEffect, useState } from "react";

// This is a placeholder for the Link component from react-router-dom.
// In your actual project, you would import it directly:
// import { Link } from 'react-router-dom';
const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

// Bubble component for the background effect
// These are purely decorative elements to add a sense of depth and motion.
const Bubble = ({ style }) => (
  <div className="absolute rounded-full" style={style}></div>
);

export default function ErrorPage() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  // This effect tracks the mouse's position to move the interactive glow.
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // We generate an array of bubble elements for the background animation.
  // Each bubble has a random size, position, and animation duration for a natural look.
  const bubbles = Array.from({ length: 15 }).map((_, index) => {
    const size = Math.random() * 60 + 20; // Bubbles of size 20px to 80px
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      // The float-up animation is defined in the <style> block below.
      animation: `float-up ${Math.random() * 15 + 10}s linear infinite`,
      animationDelay: `${Math.random() * 5}s`,
      // Bubbles have a soft, semi-transparent blue/purple color.
      background: `rgba(${150 + Math.random() * 105}, ${
        200 + Math.random() * 55
      }, 255, 0.1)`,
      boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.5)",
    };
    return <Bubble key={index} style={style} />;
  });

  return (
    <>
      {/* This style block contains the keyframes for our custom animations. 
        In a larger project, you would typically define these in your tailwind.config.js file 
        under the theme.extend.animation and theme.extend.keyframes sections.
      */}
      <style>
        {`
        @keyframes blob-move {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.7s ease-out forwards;
        }
        /* This new keyframe makes the bubbles float up and fade out */
        @keyframes float-up {
            from {
                transform: translateY(100vh) scale(1);
                opacity: 0.7;
            }
            to {
                transform: translateY(-200px) scale(1.5);
                opacity: 0;
            }
        }
        `}
      </style>

      {/* Main container keeps the light theme and overflow hidden for the animations */}
      <main className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-gray-50 font-sans">
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 z-0">{bubbles}</div>

        {/* Mouse-following Glow Effect */}
        {/* This div creates a soft glow that follows the cursor, adding an interactive feel. */}
        <div
          className="absolute z-0 w-96 h-96 bg-gradient-to-radial from-blue-200/50 to-transparent rounded-full pointer-events-none filter blur-3xl"
          style={{
            transform: `translate(${mousePosition.x - 192}px, ${
              mousePosition.y - 192
            }px)`,
          }}
        ></div>

        {/* Original Animated Blobs are kept for layered effect */}
        <div className="absolute w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-300 rounded-full -top-16 -left-16 animate-[blob-move_8s_ease-in-out_infinite] opacity-50 filter blur-3xl z-0"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-tr from-purple-200 to-pink-300 rounded-full -bottom-16 -right-16 animate-[blob-move_10s_ease-in-out_infinite_reverse] opacity-50 filter blur-3xl z-0"></div>

        {/* Content Container remains the focal point, now with a higher z-index */}
        <div className="relative z-10 flex flex-col items-center p-8">
          {/* Main 404 Text - Adding a subtle text shadow for depth */}
          <h1
            className="text-[10rem] md:text-[12rem] font-black text-gray-800 leading-none tracking-tighter opacity-0 animate-fade-in-down"
            style={{ textShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600">
              404
            </span>
          </h1>

          {/* Title */}
          <h2
            className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight opacity-0 animate-fade-in-down"
            style={{ animationDelay: "0.2s" }}
          >
            A Universe Away
          </h2>

          {/* Description */}
          <p
            className="mt-4 text-lg text-gray-600 max-w-md text-center opacity-0 animate-fade-in-down"
            style={{ animationDelay: "0.4s" }}
          >
            Oops! It seems this page has drifted into a cosmic anomaly. Let's
            navigate you back to familiar territory.
          </p>

          {/* Home Button - adding a more pronounced shadow on hover for a tactile feel */}
          <Link
            to="/"
            className="mt-8 px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-indigo-500/40 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out opacity-0 animate-fade-in-down"
            style={{ animationDelay: "0.6s" }}
          >
            Return to Home Base
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Or{" "}
            <Link to="/help_us" className="text-blue-600 hover:underline">
              contact support
            </Link>{" "}
            if you think this is a mistake.
          </p>
        </div>
      </main>
    </>
  );
}
