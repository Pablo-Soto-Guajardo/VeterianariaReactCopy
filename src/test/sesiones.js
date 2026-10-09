import { CLAVE_SESION } from "../utils/persistencia";

export const sesionAdmin = {
  run: "190110222",
  nombre: "Administrador",
  apellidos: "San Marcos",
  correo: "admin@duoc.cl",
  rol: "Administrador",
  fechaNacimiento: "1990-04-12",
  direccion: "Av. San Juan 1020",
  region: "OHI",
  comuna: "Rancagua"
};

export function iniciarSesionComoAdmin() {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesionAdmin));
}
