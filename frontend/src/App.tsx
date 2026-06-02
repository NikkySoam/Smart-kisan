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
import FieldWater from "./pages/FieldWater";
import Fields from "./pages/Fields";
import Fertilizers from "./pages/Fertilizers";
import Labour from "./pages/Labour";
import Equipment from "./pages/Equipment";

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

          {/* TUBEWELL FARMERS */}

          <Route
            path="/farmers"
            element={<Farmers />}
          />

          {/* TUBEWELL WATER */}

          <Route
            path="/water"
            element={
              <WaterManagement />
            }
          />

            {/* USER SETTINGS */}
          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* REPORTS OF TUBEWELL WATER */}
          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* FARMERS DETAILS WHICH USE TUBEWELL */}
          <Route
            path="/farmers/:id"
            element={<FarmerDetails />}
          />

          {/* WATER IN OWN FIELD */}
          <Route
            path="/field-water/:fieldId"
            element={<FieldWater />}
          />

            {/* ALL FIELDS OF USER */}
          <Route
            path="/fields"
            element={<Fields />}
          />

            {/* FERTILIZER IN OWN FIELD */}
          <Route
            path="/fertilizers/:fieldId"
            element={<Fertilizers />}
          />

            {/* LABOUR COST IN OWN FIELD */}
          <Route
            path="/labour/:fieldId"
            element={<Labour />}
          />

            {/* EQUIPMENT OR OTHER COST IN OWN FIELD */}
          <Route
            path="/equipment/:fieldId"
            element={<Equipment />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;