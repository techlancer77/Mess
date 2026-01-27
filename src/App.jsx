import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import Login from "./Pages/Login";
import OwnerLogin from "./Pages/owner login/owner";
import { PrivateRoute } from "./components/private_routing";
import { useAuth } from "./context/context_rout";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Owner Page Route (after login) */}
       
        <Route path="/owner" element={<OwnerLogin />} />


        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
