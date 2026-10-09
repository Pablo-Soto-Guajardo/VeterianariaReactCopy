import { Col, Row } from "react-bootstrap";
import { listarCategorias } from "../../data/baseDatos";
import TarjetaProducto from "./TarjetaProducto";

// Grilla responsiva: 1 columna en móvil, 2 en tablet, 3 en escritorio y 4 en pantallas grandes.
function GrillaProductos({ productos, onAgregar, columnasXl = 4 }) {
  const categorias = listarCategorias();

  function nombreCategoria(id) {
    const categoria = categorias.find((c) => c.id === id);
    return categoria ? categoria.nombre : "";
  }

  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col xs={12} sm={6} lg={4} xl={12 / columnasXl} key={producto.codigo}>
          <TarjetaProducto
            producto={producto}
            nombreCategoria={nombreCategoria(producto.categoria)}
            onAgregar={onAgregar}
          />
        </Col>
      ))}
    </Row>
  );
}

export default GrillaProductos;
