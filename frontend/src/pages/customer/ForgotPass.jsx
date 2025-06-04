import axios from "axios";
import React, { useState } from "react";

function ForgotPass() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/user/forgot-password",
        { email }
      );
      console.log(res.data.message);
      alert("Reset link sent successfully!");
    } catch (error) {
      console.error("Error sending reset link", error);
      alert("Error sending reset link. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

// Inline CSS Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    minWidth: "100vw",
    background: "linear-gradient(to right, #e0ecff, #f4f6ff)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "350px",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#007bff",
    fontFamily: "'Poppins', sans-serif",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "linear-gradient(to right, #1A2A49, #007bff)",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease-in-out",
  },
};

export default ForgotPass;
