import { regiones } from "../data/datosIniciales";

export function obtenerRegion(id) {
  return regiones.find((region) => region.id === id);
}

export function obtenerNombreRegion(id) {
  const region = obtenerRegion(id);
  return region ? region.nombre : "";
}

export function obtenerComunas(idRegion) {
  const region = obtenerRegion(idRegion);
  return region ? region.comunas : [];
}
