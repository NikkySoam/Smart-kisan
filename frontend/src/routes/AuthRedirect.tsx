import {
  Navigate,
} from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AuthRedirect = ({
  children,
}: Props) => {
  const token =
    localStorage.getItem("token");

  // ALREADY LOGGED IN

  if (token) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default AuthRedirect;