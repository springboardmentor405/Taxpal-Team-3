import { Navigate } from "react-router-dom";

/**
 * Wraps any route that requires the user to be logged in.
 * If no JWT token is found in localStorage, redirects to /login.
 */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
