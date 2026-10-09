import { Col, Form, Row } from "react-bootstrap";
import { obtenerNombreRegion } from "../../utils/regiones";

// Muestra los datos del cliente y de despacho de una orden en modo lectura.
function CampoLectura({ id, etiqueta, valor, xs = 12, md = 6, multilinea = false }) {
  return (
    <Col xs={xs} md={md}>
      <Form.Group controlId={id}>
        <Form.Label className="small mb-1">{etiqueta}</Form.Label>
        <Form.Control
          as={multilinea ? "textarea" : "input"}
          rows={multilinea ? 2 : undefined}
          value={valor || "—"}
          readOnly
          className="bg-body-tertiary"
        />
      </Form.Group>
    </Col>
  );
}

function DatosOrden({ orden }) {
  const { cliente, envio } = orden;

  return (
    <>
      <h2 className="h5 mt-3">Datos del cliente</h2>
      <Row className="g-3">
        <CampoLectura id="orden-nombre" etiqueta="Nombre" valor={cliente.nombre} md={4} />
        <CampoLectura id="orden-apellidos" etiqueta="Apellidos" valor={cliente.apellidos} md={4} />
        <CampoLectura id="orden-correo" etiqueta="Correo" valor={cliente.correo} md={4} />
      </Row>
      <h2 className="h5 mt-4">Dirección de entrega</h2>
      <Row className="g-3">
        <CampoLectura id="orden-calle" etiqueta="Calle" valor={envio.calle} />
        <CampoLectura id="orden-departamento" etiqueta="Departamento" valor={envio.departamento} />
        <CampoLectura id="orden-region" etiqueta="Región" valor={obtenerNombreRegion(envio.region)} />
        <CampoLectura id="orden-comuna" etiqueta="Comuna" valor={envio.comuna} />
        <CampoLectura
          id="orden-indicaciones"
          etiqueta="Indicaciones para la entrega"
          valor={envio.indicaciones}
          md={12}
          multilinea
        />
      </Row>
    </>
  );
}

export default DatosOrden;
