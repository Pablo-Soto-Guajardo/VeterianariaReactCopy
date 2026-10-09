import { Col, Container, Row } from "react-bootstrap";
import TarjetaCategoria from "../../components/categorias/TarjetaCategoria";
import { listarCategorias, listarProductos } from "../../data/baseDatos";

function Categorias() {
  const categorias = listarCategorias();
  const productos = listarProductos();

  return (
    <Container className="py-4">
      <h1>Categorías</h1>
      <p className="text-body-secondary">Elige una categoría para ver sus productos.</p>
      <Row className="g-4">
        {categorias.map((categoria) => (
          <Col xs={6} md={4} lg={3} xl={2} key={categoria.id}>
            <TarjetaCategoria
              categoria={categoria}
              cantidad={productos.filter((producto) => producto.categoria === categoria.id).length}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Categorias;
