import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  const emailUsuario = usuario?.email?.toLowerCase() || localStorage.getItem("usuario-supabase")?.toLowerCase() || "Usuario Desconocido";

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Card className="shadow-lg border-0" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body className="text-center p-5">
          <div className="mb-4">
            <i className="bi-person-circle" style={{ fontSize: "5rem", color: "var(--bs-primary)" }}></i>
          </div>
          <h3 className="mb-1 fw-bold">Mi Perfil</h3>
          <p className="text-muted mb-4">{emailUsuario}</p>
          
          <hr className="mb-4" />

          <Button variant="outline-danger" size="lg" className="w-100 fw-bold" onClick={cerrarSesion}>
            <i className="bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Perfil;
