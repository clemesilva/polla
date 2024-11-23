import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Predictions from "./components/Predictions";
import ProtectedRoute from "./components/ProtectedRoute";
import Reglas from "./components/Reglas";
import Footer from "./components/Footer";
import ComoFunciona from "./components/ComoFunciona";
import CrearGrupo from "./components/CrearGrupo";
import GrupoCreado from "./components/GrupoCreado";

function App() {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reglas" element={<Reglas />} />
              <Route path="/comofunciona" element={<ComoFunciona />} />
              <Route path="/grupo-creado" element={<GrupoCreado />} />
              <Route
                path="/predictions"
                element={
                  <ProtectedRoute>
                    <Predictions />
                  </ProtectedRoute>
                }
              />
              <Route path="/crear-grupo" element={<CrearGrupo />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
