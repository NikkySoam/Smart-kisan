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
import Farmers from "./pages/tubewell/Farmers";
import WaterEntry from "./pages/tubewell/WaterEntry";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRedirect from "./routes/AuthRedirect";
import Settings from "./pages/Settings";
import Reports from "./pages/tubewell/Reports";
import FarmerDetails from "./pages/tubewell/FarmerDetails";
import FieldWater from "./pages/apna-khet/FieldWater";
import Fields from "./pages/apna-khet/Fields";
import Fertilizers from "./pages/apna-khet/Fertilizers";
import Labour from "./pages/apna-khet/Labour";
import Equipment from "./pages/apna-khet/Equipment";
import WaterManagement from "./pages/tubewell/WaterManagement";

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

          {/* TUBEWELL WATER ENTRY */}

          <Route
            path="/water"
            element={
              <WaterEntry />
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

            {/* WATER MANAGEMENT */}
          <Route
            path="/water-management"
            element={<WaterManagement />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
