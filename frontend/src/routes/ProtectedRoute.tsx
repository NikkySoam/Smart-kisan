import {
  Navigate,
} from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children,
}: Props) => {
  const token =
    localStorage.getItem("token");

  // NOT LOGGED IN

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // LOGGED IN

  return children;
};

export default ProtectedRoute;