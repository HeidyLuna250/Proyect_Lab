import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.png";

// 6. Asegurese de importar AuthContext en su componente Encabezado:
import { useAuth } from "../../context/AuthContext";
import InstallPWAButton from "../InstallPWAButton";
import ChatIA from "../ia/ChatIA";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarChatIA, setMostrarChatIA] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); //Para detectar la ruta actual

  // 7. Dentro de la lógia del Encabezado desestructure la funcion paa verrificar los permisos, cierre de sesión y usuario autenticado:
  const { tienePermiso, logout, usuario } = useAuth();

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  // 8. Actualice la función cerrarSesion, quedando de la siguiente forma:
  const cerrarSesion = async () => {
    await logout();
    setMostrarMenu(false);
    navigate("/login");
  };

  //Detectar rutas especiales
  const esLogin = location.pathname === "/login";
  const esCatalogo =
    location.pathname === "/catalogo" &&
    localStorage.getItem("usuario-supabase") === null;

  //Contenido del menú
  let contenidoMenu;

  if (esLogin) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion("/login")}
          className={mostrarMenu ? "color-texto-marca" : "text-white"}
        >
          <i className="bi-person-fill-lock me-2"></i>
          Iniciar sesión
        </Nav.Link>
      </Nav>
    );
  } else {
    if (esCatalogo) {
      contenidoMenu = (
        <Nav className="ms-auto pe-2 align-items-md-center gap-md-2">
          <Nav.Link
            onClick={() => manejarNavegacion("/catalogo")}
            className="px-2"
          >
            <i className="bi-images me-2 d-md-none"></i>
            Catálogo
          </Nav.Link>
        </Nav>
      );
    } else {
      contenidoMenu = (
        <>
          <Nav className="ms-auto pe-2 align-items-md-center gap-md-2">
            {/* 9. Utilice la función tienePermiso para valdiar y envolver las opciones de navegación */}

            {tienePermiso("ver_inicio") && (
              <Nav.Link
                onClick={() => manejarNavegacion("/")}
                className="px-2"
              >
                <i className="bi-house-fill me-2 d-md-none"></i>
                Inicio
              </Nav.Link>
            )}

            {tienePermiso("ver_categorias") && (
              <Nav.Link
                onClick={() => manejarNavegacion("/categorias")}
                className="px-2"
              >
                <i className="bi-bookmark-fill me-2 d-md-none"></i>
                Categorías
              </Nav.Link>
            )}

            {tienePermiso("ver_productos") && (
              <Nav.Link
                onClick={() => manejarNavegacion("/productos")}
                className="px-2"
              >
                <i className="bi-bag-heart-fill me-2 d-md-none"></i>
                Productos
              </Nav.Link>
            )}

            {tienePermiso("ver_empleados") && (
              <Nav.Link
                onClick={() => manejarNavegacion("/empleados")}
                className="px-2"
              >
                <i className="bi-people-fill me-2 d-md-none"></i>
                Empleados
              </Nav.Link>
            )}

            {tienePermiso("ver_clientes") && (
              <Nav.Link
                onClick={() => manejarNavegacion("/clientes")}
                className="px-2"
              >
                <i className="bi-person-lines-fill me-2 d-md-none"></i>
                Clientes
              </Nav.Link>
            )}

            {/* Opción para navegar a la vista de Permisos */}
            {tienePermiso("ver_permisos") && (
              <Nav.Link
                onClick={() => manejarNavegacion("/permisos")}
                className="px-2"
              >
                <i className="bi-shield-lock-fill me-2 d-md-none"></i>
                Permisos
              </Nav.Link>
            )}

            {/*Opción para ir al catálogo público desde admin */}
            <Nav.Link
              onClick={() => manejarNavegacion("/catalogo")}
              className="px-2"
            >
              <i className="bi-images me-2 d-md-none"></i>
              Catálogo
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/ventas")}
              className="px-2"
            >
             <i className="bi-cart-fill me-2 d-md-none"></i>
              Ventas
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/perfil")}
              className="px-2"
            >
              <i className="bi-person-circle me-2 d-md-none"></i>
              Perfil
            </Nav.Link>

            <Nav.Link onClick={() => { setMostrarChatIA(true); setMostrarMenu(false); }} className="px-2">
              <i className="bi bi-robot me-2 d-md-none"></i>
              IA
            </Nav.Link>

            {/*Icono cerrar sesión en barra superior (visible solo cuando el menú colapsable está cerrado) */}
            {!mostrarMenu && (
              <Nav.Link onClick={cerrarSesion} className="px-2 text-danger">
                <i className="bi-box-arrow-right fs-5"></i>
              </Nav.Link>
            )}
          </Nav>

          {/* El perfil y cerrado de sesión se movieron a la vista Perfil */}
        </>
      );
    }
  }

  return (
    <>
      <Navbar
        expand="md"
        fixed="top"
        className="color-navbar shadow-lg"
        variant="light"
      >
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion(esCatalogo ? "/catalogo" : "/")}
          className="color-texto-marca fw-bold d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img
            alt=""
            src={logo}
            width="45"
            height="45"
            className="d-inline-block me-2"
          />
          <strong>
            <h4 className="mb-0">Variedades</h4>
          </strong>
        </Navbar.Brand>

        {/* Botón de instalación PWA */}
        <InstallPWAButton />

        {/* Botón del menú */}
        {!esLogin && (
          <Navbar.Toggle
            aria-controls="menu-offcanvas"
            onClick={manejarToggle}
          />
        )}

        {/*Menú lateral */}
        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú NL Variedades</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>{contenidoMenu}</Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      </Navbar>
      <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
    </>
  );
};

export default Encabezado;
