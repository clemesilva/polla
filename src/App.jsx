import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import Reglas from "./components/Reglas";
import Footer from "./components/Footer";
import ComoFunciona from "./components/ComoFunciona";
import CrearGrupo from "./components/CrearGrupo";
import GrupoCreado from "./components/GrupoCreado";
import MiCuenta from "./components/MiCuenta";
import { JoinGroup } from "./components/JoinGroup";
import FootballData from "./components/FootballData";
import Partidos from "./components/Partidos";

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
                path="/partidos"
                element={
                  <ProtectedRoute>
                    {" "}
                    <Partidos />{" "}
                  </ProtectedRoute>
                }
              />

              <Route
                path="/crear-grupo"
                element={
                  <ProtectedRoute>
                    <CrearGrupo />
                  </ProtectedRoute>
                }
              />
              <Route path="/football-data" element={<FootballData />} />

              <Route path="/mi-cuenta" element={<MiCuenta />} />
              <Route path="/join-group" element={<JoinGroup />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
