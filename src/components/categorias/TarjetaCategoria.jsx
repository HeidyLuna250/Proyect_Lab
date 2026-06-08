import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCategoria = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
  copiarCategoria,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(categorias && categorias.length > 0));
  }, [categorias]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando categorías...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {categorias.map((categoria) => {
            const activa = idTarjetaActiva === categoria.id_categoria;

            return (
              <Card
                key={categoria.id_categoria}
                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={() => setIdTarjetaActiva(categoria.id_categoria)}
                onMouseLeave={() => setIdTarjetaActiva(null)}
              >
                <Card.Body style={{ position: "relative" }}>
                  <Row className="align-items-center gx-3">
                    <Col xs={3}>
                      <div
                        className="bg-light d-flex align-items-center justify-content-center rounded"
                        style={{
                          width: "60px",
                          height: "60px",
                          margin: "auto",
                        }}
                      >
                        <i className="bi bi-bookmark text-muted fs-3"></i>
                      </div>
                    </Col>

                    {/* INFO */}
                    <Col xs={6}>
                      <div className="fw-semibold text-truncate">
                        {categoria.nombre_categoria}
                      </div>

                      <div className="small text-muted text-truncate">
                        {categoria.descripcion_categoria || "Sin descripción"}
                      </div>
                    </Col>

                    {/* ESTADO */}
                    <Col xs={3} className="text-end">
                      <div className="fw-semibold small text-success">
                        Activa
                      </div>
                    </Col>
                  </Row>

                  {activa && (
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
                            abrirModalEdicion(categoria);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEliminacion(categoria);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copiarCategoria(categoria);
                          }}
                          title="Copiar al portapapeles"
                        >
                          <i className="bi bi-clipboard"></i>
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

export default TarjetaCategoria;
