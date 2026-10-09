import { estadoStock } from "../../utils/stock";

// Mensaje de disponibilidad. Usa texto e ícono, no solo color.
function EstadoStock({ producto }) {
  const estado = estadoStock(producto);

  if (estado === "agotado") {
    return (
      <p className="text-danger fw-semibold mb-2">
        <i className="bi bi-x-circle me-1" aria-hidden="true"></i>
        Agotado temporalmente
      </p>
    );
  }

  if (estado === "critico") {
    return (
      <p className="text-warning-emphasis fw-semibold mb-2">
        <i className="bi bi-exclamation-triangle me-1" aria-hidden="true"></i>
        ¡Últimas {producto.stock} unidades!
      </p>
    );
  }

  return (
    <p className="text-body-secondary mb-2">
      <i className="bi bi-check-circle me-1" aria-hidden="true"></i>
      Stock: {producto.stock} unidades
    </p>
  );
}

export default EstadoStock;
