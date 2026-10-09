import { Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import AvisoNavegacion from "../../components/admin/AvisoNavegacion";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { listarOrdenesDeUsuario, obtenerUsuario } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/precio";
import { obtenerNombreRegion } from "../../utils/regiones";
import { ordenesPagadas } from "../../utils/reportes";
import { formatearFecha } from "../../utils/texto";

function DetalleUsuario() {
  const { run } = useParams();
  const usuario = obtenerUsuario(run);

  if (!usuario) {
    return <MensajeVacio titulo="El usuario no existe" enlace="/admin/usuarios" textoEnlace="Volver a usuarios" />;
  }

  const compras = ordenesPagadas(listarOrdenesDeUsuario(usuario.correo));
  const totalComprado = compras.reduce((suma, orden) => suma + orden.total, 0);
  const filas = [
    ["RUN", usuario.run],
    ["Correo", usuario.correo],
    ["Rol", usuario.rol],
    ["Fecha de nacimiento", usuario.fechaNacimiento ? formatearFecha(`${usuario.fechaNacimiento}T12:00:00`) : "—"],
    ["Dirección", usuario.direccion],
    ["Comuna", usuario.comuna],
    ["Región", obtenerNombreRegion(usuario.region)]
  ];

  return (
    <>
      <EncabezadoAdmin titulo={`${usuario.nombre} ${usuario.apellidos}`} subtitulo="Detalle del usuario">
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver</Link>
        <Link to={`/admin/usuarios/${run}/compras`} className="btn btn-outline-primary">
          <i className="bi bi-bag me-1" aria-hidden="true"></i> Historial de compras
        </Link>
        <Link to={`/admin/usuarios/${run}/editar`} className="btn btn-primary">
          <i className="bi bi-pencil me-1" aria-hidden="true"></i> Editar usuario
        </Link>
      </EncabezadoAdmin>
      <AvisoNavegacion />
      <Row className="g-3">
        <Col xs={12} lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <dl className="row mb-0">
                {filas.map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="d-contents">
                    <dt className="col-sm-4">{etiqueta}</dt>
                    <dd className="col-sm-8">{valor}</dd>
                  </div>
                ))}
              </dl>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card className="shadow-sm h-100 text-center">
            <Card.Body>
              <i className="bi bi-bag-check fs-1 text-primary" aria-hidden="true"></i>
              <p className="fs-4 fw-bold mb-0">{compras.length}</p>
              <p className="text-body-secondary">compras pagadas</p>
              <p className="mb-0">Total comprado: <strong>{formatearPrecio(totalComprado)}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DetalleUsuario;
