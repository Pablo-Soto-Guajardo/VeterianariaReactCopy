import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import DatosOrden from "../../components/compra/DatosOrden";
import TablaItemsCompra from "../../components/compra/TablaItemsCompra";
import { obtenerOrden } from "../../data/baseDatos";
import { formatearFechaHora } from "../../utils/texto";

function CompraExitosa() {
  const { numero } = useParams();
  const orden = obtenerOrden(numero);
  const [correoEnviado, setCorreoEnviado] = useState(false);

  if (!orden || orden.estado !== "Pagada") {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Compra no encontrada</h1>
        <MensajeVacio icono="bi-receipt" titulo="No encontramos una compra pagada con ese número" enlace="/" textoEnlace="Volver al inicio" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex flex-wrap justify-content-between gap-2">
                <h1 className="h3 text-success mb-1">
                  <i className="bi bi-check-circle me-2" aria-hidden="true"></i>
                  Se ha realizado la compra. nro #{orden.numero}
                </h1>
                <p className="small text-body-secondary mb-0">Código orden: ORDER{orden.numero}</p>
              </div>
              <p className="text-body-secondary">
                {formatearFechaHora(orden.fecha)} · Autorización {orden.pago.codigoAutorizacion} · Tarjeta terminada en {orden.pago.ultimosDigitos}
              </p>

              <DatosOrden orden={orden} />

              <h2 className="h5 mt-4">Productos</h2>
              <TablaItemsCompra items={orden.items} total={orden.total} etiquetaTotal="Total pagado" />

              <div className="text-center bg-body-tertiary rounded-3 p-3 mt-4">
                <p className="fs-4 fw-semibold mb-0">Total pagado: ${orden.total.toLocaleString("es-CL")}</p>
              </div>

              {correoEnviado && (
                <Alert variant="success" className="mt-3" role="status">
                  Enviamos la boleta a {orden.cliente.correo}.
                </Alert>
              )}

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-4 no-imprimir">
                <Button variant="danger" onClick={() => window.print()}>
                  <i className="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>
                  Imprimir boleta en PDF
                </Button>
                <Button variant="success" onClick={() => setCorreoEnviado(true)}>
                  <i className="bi bi-envelope me-1" aria-hidden="true"></i>
                  Enviar boleta por email
                </Button>
                <Link to="/productos" className="btn btn-outline-primary">
                  Seguir comprando
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CompraExitosa;
