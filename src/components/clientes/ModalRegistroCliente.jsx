import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => (
  <Modal
    show={mostrarModal}
    onHide={() => setMostrarModal(false)}
    centered
    backdrop="static"
  >
    <Modal.Header closeButton>
      <Modal.Title>Registrar Nuevo Cliente</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={nuevoCliente.nombre || ""}
            onChange={manejoCambioInput}
            placeholder="Ej. Juan"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            name="apellido"
            value={nuevoCliente.apellido || ""}
            onChange={manejoCambioInput}
            placeholder="Ej. Pérez"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Celular</Form.Label>
          <Form.Control
            name="celular"
            type="number"
            value={nuevoCliente.celular || ""}
            onChange={manejoCambioInput}
            placeholder="Ej. 88888888"
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setMostrarModal(false)}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={agregarCliente}
        disabled={!nuevoCliente.nombre || !nuevoCliente.apellido}
      >
        Guardar Cliente
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalRegistroCliente;
