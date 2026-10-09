import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/texto";
import ImagenConRespaldo from "../comunes/ImagenConRespaldo";

function TarjetaBlog({ blog }) {
  return (
    <Card as="article" className="shadow-sm overflow-hidden">
      <Row className="g-0 align-items-center">
        <Col xs={12} md={7} className="p-4">
          <p className="small text-uppercase text-primary fw-semibold mb-1">{blog.categoria}</p>
          <h2 className="h4">{blog.titulo}</h2>
          <p className="small text-body-secondary">
            <time dateTime={blog.fecha}>{formatearFecha(`${blog.fecha}T12:00:00`)}</time> · {blog.autor}
          </p>
          <p>{blog.resumen}</p>
          <Link className="btn btn-primary" to={`/blogs/${blog.id}`}>
            Leer artículo
            <span className="visually-hidden">: {blog.titulo}</span>
          </Link>
        </Col>
        <Col xs={12} md={5}>
          <ImagenConRespaldo src={blog.imagen} alt="" className="img-fluid w-100 imagen-tarjeta" />
        </Col>
      </Row>
    </Card>
  );
}

export default TarjetaBlog;
