import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import WaterManagement from "./pages/WaterManagement";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRedirect from "./routes/AuthRedirect";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import FarmerDetails from "./pages/FarmerDetails";

function App() {
  return (
    <BrowserRouter>

      <Toaster />

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
            />
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          }
        />

        {/* PROTECTED LAYOUT */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* FARMERS */}

          <Route
            path="/farmers"
            element={<Farmers />}
          />

          {/* WATER */}

          <Route
            path="/water"
            element={
              <WaterManagement />
            }
          />

            {/* SETTINGS */}
          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/farmers/:id"
            element={<FarmerDetails />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;