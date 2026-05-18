import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => (
  <Modal
    show={mostrarModalEdicion}
    onHide={() => setMostrarModalEdicion(false)}
    centered
    backdrop="static"
  >
    <Modal.Header closeButton>
      <Modal.Title>Editar Cliente</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={clienteEditar.nombre || ""}
            onChange={manejoCambioInputEdicion}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            name="apellido"
            value={clienteEditar.apellido || ""}
            onChange={manejoCambioInputEdicion}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Celular</Form.Label>
          <Form.Control
            name="celular"
            type="number"
            value={clienteEditar.celular || ""}
            onChange={manejoCambioInputEdicion}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={actualizarCliente}>
        Guardar Cambios
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalEdicionCliente;
