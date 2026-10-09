// Convierte un texto en un identificador para URL: "Alimentos clínicos" -> "alimentos-clinicos".
export function crearSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export function formatearFechaHora(fechaIso) {
  return new Date(fechaIso).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
