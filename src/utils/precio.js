// Utilidades de precios. Son funciones puras: reciben datos y devuelven
// un resultado sin modificar la interfaz, por eso son fáciles de probar.

export function formatearPrecio(valor) {
  if (valor === 0) return "Gratis";
  return `$${valor.toLocaleString("es-CL")}`;
}

export function tieneOferta(producto) {
  return (
    producto.precioOferta !== null &&
    producto.precioOferta !== undefined &&
    producto.precioOferta < producto.precio
  );
}

// Precio que realmente paga el cliente.
export function precioVigente(producto) {
  return tieneOferta(producto) ? producto.precioOferta : producto.precio;
}

export function porcentajeDescuento(producto) {
  if (!tieneOferta(producto) || producto.precio === 0) return 0;
  return Math.round((1 - producto.precioOferta / producto.precio) * 100);
}
