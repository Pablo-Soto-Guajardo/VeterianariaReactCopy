import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import GrillaProductos from "../../components/productos/GrillaProductos";
import { listarProductos, listarProductosEnOferta } from "../../data/baseDatos";
import { calcularTotal, contarUnidades, detallarCarrito } from "../../utils/carrito";
import { formatearPrecio } from "../../utils/precio";

function Carrito({ carrito, onCambiarCantidad, onQuitar, onVaciar, onAgregar }) {
  const navigate = useNavigate();
  const items = detallarCarrito(carrito, listarProductos());
  const total = calcularTotal(items);
  const sugeridos = listarProductosEnOferta()
    .filter((producto) => !carrito.some((item) => item.codigo === producto.codigo))
    .slice(0, 4);

  return (
    <Container className="py-4">
      <h1>Carrito de compras</h1>

      {items.length === 0 ? (
        <MensajeVacio
          icono="bi-cart-x"
          titulo="Tu carrito está vacío"
          texto="Agrega productos desde el catálogo para comenzar tu compra."
          enlace="/productos"
          textoEnlace="Ver productos"
        />
      ) : (
        <Row className="g-4">
          <Col xs={12} lg={8}>
            <ListGroup as="ul" aria-label="Productos en el carrito">
              {items.map((item) => (
                <ListGroup.Item as="li" key={item.codigo} className="d-flex flex-wrap align-items-center gap-3 py-3">
                  <ImagenConRespaldo src={item.imagen} alt="" className="imagen-miniatura" />
                  <div className="flex-grow-1" style={{ minWidth: "10rem" }}>
                    <Link to={`/productos/${item.codigo}`} className="fw-semibold text-decoration-none">
                      {item.nombre}
                    </Link>
                    <p className="small text-body-secondary mb-0">
                      {formatearPrecio(item.precioUnitario)} c/u
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-2" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onCambiarCantidad(item.codigo, item.cantidad - 1)}
                      aria-label={`Quitar una unidad de ${item.nombre}`}
                    >
                      −
                    </Button>
                    <span className="fw-semibold text-center" style={{ minWidth: "2rem" }} aria-live="polite">
                      {item.cantidad}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onCambiarCantidad(item.codigo, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      aria-label={`Agregar una unidad de ${item.nombre}`}
                    >
                      +
                    </Button>
                  </div>
                  <p className="fw-bold mb-0 text-end" style={{ minWidth: "6rem" }}>
                    {item.subtotal === 0 ? "$0" : formatearPrecio(item.subtotal)}
                  </p>
                  <Button variant="outline-danger" size="sm" onClick={() => onQuitar(item.codigo)} aria-label={`Eliminar ${item.nombre} del carrito`}>
                    <i className="bi bi-trash" aria-hidden="true"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col xs={12} lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h5">Resumen</h2>
                <div className="d-flex justify-content-between">
                  <span>Productos ({contarUnidades(carrito)})</span>
                  <span>{total === 0 ? "$0" : formatearPrecio(total)}</span>
                </div>
                <div className="d-flex justify-content-between text-body-secondary small">
                  <span>Despacho</span>
                  <span>Se calcula al confirmar</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total</span>
                  <span data-testid="total-carrito">{total === 0 ? "$0" : formatearPrecio(total)}</span>
                </div>
                <div className="d-grid gap-2 mt-3">
                  <Button variant="success" size="lg" onClick={() => navigate("/checkout")}>
                    Comprar ahora
                  </Button>
                  <Button variant="outline-secondary" onClick={onVaciar}>
                    Limpiar carrito
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {sugeridos.length > 0 && (
        <section className="mt-5" aria-labelledby="titulo-sugeridos">
          <h2 id="titulo-sugeridos" className="h4 mb-3">También te puede interesar</h2>
          <GrillaProductos productos={sugeridos} onAgregar={onAgregar} />
        </section>
      )}
    </Container>
  );
}

export default Carrito;
