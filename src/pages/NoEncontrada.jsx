import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NoEncontrada() {
  return (
    <Container className="py-5 text-center">
      <p className="display-1 fw-bold text-secondary mb-0">404</p>
      <h1>Página no encontrada</h1>
      <p>La dirección solicitada no corresponde a una vista disponible.</p>
      <Link className="btn btn-primary" to="/">
        Volver al inicio
      </Link>
    </Container>
  );
}

export default NoEncontrada;
