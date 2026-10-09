import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { crearMensajeContacto } from "../../data/baseDatos";
import { esFormularioValido, validarContacto } from "../../utils/validaciones";

const VACIO = { nombre: "", correo: "", comentario: "" };

function Contacto() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
    setEnviado(false);
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) return;
    crearMensajeContacto(datos);
    setEnviado(true);
    setDatos(VACIO);
  }

  return (
    <Container className="py-4">
      <h1>Contáctanos</h1>
      <p className="text-body-secondary">
        Estamos disponibles para resolver consultas sobre pacientes, recetas veterinarias o pedidos de la tienda.
      </p>
      <Row className="g-4">
        <Col xs={12} lg={5}>
          <section className="bg-white border rounded-3 p-4 h-100" aria-labelledby="titulo-canales">
            <h2 id="titulo-canales" className="h4">Canales de atención</h2>
            <p><i className="bi bi-geo-alt me-2 text-primary" aria-hidden="true"></i><strong>Ubicación:</strong> Av. San Juan 1020, Rancagua</p>
            <p><i className="bi bi-telephone me-2 text-primary" aria-hidden="true"></i><strong>Urgencias 24/7:</strong> +56 2 2987 6543</p>
            <p><i className="bi bi-envelope me-2 text-primary" aria-hidden="true"></i><strong>Consultas:</strong> contacto@veterinariasanmarcos.cl</p>
            <p><i className="bi bi-clock me-2 text-primary" aria-hidden="true"></i><strong>Horario:</strong> lunes a sábado de 08:30 a 20:00 hrs.</p>
            <hr />
            <h3 className="h5">Turnos de urgencia</h3>
            <p className="mb-0">
              Para emergencias fuera del horario regular, acude directamente a nuestro pabellón central con el
              carnet de vacunación del paciente.
            </p>
          </section>
        </Col>
        <Col xs={12} lg={7}>
          <Form noValidate onSubmit={enviar} className="bg-white border rounded-3 p-4" aria-labelledby="titulo-formulario-contacto">
            <h2 id="titulo-formulario-contacto" className="h4">Envíanos un mensaje</h2>
            {enviado && (
              <Alert variant="success" role="status">
                Mensaje enviado exitosamente. Te responderemos dentro de 24 horas hábiles.
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="contacto-nombre">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} maxLength={100} isInvalid={Boolean(errores.nombre)} placeholder="Ej: Camila Morales" />
              <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contacto-correo">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} isInvalid={Boolean(errores.correo)} placeholder="usuario@gmail.com" />
              <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contacto-comentario">
              <Form.Label>Comentario o consulta</Form.Label>
              <Form.Control as="textarea" rows={4} name="comentario" value={datos.comentario} onChange={cambiar} maxLength={500} isInvalid={Boolean(errores.comentario)} placeholder="Indica especie, edad y tu consulta..." />
              <Form.Text>{datos.comentario.length}/500 caracteres</Form.Text>
              <Form.Control.Feedback type="invalid">{errores.comentario}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Enviar mensaje</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacto;
