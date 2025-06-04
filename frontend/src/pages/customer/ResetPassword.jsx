import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/user/reset-password/${resetToken}`,
        { newPassword }
      );

      console.log("✅ Password reset successful:", response.data.message);
      alert("Password reset successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error(
        "❌ Error resetting password:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.message || "Error resetting password. Try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleResetPassword} style={styles.form}>
        <h2 style={styles.heading}>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

// Internal CSS styles
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

export default ResetPassword;
