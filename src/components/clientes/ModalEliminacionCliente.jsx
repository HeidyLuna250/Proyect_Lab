import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCliente,
  cliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    setDeshabilitado(true);
    await eliminarCliente();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      centered
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Eliminar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>
          ¿Seguro que deseas eliminar a{" "}
          <strong>{cliente?.nombre_cliente}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={deshabilitado}
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;
