import { useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoOrden from "../../components/admin/EstadoOrden";
import { listarOrdenes } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/precio";
import { formatearFechaHora } from "../../utils/texto";

function Ordenes() {
  const [estado, setEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const ordenes = listarOrdenes();

  const texto = busqueda.trim().toLowerCase();
  const visibles = ordenes.filter((orden) => {
    const coincideEstado = estado === "" || orden.estado === estado;
    const cliente = `${orden.cliente.nombre} ${orden.cliente.apellidos} ${orden.cliente.correo}`.toLowerCase();
    const coincideTexto = texto === "" || cliente.includes(texto) || String(orden.numero).includes(texto);
    return coincideEstado && coincideTexto;
  });

  return (
    <>
      <EncabezadoAdmin titulo="Órdenes y boletas" subtitulo={`${ordenes.length} órdenes registradas`} />
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-3 mb-3">
            <Col xs={12} md={8}>
              <Form.Group controlId="ordenes-busqueda">
                <Form.Label>Buscar por número o cliente</Form.Label>
                <Form.Control type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="ordenes-estado">
                <Form.Label>Estado</Form.Label>
                <Form.Select value={estado} onChange={(evento) => setEstado(evento.target.value)}>
                  <option value="">Todos</option>
                  <option value="Pagada">Pagada</option>
                  <option value="Rechazada">Rechazada</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Table responsive hover className="align-middle">
            <caption>Órdenes de compra de la tienda</caption>
            <thead>
              <tr>
                <th scope="col">N°</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Comuna</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">Total</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((orden) => (
                <tr key={orden.numero}>
                  <th scope="row">#{orden.numero}</th>
                  <td>{formatearFechaHora(orden.fecha)}</td>
                  <td>
                    {orden.cliente.nombre} {orden.cliente.apellidos}
                    <br />
                    <small className="text-body-secondary">{orden.cliente.correo}</small>
                  </td>
                  <td>{orden.envio.comuna}</td>
                  <td><EstadoOrden estado={orden.estado} /></td>
                  <td className="text-end">{formatearPrecio(orden.total)}</td>
                  <td>
                    <Link to={`/admin/ordenes/${orden.numero}`} className="btn btn-outline-primary btn-sm">
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-body-secondary py-4">No hay órdenes que coincidan con el filtro.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default Ordenes;
