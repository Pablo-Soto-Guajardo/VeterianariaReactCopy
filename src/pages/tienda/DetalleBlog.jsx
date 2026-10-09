import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { blogs } from "../../data/datosIniciales";
import { formatearFecha } from "../../utils/texto";

function DetalleBlog() {
  const { id } = useParams();
  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Artículo no encontrado</h1>
        <MensajeVacio icono="bi-journal-x" titulo="El artículo solicitado no existe" enlace="/blogs" textoEnlace="Volver al blog" />
      </Container>
    );
  }

  const otros = blogs.filter((item) => item.id !== blog.id);

  return (
    <Container className="py-4">
      <p>
        <Link to="/blogs">&larr; Volver a noticias</Link>
      </p>
      <Row>
        <Col xs={12} lg={8}>
          <article className="bg-white border rounded-3 p-4">
            <p className="text-uppercase text-primary fw-semibold small mb-1">{blog.categoria}</p>
            <h1>{blog.titulo}</h1>
            <p className="text-body-secondary">
              Publicado el <time dateTime={blog.fecha}>{formatearFecha(`${blog.fecha}T12:00:00`)}</time> · {blog.autor}
            </p>
            <figure>
              <ImagenConRespaldo src={blog.imagen} alt={blog.titulo} className="img-fluid rounded-3 w-100 imagen-tarjeta" />
              <figcaption className="small text-body-secondary mt-1">Imagen referencial · Unsplash</figcaption>
            </figure>
            {blog.contenido.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
            <h2 className="h5">Recomendaciones prácticas</h2>
            <ul>
              {blog.consejos.map((consejo) => (
                <li key={consejo}>{consejo}</li>
              ))}
            </ul>
          </article>
        </Col>
        <Col xs={12} lg={4} className="mt-4 mt-lg-0">
          <aside className="bg-white border rounded-3 p-4">
            <h2 className="h5">Otros artículos</h2>
            <ul className="list-unstyled mb-0">
              {otros.map((item) => (
                <li key={item.id} className="mb-2">
                  <Link to={`/blogs/${item.id}`}>{item.titulo}</Link>
                </li>
              ))}
            </ul>
          </aside>
        </Col>
      </Row>
    </Container>
  );
}

export default DetalleBlog;
