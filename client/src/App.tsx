import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes Publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes Protégées */}
          <Route 
            path="/" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          />

          {/* Redirection par défaut (Catch all) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;