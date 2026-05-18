import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => (
  <Table striped borderless hover responsive size="sm" className="shadow-sm">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Celular</th>
        <th className="text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {clientes.map((cli) => (
        <tr key={cli.id_cliente}>
          <td>{cli.id_cliente}</td>
          <td>{cli.nombre}</td>
          <td>{cli.apellido}</td>
          <td>{cli.celular}</td>
          <td className="text-center">
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              onClick={() => abrirModalEdicion(cli)}
            >
              <i className="bi bi-pencil"></i>
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => abrirModalEliminacion(cli)}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TablaClientes;
