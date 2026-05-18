import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

const TarjetaCliente = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  return (
    <div>
      {clientes.map((cli) => {
        const activa = idTarjetaActiva === cli.id_cliente;
        return (
          <Card
            key={cli.id_cliente}
            className="mb-3 border-0 shadow-sm"
            onMouseEnter={() => setIdTarjetaActiva(cli.id_cliente)}
            onMouseLeave={() => setIdTarjetaActiva(null)}
          >
            <Card.Body style={{ position: "relative" }}>
              <Row className="align-items-center">
                <Col xs={3}>
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="bi bi-person-heart text-primary fs-3"></i>
                  </div>
                </Col>
                <Col xs={9}>
                  <div className="fw-bold">{cli.nombre_cliente}</div>
                  <div className="small text-muted">{cli.correo_cliente}</div>
                </Col>
              </Row>
              {activa && (
                <div
                  className="d-flex gap-2 justify-content-center align-items-center rounded-3"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.6)",
                  }}
                >
                  <Button
                    variant="warning"
                    onClick={() => abrirModalEdicion(cli)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => abrirModalEliminacion(cli)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default TarjetaCliente;
