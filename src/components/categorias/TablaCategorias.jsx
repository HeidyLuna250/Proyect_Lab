import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCategoria,
  copiarCategoria,
}) => {
  const hayCategorias = Array.isArray(categorias) && categorias.length > 0;

  return (
    <>
      {!hayCategorias ? (
        <div className="text-center text-muted py-4">
          <h5 className="mb-0">No hay categorías registradas.</h5>
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.id_categoria}</td>
                <td>{categoria.nombre_categoria}</td>
                <td className="d-none d-md-table-cell">
                  {categoria.descripcion_categoria}
                </td>
                <td className="text-center align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => abrirModalEdicion(categoria)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => abrirModalEliminacion(categoria)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => generarPDFCategoria(categoria)}
                    >
                      <i className="bi bi-file-earmark-pdf"></i>
                    </Button>

                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => copiarCategoria(categoria)}
                      title="Copiar al portapapeles"
                    >
                      <i className="bi bi-clipboard"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaCategorias;
