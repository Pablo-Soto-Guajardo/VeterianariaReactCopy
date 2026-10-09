import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import DatosOrden from "../../components/compra/DatosOrden";
import TablaItemsCompra from "../../components/compra/TablaItemsCompra";
import { obtenerOrden } from "../../data/baseDatos";

function CompraError() {
  const { numero } = useParams();
  const orden = obtenerOrden(numero);

  if (!orden || orden.estado !== "Rechazada") {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Pago no encontrado</h1>
        <MensajeVacio icono="bi-receipt" titulo="No encontramos un pago rechazado con ese número" enlace="/" textoEnlace="Volver al inicio" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <h1 className="h3 text-danger">
                <i className="bi bi-x-circle me-2" aria-hidden="true"></i>
                No se pudo realizar el pago. nro #{orden.numero}
              </h1>
              <Alert variant="danger" role="alert">
                <strong>Motivo:</strong> {orden.pago.motivo} Tus productos siguen en el carrito; puedes intentarlo nuevamente.
              </Alert>
              <div className="text-center my-3">
                <Link to="/checkout" className="btn btn-success btn-lg">
                  Volver a realizar el pago
                </Link>
              </div>

              <DatosOrden orden={orden} />

              <h2 className="h5 mt-4">Detalle de compra</h2>
              <TablaItemsCompra items={orden.items} total={orden.total} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CompraError;
