import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaVenta = ({ ventas, abrirEdicion }) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(ventas && ventas.length > 0));
  }, [ventas]);

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
          <h5>Cargando ventas...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {ventas.map((venta) => {
            const tarjetaActiva = idTarjetaActiva === venta.id_venta;
            return (
              <Card
                key={venta.id_venta}
                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={() => setIdTarjetaActiva(venta.id_venta)}
                onMouseLeave={() => setIdTarjetaActiva(null)}
              >
                <Card.Body style={{ position: "relative" }}>
                  <Row className="align-items-center gx-3">
                    <Col xs={2} className="px-2">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-venta-placeholder-imagen">
                        <i className="bi bi-receipt text-muted fs-3"></i>
                      </div>
                    </Col>
                    <Col xs={6} className="text-start">
                      <div className="fw-semibold text-truncate">
                        {venta.clientes?.nombre_cliente}{" "}
                        {venta.clientes?.apellido_cliente}
                      </div>
                      <div className="small text-muted text-truncate">
                        {new Date(venta.fecha_venta).toLocaleString("es-NI")}
                      </div>
                    </Col>
                    <Col xs={4} className="text-end">
                      <div className="fw-bold text-success">
                        C$ {parseFloat(venta.total || 0).toFixed(2)}
                      </div>
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
                            abrirEdicion(venta);
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

export default TarjetaVenta;
