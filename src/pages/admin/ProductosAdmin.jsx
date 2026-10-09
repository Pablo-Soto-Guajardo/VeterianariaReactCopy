import { useState } from "react";
import { Alert, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AvisoNavegacion from "../../components/admin/AvisoNavegacion";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import ModalConfirmacion from "../../components/comunes/ModalConfirmacion";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import { eliminarProducto, listarCategorias, listarProductos } from "../../data/baseDatos";
import { filtrarProductos } from "../../utils/filtros";
import { formatearPrecio } from "../../utils/precio";
import { estadoStock } from "../../utils/stock";

function ProductosAdmin() {
  const [productos, setProductos] = useState(() => listarProductos());
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [porEliminar, setPorEliminar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const categorias = listarCategorias();

  const visibles = filtrarProductos(productos, { texto: busqueda, categoria });

  function nombreCategoria(id) {
    return categorias.find((c) => c.id === id)?.nombre || "Sin categoría";
  }

  function confirmarEliminacion() {
    eliminarProducto(porEliminar.codigo);
    setProductos(listarProductos());
    setMensaje(`Producto ${porEliminar.nombre} eliminado.`);
    setPorEliminar(null);
  }

  return (
    <>
      <EncabezadoAdmin titulo="Productos" subtitulo={`${productos.length} productos en inventario`}>
        <Link to="/admin/productos/criticos" className="btn btn-outline-warning">
          <i className="bi bi-exclamation-triangle me-1" aria-hidden="true"></i> Críticos
        </Link>
        <Link to="/admin/productos/reportes" className="btn btn-outline-primary">
          <i className="bi bi-bar-chart me-1" aria-hidden="true"></i> Reportes
        </Link>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1" aria-hidden="true"></i> Nuevo producto
        </Link>
      </EncabezadoAdmin>

      <AvisoNavegacion />
      {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje("")}>{mensaje}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-3 mb-3">
            <Col xs={12} md={8}>
              <Form.Group controlId="admin-productos-busqueda">
                <Form.Label>Buscar</Form.Label>
                <Form.Control type="search" placeholder="Código o nombre" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="admin-productos-categoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
                  <option value="">Todas</option>
                  {categorias.map((item) => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Table responsive hover className="align-middle">
            <caption>Inventario de medicamentos y artículos de la tienda</caption>
            <thead>
              <tr>
                <th scope="col">Imagen</th>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col" className="text-center">Stock</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((producto) => {
                const estado = estadoStock(producto);
                return (
                  <tr key={producto.codigo}>
                    <td><ImagenConRespaldo src={producto.imagen} alt="" className="imagen-miniatura" /></td>
                    <th scope="row">{producto.codigo}</th>
                    <td>{producto.nombre}</td>
                    <td>{nombreCategoria(producto.categoria)}</td>
                    <td className="text-end">{formatearPrecio(producto.precio)}</td>
                    <td className="text-center">
                      <span className={`badge ${estado === "agotado" ? "text-bg-danger" : estado === "critico" ? "text-bg-warning" : "text-bg-light border"}`}>
                        {producto.stock}
                        {estado !== "disponible" && <span className="ms-1">({estado === "agotado" ? "agotado" : "crítico"})</span>}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/admin/productos/${producto.codigo}`} className="btn btn-sm btn-outline-secondary" aria-label={`Ver ${producto.nombre}`}>
                          <i className="bi bi-eye" aria-hidden="true"></i>
                        </Link>
                        <Link to={`/admin/productos/${producto.codigo}/editar`} className="btn btn-sm btn-outline-primary" aria-label={`Editar ${producto.nombre}`}>
                          <i className="bi bi-pencil" aria-hidden="true"></i>
                        </Link>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPorEliminar(producto)} aria-label={`Eliminar ${producto.nombre}`}>
                          <i className="bi bi-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-body-secondary py-4">No hay productos que coincidan con la búsqueda.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ModalConfirmacion
        mostrar={Boolean(porEliminar)}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${porEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

export default ProductosAdmin;
