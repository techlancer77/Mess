import { Link, Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";
import  Login  from "./Pages/Login";
import { PrivateRoute } from "./components/private_routing";
import { Navigate } from "react-router-dom";
import { useAuth} from "./context/context_rout";

function App() {
  const{isAuthenticated} = useAuth();
  return (
    <>
    
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}/>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </>
  );
}

export default App;
