// Funciones de bajo nivel para leer y escribir en localStorage.
// Todo el proyecto guarda datos mediante estas dos funciones.

export function leerDatos(clave, valorInicial) {
  const texto = localStorage.getItem(clave);
  if (texto === null) return valorInicial;
  try {
    return JSON.parse(texto);
  } catch {
    // Si el texto guardado está dañado, se usa el valor inicial.
    return valorInicial;
  }
}

export function guardarDatos(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function eliminarDatos(clave) {
  localStorage.removeItem(clave);
}
