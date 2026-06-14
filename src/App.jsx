import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegistroTramite from "./pages/RegistroTramite";
import Dashboard from "./pages/Dashboard";
import ListaTramites from "./pages/ListaTramites";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lista" element={<ListaTramites />} />
        <Route path="/registro" element={<RegistroTramite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;