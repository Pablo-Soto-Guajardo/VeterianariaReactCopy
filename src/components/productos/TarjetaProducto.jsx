import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImagenConRespaldo from "../comunes/ImagenConRespaldo";
import EstadoStock from "./EstadoStock";
import PrecioProducto from "./PrecioProducto";

// Tarjeta de un producto del catálogo.
// Recibe por props el producto a mostrar y la función que se ejecuta al agregarlo.
function TarjetaProducto({ producto, nombreCategoria, onAgregar }) {
  const agotado = producto.stock === 0;
  const urlDetalle = `/productos/${producto.codigo}`;

  return (
    <Card as="article" className="h-100 shadow-sm tarjeta-enlace">
      <Link to={urlDetalle} tabIndex={-1} aria-hidden="true">
        <ImagenConRespaldo src={producto.imagen} alt="" className="card-img-top imagen-tarjeta" />
      </Link>
      <Card.Body className="d-flex flex-column">
        {nombreCategoria && (
          <span className="badge text-bg-light border align-self-start mb-2">{nombreCategoria}</span>
        )}
        <h3 className="h6 mb-1">
          <Link to={urlDetalle} className="text-decoration-none">
            {producto.nombre}
          </Link>
        </h3>
        <p className="small text-body-secondary mb-2">{producto.presentacion}</p>
        <PrecioProducto producto={producto} />
        <EstadoStock producto={producto} />
        <button
          type="button"
          className="btn btn-primary mt-auto"
          onClick={() => onAgregar(producto)}
          disabled={agotado}
          aria-label={agotado ? `${producto.nombre} sin stock` : `Añadir ${producto.nombre} al carrito`}
        >
          <i className="bi bi-cart-plus me-1" aria-hidden="true"></i>
          {agotado ? "Sin stock" : "Añadir al carrito"}
        </button>
      </Card.Body>
    </Card>
  );
}

export default TarjetaProducto;
