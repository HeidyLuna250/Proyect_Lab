import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionEmpleado = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarEmpleado,
  empleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarEmpleado();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
        <p className="mb-0">
          ¿Estás seguro de que deseas eliminar al empleado: <br />
          <strong>{empleado?.nombre_empleado}</strong>?
        </p>
        <small className="text-muted">Esta acción no se puede deshacer.</small>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          No, Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={deshabilitado}
        >
          Sí, Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionEmpleado;