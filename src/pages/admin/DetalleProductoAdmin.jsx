import { Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import AvisoNavegacion from "../../components/admin/AvisoNavegacion";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import EstadoStock from "../../components/productos/EstadoStock";
import PrecioProducto from "../../components/productos/PrecioProducto";
import { obtenerCategoria, obtenerProducto } from "../../data/baseDatos";

function DetalleProductoAdmin() {
  const { codigo } = useParams();
  const producto = obtenerProducto(codigo);

  if (!producto) {
    return <MensajeVacio titulo={`El producto ${codigo} no existe`} enlace="/admin/productos" textoEnlace="Volver a productos" />;
  }

  const categoria = obtenerCategoria(producto.categoria);
  const filas = [
    ["Código", producto.codigo],
    ["Categoría", categoria ? categoria.nombre : "Sin categoría"],
    ["Presentación", producto.presentacion || "—"],
    ["Stock actual", `${producto.stock} unidades`],
    ["Stock crítico", `${producto.stockCritico} unidades`]
  ];

  return (
    <>
      <EncabezadoAdmin titulo={producto.nombre} subtitulo="Detalle del producto">
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
        <Link to={`/admin/productos/${producto.codigo}/editar`} className="btn btn-primary">
          <i className="bi bi-pencil me-1" aria-hidden="true"></i> Editar producto
        </Link>
      </EncabezadoAdmin>
      <AvisoNavegacion />
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <ImagenConRespaldo src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-3 imagen-tarjeta w-100" />
            </Col>
            <Col xs={12} md={8}>
              <PrecioProducto producto={producto} grande />
              <EstadoStock producto={producto} />
              <dl className="row mb-3">
                {filas.map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="d-contents">
                    <dt className="col-sm-4">{etiqueta}</dt>
                    <dd className="col-sm-8">{valor}</dd>
                  </div>
                ))}
              </dl>
              <h2 className="h6">Descripción</h2>
              <p className="mb-0">{producto.descripcion || "Sin descripción."}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default DetalleProductoAdmin;
