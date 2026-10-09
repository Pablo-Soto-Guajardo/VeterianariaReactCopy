// Persistencia del estado global de la tienda: carrito y sesión.
import { eliminarDatos, guardarDatos, leerDatos } from "./almacenamiento";

export const CLAVE_CARRITO = "sanMarcos.carrito";
export const CLAVE_SESION = "sanMarcos.sesion";

export function leerCarrito() {
  return leerDatos(CLAVE_CARRITO, []);
}

export function guardarCarrito(carrito) {
  guardarDatos(CLAVE_CARRITO, carrito);
}

export function leerSesion() {
  return leerDatos(CLAVE_SESION, null);
}

export function guardarSesion(usuario) {
  if (usuario) {
    guardarDatos(CLAVE_SESION, usuario);
  } else {
    eliminarDatos(CLAVE_SESION);
  }
}
