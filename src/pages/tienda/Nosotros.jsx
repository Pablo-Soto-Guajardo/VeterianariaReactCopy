import { Col, Container, Row } from "react-bootstrap";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import { imagenes } from "../../data/datosIniciales";

const valores = [
  { icono: "bi-bullseye", titulo: "Misión", texto: "Entregar atención de salud integral, preventiva y quirúrgica de alto estándar para mascotas domésticas." },
  { icono: "bi-eye", titulo: "Visión", texto: "Ser la clínica y farmacia veterinaria de referencia en la Región de O'Higgins." },
  { icono: "bi-people", titulo: "Equipo", texto: "3 médicos veterinarios cirujanos, 1 técnico veterinario y personal administrativo." }
];

const desarrolladores = [
  "Pablo Esteban Soto Guajardo",
  "Maximiliano Andrés Mondaca Grandón",
  "Pascal Ignacio Pacheco Bravo"
];

function Nosotros() {
  return (
    <Container className="py-4">
      <Row className="g-4 align-items-center mb-5">
        <Col xs={12} lg={6}>
          <p className="text-uppercase text-primary fw-semibold mb-1">Nuestra historia</p>
          <h1>Sobre Veterinaria San Marcos</h1>
          <p>
            Fundada en 2009 en Rancagua, nuestra clínica médica veterinaria nació con la misión de entregar
            atención de salud integral, preventiva y quirúrgica de alto estándar para mascotas domésticas.
          </p>
          <p>
            Hoy sumamos una farmacia veterinaria online para que los tutores puedan comprar medicamentos,
            alimentos clínicos y productos de cuidado con la misma confianza de nuestra clínica.
          </p>
        </Col>
        <Col xs={12} lg={6}>
          <ImagenConRespaldo src={imagenes.clinica} alt="Veterinaria examinando a un paciente canino" className="img-fluid rounded-3 shadow-sm" />
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {valores.map((valor) => (
          <Col xs={12} md={4} key={valor.titulo}>
            <div className="bg-white border rounded-3 p-4 h-100">
              <i className={`bi ${valor.icono} fs-2 text-primary`} aria-hidden="true"></i>
              <h2 className="h5 mt-2">{valor.titulo}</h2>
              <p className="mb-0">{valor.texto}</p>
            </div>
          </Col>
        ))}
      </Row>

      <section className="bg-white border rounded-3 p-4" aria-labelledby="titulo-equipo-desarrollo">
        <h2 id="titulo-equipo-desarrollo" className="h4">Equipo de desarrollo web</h2>
        <p>
          Plataforma diseñada y construida por estudiantes de la Escuela de Informática y Telecomunicaciones de
          Duoc UC para la asignatura Desarrollo FullStack II (DSY1104), Grupo 5.
        </p>
        <ul className="mb-0">
          {desarrolladores.map((nombre) => (
            <li key={nombre}>{nombre}</li>
          ))}
        </ul>
        <p className="mt-3 mb-0 small text-body-secondary">
          Tecnologías: React, Vite, React Router, React Bootstrap y Vitest.
        </p>
      </section>
    </Container>
  );
}

export default Nosotros;
