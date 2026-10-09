import { formatearPrecio, porcentajeDescuento, tieneOferta } from "../../utils/precio";

// Muestra el precio; si hay oferta, también el precio anterior tachado.
function PrecioProducto({ producto, grande = false }) {
  const clase = grande ? "fs-3 fw-bold text-primary" : "fs-5 fw-bold text-primary";

  if (!tieneOferta(producto)) {
    return <p className={`${clase} mb-1`}>{formatearPrecio(producto.precio)}</p>;
  }

  return (
    <p className="mb-1">
      <span className="precio-anterior me-2">
        <span className="visually-hidden">Precio normal: </span>
        {formatearPrecio(producto.precio)}
      </span>
      <span className={clase}>
        <span className="visually-hidden">Precio oferta: </span>
        {formatearPrecio(producto.precioOferta)}
      </span>
      <span className="badge text-bg-danger ms-2">-{porcentajeDescuento(producto)}%</span>
    </p>
  );
}

export default PrecioProducto;
