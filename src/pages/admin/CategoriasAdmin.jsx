import { useState } from "react";
import { Alert, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AvisoNavegacion from "../../components/admin/AvisoNavegacion";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import ModalConfirmacion from "../../components/comunes/ModalConfirmacion";
import { eliminarCategoria, listarCategorias, listarProductos } from "../../data/baseDatos";

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState(() => listarCategorias());
  const [porEliminar, setPorEliminar] = useState(null);
  const [aviso, setAviso] = useState(null);
  const productos = listarProductos();

  function confirmarEliminacion() {
    try {
      eliminarCategoria(porEliminar.id);
      setCategorias(listarCategorias());
      setAviso({ tipo: "success", texto: `Categoría ${porEliminar.nombre} eliminada.` });
    } catch (error) {
      setAviso({ tipo: "danger", texto: error.message });
    }
    setPorEliminar(null);
  }

  return (
    <>
      <EncabezadoAdmin titulo="Categorías" subtitulo={`${categorias.length} categorías`}>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1" aria-hidden="true"></i> Nueva categoría
        </Link>
      </EncabezadoAdmin>
      <AvisoNavegacion />
      {aviso && (
        <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover className="align-middle mb-0">
            <caption>Categorías de productos de la tienda</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col" className="text-center">Productos</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => {
                const cantidad = productos.filter((producto) => producto.categoria === categoria.id).length;
                return (
                  <tr key={categoria.id}>
                    <th scope="row">{categoria.nombre}</th>
                    <td>{categoria.descripcion || "—"}</td>
                    <td className="text-center">{cantidad}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/admin/categorias/${categoria.id}/editar`} className="btn btn-sm btn-outline-primary" aria-label={`Editar ${categoria.nombre}`}>
                          <i className="bi bi-pencil" aria-hidden="true"></i>
                        </Link>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPorEliminar(categoria)} aria-label={`Eliminar ${categoria.nombre}`}>
                          <i className="bi bi-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ModalConfirmacion
        mostrar={Boolean(porEliminar)}
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar la categoría "${porEliminar?.nombre}"? Solo es posible si no tiene productos.`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

export default CategoriasAdmin;
