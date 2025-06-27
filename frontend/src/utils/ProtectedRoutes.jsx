import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const loggedIn = localStorage.getItem("currentlyLoggedIn");

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
