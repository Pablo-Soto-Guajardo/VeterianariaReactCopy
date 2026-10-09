import { Button, Card } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoOrden from "../../components/admin/EstadoOrden";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import DatosOrden from "../../components/compra/DatosOrden";
import TablaItemsCompra from "../../components/compra/TablaItemsCompra";
import { obtenerOrden } from "../../data/baseDatos";
import { formatearFechaHora } from "../../utils/texto";

function DetalleOrden() {
  const { numero } = useParams();
  const orden = obtenerOrden(numero);

  if (!orden) {
    return <MensajeVacio icono="bi-receipt" titulo={`La orden #${numero} no existe`} enlace="/admin/ordenes" textoEnlace="Volver a órdenes" />;
  }

  return (
    <>
      <EncabezadoAdmin titulo={`Boleta #${orden.numero}`} subtitulo={formatearFechaHora(orden.fecha)}>
        <Button variant="outline-secondary" onClick={() => window.print()} className="no-imprimir">
          <i className="bi bi-printer me-1" aria-hidden="true"></i> Imprimir
        </Button>
        <Link to="/admin/ordenes" className="btn btn-outline-primary no-imprimir">Volver</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <p className="mb-1">
            Estado: <EstadoOrden estado={orden.estado} />
          </p>
          <p className="small text-body-secondary">
            Pago con tarjeta terminada en {orden.pago.ultimosDigitos} ·{" "}
            {orden.estado === "Pagada" ? `Autorización ${orden.pago.codigoAutorizacion}` : `Motivo: ${orden.pago.motivo}`}
          </p>
          <DatosOrden orden={orden} />
          <h2 className="h5 mt-4">Productos</h2>
          <TablaItemsCompra items={orden.items} total={orden.total} etiquetaTotal={orden.estado === "Pagada" ? "Total pagado" : "Total"} />
        </Card.Body>
      </Card>
    </>
  );
}

export default DetalleOrden;
