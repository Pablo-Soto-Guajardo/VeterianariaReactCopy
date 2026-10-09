// Filtros y ordenamiento del catálogo. Se usan en la página Productos.
import { precioVigente } from "./precio";

function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function filtrarProductos(productos, { texto = "", categoria = "", soloDisponibles = false } = {}) {
  const busqueda = normalizar(texto.trim());
  return productos.filter((producto) => {
    const coincideTexto =
      busqueda === "" ||
      normalizar(producto.nombre).includes(busqueda) ||
      normalizar(producto.descripcion).includes(busqueda) ||
      normalizar(producto.codigo).includes(busqueda);
    const coincideCategoria = categoria === "" || producto.categoria === categoria;
    const coincideStock = !soloDisponibles || producto.stock > 0;
    return coincideTexto && coincideCategoria && coincideStock;
  });
}

export function ordenarProductos(productos, criterio) {
  const copia = [...productos];
  if (criterio === "precio-asc") copia.sort((a, b) => precioVigente(a) - precioVigente(b));
  if (criterio === "precio-desc") copia.sort((a, b) => precioVigente(b) - precioVigente(a));
  if (criterio === "nombre") copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return copia;
}
