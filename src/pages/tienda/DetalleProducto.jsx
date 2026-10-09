import { useState } from "react";
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import EstadoStock from "../../components/productos/EstadoStock";
import GrillaProductos from "../../components/productos/GrillaProductos";
import PrecioProducto from "../../components/productos/PrecioProducto";
import { listarProductosPorCategoria, obtenerCategoria, obtenerProducto } from "../../data/baseDatos";

function DetalleProducto({ onAgregar }) {
  const { codigo } = useParams();
  const producto = obtenerProducto(codigo);
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Producto no encontrado</h1>
        <MensajeVacio
          icono="bi-question-circle"
          titulo="El producto solicitado no existe"
          texto={`No encontramos un producto con el código ${codigo}.`}
          enlace="/productos"
          textoEnlace="Volver al catálogo"
        />
      </Container>
    );
  }

  const categoria = obtenerCategoria(producto.categoria);
  const agotado = producto.stock === 0;
  const relacionados = listarProductosPorCategoria(producto.categoria)
    .filter((item) => item.codigo !== producto.codigo)
    .slice(0, 4);

  function cambiarCantidad(valor) {
    const numero = Math.max(1, Math.min(producto.stock, Number(valor) || 1));
    setCantidad(numero);
  }

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>Productos</Breadcrumb.Item>
        {categoria && (
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/categorias/${categoria.id}` }}>
            {categoria.nombre}
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>{producto.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-4 g-lg-5 mb-5">
        <Col xs={12} md={6}>
          <ImagenConRespaldo src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-3 shadow-sm w-100 imagen-tarjeta" />
        </Col>
        <Col xs={12} md={6}>
          {categoria && <span className="badge text-bg-light border mb-2">{categoria.nombre}</span>}
          <h1 className="h2">{producto.nombre}</h1>
          <p className="text-body-secondary mb-2">
            {producto.presentacion} · Código {producto.codigo}
          </p>
          <PrecioProducto producto={producto} grande />
          <EstadoStock producto={producto} />
          <p className="mt-3">{producto.descripcion}</p>

          <div className="d-flex flex-wrap gap-2 align-items-end mt-4">
            <Form.Group controlId="cantidad-detalle" style={{ maxWidth: "11rem" }}>
              <Form.Label>Cantidad</Form.Label>
              <InputGroup>
                <Button variant="outline-secondary" onClick={() => cambiarCantidad(cantidad - 1)} disabled={agotado || cantidad <= 1} aria-label="Disminuir cantidad">
                  −
                </Button>
                <Form.Control
                  type="number"
                  min={1}
                  max={producto.stock}
                  value={cantidad}
                  onChange={(evento) => cambiarCantidad(evento.target.value)}
                  disabled={agotado}
                  className="text-center"
                />
                <Button variant="outline-secondary" onClick={() => cambiarCantidad(cantidad + 1)} disabled={agotado || cantidad >= producto.stock} aria-label="Aumentar cantidad">
                  +
                </Button>
              </InputGroup>
            </Form.Group>
            <Button size="lg" onClick={() => onAgregar(producto, cantidad)} disabled={agotado}>
              <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>
              {agotado ? "Sin stock" : "Añadir al carrito"}
            </Button>
          </div>
        </Col>
      </Row>

      {relacionados.length > 0 && (
        <section aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados" className="h4 mb-3">Productos relacionados</h2>
          <GrillaProductos productos={relacionados} onAgregar={(item) => onAgregar(item, 1)} />
        </section>
      )}
    </Container>
  );
}

export default DetalleProducto;
