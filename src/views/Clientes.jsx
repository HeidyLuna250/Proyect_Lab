import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import TablaClientes from "../components/clientes/TablaClientes";
import TarjetaCliente from "../components/clientes/TarjetaCliente";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    celular: "",
  });
  const [clienteEditar, setClienteEditar] = useState({
    id_cliente: "",
    nombre: "",
    apellido: "",
    celular: "",
  });
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  const cargarClientes = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("id_cliente", { ascending: true });
    if (!error) setClientes(data || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    const filtrados = clientes.filter(
      (cli) =>
        (cli.nombre?.toLowerCase() || "").includes(
          textoBusqueda.toLowerCase(),
        ) ||
        (cli.apellido?.toLowerCase() || "").includes(
          textoBusqueda.toLowerCase(),
        ),
    );
    setClientesFiltrados(filtrados);
    setPaginaActual(1);
  }, [textoBusqueda, clientes]);

  const agregarCliente = async () => {
    // IMPORTANTE: Solo enviamos lo que existe en tu tabla
    const { error } = await supabase.from("clientes").insert([
      {
        nombre: nuevoCliente.nombre,
        apellido: nuevoCliente.apellido,
        celular: nuevoCliente.celular,
      },
    ]);

    if (error) {
      setToast({ mostrar: true, mensaje: "Error al registrar", tipo: "error" });
    } else {
      setToast({
        mostrar: true,
        mensaje: "Cliente registrado!",
        tipo: "exito",
      });
      setMostrarModal(false);
      setNuevoCliente({ nombre: "", apellido: "", celular: "" });
      cargarClientes();
    }
  };

  const actualizarCliente = async () => {
    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: clienteEditar.nombre,
        apellido: clienteEditar.apellido,
        celular: clienteEditar.celular,
      })
      .eq("id_cliente", clienteEditar.id_cliente);

    if (error) {
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar",
        tipo: "error",
      });
    } else {
      setToast({
        mostrar: true,
        mensaje: "Actualizado con éxito",
        tipo: "exito",
      });
      setMostrarModalEdicion(false);
      cargarClientes();
    }
  };

  const eliminarCliente = async () => {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id_cliente", clienteAEliminar.id_cliente);
    if (!error) {
      setToast({ mostrar: true, mensaje: "Cliente eliminado", tipo: "exito" });
      setMostrarModalEliminacion(false);
      cargarClientes();
    }
  };

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina,
  );

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={8}>
          <h3>
            <i className="bi bi-person-lines-fill me-2"></i> Clientes
          </h3>
        </Col>
        <Col xs={4} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi bi-person-plus-fill"></i> Nuevo
          </Button>
        </Col>
      </Row>
      <hr />
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
        placeholder="Buscar por nombre o apellido..."
      />
      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="d-lg-none">
            <TarjetaCliente
              clientes={clientesPaginados}
              abrirModalEdicion={(c) => {
                setClienteEditar(c);
                setMostrarModalEdicion(true);
              }}
              abrirModalEliminacion={(c) => {
                setClienteAEliminar(c);
                setMostrarModalEliminacion(true);
              }}
            />
          </div>
          <div className="d-none d-lg-block">
            <TablaClientes
              clientes={clientesPaginados}
              abrirModalEdicion={(c) => {
                setClienteEditar(c);
                setMostrarModalEdicion(true);
              }}
              abrirModalEliminacion={(c) => {
                setClienteAEliminar(c);
                setMostrarModalEliminacion(true);
              }}
            />
          </div>
          <Paginacion
            registrosPorPagina={registrosPorPagina}
            totalRegistros={clientesFiltrados.length}
            paginaActual={paginaActual}
            establecerPaginaActual={setPaginaActual}
            establecerRegistrosPorPagina={setRegistrosPorPagina}
          />
        </>
      )}
      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={(e) =>
          setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })
        }
        agregarCliente={agregarCliente}
      />
      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={(e) =>
          setClienteEditar({
            ...clienteEditar,
            [e.target.name]: e.target.value,
          })
        }
        actualizarCliente={actualizarCliente}
      />
      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
      />
      <NotificacionOperacion
        {...toast}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Clientes;
