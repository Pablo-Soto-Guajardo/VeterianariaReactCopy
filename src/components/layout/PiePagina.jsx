import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { validarCorreo } from "../../utils/validaciones";

const ANIO_ACTUAL = new Date().getFullYear();

function PiePagina() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [suscrito, setSuscrito] = useState(false);

  function suscribir(evento) {
    evento.preventDefault();
    const mensaje = validarCorreo(correo);
    setError(mensaje);
    if (mensaje) return;
    setSuscrito(true);
    setCorreo("");
  }

  return (
    <footer className="bg-dark text-white mt-auto pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          <Col xs={12} md={6} lg={4}>
            <p className="h5">Veterinaria San Marcos</p>
            <p className="mb-1">Av. San Juan 1020, Rancagua, O&apos;Higgins</p>
            <p className="mb-1">Urgencias 24/7: +56 2 2987 6543</p>
            <p className="mb-0">Lunes a sábado de 08:30 a 20:00 hrs.</p>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <p className="h6">Tienda</p>
            <ul className="list-unstyled">
              <li><Link className="link-light" to="/productos">Productos</Link></li>
              <li><Link className="link-light" to="/categorias">Categorías</Link></li>
              <li><Link className="link-light" to="/ofertas">Ofertas</Link></li>
              <li><Link className="link-light" to="/carrito">Carrito</Link></li>
            </ul>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <p className="h6">Clínica</p>
            <ul className="list-unstyled">
              <li><Link className="link-light" to="/nosotros">Nosotros</Link></li>
              <li><Link className="link-light" to="/blogs">Blog</Link></li>
              <li><Link className="link-light" to="/contacto">Contacto</Link></li>
            </ul>
          </Col>
          <Col xs={12} lg={4}>
            <p className="h6">Newsletter</p>
            {suscrito ? (
              <p role="status">¡Gracias! Te enviaremos consejos de salud animal.</p>
            ) : (
              <Form onSubmit={suscribir} noValidate>
                <Form.Group controlId="correo-newsletter">
                  <Form.Label className="small">Recibe consejos y ofertas en tu correo</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="email"
                      placeholder="usuario@gmail.com"
                      value={correo}
                      onChange={(evento) => setCorreo(evento.target.value)}
                      isInvalid={Boolean(error)}
                    />
                    <Button type="submit" variant="success">Suscribirme</Button>
                  </div>
                  {error && <p className="text-warning small mt-1 mb-0">{error}</p>}
                </Form.Group>
              </Form>
            )}
          </Col>
        </Row>
        <hr className="border-secondary" />
        <p className="small text-center mb-0">
          &copy; {ANIO_ACTUAL} Veterinaria San Marcos · Rancagua · Proyecto académico DSY1104 Duoc UC
        </p>
      </Container>
    </footer>
  );
}

export default PiePagina;
