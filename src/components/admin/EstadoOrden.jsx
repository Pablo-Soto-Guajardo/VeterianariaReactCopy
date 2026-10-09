// Etiqueta del estado de una orden: texto + ícono + color.
function EstadoOrden({ estado }) {
  const pagada = estado === "Pagada";
  return (
    <span className={`badge ${pagada ? "text-bg-success" : "text-bg-danger"}`}>
      <i className={`bi ${pagada ? "bi-check-circle" : "bi-x-circle"} me-1`} aria-hidden="true"></i>
      {estado}
    </span>
  );
}

export default EstadoOrden;
