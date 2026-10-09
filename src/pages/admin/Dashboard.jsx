import { Alert, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoOrden from "../../components/admin/EstadoOrden";
import TarjetaEstadistica from "../../components/admin/TarjetaEstadistica";
import { listarOrdenes, listarProductos, listarProductosCriticos, listarUsuarios } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/precio";
import { resumenVentas } from "../../utils/reportes";
import { formatearFechaHora } from "../../utils/texto";

const accesos = [
  { to: "/admin", titulo: "Dashboard", texto: "Visión general de las métricas clave del sistema.", icono: "bi-speedometer2" },
  { to: "/admin/ordenes", titulo: "Órdenes", texto: "Gestión y seguimiento de las órdenes de compra.", icono: "bi-receipt" },
  { to: "/admin/productos", titulo: "Productos", texto: "Administrar inventario y detalles de los productos.", icono: "bi-box-seam" },
  { to: "/admin/categorias", titulo: "Categorías", texto: "Organizar productos en categorías para la navegación.", icono: "bi-tags" },
  { to: "/admin/usuarios", titulo: "Usuarios", texto: "Gestión de cuentas de usuario y sus roles.", icono: "bi-people" },
  { to: "/admin/reportes", titulo: "Reportes", texto: "Informes de ventas e inventario.", icono: "bi-graph-up" },
  { to: "/admin/perfil", titulo: "Perfil", texto: "Administración de tu información personal.", icono: "bi-person-circle" },
  { to: "/", titulo: "Tienda", texto: "Visualiza la tienda tal como la ven los clientes.", icono: "bi-shop" }
];

function Dashboard({ sesion }) {
  const ordenes = listarOrdenes();
  const productos = listarProductos();
  const usuarios = listarUsuarios();
  const criticos = listarProductosCriticos();
  const ventas = resumenVentas(ordenes);
  const unidades = productos.reduce((suma, producto) => suma + producto.stock, 0);
  const clientes = usuarios.filter((usuario) => usuario.rol === "Cliente").length;

  return (
    <>
      <EncabezadoAdmin titulo={`¡Hola, ${sesion.nombre}!`} subtitulo="Resumen de las actividades de la tienda" />

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <TarjetaEstadistica titulo="Compras" valor={ventas.cantidadPagadas} detalle={`Total vendido: ${formatearPrecio(ventas.totalVendido)}`} icono="bi-cart-check" color="primary" />
        </Col>
        <Col xs={12} md={4}>
          <TarjetaEstadistica titulo="Productos" valor={productos.length} detalle={`Inventario actual: ${unidades} unidades`} icono="bi-box-seam" color="success" />
        </Col>
        <Col xs={12} md={4}>
          <TarjetaEstadistica titulo="Usuarios" valor={usuarios.length} detalle={`Clientes registrados: ${clientes}`} icono="bi-people" color="warning" />
        </Col>
      </Row>

      {criticos.length > 0 && (
        <Alert variant="warning" className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>
            <i className="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
            Hay {criticos.length} productos con stock crítico o agotado.
          </span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-warning">Ver listado</Link>
        </Alert>
      )}

      <Row className="g-3 mb-4">
        {accesos.map((acceso) => (
          <Col xs={6} md={4} xl={3} key={acceso.titulo}>
            <Card className="h-100 text-center shadow-sm tarjeta-enlace">
              <Card.Body>
                <i className={`bi ${acceso.icono} fs-3 text-primary`} aria-hidden="true"></i>
                <h2 className="h6 mt-2">
                  <Link to={acceso.to} className="stretched-link text-decoration-none">{acceso.titulo}</Link>
                </h2>
                <p className="small text-body-secondary mb-0 d-none d-sm-block">{acceso.texto}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="h5 mb-0">Últimas órdenes</h2>
            <Link to="/admin/ordenes">Ver todas</Link>
          </div>
          <Table responsive hover className="align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">N°</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.slice(0, 5).map((orden) => (
                <tr key={orden.numero}>
                  <th scope="row"><Link to={`/admin/ordenes/${orden.numero}`}>#{orden.numero}</Link></th>
                  <td>{formatearFechaHora(orden.fecha)}</td>
                  <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
                  <td>
                    <EstadoOrden estado={orden.estado} />
                  </td>
                  <td className="text-end">{formatearPrecio(orden.total)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default Dashboard;
