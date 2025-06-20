import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./PasswordInput.css";

const PasswordInput = ({
  name,
  placeholder,
  onChange,
  value,
  required,
  minLength = 8,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleInputChange = (e) => {
    onChange(e); // Let parent manage value
  };

  const isValid = (val) => val.length >= minLength;

  return (
    <div className="password-input-container">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onBlur={() => setTouched(true)}
        required={required}
        minLength={minLength}
        maxLength={10}
        className={`password-input ${
          touched && !isValid(value) ? "invalid" : ""
        }`}
      />

      <span
        onClick={() => setShowPassword((prev) => !prev)}
        className="toggle-visibility"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordInput;
