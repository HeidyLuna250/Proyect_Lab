import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./assets/components/navegacion/Encabezado.jsx";

import Inicio from "./assets/views/Inicio.jsx";
import Categorias from "./assets/views/Categorias.jsx";
import Catalogo from "./assets/views/Catalogo.jsx";
import Productos from "./assets/views/Productos.jsx";
import Login from "./assets/views/Login.jsx";
import Pagina404 from "./assets/views/Pagina404.jsx";
import RutaProtegida from "./assets/components/rutas/RutaProtegida.jsx";

import "./App.css";

const App = () => {
  return (
    <Router>

      <Encabezado />

      <main className="margen-superior-main">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>

    </Router>
  );
};

export default App;