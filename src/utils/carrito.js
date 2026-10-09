// Lógica del carrito como funciones puras.
// El carrito guarda solo { codigo, cantidad }; el precio se toma siempre del
// catálogo vigente para que un cambio de precio en administración se refleje.
import { precioVigente } from "./precio";

export function agregarItem(carrito, producto, cantidad = 1) {
  if (producto.stock === 0) {
    throw new Error("Producto sin stock disponible.");
  }
  const existente = carrito.find((item) => item.codigo === producto.codigo);
  const cantidadFinal = (existente ? existente.cantidad : 0) + cantidad;
  if (cantidadFinal > producto.stock) {
    throw new Error(`No puedes superar el stock disponible (${producto.stock} unidades).`);
  }
  if (existente) {
    return carrito.map((item) =>
      item.codigo === producto.codigo ? { ...item, cantidad: cantidadFinal } : item
    );
  }
  return [...carrito, { codigo: producto.codigo, cantidad }];
}

export function cambiarCantidad(carrito, codigo, cantidad, stock) {
  if (cantidad <= 0) return quitarItem(carrito, codigo);
  const cantidadPermitida = Math.min(cantidad, stock);
  return carrito.map((item) =>
    item.codigo === codigo ? { ...item, cantidad: cantidadPermitida } : item
  );
}

export function quitarItem(carrito, codigo) {
  return carrito.filter((item) => item.codigo !== codigo);
}

export function contarUnidades(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Une el carrito con los productos para obtener nombre, precio y subtotal.
export function detallarCarrito(carrito, productos) {
  const detalle = [];
  for (const item of carrito) {
    const producto = productos.find((p) => p.codigo === item.codigo);
    if (!producto) continue; // el producto pudo ser eliminado en administración
    const precioUnitario = precioVigente(producto);
    detalle.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      imagen: producto.imagen,
      stock: producto.stock,
      precioUnitario,
      cantidad: item.cantidad,
      subtotal: precioUnitario * item.cantidad
    });
  }
  return detalle;
}

export function calcularTotal(items) {
  return items.reduce((total, item) => total + item.precioUnitario * item.cantidad, 0);
}
