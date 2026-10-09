import { Card, Col, Row, Table } from "react-bootstrap";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import TarjetaEstadistica from "../../components/admin/TarjetaEstadistica";
import { listarCategorias, listarOrdenes, listarProductos } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/precio";
import { productosMasVendidos, resumenVentas, ventasPorCategoria } from "../../utils/reportes";

function Reportes() {
  const ordenes = listarOrdenes();
  const resumen = resumenVentas(ordenes);
  const porCategoria = ventasPorCategoria(ordenes, listarProductos(), listarCategorias());
  const masVendidos = productosMasVendidos(ordenes);

  return (
    <>
      <EncabezadoAdmin titulo="Reportes" subtitulo="Indicadores de ventas de la tienda online" />
      <Row className="g-3 mb-4">
        <Col xs={12} md={6} xl={3}>
          <TarjetaEstadistica titulo="Total vendido" valor={formatearPrecio(resumen.totalVendido)} detalle="Órdenes pagadas" icono="bi-cash-coin" color="primary" />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaEstadistica titulo="Órdenes pagadas" valor={resumen.cantidadPagadas} detalle={`de ${resumen.cantidadOrdenes} órdenes`} icono="bi-bag-check" color="success" />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaEstadistica titulo="Pagos rechazados" valor={resumen.cantidadRechazadas} detalle="Requieren seguimiento" icono="bi-x-octagon" color="danger" />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaEstadistica titulo="Ticket promedio" valor={formatearPrecio(resumen.ticketPromedio)} detalle="Por orden pagada" icono="bi-receipt" color="secondary" />
        </Col>
      </Row>
      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h2 className="h5">Ventas por categoría</h2>
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th scope="col">Categoría</th>
                    <th scope="col" className="text-end">Total vendido</th>
                  </tr>
                </thead>
                <tbody>
                  {porCategoria.map((fila) => (
                    <tr key={fila.id}>
                      <th scope="row" className="fw-normal">{fila.nombre}</th>
                      <td className="text-end">{formatearPrecio(fila.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h2 className="h5">Productos más vendidos</h2>
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col" className="text-end">Unidades</th>
                  </tr>
                </thead>
                <tbody>
                  {masVendidos.map((fila) => (
                    <tr key={fila.codigo}>
                      <th scope="row" className="fw-normal">{fila.nombre}</th>
                      <td className="text-end">{fila.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Reportes;
