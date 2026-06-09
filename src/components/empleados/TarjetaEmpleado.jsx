import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaEmpleado = ({ empleados, abrirModalEdicion }) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(empleados && empleados.length > 0));
  }, [empleados]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando empleados...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {empleados.map((empleado) => {
            const tarjetaActiva = idTarjetaActiva === empleado.id_empleado;

            return (
              <Card
                key={empleado.id_empleado}
                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={() => setIdTarjetaActiva(empleado.id_empleado)}
                onMouseLeave={() => setIdTarjetaActiva(null)}
              >
                <Card.Body style={{ position: "relative" }}>
                  <Row className="align-items-center gx-3">
                    <Col xs="auto" className="px-2">
                      <div
                        className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-empleado-placeholder-imagen"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <i className="bi bi-person text-muted fs-3"></i>
                      </div>
                    </Col>

                    <Col className="text-start">
                      <div className="fw-semibold text-truncate">
                        {empleado.nombre_empleado} {empleado.apellido_empleado}
                      </div>
                      <div className="small text-muted">{empleado.email}</div>
                      <div className="small text-muted">
                        Celular: {empleado.celular || "-"}
                      </div>
                    </Col>

                    <Col
                      xs="auto"
                      className="d-flex flex-column align-items-end justify-content-center text-end"
                    >
                      <div className="text-muted small">
                        {empleado.tipo_empleado}
                      </div>
                      <div className="fw-bold text-dark">
                        {empleado.pin || "-"}
                      </div>
                      <div className="fw-semibold small">Activo</div>
                    </Col>
                  </Row>
                  {tarjetaActiva && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                      }}
                    >
                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEdicion(empleado);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaEmpleado;
