import { Card } from "react-bootstrap";

function TarjetaEstadistica({ titulo, valor, detalle, icono, color }) {
  return (
    <Card className={`h-100 border-0 shadow-sm bg-${color} ${color === "warning" ? "text-dark" : "text-white"}`}>
      <Card.Body className="d-flex align-items-center gap-3">
        <i className={`bi ${icono} icono-estadistica`} aria-hidden="true"></i>
        <div>
          <p className="mb-0 fw-semibold">{titulo}</p>
          <p className="fs-3 fw-bold mb-0">{valor}</p>
          <p className="small mb-0 opacity-75">{detalle}</p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TarjetaEstadistica;
